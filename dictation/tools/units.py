# Bước 0: lập danh sách "đoạn nghe nguồn" cho ngân hàng chép chính tả → /tmp/ewt-dict/units.json
#   • các đoạn Cambridge A1/KET/PET/FCE đã cắt sẵn trong placement/audio (lời thoại lấy từ placement/bank/listen.json)
#   • (tuỳ chọn) đề KET/PET/FCE/CAE tải thêm từ englishpracticetest.net: python3 units.py cae:1-6 fce:1-8 pet:1-3 ket:1-3  (tải trang đề + mp3 vào /tmp/ewt-dict/cae, chỉ để xử lý, KHÔNG đưa vào kho mã nguồn)
import sys, os, re, json, time, urllib.request
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'placement', 'tools'))
OUT = '/tmp/ewt-dict'; CAE = OUT + '/cae'; UA = {'User-Agent': 'Mozilla/5.0'}

def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 1000: return
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r: data = r.read()
    open(path, 'wb').write(data); time.sleep(0.6)

def cambridge_units():
    bank = json.load(open(os.path.join(ROOT, 'placement', 'bank', 'listen.json')))
    return [{'id': it['id'][2:], 'lv': it['lv'], 'src': it.get('src', '').split('·')[0].strip() + ' · ' + it['id'][2:], 'audio': os.path.join(ROOT, 'placement', 'audio', it['id'] + '.m4a'), 'script': it.get('script', [])} for it in bank]

SKIP = re.compile(r'^(Extract (One|Two|Three|Four|Five|Six|Seven|Eight)|Speaker \d|Part \d|Task (One|Two)|Interviewer\s*$|Now listen again\.?|\[.*\]|\d{1,2})$', re.I)
FAMS = {  # họ đề → (mẫu địa chỉ, mức CEFR, nhãn nguồn)
    'cae': ('practice-cae-c1-listening-test-{n:02d}-with-answers-and-audioscripts', 'C1', 'CAE (C1 Advanced)'),
    'fce': ('practice-fce-b2-listening-test-{n:02d}-with-answers-and-audioscripts', 'B2', 'FCE (B2 First)'),
    'pet': ('practice-pet-b1-listening-test-{n:02d}-with-answers-and-audioscripts', 'B1', 'PET (B1 Preliminary)'),
    'ket': ('practice-ket-a2-listening-test-{n:02d}-with-answers-and-audioscripts', 'A2', 'KET (A2 Key)'),
}
def exam_units(fam, tests):
    from parse import text_of
    pat, lv, label = FAMS[fam]; os.makedirs(CAE, exist_ok=True); units = []
    for n in tests:
        slug = pat.format(n=n)
        page = f'{CAE}/{slug}.html'
        try: get(f'https://englishpracticetest.net/{slug}/', page)
        except Exception as e: print('!! không tải được', slug, e); continue
        L = text_of(page); idx = [i for i, l in enumerate(L) if re.match(r'^Listening (Part )?\d+\s*$', l)]
        for k, i in enumerate(idx):
            part = int(re.search(r'(\d+)', L[i])[1]); end = idx[k + 1] if k + 1 < len(idx) else len(L)
            blk = L[i:end]
            audio = next((re.search(r'\[AUDIO (\S+)\]', l)[1] for l in blk if l.startswith('[AUDIO')), None)
            a = next((j for j, l in enumerate(blk) if re.match(r'^Audioscripts?$', l)), None)
            if not audio or a is None: print('!! thiếu âm thanh/lời thoại', slug, part); continue
            mp3 = f'{CAE}/{fam}{n:02d}p{part}.mp3'
            try: get(audio, mp3)
            except Exception as e: print('!! không tải được', audio, e); continue
            script = []
            for l in blk[a + 1:]:
                if re.match(r'^(Copyright|Share This|Follow|Pin It|Related|Leave a Reply)', l): break
                if SKIP.match(l): continue
                l = re.sub(r'^\d{1,2}\s{2,}', '', l)           # bỏ số câu hỏi đầu dòng
                m = re.match(r'^([A-Z][A-Za-z ]{1,20}):\s+(.*)$', l)
                script.append([m[1], m[2]] if m else ['', l])
            units.append({'id': f'{fam}{n:02d}p{part}', 'lv': lv, 'src': f'{label} Listening · test {n:02d} part {part}', 'audio': mp3, 'script': script})
            print(fam.upper(), n, part, len(script), 'dòng', flush=True)
    return units

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    units = cambridge_units()
    for arg in sys.argv[1:]:          # vd: cae:1-6 fce:1-8 pet:1-3 ket:1-3
        fam, rng = arg.split(':'); a, b = rng.split('-'); units += exam_units(fam, range(int(a), int(b) + 1))
    json.dump(units, open(OUT + '/units.json', 'w'), ensure_ascii=False)
    print('units', len(units))
