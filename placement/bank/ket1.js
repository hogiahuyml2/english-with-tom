'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge A2 Key for Schools Trainer · Test 1 · ' + p;

module.exports = [
  // ── Reading & Writing Part 1 (thông báo) — key: A B C C A C ──
  notice('ket1-r1-1', 'A2', "Please note: this afternoon's football class will be tomorrow instead, as Mr Hall is away today.", null,
    ['There is no football class today.', "Mr Hall can't come to the football class tomorrow.", 'You can choose to go to the football class today or tomorrow.'], 'A', S('R&W P1 Q1')),
  notice('ket1-r1-2', 'A2', "Hi Jane,\nHave you finished with that book I lent you? It's just that my brother needs it for a school project.\nThanks,\nLouise", null,
    ['Louise is offering to lend Jane a book.', 'Louise wants her book back from Jane.', "Louise's brother has borrowed a book from Jane."], 'B', S('R&W P1 Q2')),
  notice('ket1-r1-3', 'A2', 'Picnic area\nNo ball games here – please use the other side of the park.', null,
    ['You can buy food somewhere else in the park.', "Please don't eat while you are playing sport here.", "This is a place for eating and you can't play football here."], 'C', S('R&W P1 Q3')),
  notice('ket1-r1-4', 'A1', 'Museum open from 12.\nChildren must be with an adult.', null,
    ['Adults can take children to the museum in the morning.', 'Adults with children over 12 will enjoy the museum.', 'Children can visit the museum if they are with an adult.'], 'C', S('R&W P1 Q4')),
  notice('ket1-r1-5', 'A2', "From: Mrs Monmouth, Head Teacher\nTo: All Pupils and Parents\n\nHello,\nThis week, please don't use the car to get to school. Coming on foot is healthy and doesn't take much time.\nThanks,\nMrs Monmouth",
    'Why has Mrs Monmouth written this message?', ['to ask pupils to walk to school', 'to tell pupils to get to school on time', 'to explain about a health problem at school'], 'A', S('R&W P1 Q5')),
  notice('ket1-r1-6', 'A2', "Pedro's Pizza Bar\nBuy two pizzas at the same time, and we'll give you a third one for free! This offer is Mon–Fri only.", null,
    ["Pedro's Pizza Bar isn't open at weekends.", 'The third time you visit, you get a free pizza.', 'Three pizzas cost the same as two.'], 'C', S('R&W P1 Q6')),

  // ── Reading & Writing Part 3 (bài đọc) — key: B A C A B ──
  passage('ket1-r3', 'A2', "Will's blog",
`One day my dad said, 'Why don't we have a street party?' This means that the street is closed so cars can't use it, and people put tables and chairs out in the street, then have a party! Dad said there was one in 1977 and he still remembers it well. Everyone loved it! I couldn't believe that since 1977 they never had another one. If it was so good, why not do it again?

We started to organise it, together with some other people. I helped to make the web page, so everyone on the street knew about the party and could post their old photos from the party in 1977. There were some pictures of my dad when he was a kid, together with his friends, who have moved away from the street now. It was interesting to see that the buildings on the street haven't changed at all!

My mum was a bit worried about the party. 'But a lot of people on the street don't really know each other,' she said. 'What if they don't have anything to talk about?' I just said, 'Relax, Mum. It'll be great.'

So, what was the party like? It was fantastic! My friends and I really liked speaking to an old lady called Louisa. She's 89 and was telling us about when she and her friends were our age. So now I always chat to her when I see her on the street. I didn't know who she was before, so I'm glad we had the party.`,
    [['Why was Will surprised?', ['His father wanted to have a street party.', "There hasn't been a street party for a long time.", 'Many people remembered the last street party.'], 'B'],
     ['What did the photos from 1977 show?', ['The street still looks the same now.', 'There are more children living in the street now.', 'The same people still live on the street now.'], 'A'],
     ["Why was Will's mother worried?", ['She thought that the party was too expensive.', 'She thought that people might not come to the party.', 'She thought that the guests might not talk to each other.'], 'C'],
     ['Will and his friends enjoyed', ["hearing Louisa's stories.", "meeting Louisa's friends.", 'telling Louisa about their lives.'], 'A'],
     ['What is the best title for the article?', ['Why I love street parties', 'The street party we had', 'How to have a street party'], 'B']],
    S('R&W P3 Q14–18')),

  // ── Reading & Writing Part 4 (điền từ chọn đáp án) — key: C A C A A B ──
  cloze('ket1-r4-19', 'vocab', 'A2', 'Red pandas live in Nepal, Northern Myanmar, India and Bhutan, as ____ as in China.', ['soon', 'much', 'well'], 'C', S('R&W P4 Q19')),
  cloze('ket1-r4-20', 'vocab', 'A2', 'Red pandas ____ a lot of their time in trees.', ['spend', 'live', 'take'], 'A', S('R&W P4 Q20')),
  cloze('ket1-r4-21', 'grammar', 'A1', 'Red pandas are very ____ at climbing.', ['nice', 'great', 'good'], 'C', S('R&W P4 Q21')),
  cloze('ket1-r4-22', 'vocab', 'A2', 'Red pandas are more active during the night than the day, and they usually ____ for food in the evening and early in the morning.', ['look', 'see', 'find'], 'A', S('R&W P4 Q22')),
  cloze('ket1-r4-23', 'vocab', 'A2', 'But they also eat fruit, grass, eggs, insects and ____ small birds and animals.', ['even', 'quite', 'still'], 'A', S('R&W P4 Q23')),
  cloze('ket1-r4-24', 'vocab', 'A2', 'Scientists believe that the number of red pandas in the world is ____ because the forests where they live are getting smaller.', ['little', 'low', 'short'], 'B', S('R&W P4 Q24')),

  // ── Reading & Writing Part 5 (điền 1 từ) ──
  fill('ket1-r5-25', 'A2', 'Thank you very much for the book you sent me. It was very kind ____ you.', 'of', S('R&W P5 Q25')),
  fill('ket1-r5-26', 'A1', "Actually, History of Space Travel sounds like ____ brilliant title.", 'a', S('R&W P5 Q26')),
  fill('ket1-r5-27', 'A2', "I'm really interested ____ that kind of thing – exploring space and learning about the moon.", 'in', S('R&W P5 Q27')),
  fill('ket1-r5-28', 'A2', "I'll start it after I finish the one I'm reading now, ____ is about how cars are made.", 'which', S('R&W P5 Q28')),
  fill('ket1-r5-29', 'A1', 'The holidays are nearly finished now. I go back ____ school next week.', 'to', S('R&W P5 Q29')),
  fill('ket1-r5-30', 'A2', 'Then I\'ve only got two more years of school, so I need to decide ____ to do next!', 'what', S('R&W P5 Q30')),

  // ── Listening Part 3 (1 hội thoại, 5 câu) — key: C B B A A ──
  listen('ket1-l3', 'A2', 'You will hear Luis talking to his friend Charlotte about a computer game.',
    [['M', "Charlotte! I've got the computer game called Green Space."],
     ['F', 'Where did you find out about it, Luis?'],
     ['M', 'I borrowed a magazine from a schoolfriend and there was an ad for it. I asked my mum and she bought it for me from their website.'],
     ['F', "I really like that game. It's not new, but it's my favourite game because it isn't easy. I play it a lot, which is strange because it's not funny at all! Who are you going to play it with?"],
     ['M', "Well, my brother's too busy studying, and my cousin Amy only likes board games. But my granddad has lots of time, so I want to play with him. How long do you usually play it for?"],
     ['F', "When I was sick last Wednesday, I played for an hour and a half. Then, on Friday, an hour. And on Saturday, three quarters of an hour! Which part do you like best?"],
     ['M', "Crossing the river's really good, but the bit I enjoy most is finding something to eat. The part about building a hut's my least favourite."]],
    [['Where did Luis first find out about the game?', ['from a game website', 'from a school friend', 'from a magazine advertisement'], 'C'],
     ['Charlotte likes the game because', ["it's funny.", "it's hard.", "it's new."], 'B'],
     ['Who does Luis want to play the game with?', ['his brother', 'his granddad', 'his cousin'], 'B'],
     ['How long did Charlotte play the game for last Saturday?', ['forty-five minutes', 'one hour', 'one hour and thirty minutes'], 'A'],
     ['Which part of the game does Luis like best?', ['finding food', 'building a hut', 'crossing the river'], 'A']],
    S('Listening P3 Q11–15')),

  // ── Listening Part 4 (5 đoạn ngắn) — key: A C B C A ──
  listen('ket1-l4-16', 'A2', 'You will hear two friends talking about shopping.',
    [['F', "I'm glad I got the school book I wanted yesterday."],
     ['M', "Yes, my mum had already bought that and a new magazine for me. Everyone thinks the gloves I got yesterday are cool, too."],
     ['F', 'The T-shirt I liked was really colourful!'],
     ['M', 'But nearly one hundred pounds!'],
     ['F', "I know. Let's buy some snacks now. We can eat them during break at school."]],
    [['What did the boy buy yesterday?', ['something to wear', 'something to eat', 'something to read'], 'A']], S('Listening P4 Q16')),
  listen('ket1-l4-17', 'A2', 'You will hear a teacher talking to a student called Lyn.',
    [['F', 'Mr Jones, could I ask you about the tennis match on Saturday?'],
     ['M', 'Of course, Lyn. You missed class yesterday. Do you feel better?'],
     ['F', "Oh, I wasn't ill. We were camping in Switzerland for a week and our flight was cancelled on Sunday. We flew on Monday instead."],
     ['M', "Oh, OK. So, next Saturday's really important. If we win, we'll win the championship!"]],
    [["Why didn't Lyn come to school yesterday?", ['She was sick.', 'She was in a competition.', 'She arrived back late from holiday.'], 'C']], S('Listening P4 Q17')),
  listen('ket1-l4-18', 'A2', 'You will hear a boy talking about surfing.',
    [['M', "When I started surfing, I went to the beach with friends and tried and tried, but I didn't seem to improve. Then, I saw that someone was organising lessons, but they were on Fridays when I play football. In the end, I found a website with a famous surfer showing people the best way to learn. That's what helped me."]],
    [['How did he learn to surf?', ['by doing a course', 'by watching videos', 'by practising by himself'], 'B']], S('Listening P4 Q18')),
  listen('ket1-l4-19', 'A2', 'You will hear a girl talking about her day at school.',
    [['F', "School was great today. First, we had a lesson about oceans and the average water temperature in each one. But the most interesting lesson was about bees – how they live together and how they develop from eggs to adults. In another lesson, we read part of a novel and, for homework, we can write either a story or an article."]],
    [['Which subject did she like best?', ['geography', 'English', 'biology'], 'C']], S('Listening P4 Q19')),
  listen('ket1-l4-20', 'A2', 'You will hear two brothers talking about last night.',
    [['M', "I'm tired this morning. I didn't sleep well."],
     ['M2', "Neither did I. Let's ask Dad to turn down the heating in our room."],
     ['M', "Yes, that was the problem. I can hear him outside. I think he's packing the car so that we are ready to go camping."],
     ['M2', "I can hear Mum playing music downstairs. Let's ask her about the heating."],
     ['M', 'Yeah.']],
    [['Why did they both sleep badly?', ['Their bedroom was hot.', 'There were noises in the street.', 'They were excited about going on holiday.'], 'A']], S('Listening P4 Q20')),
];
