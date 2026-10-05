# Bước 2: cắt từng CÂU từ các đoạn nghe Cambridge và dựng ngân hàng chép chính tả.
# Quy trình (chạy trên máy dev, không chạy trên server):
#   0) units.py lập danh sách đoạn nghe nguồn + lời thoại → /tmp/ewt-dict/units.json
#   1) asr.py nhận dạng giọng nói từng đoạn → /tmp/ewt-dict/asr/<id>.json (từ + mốc thời gian)
#   2) tách lời thoại thành câu; căn hàng câu với kết quả nhận dạng bằng quy hoạch động
#   3) cắt từng câu (thêm ~0.15 s đệm hai đầu, không lấn sang câu kề), nén AAC 32 kbps
#   4) KIỂM TRA LẠI: nhận dạng giọng nói ngay trên đoạn đã cắt; chỉ giữ câu khi nghe ra ĐÚNG câu gốc
#      (không thiếu từ, không dính từ của câu bên cạnh ở hai đầu). Câu không đạt bị loại, không "đoán".
# Chạy song song nhiều tiến trình:  build.py small.en --worker 0/4  (…1/4, 2/4, 3/4)  rồi  build.py --merge
# Kết quả: dictation/audio/*.m4a + dictation/bank.json
import sys, os, re, json, subprocess, shutil, unicodedata, argparse
import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ASR = '/tmp/ewt-dict/asr'; PARTS = '/tmp/ewt-dict/parts'
OUT = os.path.join(ROOT, 'dictation'); OUT_AUDIO = os.path.join(OUT, 'audio'); TMP = '/tmp/ewt-dict/cut'
os.makedirs(TMP, exist_ok=True); os.makedirs(PARTS, exist_ok=True)
ONES = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
TENS = {'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90}
NUM = {w: str(i) for i, w in enumerate(ONES)}; NUM.update({k: str(v) for k, v in TENS.items()}); NUM['hundred'] = '100'
ABBR = {'mr', 'mrs', 'ms', 'dr', 'st', 'prof', 'no', 'vs', 'etc'}

def norm_tok(w):
    w = unicodedata.normalize('NFKC', w).lower().replace('’', "'").replace('‘', "'")
    w = re.sub(r"[^a-z0-9']", '', w).strip("'")
    return NUM.get(w, w)

def toks(text):
    t = unicodedata.normalize('NFKC', text).replace('’', "'")
    t = re.sub(r'(\d)[.:,](\d)', r'\1 \2', t)
    t = re.sub(r'(?<=\w)-(?=\w)', ' ', t)
    out = []
    for w in t.split():
        n = norm_tok(w)
        if n: out.append(n)
    return out

def lev(a, b):
    if len(a) < len(b): a, b = b, a
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1): cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]

def sim(a, b):
    """2 = giống hệt; 1 = gần giống (chỉ lệch 1 chữ cái ở từ dài hoặc dạng viết tắt); 0 = khác"""
    if a == b: return 2
    if a.replace("'", '') == b.replace("'", ''): return 2
    if len(a) >= 4 and len(b) >= 4 and abs(len(a) - len(b)) <= 1 and (a[0] == b[0] or a[-1] == b[-1]) and lev(a, b) <= 1: return 1
    return 0

def align(S, A):
    """Căn hàng hai chuỗi từ (Needleman–Wunsch). Trả về list cặp (i_script, j_asr) đã khớp."""
    n, m = len(S), len(A); GAP = -1
    D = [[0] * (m + 1) for _ in range(n + 1)]; B = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1): D[i][0] = i * GAP; B[i][0] = 1
    for j in range(1, m + 1): D[0][j] = j * GAP; B[0][j] = 2
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = sim(S[i - 1], A[j - 1]); diag = D[i - 1][j - 1] + (2 if s == 2 else 1 if s == 1 else -1)
            up = D[i - 1][j] + GAP; left = D[i][j - 1] + GAP
            best = max(diag, up, left); D[i][j] = best; B[i][j] = 0 if best == diag else 1 if best == up else 2
    i, j, pairs = n, m, []
    while i > 0 or j > 0:
        if i > 0 and j > 0 and B[i][j] == 0:
            if sim(S[i - 1], A[j - 1]) > 0: pairs.append((i - 1, j - 1))
            i -= 1; j -= 1
        elif i > 0 and (j == 0 or B[i][j] == 1): i -= 1
        else: j -= 1
    return list(reversed(pairs))

def split_sentences(line):
    line = re.sub(r'\s+', ' ', line.replace('…', '...')).strip()
    parts, cur = [], ''
    words = line.split(' ')
    for k, w in enumerate(words):
        cur = (cur + ' ' + w).strip()
        if re.search(r'[.?!]["”’\']*$', w):
            base = re.sub(r'[^A-Za-z]', '', w).lower()
            nxt = words[k + 1] if k + 1 < len(words) else ''
            if w.endswith('.') and (base in ABBR or re.fullmatch(r'[A-Z]\.', w)): continue  # Mr. / Mrs. / A.
            if w.endswith('.') and nxt and not re.match(r'^["“(\']?[A-Z0-9]', nxt): continue
            parts.append(cur); cur = ''
    if cur.strip(): parts.append(cur.strip())
    return parts

CONJ = re.compile(r"\b(because|although|though|while|whereas|unless|until|before|after|when|whenever|if|which|who|whose|where|since|so that|as soon as|but|so)\b", re.I)
def kind_of(text):
    n = len(toks(text))
    if ';' in text: return 'compound'
    if CONJ.search(text) and n >= 7: return 'compound'
    if re.search(r',\s*(and|or|but|so)\b', text, re.I) and n >= 8: return 'compound'
    if re.search(r'\b(and|or)\b', text, re.I) and n >= 11: return 'compound'
    if n >= 15 or (n >= 12 and ',' in text): return 'compound'   # câu dài nhiều ý
    return 'single'

def good_text(text, maxw=26):
    n = len(toks(text))
    if n < 4 or n > maxw or len(text) < 14: return False
    if re.search(r'[\[\]{}<>#*_=/\\@]', text): return False
    letters = [t for t in toks(text) if len(t) == 1 and t not in ('i', 'a')]
    if len(letters) >= 2: return False                      # đánh vần tên / chữ cái
    if sum(1 for t in toks(text) if t.isdigit()) >= 4: return False  # chuỗi số điện thoại, mã số...
    return True

def cut(src, a, b, dst):
    subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', f'{a:.2f}', '-to', f'{b:.2f}', '-i', src, '-ac', '1', '-ar', '24000', '-c:a', 'aac', '-b:a', '32k', '-movflags', '+faststart', dst], check=True)

def listen(model, path, tag):
    wav = f'{TMP}/{tag}.wav'
    subprocess.run([FF, '-y', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', '16000', wav], check=True)
    segs, _ = model.transcribe(wav, language='en', word_timestamps=True, condition_on_previous_text=False, beam_size=3, temperature=0.0)
    R = [norm_tok(w.word) for sg in segs for w in (sg.words or [])]
    try: os.remove(wav)
    except OSError: pass
    return [r for r in R if r]

def process_unit(it, model):
    """Trả về (items, rejected) cho một đoạn nghe nguồn; lưu âm thanh từng câu vào dictation/audio."""
    cid = it['id']; items, rej = [], []
    f = f'{ASR}/{cid}.json'
    if not os.path.exists(f): return None
    asr = json.load(open(f)); aw = asr['words']; dur = asr['dur']
    A = [norm_tok(w['w']) for w in aw]
    sents = []
    for spk, line in it.get('script', []):
        for s_ in split_sentences(line): sents.append(s_)
    S, owner = [], []
    for k, s_ in enumerate(sents):
        for t in toks(s_): S.append(t); owner.append(k)
    pairs = align(S, A); mp = {i: j for i, j in pairs}
    spans = []
    for k, s_ in enumerate(sents):
        idx = [i for i in range(len(S)) if owner[i] == k]
        if not idx: spans.append(None); continue
        hit = [mp[i] for i in idx if i in mp]
        spans.append({'frac': len(hit) / len(idx), 'first': mp.get(idx[0]), 'last': mp.get(idx[-1]), 'ok': idx[0] in mp and idx[-1] in mp, 'n': len(idx)})
    src_audio = it['audio']; maxw = 30 if it['lv'] == 'C1' else 26
    for k, s in enumerate(sents):
        sp = spans[k]; sid = f"d-{cid}-s{k + 1}"
        if not good_text(s, maxw): continue
        if not sp or not sp['ok'] or sp['frac'] < 0.9: rej.append((sid, 'align', round(sp['frac'], 2) if sp else 0, s)); continue
        st = aw[sp['first']]['s']; en = aw[sp['last']]['e']
        if en - st > 18: rej.append((sid, 'span', round(en - st, 1), s)); continue  # căn hàng bị kéo dãn → không tin
        # đệm hai đầu nhưng không lấn sang câu kề
        prev_end = None; next_start = None
        for kk in range(k - 1, -1, -1):
            if spans[kk] and spans[kk]['last'] is not None and spans[kk]['last'] < sp['first']: prev_end = aw[spans[kk]['last']]['e']; break
        for kk in range(k + 1, len(sents)):
            if spans[kk] and spans[kk]['first'] is not None and spans[kk]['first'] > sp['last']: next_start = aw[spans[kk]['first']]['s']; break
        a = max(0.0, st - 0.15); b = min(dur, en + 0.25)
        if prev_end is not None: a = max(a, (prev_end + st) / 2 if st - prev_end < 0.3 else prev_end + 0.05)
        if next_start is not None: b = min(b, (en + next_start) / 2 if next_start - en < 0.5 else en + 0.25)
        if b - a < 1.0 or b - a > 20: rej.append((sid, 'len', round(b - a, 1), s)); continue
        T = toks(s); ok = False; dst = f'{TMP}/{sid}.m4a'; info = ''
        # thử lần 1 với đệm bình thường; nếu dính chữ của câu bên cạnh thì thử lại với đệm sát hơn
        for (ca, cb) in [(a, b), (max(a, st - 0.04), min(b, en + 0.06))]:
            if cb - ca < 0.8: continue
            cut(src_audio, ca, cb, dst)
            R = listen(model, dst, sid)
            pr = align(T, R); matched = len(pr)
            extra_edge = (pr[0][1] if pr else 0) + (len(R) - 1 - pr[-1][1] if pr else len(R))  # từ thừa ở hai đầu (dính câu bên cạnh)
            first_ok = bool(pr) and pr[0][0] == 0; last_ok = bool(pr) and pr[-1][0] == len(T) - 1
            exact = sum(1 for i, j in pr if sim(T[i], R[j]) == 2)
            ok = first_ok and last_ok and extra_edge == 0 and matched >= len(T) - (1 if len(T) >= 9 else 0) and exact >= len(T) - (2 if len(T) >= 9 else 1) and len(R) <= len(T) + 1
            info = f'{matched}/{len(T)} edge{extra_edge} :: ' + ' '.join(R)
            if ok: a, b = ca, cb; break
        if not ok:
            rej.append((sid, 'verify', info, s))
            if os.path.exists(dst): os.remove(dst)
            continue
        shutil.move(dst, os.path.join(OUT_AUDIO, sid + '.m4a'))
        text = re.sub(r'\s+', ' ', s).strip()
        items.append({'id': sid, 'lv': it['lv'], 'kind': kind_of(text), 'text': text, 'words': len(T), 'sec': round(b - a, 1), 'src': it.get('src', '')})
    return items, rej

INSTR = re.compile(r"^(you will hear|you hear|you overhear|now listen|listen to|look at|you will now hear|you'll hear)\b", re.I)
def merge():
    units = json.load(open('/tmp/ewt-dict/units.json')); items, seen, rej = [], set(), []
    for u in units:
        pf = f'{PARTS}/{u["id"]}.json'
        if not os.path.exists(pf): continue
        d = json.load(open(pf)); rej += d['rej']
        for x in d['items']:
            if INSTR.match(x['text']): rej.append((x['id'], 'instruction', 0, x['text'])); continue  # câu hướng dẫn của người dẫn ("You will hear…") lặp lại nhiều, không hữu ích
            key = ' '.join(toks(x['text']))
            if key in seen: rej.append((x['id'], 'dup', 0, x['text'])); continue
            x['text'] = re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', x['text']).replace('\u2026', '...')).strip()  # chuẩn hoá ký tự lạ (vd. ﬀ → ff)
            x['kind'] = kind_of(x['text'])
            seen.add(key); items.append(x)
    keep = {x['id'] + '.m4a' for x in items}
    for fn in os.listdir(OUT_AUDIO):
        if fn.endswith('.m4a') and fn not in keep: os.remove(os.path.join(OUT_AUDIO, fn))
    json.dump({'version': 1, 'note': 'Câu cắt từ đề nghe Cambridge (A1, KET, PET, FCE, CAE) — dùng cho mục đích học tập phi lợi nhuận.', 'items': items}, open(os.path.join(OUT, 'bank.json'), 'w'), ensure_ascii=False, indent=0)
    json.dump(rej, open('/tmp/ewt-dict/rejected.json', 'w'), ensure_ascii=False, indent=0)
    import collections
    print('TOTAL', len(items), 'rejected', len(rej), dict(collections.Counter(x['lv'] for x in items)))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('model', nargs='?', default='small.en'); ap.add_argument('--only', default=''); ap.add_argument('--lv', default='')
    ap.add_argument('--worker', default=''); ap.add_argument('--merge', action='store_true'); ap.add_argument('--threads', type=int, default=2)
    args = ap.parse_args()
    if args.merge: return merge()
    from faster_whisper import WhisperModel
    model = WhisperModel(args.model, device='cpu', compute_type='int8', cpu_threads=args.threads)
    units = json.load(open('/tmp/ewt-dict/units.json'))
    if args.only: units = [u for u in units if u['id'] in set(args.only.split(','))]
    if args.lv: units = [u for u in units if u['lv'] == args.lv]
    if args.worker: k, n = map(int, args.worker.split('/')); units = [u for i, u in enumerate(units) if i % n == k]
    os.makedirs(OUT_AUDIO, exist_ok=True)
    for it in units:
        pf = f'{PARTS}/{it["id"]}.json'
        if os.path.exists(pf): continue
        res = process_unit(it, model)
        if res is None: continue
        json.dump({'items': res[0], 'rej': res[1]}, open(pf, 'w'), ensure_ascii=False)
        print(it['id'], 'giữ', len(res[0]), 'loại', len(res[1]), flush=True)
    print('WORKER DONE', args.worker, flush=True)

if __name__ == '__main__':
    main()
