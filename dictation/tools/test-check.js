const {check}=require('../../dictation-check.js');
let bad=0; function t(name,ref,typed,exp){const r=check(ref,typed);const ok=Object.keys(exp).every(k=>k==='score'?(Math.abs(r.score-exp.score)<=exp.tol||0)||r.score===exp.score:(k==='perfect'?r.perfect===exp.perfect:JSON.stringify(r.counts[k])===JSON.stringify(exp[k])));console.log(ok?'ok  ':'FAIL',name,r.score,JSON.stringify(r.counts));if(!ok)bad++;}
t('exact','I’m hungry, Mum.','i am hungry mum',{perfect:true,score:100});
t('contraction both','She doesn\'t like pasta.','She does not like pasta',{perfect:true});
t('cannot','I can\'t swim.','I cannot swim',{perfect:true});
t('numbers','The bus leaves at seven thirty.','The bus leaves at 7.30',{perfect:true});
t('twenty five','There are twenty-five students.','There are 25 students',{perfect:true});
t('US spelling','My favourite colour is blue.','My favorite color is blue',{perfect:true});
t('missing','I went to the shop yesterday.','I went to shop yesterday',{miss:1,ok:5,score:83});
t('extra','I like tea.','I really like tea',{extra:1,ok:3});
t('typo','She bought a beautiful dress.','She bought a beutiful dress',{typo:1,ok:4});
t('wrong word','He plays tennis on Monday.','He plays football on Monday',{ok:4,miss:1,extra:1});
t('empty','Hello there my friend.','',{miss:4,score:0});
t('hyphen','My mother-in-law is kind.','My mother in law is kind',{perfect:true});
t('let us','Let\'s go home.','let us go home',{perfect:true});
t('it is','It\'s raining.','it is raining',{perfect:true});
t('possessive','This is Tom\'s bag.','this is toms bag',{typo:1});
t('order swap','You can see the park from here.','from here you can see the park',{});
process.exit(bad?1:0)
