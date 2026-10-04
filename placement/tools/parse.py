import re,json,sys,html
def text_of(f):
    h=open(f,encoding='utf8').read()
    i=h.find('<div class="et_pb_section et_pb_section_0'); 
    t=re.sub(r'<script.*?</script>|<style.*?</style>','',h,flags=re.S)
    t=re.sub(r'<audio[^>]*>.*?</audio>',lambda m:'\n[AUDIO '+re.search(r'src="([^"?]+)',m.group(0)).group(1)+']\n',t,flags=re.S)
    t=re.sub(r'<img[^>]*src="([^"]+)"[^>]*>',lambda m:'\n[IMG '+m.group(1)+']\n' if 'wp-content/uploads' in m.group(1) and 'logo' not in m.group(1) and 'favicon' not in m.group(1) else '',t)
    t=re.sub(r'<br ?/?>','\n',t)
    t=re.sub(r'</(p|div|h\d|li|tr|td|span)>','\n',t)
    t=re.sub(r'<[^>]+>','',t); t=html.unescape(t).replace('\xa0',' ')
    lines=[l.strip() for l in t.split('\n')]
    lines=[l for l in lines if l]
    return lines
def parse(f):
    L=text_of(f)
    # trim to content
    s=next(i for i,l in enumerate(L) if re.match(r'^Listening Part 1',l))
    L=L[s:]
    parts=[];cur=None
    for l in L:
        m=re.match(r'^Listening Part (\d+)',l)
        if m:
            cur={'part':int(m.group(1)),'lines':[]};parts.append(cur);continue
        if cur is None: continue
        if re.match(r'^(Copyright|Share This|Follow|Pin It)',l): break
        cur['lines'].append(l)
    return parts
if __name__=='__main__':
    for p in parse(sys.argv[1]):
        print('=== PART',p['part'])
        print('\n'.join(p['lines'][:int(sys.argv[2]) if len(sys.argv)>2 else 60]))
