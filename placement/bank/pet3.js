'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge B1 Preliminary for Schools Trainer · Test 3 · ' + p;

module.exports = [
  // Reading P1 — key: B B A C C
  notice('pet3-r1-1', 'B1', "Toni's Pizza Bar\nWant to enjoy a pizza with your friends? This week only – special offers on our giant pizzas.", null,
    ['Choose which size of pizza you buy and still get a special price.', 'Pay less at the moment for pizzas big enough to share with other people.', 'The very big pizzas at Toni\'s are only available this week.'], 'B', S('Reading P1 Q1')),
  notice('pet3-r1-2', 'B1', "New Message\nFrom: Mrs Walsh, head teacher\nTo: All students\n\nLots of you have got in touch with me, with good ideas for increasing recycling around the school. I'll announce which ones we've chosen in the hall this afternoon.", null,
    ['Mrs Walsh wants students to contact her with plans for recycling around the school.', 'Mrs Walsh intends to let students know which of their suggestions the school will use.', 'Mrs Walsh wants students to go to the hall today to help recycle rubbish.'], 'B', S('Reading P1 Q2')),
  notice('pet3-r1-3', 'B1', "Tim,\nI'm going to a tree-planting day tomorrow, to help the environment by increasing the number of trees. If you're interested, come along – and bring some friends, if they'd also like to help!\nSarah", null,
    ["Sarah is keen to get others involved in an environmental project she's joining.", 'Sarah says a tree-planting project is still short of volunteers to complete their work.', 'Sarah is wondering whether to take part in a project with her friend.'], 'A', S('Reading P1 Q3')),
  notice('pet3-r1-4', 'B1', "BROWN'S BOOKS\nEverything must go!\nMoving to a new location in town\nAll goods, including books, half-price this week.", null,
    ['This bookstore will no longer serve customers in the town after this week.', 'Only books are available here this week, at a reduced price.', 'To buy books from Brown\'s, find their new store in town after this week.'], 'C', S('Reading P1 Q4')),
  notice('pet3-r1-5', 'B1', "Mum,\nAre you at work? I thought I'd put my gym kit in my room – and it's not in the washing machine either. Could it still be in your car?\nCall me?\nThanks!\nCarrie", null,
    ['Carrie is asking if her mum has washed her gym kit for her.', 'Carrie has just remembered where she left her gym kit.', 'Carrie wonders if her mum has driven to work with her gym kit.'], 'C', S('Reading P1 Q5')),

  // Reading P3 — key: B C D A B
  passage('pet3-r3', 'B1', 'Karina Moore – teenage high diver!',
`Several times a week, teenager Karina Moore trains at her local pool to jump from the high-diving board into the water – in an attempt to become a national diving champion.

Karina first learned about diving during a family break in Spain, where the resort's pool had a high-diving board. Young people were diving off it, and it looked fun, but Karina didn't join in, even though she was a strong swimmer. Then after returning home, she discovered a long-distance runner she'd always admired had started diving for relaxation – so she became more interested.

Karina joined a beginners' diving class at her local pool. They had several sessions jumping onto soft materials before trying the high board. 'The water looked a long way down,' says Karina, 'but after our training, I felt I'd handle it – without injuring myself. They'd warned me I'd land in the water fast – at around 60 kph – but I was prepared. I couldn't wait to get started – although the others weren't so keen! Anyway, I wasn't disappointed by the experience.'

In Karina's area, there's now lots of interest in high diving, but it's sometimes difficult for swimmers to find suitable practice facilities. Although the pools are deep enough, they're in use so often by diving clubs that other people don't get opportunities to practise. Fortunately, though, Karina's coach noticed her talent and helped her develop her techniques. After only two years, she's winning competitions in her area.

But what's it like to concentrate so much on diving? 'I train 20 hours a week,' says Karina, 'and I won't pretend it's easy – you have to enjoy it to spend so much time doing it! It's not easy for my parents either, though – they drive me to training sessions early in the morning, and that costs money. But they've had financial help from sports organisations, luckily. And my schoolwork and social life are good. I still meet my mates – and there's always the phone! The only thing I hadn't realised was that the pool water would damage my hair – I used to love my long hair, but I've had to cut it short because it looked awful! But I'll definitely keep on diving!'`,
    [['What made Karina keen to take up diving?', ['She wanted to repeat her holiday experience.', 'She found out her athletics hero had taken it up.', "She'd visited a pool where some teenagers were doing it.", 'She wanted a new challenge after her success at swimming.'], 'B'],
     ['How did Karina feel the first time she used the high board?', ['worried about how far it was above the pool', 'pleased to experience it with other beginners', "confident that she wouldn't get hurt", 'shocked to hit the water at such speed'], 'C'],
     ["What does the writer suggest about diving facilities in Karina's area?", ["They're not used as much as they could be.", "There aren't enough coaches teaching people to use them.", "There aren't as many boards as there used to be.", "They're not available to the public for long enough each day."], 'D'],
     ['How does Karina feel about spending so much time diving?', ['surprised by one effect it has had on her', 'sorry she no longer sees her friends so much', 'anxious about the amount of money it costs', 'grateful to be able to focus on something she loves'], 'A'],
     ['What would the writer say about Karina?', ["She's a young girl who's achieved a lot by becoming a national diving champion – and all with very little support.", "She's made enormous progress in a very short time – after only a couple of years, she's already showing great signs of success.", "She has a lot of natural talent, but she's already thinking of having a break from the high board for a while.", "She's sad that she's given up almost everything for her sport – and her lifestyle really sounds quite hard."], 'B']],
    S('Reading P3 Q11–15')),

  // Reading P5 — key: D A B D C A
  cloze('pet3-r5-21', 'vocab', 'B1', 'The flavours of foods such as cabbage and broccoli are generally the ones people mention as their least ____ vegetables.', ['pleasant', 'delicious', 'special', 'favourite'], 'D', S('Reading P5 Q21')),
  cloze('pet3-r5-22', 'vocab', 'B1', 'These vegetables are believed to have an extremely ____ taste.', ['bitter', 'hard', 'heavy', 'raw'], 'A', S('Reading P5 Q22')),
  cloze('pet3-r5-23', 'vocab', 'B1', 'According to an Oxford psychologist, children might change their ____ about these foods if they can hear simple music while they\'re eating.', ['senses', 'minds', 'moods', 'reasons'], 'B', S('Reading P5 Q23')),
  cloze('pet3-r5-24', 'vocab', 'B1', "A wind chime is an instrument that often ____ in people's gardens, and plays sweet notes when the wind blows through it.", ['drops', 'connects', 'attaches', 'hangs'], 'D', S('Reading P5 Q24')),
  cloze('pet3-r5-25', 'vocab', 'B1', 'However, many adults ____ that their tastes developed as they grew up, so they now enjoy a far greater range of food.', ['complain', 'advise', 'admit', 'warn'], 'C', S('Reading P5 Q25')),
  cloze('pet3-r5-26', 'grammar', 'B1', "As a result, adults are much more ____ to eat the kind of vegetables they always hated during their childhood.", ['likely', 'possible', 'reasonable', 'sure'], 'A', S('Reading P5 Q26')),

  // Reading P6 — key: been · me · no · because · which · one/some
  fill('pet3-r6-27', 'B1', "As you know, I've ____ meaning to look for a job for ages.", 'been', S('Reading P6 Q27')),
  fill('pet3-r6-28', 'B1', "Then Mum offered to let ____ work in her clothes shop, so I started last week.", 'me', S('Reading P6 Q28')),
  fill('pet3-r6-29', 'B1', "It's hard work. There's ____ time at all to chat with the other assistants, sadly.", 'no', S('Reading P6 Q29')),
  fill('pet3-r6-30', 'B1', "There's no time at all to chat with the other assistants, sadly. That's ____ we're always so busy.", 'because', S('Reading P6 Q30')),
  fill('pet3-r6-31', 'B1', "The good thing is that I'm finally earning a bit of money of my own, ____ I can use to buy the things I want.", 'which', S('Reading P6 Q31')),
  fill('pet3-r6-32', 'B1', "Why don't you come to the shop ____ day soon? It's called Modes, and it's on Green Street.", ['one', 'some'], S('Reading P6 Q32')),

  // Listening P2 — key: A B C A A B
  listen('pet3-l2-8', 'B1', 'You will hear two friends talking about a play.',
    [['M', 'Hey, what happened to you? You just disappeared from the theatre yesterday.'],
     ['F', 'Erm, well, I did tell the teacher I wanted to leave.'],
     ['M', "What was wrong? I didn't think the play was that terrible?"],
     ['F', "It was nothing to do with that. You know what it's like when you get toothache, though – you can't concentrate on anything. The teacher phoned my mum who contacted the dentist, but they couldn't see me yesterday, even though it was a bit of an emergency. So I had to go this morning."],
     ['M', "It seems you'll do anything to avoid going to the theatre!"]],
    [['Why did the girl leave the theatre early?', ['She felt unwell.', 'She hated the play.', 'She had an appointment.'], 'A']], S('Listening P2 Q8')),
  listen('pet3-l2-9', 'B1', 'You will hear two friends talking about the food at a school party.',
    [['F', 'The party was fun, wasn\'t it?'],
     ['M', 'It was. It was a bit of a shame that everyone was told to bring anything they wanted, rather than making a list of who should bring what.'],
     ['F', 'Yes, it certainly meant that lots of people brought the same thing.'],
     ['M', "Not having lots of stuff to choose from doesn't bother me as long as you like what's there, which I did."],
     ['F', "Me too. I didn't see anyone eating what I brought – apart from us of course."],
     ['M', 'No, but that meant there was more for us.']],
    [['They agree that', ['there was lots of variety.', 'everything there was tasty.', 'the food they took was popular.'], 'B']], S('Listening P2 Q9')),
  listen('pet3-l2-10', 'B1', 'You will hear two friends talking about a soccer match they both watched on TV.',
    [['F', 'Did you see the soccer match last night?'],
     ['M', "Sure did, and although I can't say I was unhappy at the result, it wasn't the most interesting game I've ever seen."],
     ['F', "They've played better, I agree, but I didn't think they did that badly, especially that guy you really like."],
     ['M', "He did well, but he was the only one who did. Imagine if he got injured and couldn't play for a few weeks – they'd lose every game."],
     ['F', "Let's hope that never happens. Anyway, I thought it was a pretty entertaining game."],
     ['M', "I've seen our school team play more interesting soccer."]],
    [['Why was the boy disappointed?', ['The team he supports lost.', 'His favourite player was injured.', 'The quality of the match was bad.'], 'C']], S('Listening P2 Q10')),
  listen('pet3-l2-11', 'B1', 'You will hear two friends talking about a new science building at their school.',
    [['M', 'Have you been in the new science building yet?'],
     ['F', "I had a class in there this morning. It's a shame they've used all the stuff for experiments from the old building."],
     ['M', "Yes, it'd be nice to have new things like that as well as a new building. What do you think of it inside?"],
     ['F', 'The colours are nice and those paintings make it look really modern.'],
     ['M', "I don't think we share the same taste in colours and paintings, but I'm really impressed with the design of the outside."],
     ['F', "I can't think of a building I like the look of more."]],
    [['They agree that', ['it looks great from the outside.', 'the equipment is very good.', 'it is very well decorated.'], 'A']], S('Listening P2 Q11')),
  listen('pet3-l2-12', 'B1', 'You will hear a girl talking about a blog she has started writing.',
    [['M', 'Have you started your blog yet?'],
     ['F', "I've already written five entries and have had nice comments from some readers. That really makes it seem like it was worth doing, despite all the issues I had when I was getting it ready. The website I used said it was easy to create a blog – and maybe it is for someone who's a bit more familiar with IT than I am."],
     ['M', 'Have you put pictures in, too?'],
     ['F', "A few. I think I need more, though, to get it looking as good as some of the other blogs I've seen."]],
    [['How does she feel about it?', ['delighted that other people like it', 'surprised it was so easy to set up', 'satisfied with its appearance'], 'A']], S('Listening P2 Q12')),
  listen('pet3-l2-13', 'B1', 'You will hear a girl telling her friend about learning Chinese.',
    [['M', 'Are you still enjoying your Chinese lessons?'],
     ['F', "I am, but we always focus on reading and writing. I know they're important, but I want to learn other skills, too."],
     ['M', "There's loads of stuff online for improving reading and writing, but less for speaking, I guess. It's the same problem with coursebooks – they're good for exercises on grammar and things, but you obviously can't talk to a book!"],
     ['F', 'No ...'],
     ['M', 'But lots of people learn Chinese these days, so there must be groups that meet just to practise talking to each other. Why not search for one of those?'],
     ['F', 'Hmm, maybe.']],
    [['The boy suggests that the girl should', ['use websites to help her.', 'find a conversation class.', 'buy a good textbook.'], 'B']], S('Listening P2 Q13')),

  // Listening P4 — key: C B A C B C
  listen('pet3-l4', 'B1', 'You will hear an interview with a girl called Jasmine, talking about her experiences of flying a plane.',
    [['M', 'Jasmine, you recently went on a flying experience day, and actually flew a plane with the help of a qualified instructor. What made you decide to do this?'],
     ['F', "A friend of mine tried it a while ago. Even though she wasn't especially positive about it, as she'd been quite frightened, she told me she'd noticed her house while she was up there. That made me want to look for mine, too, and also enjoy a different view of the local countryside. It wasn't like I wanted to fly planes professionally or anything."],
     ['M', 'How did you feel at the beginning of the day?'],
     ['F', "When I saw the aeroplane we'd be using, I couldn't believe that something that size could actually take off with two people in it. The organisation of everything was so efficient, though, that I'd soon forgotten about any doubts I'd had. I'd watched some online videos and flying looked quite easy, so I was confident I could do that well."],
     ['M', 'What training did you do before you got in the plane?'],
     ['F', "We had a session on safety, which needed to be a bit shorter in my opinion, and one on what the different controls do, which I enjoyed. While what we were told was all essential, I don't think the people running the sessions were actually trained teachers, so they didn't really communicate the information very clearly."],
     ['M', 'And how was your flying instructor?'],
     ['F', "She was brilliant. I'd always imagined that flying instructors would be really cool and quiet people. Jana was like that before we took off but quite different in the air. She never stopped chatting and making me laugh by saying funny things – she said afterwards she does it to help people to relax."],
     ['M', 'And what about the flight?'],
     ['F', "It was amazing – one of the most exciting things I've ever done, although I was kind of expecting that. When we landed, it felt like we'd been up there for hours, although it was only about 30 minutes in reality. In some of the reviews on the website, people said they were exhausted afterwards, but I was just the opposite."],
     ['M', 'So has this made you want to try other experience days?'],
     ['F', "Definitely, yes. I had a look at the company's brochure and there are loads I'd like to try. I've never been horse riding, so that's something I wouldn't mind doing. First on my list, though, would have to be driving a sports car, and after that would come deep-sea fishing."],
     ['M', 'Thanks, Jasmine.']],
    [['Why did Jasmine decide to try a flying experience day?', ['Someone recommended it.', 'She wants to become a pilot.', 'To see her area from high up.'], 'C'],
     ['How did Jasmine feel at the beginning of the flying experience day?', ['nervous about making mistakes', 'worried about how small the plane was', 'disappointed with the arrangements'], 'B'],
     ['What did Jasmine think about the training she did before the flight?', ['It was badly presented.', 'It was done too quickly.', "Some of it wasn't useful."], 'A'],
     ['Jasmine says that during the flight her instructor', ['said very little.', 'stayed very calm.', 'joked with her a lot.'], 'C'],
     ['Jasmine says that the flight', ['made her feel tired.', 'seemed to last a long time.', 'was better than she had hoped.'], 'B'],
     ['Which experience day would Jasmine like to try most?', ['horse riding', 'deep-sea fishing', 'sports car driving'], 'C']],
    S('Listening P4 Q20–25')),
];
