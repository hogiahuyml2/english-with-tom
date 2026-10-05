#!/usr/bin/env python3
"""Dựng reading/bank.json từ reading/src/*.json (bài đọc + câu hỏi + ghi chú đã soạn).
Với mỗi bài: tách từ, gắn từ loại theo ngữ cảnh (NLTK), đưa về dạng gốc, rồi
  - từ có trong danh sách từ vựng chính của bài → dùng nghĩa đã soạn (có tiếng Việt);
  - các từ còn lại → tra nghĩa tiếng Anh từ Wiktionary (kaikki.org, giấy phép CC BY-SA), chọn nghĩa đúng từ loại và gần ngữ cảnh nhất,
    kèm nghĩa tiếng Việt nếu Wiktionary có bản dịch khớp nghĩa; nếu không có thì dùng WordNet.
Chạy: python3 reading/tools/build.py   (cần: pip install nltk cefrpy requests; mạng để tra Wiktionary lần đầu, có bộ nhớ đệm)
"""
import json, re, os, sys, glob, time, warnings
warnings.filterwarnings('ignore')
import requests, nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet as wn
from nltk.tokenize.punkt import PunktSentenceTokenizer
from cefrpy import CEFRAnalyzer

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'src')
OUT = os.path.join(HERE, '..', 'bank.json')
CACHE = os.environ.get('KAIKKI_CACHE', '/tmp/ewt-kaikki')
os.makedirs(CACHE, exist_ok=True)
LEMMA = WordNetLemmatizer(); CEFR = CEFRAnalyzer(); PUNKT = PunktSentenceTokenizer()
H = {'User-Agent': 'EWT-reading-build/1.0 (education)'}
LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
WORD = re.compile(r"[A-Za-z]+(?:['’][A-Za-z]+)?(?:-[A-Za-z]+)*")
SKIP_LEMMA = set('be have do not also very just only even still too quite much many more most such own same other another each every any some no yes so then than there here now ever never always often again once already yet away back well'.split())
POSMAP = {'NN': 'n', 'NNS': 'n', 'VB': 'v', 'VBD': 'v', 'VBG': 'v', 'VBN': 'v', 'VBP': 'v', 'VBZ': 'v', 'JJ': 'adj', 'JJR': 'adj', 'JJS': 'adj', 'RB': 'adv', 'RBR': 'adv', 'RBS': 'adv'}
WNPOS = {'n': 'n', 'v': 'v', 'adj': 'a', 'adv': 'r'}
KPOS = {'n': 'noun', 'v': 'verb', 'adj': 'adj', 'adv': 'adv'}
BAD_TAGS = {'obsolete', 'archaic', 'dated', 'rare', 'slang', 'vulgar', 'offensive', 'derogatory', 'historical', 'nonstandard', 'dialectal', 'colloquial'}
BAD_GLOSS = re.compile(r'^(alternative|obsolete|misspelling|plural of|singular of|present participle|past participle|simple past|third-person|comparative|superlative|inflection|gerund|nonstandard|eye dialect|abbreviation|initialism|acronym|clipping|contraction|synonym of)', re.I)
STOPW = set('the a an and or but of to in on at for with from by as is are was were be been it its this that these those he she they we you i his her their our your my me him them us not no do does did have has had will would can could should may might must than then so if when while which who what where why how also very more most some any all each other such only own same too just about into over after before between because through during without again further once'.split())

PREFETCH = False
LEMMAS = set()
def log(*a): print(*a, file=sys.stderr)

def kaikki(word):
    f = os.path.join(CACHE, re.sub(r'[^a-z0-9\-]', '_', word) + '.json')
    if os.path.exists(f):
        try: return json.load(open(f))
        except Exception: pass
    data = None
    if len(word) >= 2 and re.fullmatch(r'[a-z\-]+', word):
        u = 'https://kaikki.org/dictionary/English/meaning/%s/%s/%s.jsonl' % (word[0], word[:2], word)
        for _ in range(2):
            try:
                r = requests.get(u, headers=H, timeout=30)
                if r.status_code == 200:
                    data = []
                    for l in r.text.strip().split('\n'):
                        if not l.strip(): continue
                        e = json.loads(l)
                        data.append({'pos': e.get('pos'), 'senses': [{'g': s.get('glosses') or [], 't': s.get('tags') or [], 'ex': [x.get('text', '') for x in (s.get('examples') or [])][:3]} for s in e.get('senses', [])][:12],
                                     'vi': [{'s': t.get('sense', ''), 'w': t.get('word', '')} for t in e.get('translations', []) if t.get('lang_code') == 'vi'][:8]})
                    break
                if r.status_code == 404: data = []; break
            except Exception: time.sleep(1)
    json.dump(data or [], open(f, 'w'))
    return data or []

def words_of(s): return set(w for w in re.findall(r"[a-z]+", s.lower()) if w not in STOPW and len(w) > 2)
def short(g, n=125):
    g = re.sub(r'\s+', ' ', g).strip()
    g = re.sub(r'\s*\([^)]{40,}\)', '', g)
    if len(g) <= n: return g
    cut = g[:n]; i = max(cut.rfind(';'), cut.rfind(', '), cut.rfind(' '))
    return cut[:i if i > 60 else n].rstrip(' ,;') + '…'

DOMAIN = {'nautical', 'medicine', 'law', 'computing', 'mathematics', 'chemistry', 'biology', 'physics', 'military', 'sports', 'music', 'finance', 'business', 'geometry', 'linguistics', 'grammar', 'astronomy', 'botany', 'zoology', 'anatomy', 'baseball', 'cricket', 'golf', 'poker', 'cooking', 'heraldry', 'engineering', 'electronics', 'mining', 'gambling', 'sports', 'football', 'obsolete', 'archaic', 'rare', 'slang', 'vulgar', 'offensive', 'dated', 'historical', 'dialectal', 'nonstandard', 'colloquial', 'Britain', 'UK', 'US', 'Australia', 'Ireland', 'Scotland', 'India', 'regional', 'figuratively', 'euphemistic', 'ellipsis', 'idiomatic', 'transitive-with-preposition'}
def auto_def(lemma, pos, ctx, depth=0):
    """Chọn nghĩa Wiktionary đúng từ loại. Mặc định lấy nghĩa phổ biến nhất (đầu tiên, không thuộc lĩnh vực hẹp);
    chỉ đổi sang nghĩa khác khi nó khớp ngữ cảnh rõ rệt (≥2 từ trùng và hơn nghĩa đầu ít nhất 1)."""
    cands = []; redirect = None
    for e in kaikki(lemma):
        if e['pos'] != KPOS[pos]: continue
        for si, s in enumerate(e['senses']):
            if not s['g']: continue
            g = s['g'][-1]
            if 'form-of' in s['t'] or BAD_GLOSS.match(g):
                m = re.search(r'(?:form|tense|participle|plural|singular) of ([a-z\-]+)', g)
                if m and redirect is None and not cands: redirect = m.group(1)
                continue
            restricted = bool(set(s['t']) & DOMAIN)
            ov = len(words_of(' '.join(s['g'])) & ctx)
            cands.append({'ov': ov, 'g': g, 'e': e, 'r': restricted})
    if redirect and depth == 0:
        r = auto_def(redirect, pos, ctx, 1)
        if r: return r
    if not cands: return None
    plain = [c for c in cands if not c['r']] or cands
    first = plain[0]
    best = max(plain, key=lambda c: c['ov'])
    pick = best if (best['ov'] >= 3 and best['ov'] >= first['ov'] + 2) else first
    g, e = pick['g'], pick['e']
    vi, bestj = None, 0
    gw = words_of(g)
    for t in e['vi']:
        sw = words_of(t['s'])
        if not sw: continue
        j = len(sw & gw) / max(1, len(sw | gw))
        if j > bestj: bestj, vi = j, t['w']
    if bestj < 0.34: vi = None
    return short(g), vi

def wn_def(lemma, pos):
    ss = wn.synsets(lemma, pos=WNPOS[pos])
    return short(ss[0].definition()) if ss else None

def cefr_of(w):
    try:
        l = CEFR.get_average_word_level_CEFR(w.lower()); return str(l) if l else ''
    except Exception: return ''

def tokenize_para(par):
    """→ danh sách [(văn bản, None | (surface, lemma, pos))] kèm câu chứa nó."""
    items = []
    for a, b in PUNKT.span_tokenize(par):
        sent = par[a:b]
        ms = list(WORD.finditer(sent)); toks = [m.group(0) for m in ms]
        tags = nltk.pos_tag(toks) if toks else []
        yield a, b, sent, ms, tags

def build_text(src):
    curated = {}
    for v in src['notes'].get('vocab', []):
        w = v['w'].strip().lower()
        if ' ' in w: continue
        curated[w] = v
    lex, ptok = {}, []
    need = []   # (key, lemma, pos, ctxwords)
    for par in src['paras']:
        items, pos_i = [], 0
        for a, b, sent, ms, tags in tokenize_para(par):
            if a > pos_i: items.append(par[pos_i:a])
            cur = 0
            ctx = words_of(sent) | words_of(src['title'])
            for m, (tok, tag) in zip(ms, tags):
                if m.start() > cur: items.append(sent[cur:m.start()])
                cur = m.end()
                low = tok.lower().replace('’', "'")
                pos = POSMAP.get(tag)
                key = None
                if '-' in tok and not pos: pos = None
                base = None
                if pos and tag not in ('NNP', 'NNPS') and low not in STOPW and not low.endswith("'s") and len(low) > 2:
                    base = LEMMA.lemmatize(low, WNPOS[pos]) if "'" not in low else low
                    if base in SKIP_LEMMA or (base in ('be', 'have', 'do')): base = None
                # từ vựng chính đã soạn: khớp theo dạng gốc hoặc dạng gõ
                cv = None
                for cand in {low, base or low, LEMMA.lemmatize(low, 'n'), LEMMA.lemmatize(low, 'v'), LEMMA.lemmatize(low, 'a')}:
                    if cand in curated: cv = (cand, curated[cand]); break
                if cv and not (tok[0].isupper() and tag in ('NNP', 'NNPS')):
                    cp = {'n': 'n', 'v': 'v', 'adj': 'adj', 'adv': 'adv'}.get(cv[1]['pos'], 'other')
                    key = cv[0] + '|' + cp
                    if key not in lex:
                        lex[key] = {'w': cv[0], 'pos': cp, 'def': cv[1]['def'], 'vi': cv[1].get('vi') or None, 'cefr': cefr_of(cv[0]), 'cur': 1}
                elif base:
                    key = base + '|' + pos
                    if key not in lex and key not in [n[0] for n in need]: need.append((key, base, pos, ctx))
                items.append([tok, key] if key else tok)
            if cur < len(sent): items.append(sent[cur:])
            pos_i = b
        if pos_i < len(par): items.append(par[pos_i:])
        ptok.append(items)
    for key, base, pos, ctx in need:
        if PREFETCH:
            LEMMAS.add(base); continue
        r = auto_def(base, pos, ctx); vi = None
        if r: d, vi = r
        else:
            d = wn_def(base, pos)
        if d: lex[key] = {'w': base, 'pos': pos, 'def': d, 'vi': vi, 'vi_auto': 1 if vi else 0, 'cefr': cefr_of(base), 'cur': 0}
    # bỏ khoá không có nghĩa → token thường
    for p in ptok:
        for i, t in enumerate(p):
            if isinstance(t, list) and t[1] not in lex: p[i] = t[0]
    return lex, ptok

def main():
    global PREFETCH
    files = sorted(glob.glob(os.path.join(SRC, '*.json')))
    # 1) gom mọi từ cần tra rồi tải song song vào bộ nhớ đệm (mỗi lượt tra ~2 giây nên phải chạy nhiều luồng)
    PREFETCH = True
    for f in files: build_text(json.load(open(f)))
    PREFETCH = False
    from concurrent.futures import ThreadPoolExecutor
    todo = [w for w in sorted(LEMMAS) if not os.path.exists(os.path.join(CACHE, re.sub(r'[^a-z0-9\-]', '_', w) + '.json'))]
    log('cần tra', len(LEMMAS), 'từ, chưa có trong bộ nhớ đệm:', len(todo))
    with ThreadPoolExecutor(24) as ex: list(ex.map(kaikki, todo))
    texts = []
    for f in files:
        s = json.load(open(f))
        lex, ptok = build_text(s)
        s['lex'], s['ptok'] = lex, ptok
        texts.append(s)
        log(s['id'], 'tokens-lex', len(lex))
    texts.sort(key=lambda t: (LEVELS.index(t['level']), t['id']))
    json.dump({'built': time.strftime('%Y-%m-%d'), 'texts': texts}, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
    log('OK', len(texts), 'bài →', OUT, round(os.path.getsize(OUT) / 1024), 'KB')

if __name__ == '__main__':
    main()
