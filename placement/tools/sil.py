import sys,re,subprocess
FF=open('../ff.env').read().split("'")[1]
def silences(path,noise='-38dB',d=1.0):
    r=subprocess.run([FF,'-hide_banner','-i',path,'-af',f'silencedetect=noise={noise}:d={d}','-f','null','-'],capture_output=True,text=True).stderr
    dur=0;out=[]
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',r)
    if m: dur=int(m[1])*3600+int(m[2])*60+float(m[3])
    for m in re.finditer(r'silence_end: ([\d.]+) \| silence_duration: ([\d.]+)',r):
        e=float(m[1]);du=float(m[2]);out.append((round(e-du,1),round(e,1),round(du,1)))
    return dur,out
if __name__=='__main__':
    for p in sys.argv[1:]:
        dur,s=silences(p); print('==',p,'dur',round(dur,1)); print([ (a,du) for a,b,du in s])
