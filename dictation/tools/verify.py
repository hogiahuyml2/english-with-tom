# Bước 3: kiểm tra chéo ĐỘC LẬP — dùng một mô hình nhận dạng khác (mặc định base.en) nghe lại TỪNG câu trong ngân hàng
# và so với văn bản gốc. Câu nào không khớp (thiếu/thừa từ, sai từ) bị loại khỏi ngân hàng.
#   verify.py base.en --worker 0/4  (…1/4, 2/4, 3/4)   → /tmp/ewt-dict/verify_<k>.json (danh sách câu không đạt)
#   verify.py --apply                                   → xoá các câu không đạt khỏi bank.json và dictation/audio
import sys, os, re, json, subprocess, argparse
sys.path.insert(0, os.path.dirname(__file__))
from build import toks, norm_tok, align, sim, OUT, OUT_AUDIO, FF

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('model', nargs='?', default='base.en'); ap.add_argument('--worker', default=''); ap.add_argument('--apply', action='store_true'); ap.add_argument('--threads', type=int, default=2); ap.add_argument('--ids', default=''); ap.add_argument('--prefix', default='verify_')
    a = ap.parse_args()
    bank_path = os.path.join(OUT, 'bank.json'); bank = json.load(open(bank_path))
    if a.apply:
        bad = {}
        for k in range(16):
            f = f'/tmp/ewt-dict/{a.prefix}{k}.json'
            if os.path.exists(f):
                for b in json.load(open(f)): bad[b['id']] = b
        for b in bad.values():
            try: os.remove(os.path.join(OUT_AUDIO, b['id'] + '.m4a'))
            except OSError: pass
        bank['items'] = [x for x in bank['items'] if x['id'] not in bad]
        json.dump(bank, open(bank_path, 'w'), ensure_ascii=False, indent=0)
        json.dump(list(bad.values()), open('/tmp/ewt-dict/verify_removed.json', 'w'), ensure_ascii=False, indent=1)
        print('ĐÃ LOẠI', len(bad), 'câu; còn lại', len(bank['items'])); return
    from faster_whisper import WhisperModel
    model = WhisperModel(a.model, device='cpu', compute_type='int8', cpu_threads=a.threads)
    k, n = map(int, a.worker.split('/')) if a.worker else (0, 1)
    bad = []; wav = f'/tmp/ewt-dict/cut/verify_{k}.wav'
    only = set(json.load(open(a.ids))) if a.ids else None
    items = [it for i, it in enumerate(bank['items']) if i % n == k and (only is None or it['id'] in only)]
    for c, it in enumerate(items):
        subprocess.run([FF, '-y', '-loglevel', 'error', '-i', os.path.join(OUT_AUDIO, it['id'] + '.m4a'), '-ac', '1', '-ar', '16000', wav], check=True)
        segs, _ = model.transcribe(wav, language='en', word_timestamps=False, condition_on_previous_text=False, beam_size=3, temperature=0.0)
        R = [norm_tok(w) for sg in segs for w in sg.text.split()]; R = [r for r in R if r]
        # từ nối gạch (four-star): trình nhận dạng thường ghi liền → so cả hai dạng liền
        T = toks(re.sub(r'(?<=[A-Za-z])-(?=[A-Za-z])', '', it['text'])); pr = align(T, R); exact = sum(1 for i, j in pr if sim(T[i], R[j]) == 2)
        slack = 1 if len(T) >= 9 else 0
        ok = len(pr) >= len(T) - slack and exact >= len(T) - slack - 1 and len(R) <= len(T) + 1 and len(R) >= len(T) - 1
        if not ok: bad.append({'id': it['id'], 'text': it['text'], 'heard': ' '.join(R)})
        if (c + 1) % 100 == 0: print(c + 1, len(items), 'loại', len(bad), flush=True)
    json.dump(bad, open(f'/tmp/ewt-dict/{a.prefix}{k}.json', 'w'), ensure_ascii=False, indent=1)
    print('WORKER DONE', k, 'kiểm', len(items), 'không đạt', len(bad), flush=True)

if __name__ == '__main__':
    main()
