import re,sys,json,os,subprocess,time,urllib.request
sys.path.insert(0,'.')
from parse import text_of
from extract import split_sections,parse_part
from sil import silences,FF
OUT=sys.argv[1] if len(sys.argv)>1 else 'out'
os.makedirs(OUT+'/audio',exist_ok=True);os.makedirs(OUT+'/img',exist_ok=True);os.makedirs('mp3',exist_ok=True);os.makedirs('imgsrc',exist_ok=True)
UA={'User-Agent':'Mozilla/5.0'}
def get(url,path):
    if os.path.exists(path) and os.path.getsize(path)>1000: return
    req=urllib.request.Request(url,headers=UA)
    with urllib.request.urlopen(req,timeout=60) as r: data=r.read()
    open(path,'wb').write(data);time.sleep(0.4)
def page(fam,slug):
    f=f'pages/{slug}.html'
    os.makedirs('pages',exist_ok=True)
    get('https://englishpracticetest.net/'+slug+'/',f)
    return f
def cut(src,a,b,dst):
    subprocess.run([FF,'-y','-loglevel','error','-ss',f'{a:.2f}','-to',f'{b:.2f}','-i',src,'-ac','1','-ar','24000','-c:a','aac','-b:a','32k','-movflags','+faststart',dst],check=True)
def split_questions(path,n,lo,hi):
    dur,s=silences(path,d=1.0)
    first=s[0] if s else (0,0,0)
    t0=0.0 if first[0]<3.0 else first[1]
    for thr in lo:
        g=[x for x in s if thr<=x[2]<=hi and x[0]>3.0]
        if len(g)==n-1: ends=[x[0]+0.3 for x in g]+[dur]
        elif len(g)==n and g[-1][1]>dur-8.0: ends=[x[0]+0.3 for x in g]
        else: continue
        starts=[t0]+[x[1] for x in g]
        return list(zip(starts,ends))
    return None
def split_a1(path,n):
    dur,s=silences(path,d=0.9)
    # speech blocks separated by gaps >=3.3
    t=0;blocks=[]
    bs=0.0
    segs=[]
    prev=0.0
    for a,b,d in s:
        if d>=3.3:
            if a-prev>0.2: segs.append((prev,a))
            prev=b
    if dur-prev>0.2: segs.append((prev,dur))
    long=[i for i,(a,b) in enumerate(segs) if b-a>=10]
    if len(long)!=n+1: return None
    res=[]
    for k in range(1,n+1):
        di=long[k]; prevdi=long[k-1]
        st=segs[di-1][0] if di-1>prevdi else segs[di][0]
        res.append((max(0,st-0.2),min(dur,segs[di][1]+0.5)))
    return res
def speaker_lines(block):
    out=[]
    for l in block or []:
        l=l.strip()
        if not l or l=='Now listen again.': continue
        m=re.match(r'^([A-Za-z0-9 ]{1,18}?)\s*[:：]\s+(.*)$',l) 
        out.append([m[1].strip(),m[2].strip()] if m else ['',l])
    return out
def build(fam,lv,slug,part_n,idp,qsel=None):
    f=page(fam,slug)
    L=text_of(f);secs=split_sections(L)
    sec=next(s for s in secs if s['n']==part_n)
    p=parse_part(sec)
    qs=p['qs']
    n=len(qs)
    mp=f'mp3/{idp}.mp3'; get(p['audio'],mp)
    if fam=='A1': cl=split_a1(mp,n)
    elif fam=='FCE': cl=split_questions(mp,n,[4.0,3.8],6.0)
    else: cl=split_questions(mp,n,[2.4],3.4)
    if cl is None or len(cl)!=n: print('!! cannot split',idp,n); return []
    items=[]
    for i,(q,(a,b)) in enumerate(zip(qs,cl)):
        iid=f'l-{idp}-{i+1}'
        if q['a'] is None: print('!! no answer',iid); continue
        it={'id':iid,'lv':lv,'fam':fam,'src':f'englishpracticetest.net · {slug}','part':part_n,'n':q['n'],'q':q['q'],'a':q['a'],'dur':round(b-a,1),
            'plays':2 if fam=='A1' else 1,'script':speaker_lines(q['script']),'img':bool(q['img'])}
        if q['img']:
            it['opts']=['A','B','C']
            src=f'imgsrc/{iid}.jpg';get(q['img'],src)
            subprocess.run(['sips','-s','format','jpeg','-s','formatOptions','72','-Z','900',src,'--out',f'{OUT}/img/{iid}.jpg'],capture_output=True,check=True)
        else:
            it['opts']=[o[1] for o in q['opts']]
            if len(q['opts'])!=3: print('!! opts',iid,q['opts']);continue
        cut(mp,a,b,f'{OUT}/audio/{iid}.m4a')
        items.append(it)
    print('ok',idp,len(items),'clips',[round(b-a) for a,b in cl])
    return items
if __name__=='__main__':
    plan=json.load(open(sys.argv[2]))
    allit=[]
    for p in plan: allit+=build(p['fam'],p['lv'],p['slug'],p['part'],p['id'])
    json.dump(allit,open(OUT+'/items.json','w'),ensure_ascii=False,indent=1)
    print(len(allit),'items')
