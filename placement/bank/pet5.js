'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge B1 Preliminary for Schools Trainer · Test 5 · ' + p;

module.exports = [
  // Reading P1 — key: B C A C B
  notice('pet5-r1-1', 'B1', 'New Message\nFrom: Mrs Evans\nTo: All students\n\nCould everyone involved in the school performance for parents tomorrow please meet in the hall at 4 p.m. today for the final practice?', null,
    ['Mrs Evans wants to check who is taking part in the performance this afternoon.', 'Mrs Evans wants everyone to practise their performance again before the audience sees it.', 'Mrs Evans is letting students know that parents are coming to the practice tomorrow.'], 'B', S('Reading P1 Q1')),
  notice('pet5-r1-2', 'B1', "PLEASE DON'T FEED BREAD TO THE DUCKS!\nAVAILABLE FOR SALE INSIDE LAKE SHOP: SPECIAL FOOD PERMITTED FOR BIRDS", null,
    ["If you need bread during your visit, it's available for sale inside the shop.", 'Feeding the birds on the lake is not allowed unless you have special permission.', 'Visitors are encouraged not to give the birds anything apart from proper bird food.'], 'C', S('Reading P1 Q2')),
  notice('pet5-r1-3', 'B1', "Tim,\nYour swimming coach rang – he wants to know if you're swimming tomorrow, after your injury. I wasn't sure if you felt your leg was fully recovered, so can you let him know?\nMum", null,
    ["Tim must decide whether he's well enough to swim after his injury.", "Tim's mum doesn't think Tim is fit and ready to go swimming yet.", "Tim needs to inform his swimming coach that he's injured his leg."], 'A', S('Reading P1 Q3')),
  notice('pet5-r1-4', 'B1', "Lucy,\nI discovered when I got home that one of my new earrings was missing from my ear. Can you remember which shop we got them from? I'll get another pair – they weren't expensive.\nJade", 'Jade wants Lucy to',
    ['tell Jade if she knows where a missing item is.', 'accompany Jade on a shopping trip into town.', 'help Jade to replace something she\'s lost.'], 'C', S('Reading P1 Q4')),
  notice('pet5-r1-5', 'B1', 'Art Room closed – heating problems.\nSee Mr James in Room B16 to check where your art lessons will be.', null,
    ['Art classes will be in Room B16 as the Art Room is too cold.', 'To find out which room to go to for art lessons, ask Mr James.', 'Mr James is taking all art lessons until problems in the Art Room are fixed.'], 'B', S('Reading P1 Q5')),

  // Reading P3 — key: C A B D B
  passage('pet5-r3', 'B1', 'Our school newspaper (by Michael Williams)',
`Some years ago, our head teacher, Mrs Waters, decided to start a school newspaper, and get as many students as possible to take on the job of producing it – and parents, too. She felt the newspaper would help them learn more about school life, through articles on things like sports achievements and arts projects, which not all students know about if they're not taking part. Students took the whole thing very seriously – and we now have a prize-winning newspaper!

Some of my friends joined the newspaper team immediately and enjoyed it. I'd always loved creative writing and drawing cartoons, which I thought would be perfect in the newspaper, so I signed up. My dad, who's a journalist, was pleased – he thought that even though I wasn't keen on a job like his, the newspaper would be a great opportunity for me. And he was right – I loved it! Dad often came along to give advice, which was popular with the students. It was difficult sometimes, if he was busy, but he learned a lot about the school that way.

My first job was writing a report about a sports event – a writing style I'd never attempted before. But Dad reminded me it was similar in some ways to writing a story – getting information in the right order. Once I'd understood that, there was no stopping me – and after my first efforts, I developed quite a professional style, which was brilliant. Sometimes the team couldn't use what I'd written, or my cartoons, for whatever reason, but I didn't mind. And sometimes it was hard to finish stuff on time, but I usually got there.

I'm now one of the editors – we decide what goes into the newspaper, so our names no longer appear in print. And it's stressful sometimes as we don't have much time, but we try to manage that properly. We also correct mistakes in people's articles, which we all had to get used to, but we were soon doing it without thinking – and in our own schoolwork, too. I still put off calling people outside school for comments on stuff, but I guess it's all good experience – at least, that's what Dad says!`,
    [["Michael's head teacher wanted to start a student newspaper to", ['provide an activity for students not interested in sport or art.', 'make students feel more confident about taking part in something.', 'keep students better informed about what was happening at school.', 'give students the experience of being responsible for something.'], 'C'],
     ['Michael decided to join the newspaper because', ['he had ideas about some work he could do for it.', 'he was considering a career in journalism.', 'his friends had encouraged him to do so.', 'he liked the idea of being part of a team.'], 'A'],
     ['When Michael first started working on the newspaper, he was', ["disappointed when his stories sometimes weren't used.", 'delighted at the way his writing skills improved.', 'pleased to find he could make use of his art skills.', "worried he'd be late completing some of his writing."], 'B'],
     ['What does Michael say about his role on the newspaper now?', ["He feels uncomfortable about correcting other students' work.", 'He still needs to improve the way he manages his time.', "He's happier to handle making telephone calls to others.", "He's become better at making articles more accurate."], 'D'],
     ["What would Michael's dad say about the newspaper?", ["I was surprised at how keen Michael was to get involved – he's never shown that much interest in writing before.", "I occasionally had problems finding the time to help out at Michael's school, but the students really seemed to like my suggestions.", "Michael would never admit it, but I know he's proud to see his name in the newspaper these days – and I am, too!", "It's been great to finally find out about life at the school through reading the newspaper. I didn't really know much about it before."], 'B']],
    S('Reading P3 Q11–15')),

  // Reading P5 — key: D C A B A D
  cloze('pet5-r5-21', 'vocab', 'B1', 'Many people used to colour pictures in colouring books when they were children. However, once people get older, very few of them continue with the hobby. Instead, they ____ their crayons away in the cupboard forever.', ['leave', 'set', 'give', 'put'], 'D', S('Reading P5 Q21')),
  cloze('pet5-r5-22', 'vocab', 'B1', 'However, psychology researchers now think that even for adults, ____ as little as ten minutes a day colouring pictures in this way can bring huge benefits.', ['taking', 'completing', 'spending', 'filling'], 'C', S('Reading P5 Q22')),
  cloze('pet5-r5-23', 'vocab', 'B1', 'Colouring pictures in this way can bring huge ____. For example, some people say that it improves their mood for a while.', ['benefits', 'interests', 'favours', 'uses'], 'A', S('Reading P5 Q23')),
  cloze('pet5-r5-24', 'vocab', 'B1', 'Some people say that colouring improves their ____ for a while by making them feel more cheerful and generally calmer.', ['character', 'mood', 'condition', 'mind'], 'B', S('Reading P5 Q24')),
  cloze('pet5-r5-25', 'vocab', 'B1', 'Other activities ____ with art, such as drawing or painting, can actually be quite stressful, especially if you don\'t feel very successful at it.', ['connected', 'joined', 'compared', 'attached'], 'A', S('Reading P5 Q25')),
  cloze('pet5-r5-26', 'vocab', 'B1', "But adding colour to a picture that's already drawn for you ____ only a low level of skill, so you can relax rather than becoming anxious about it!", ['depends', 'calls', 'lacks', 'requires'], 'D', S('Reading P5 Q26')),

  // Reading P6 — key: for · much · since · one · are · be
  fill('pet5-r6-27', 'B1', "Guess what! I've finally joined the local girls' football team in my town! As you know, it's something I've wanted to do ____ ages.", 'for', S('Reading P6 Q27')),
  fill('pet5-r6-28', 'B1', "I think my parents were a bit surprised, though, as I'd never really taken very ____ interest in sport.", 'much', S('Reading P6 Q28')),
  fill('pet5-r6-29', 'B1', "After watching a women's football match on TV, I just knew it was for me. I've attended football training every week ____ then.", 'since', S('Reading P6 Q29')),
  fill('pet5-r6-30', 'B1', 'Last Saturday I played in my first match. It was really exciting! And ____ of the best things was that I actually scored a goal!', 'one', S('Reading P6 Q30')),
  fill('pet5-r6-31', 'B1', "Our next match is on the 25th. You're not on holiday with your parents then, ____ you? So why don't you come along and watch?", 'are', S('Reading P6 Q31')),
  fill('pet5-r6-32', 'B1', 'It would ____ great to see you!', 'be', S('Reading P6 Q32')),

  // Listening P2 — key: C C B A B C
  listen('pet5-l2-8', 'B1', 'You will hear a boy telling his friend about a snowboarding trip.',
    [['F', 'Hi Frankie, how was snowboarding?'],
     ['M', 'The first few days were great! The snow was perfect and I was learning some great new tricks...'],
     ['F', "Don't tell me! You hit a tree and had to stop."],
     ['M', "That's what happens to some people, isn't it – a broken leg. In my case, it was a lot more boring. My stomach found it hard getting used to the local food, so I had to spend a few days in bed. Then my sister borrowed my board and managed to drop it from the ski lift. It didn't break, but we never got it back."],
     ['F', 'Oh, no!']],
    [['What problem did the boy have on the trip?', ['He damaged some equipment.', 'He injured himself.', 'He became ill.'], 'C']], S('Listening P2 Q8')),
  listen('pet5-l2-9', 'B1', 'You will hear two friends talking about the new library at their school.',
    [['M', "The new school library's great."],
     ['F', "Everything being self-service takes a bit of getting used to – I found it quite useful having someone there to ask if you couldn't find something."],
     ['M', 'True, but the new system works well.'],
     ['F', "It's pretty quiet there, too. I can't concentrate at home because of my little sister, so I always stay now, to get everything done for the next day's lessons."],
     ['M', 'Good idea.'],
     ['F', "Yes, and of course I'd never have the books I needed because I always forgot to get them before I went home, which isn't a problem if I stay."]],
    [['The girl thinks that', ['the staff are helpful.', 'there should be more books.', "it's a good place to do homework."], 'C']], S('Listening P2 Q9')),
  listen('pet5-l2-10', 'B1', 'You will hear two friends talking about a new clothes shop.',
    [['F', 'I like that new clothes shop.'],
     ['M', 'Me, too. The one I usually use is so far out of town, I hardly ever go there.'],
     ['F', 'Me, neither, and you have to get two different buses.'],
     ['M', "The people who work at the new shop couldn't be nicer."],
     ['F', "The lady who served me was a bit miserable, actually, but the others seemed OK. It's not too expensive either."],
     ['M', "Maybe it's because it's only just opened, but I found the range of styles they had was quite narrow."],
     ['F', 'I think the other shop definitely has a bigger variety of things for teenagers.']],
    [['They agree the shop would be better if', ['the assistants were more friendly.', 'there was more choice of clothes.', 'it was in the town centre.'], 'B']], S('Listening P2 Q10')),
  listen('pet5-l2-11', 'B1', 'You will hear two friends talking about a new classmate.',
    [['F', 'What do you think of the new boy, Finnian?'],
     ['M', "He seems pretty cool to me. He certainly knows lots of jokes and funny stories – we could hardly stop him talking at break time, not that we really wanted him to. And he answered at least twice as many questions as I did during the maths class."],
     ['F', "You're really good at maths too."],
     ['M', "Maybe... but he also knew a lot about what we were discussing in our groups in the history class. I tried to get him to come to training for the school football team, but I didn't manage to persuade him."]],
    [['The boy thinks the new classmate', ['is very clever.', 'likes playing sport.', 'talks too much.'], 'A']], S('Listening P2 Q11')),
  listen('pet5-l2-12', 'B1', 'You will hear a girl talking about her big brother going away to college.',
    [['M', 'Has your brother gone away to college yet?'],
     ['F', "Yeah, he left yesterday. I thought I'd be relieved not to have to listen to music coming from his bedroom all evening. I couldn't believe it when tears actually started running down my cheeks last night, and this morning, too, when he wasn't at breakfast."],
     ['M', 'I never knew you two were so close.'],
     ['F', "We weren't. You just get used to someone being there, though, and when they're suddenly not, it's strange, even though I know he hasn't gone hundreds of kilometres away like some students do. He'll probably be back most weekends."]],
    [['How does she feel about it?', ["pleased there's less noise", "surprised that she's so sad", 'upset he\'s gone so far away'], 'B']], S('Listening P2 Q12')),
  listen('pet5-l2-13', 'B1', 'You will hear two friends talking about playing tennis.',
    [['F', 'Are you still having tennis coaching?'],
     ['M', "Yes, but I'm progressing really slowly. The teacher wants me to learn each skill well before we move onto the next. Does your coach do that?"],
     ['F', 'Pretty much, yes.'],
     ['M', "Even though I practise between the sessions with my family, I'm sure I'd improve more quickly if someone showed me a few other skills. That's why I need your help. When I watch you play, I can see you doing loads of things I'd like to be able to do, but I forget how you do them as soon as I go home."]],
    [['The boy wants the girl to', ['practise with him regularly.', 'recommend a tennis coach.', 'teach him some new techniques.'], 'C']], S('Listening P2 Q13')),

  // Listening P4 — key: B A A B C C
  listen('pet5-l4', 'B1', 'You will hear an interview with a young hairdresser called Carlotta.',
    [['M', "Carlotta, you're already a star hairdresser. What got you interested in it?"],
     ['F', "When I was a kid, I watched friends getting haircuts and I remember thinking how complicated it seemed. One day, I was watching this animated film. This man was cutting someone's hair, but did it really quickly and made it look so easy. I don't know why, but after that, I took a real interest in it and in the magazines I'd sometimes find around our house."],
     ['M', 'So who did you practise your hairdressing skills on first?'],
     ['F', "My sister had this fantastic long hair – it looked so nice, and I really wanted to cut it, but of course my parents wouldn't let me. My dad wanted his hair cut really short, so he let me have a go on his before he went to his usual hairdresser's. My mum said it didn't look too bad, but still didn't trust me to cut hers!"],
     ['M', 'Later on, you studied hairdressing at college. What did your teachers say about you?'],
     ['F', "They recognised that the way I cut hair was very natural, which they didn't want to change. I didn't take ages thinking about what I wanted to do, I just did it. They reminded me that I needed to keep chatting – not just when people first sit down – to make it a social experience as well as a haircut."],
     ['M', 'You won the Young Hairdresser competition when you were eighteen. How did that feel?'],
     ['F', "It felt good afterwards, of course, but not during the competition. I'd entered very late, so it seemed like I'd only just finished reading what I could and couldn't do when I was on stage. The person whose hair I was cutting kept moving, which was annoying, but I knew my ideas gave me a chance of doing well."],
     ['M', 'At the moment, you work for a well-known chain of hairdressing shops...'],
     ['F', "That's right. You might think I'd get to cut the hair of loads of celebrities there, but none seem to come into the one I work in. I get to try so many different things, though, because our customers all want such original styles. I'll never become rich working there, but it's been great."],
     ['M', 'What do you plan to do next?'],
     ['F', "My idea of starting a training centre didn't get very far – it was too complicated. I want my own hairdressing shop, but in a more fashionable place than where I work now, so hopefully abroad somewhere. I've found these great new skin creams and shampoos I can use there when I do."],
     ['M', 'Thanks, Carlotta!']],
    [["Carlotta first became interested in cutting people's hair when she saw", ['a hairdressing magazine.', 'a cartoon character doing it.', 'a friend having it done.'], 'B'],
     ['The first hair that Carlotta cut belonged to', ['her father.', 'her sister.', 'her mother.'], 'A'],
     ["At college, Carlotta's teachers said she should", ['talk to customers more.', 'spend more time planning.', 'improve her cutting technique.'], 'A'],
     ['How did Carlotta feel during the Young Hairdresser competition?', ['sure she would lose', 'angry with the model', 'confused by the rules'], 'B'],
     ['What does Carlotta say is the biggest benefit of working for a well-known company?', ['meeting famous people', 'making plenty of money', 'gaining a variety of experience'], 'C'],
     ['What would Carlotta like to do next?', ['open a hairdressing school', 'create a range of beauty products', 'start a business in another country'], 'C']],
    S('Listening P4 Q20–25')),
];
