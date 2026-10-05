import requests,re,json,time,sys,warnings
warnings.filterwarnings('ignore')
from bs4 import BeautifulSoup
H={'User-Agent':'Mozilla/5.0 (EWT reading research)'}
SECS={'1579':'science','1581':'stories','955':'health','986':'arts','987':'words','3521':'asitis','7468':'edu'}
urls={}
for sid,name in SECS.items():
    for p in range(1,4):
        u='https://learningenglish.voanews.com/z/%s'%sid + ('' if p==1 else '?p=%d'%(p-1))
        try:
            r=requests.get(u,headers=H,timeout=30)
            b=BeautifulSoup(r.text,'html.parser')
            n=0
            for a in b.select('a[href]'):
                h=a['href']
                if re.match(r'^/a/.+/\d+\.html$',h) and h not in urls: urls[h]=name; n+=1
            print(sid,p,r.status_code,n,file=sys.stderr)
        except Exception as e: print('ERR',u,e,file=sys.stderr)
        time.sleep(0.6)
print(len(urls),file=sys.stderr)
out=[]
for h,name in urls.items():
    try:
        r=requests.get('https://learningenglish.voanews.com'+h,headers=H,timeout=30)
        b=BeautifulSoup(r.text,'html.parser')
        t=b.find('h1'); t=t.get_text(strip=True) if t else ''
        body=b.select_one('#article-content .wsw') or b.select_one('.wsw')
        if not body: continue
        paras=[]
        for p in body.find_all(['p','h2']):
            if p.parent is not body: continue
            tx=p.get_text(' ',strip=True)
            if tx: paras.append(('h:' if p.name=='h2' else '')+tx)
        date=b.find('time'); date=date.get('datetime') if date else ''
        out.append({'url':'https://learningenglish.voanews.com'+h,'sec':name,'title':t,'date':date,'paras':paras})
    except Exception as e: print('ERR',h,e,file=sys.stderr)
    time.sleep(0.5)
json.dump(out,open('/tmp/ewt-read/voa_raw.json','w'),ensure_ascii=False)
print('done',len(out),file=sys.stderr)
