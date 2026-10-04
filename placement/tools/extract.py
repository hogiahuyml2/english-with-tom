import re,sys,json
sys.path.insert(0,'.')
from parse import text_of
def split_sections(L, a1=False):
    """returns list of {name, lines}"""
    secs=[];cur=None
    for l in L:
        m=re.match(r'^Listening (?:Part )?(\d+)\s*$',l)
        if m: cur={'n':int(m[1]),'lines':[]};secs.append(cur);continue
        if cur is None: continue
        if re.match(r'^(Copyright|Share This|Follow|Pin It|Related|Leave a Reply)',l): break
        cur['lines'].append(l)
    return secs
def answers_from(lines):
    i=next(k for k,l in enumerate(lines) if l.startswith('Answer & Audioscript'))
    j=next(k for k,l in enumerate(lines) if k>i and re.match(r'^Audioscripts?$',l))
    txt=' '.join(lines[i+1:j])
    return dict((int(n),a) for n,a in re.findall(r'(\d+)\s*([A-H])\b',txt)), lines[:i], lines[j+1:]
def script_blocks(sl):
    """split audioscript into blocks keyed by question number (a block header is 'n   text' or just 'n' on its own)"""
    blocks={};cur=None;ex=[]
    for l in sl:
        m=re.match(r'^(\d{1,2})\s{1,}(\S.*)$',l) or re.match(r'^(\d{1,2})$',l)
        if m and not re.match(r'^\d{1,2}[.:]\d',l):
            cur=int(m[1]);blocks[cur]=[m[2]] if m.lastindex==2 else [];continue
        if cur is None: ex.append(l)
        else: blocks[cur].append(l)
    return blocks,ex
def parse_part(sec):
    L=sec['lines']
    ans,qpart,spart=answers_from(L)
    audio=next(re.search(r'\[AUDIO (\S+)\]',l)[1] for l in qpart if l.startswith('[AUDIO'))
    blocks,ex=script_blocks(spart)
    qs=[];cur=None
    for l in qpart:
        if l.startswith('[AUDIO'): continue
        m=re.match(r'^(\d{1,2})\s+(.*)$',l)
        if m and not l.startswith('[IMG'):
            cur={'n':int(m[1]),'q':[m[2]],'img':None,'opts':[]};qs.append(cur);continue
        if cur is None: continue
        if l.startswith('[IMG'): cur['img']=re.search(r'\[IMG (\S+)\]',l)[1];continue
        m=re.match(r'^([ABC])\s{1,}(.+)$',l)
        if m: cur['opts'].append((m[1],m[2]));continue
        if len(cur['opts'])==0: cur['q'].append(l)
    for q in qs: q['q']=' '.join(x for x in q['q'] if x).strip(); q['a']=ans.get(q['n']); q['script']=blocks.get(q['n'])
    return {'audio':audio,'qs':qs,'ex':ex,'head':[l for l in qpart if not l.startswith('[') ][:2]}
if __name__=='__main__':
    L=text_of(sys.argv[1]); secs=split_sections(L)
    for s in secs:
        try: p=parse_part(s)
        except Exception as e: print('ERR',s['n'],e); continue
        print('SEC',s['n'],p['audio'].split('/')[-1],len(p['qs']))
        for q in p['qs'][:int(sys.argv[2]) if len(sys.argv)>2 else 2]: print('  ',q['n'],q['a'],q['q'][:70],q['img'] and 'IMG',q['opts'][:3],(q['script'] or [''])[:1])
