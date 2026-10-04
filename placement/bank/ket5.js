'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge A2 Key for Schools Trainer · Test 5 · ' + p;

module.exports = [
  // R&W P1 — key: C C A B A C
  notice('ket5-r1-1', 'A2', "School singing practice starts this week. Please don't arrive later than 1:25, as we must all be ready by 1:30. Thank you.", null,
    ['Singing practice starts at 1:25.', 'There is no singing practice this week.', 'Please arrive early for singing practice.'], 'C', S('R&W P1 Q1')),
  notice('ket5-r1-2', 'A2', "You may return games that aren't opened to the shop and get your money back.",
    'You can return a game if', ["it doesn't work.", "you don't like it.", "you haven't used it."], 'C', S('R&W P1 Q2')),
  notice('ket5-r1-3', 'A2', 'Book club\nDo you enjoy discussing books with classmates? Yes? Then come along to the book club. To join, contact Mr Sponforth.',
    'Speak to Mr Sponforth if', ['you are interested in becoming a member of the book club.', 'you would like to borrow a book from the club.', 'you have read the same book as your classmates.'], 'A', S('R&W P1 Q3')),
  notice('ket5-r1-4', 'A2', "Hi Dad! It's Sam's birthday, so I want to buy a present. Could you lend me enough to get him something from the bookshop? Thanks! Davey",
    'Davey wants to', ['go shopping with his dad.', 'borrow some money.', 'ask what to get for Sam.'], 'B', S('R&W P1 Q4')),
  notice('ket5-r1-5', 'A2', 'HONEY CAFÉ\nUnfortunately two of our staff are ill today. (We must have at least three to open.) Open at 9 a.m. tomorrow.', null,
    ['The café is closed today.', 'We are looking for more staff.', 'Tomorrow we open at a different time.'], 'A', S('R&W P1 Q5')),
  notice('ket5-r1-6', 'A2', "Smitford's Computer Store\nBring us your old laptop* when you get a new one from us and receive £100 off.\n*must still work", null,
    ['We repair old laptops.', 'Old laptops are for sale for £100.', 'Save money when you buy a new laptop.'], 'C', S('R&W P1 Q6')),

  // R&W P3 — key: B A B C C
  passage('ket5-r3', 'A2', 'Where playing video games is real life',
`Seo-yun Cho doesn't have time for hobbies because she spends all her time playing video games. 'I practise as much as I can so I will improve,' she says. 'This is what I really need to do!'

Seo-yun and her friends are members of KS Fireflies 6, a video game team. She and the other members share a flat in Seoul's business district. Since they all left school, they have managed to make playing video games their life.

Every day, Seo-yun gets up after a good night's sleep at 10 a.m. and goes for a jog for an hour, before sitting down at her computer and starting to play. She and her friends have a few breaks to eat and relax during the day and the evening, but Seo-yun thinks that after midnight is when she has more fun playing than at any other time. She usually goes to bed at 3 a.m.

Seo-yun and the rest of the team need to train hard and keep fit, as top players need to do about 500 mouse-clicks a minute. Video games are big business in South Korea, and the best players (like KS Fireflies 6) usually become even better-known than top baseball or volleyball players.

Some people might get bored after playing video games for an hour or two. But these guys are actually getting paid to do something they love as a job. Many of them would even like to do it for free!`,
    [['What is the most important thing for Seo-yun Cho?', ['trying new video games', 'getting better at video games', 'finding enough time to play video games'], 'B'],
     ['Seo-yun and her friends', ['live together.', 'went to school together.', 'have a business together.'], 'A'],
     ['What does Seo-yun say about playing games at night?', ["It's when she feels happiest.", "It's the time that she most enjoys playing.", 'It sometimes makes her tired.'], 'B'],
     ['What does the writer say about sports?', ['Seo-yun and her friends play a lot of sports video games.', 'Seo-yun and her friends play sports to get fit.', 'Seo-yun and her friends are more famous than some sports players.'], 'C'],
     ['Why does the writer think that Seo-yun and her friends are lucky?', ['because they earn a lot of money', "because they don't need to look for another job", 'because they are doing something that they love'], 'C']],
    S('R&W P3 Q14–18')),

  // R&W P4 — key: C B A C A C
  cloze('ket5-r4-19', 'vocab', 'A2', 'Most pupils are really excited when they are taken on a school camping ____. They\'re becoming really popular these days.', ['way', 'journey', 'trip'], 'C', S('R&W P4 Q19')),
  cloze('ket5-r4-20', 'vocab', 'A2', 'For example, my class goes camping at ____ once a year.', ['little', 'least', 'low'], 'B', S('R&W P4 Q20')),
  cloze('ket5-r4-21', 'vocab', 'A2', "My class usually goes camping for one night, but it's sometimes ____.", ['longer', 'bigger', 'higher'], 'A', S('R&W P4 Q21')),
  cloze('ket5-r4-22', 'vocab', 'A2', 'Parents and children need to work together to ____ sure that everything goes well.', ['get', 'do', 'make'], 'C', S('R&W P4 Q22')),
  cloze('ket5-r4-23', 'vocab', 'A2', 'Part of this is deciding what to take – this is a really important ____.', ['job', 'work', 'occupation'], 'A', S('R&W P4 Q23')),
  cloze('ket5-r4-24', 'vocab', 'A2', "It's a good idea to take more clothes than you think you will ____.", ['have', 'like', 'need'], 'C', S('R&W P4 Q24')),

  // R&W P5 — key: for / on · to · of · a · than · me
  fill('ket5-r5-25', 'A2', 'I thought maybe we could go ____ a bike ride.', ['for', 'on'], S('R&W P5 Q25')),
  fill('ket5-r5-26', 'A2', 'We can go to Moreton-on-Sea, and get something ____ eat.', 'to', S('R&W P5 Q26')),
  fill('ket5-r5-27', 'A2', 'I went there by bike last year. In fact, there were six ____ us.', 'of', S('R&W P5 Q27')),
  fill('ket5-r5-28', 'A1', 'In fact, there were six of us, and we had ____ really amazing day.', 'a', S('R&W P5 Q28')),
  fill('ket5-r5-29', 'A2', "I don't think it will take more ____ four hours to get there and back.", 'than', S('R&W P5 Q29')),
  fill('ket5-r5-30', 'A1', 'Can you let ____ know if you can come?', 'me', S('R&W P5 Q30')),

  // Listening P3 — key: B C A B B
  listen('ket5-l3', 'A2', 'You will hear Dan talking to a shop assistant in a sports shop.',
    [['M2', "Can you help me? I'd like to find out about buying a skateboard."],
     ['M', 'Do you want one made of wood or plastic?'],
     ['M2', "Plastic. I know they aren't always cheap, but all my friends have plastic ones. My brother's plastic board has strong, heavy wheels."],
     ['M', 'OK. What colour would you like?'],
     ['M2', "Those purple ones look great and the yellows are fun, but grey's a better colour for me."],
     ['M', "Good. Now let's think about how wide your skateboard should be. It's actually in centimetres. Are you a beginner?"],
     ['M2', 'Yes.'],
     ['M', "The widest ones, twenty centimetres, are best for advanced skateboarders. Then there's eighteen centimetre ones, but for people who are new to the sport sixteen's good."],
     ['M2', "OK. On the poster on the wall, it says there's a free gift this month. What is it?"],
     ['M', 'The poster next to the backpacks? Yes, we can give you a pair of gloves.'],
     ['M2', "I like those scarves, too. I'll have to come with my dad to buy my skateboard."],
     ['M', "Good idea. Remember the store isn't open on a Wednesday."],
     ['M2', "I think my dad's busy on Saturday, so we'll come on Friday."],
     ['M', 'Fine.']],
    [['Dan thinks plastic skateboards are', ['cheap.', 'popular.', 'light.'], 'B'],
     ['What colour skateboard does Dan prefer?', ['purple', 'yellow', 'grey'], 'C'],
     ['The shop assistant says the best skateboard for Dan is about', ['16 cm wide.', '18 cm wide.', '20 cm wide.'], 'A'],
     ['What free gift can Dan get from the shop?', ['a backpack', 'some gloves', 'a scarf'], 'B'],
     ['When will Dan buy a skateboard?', ['on Wednesday', 'on Friday', 'on Saturday'], 'B']],
    S('Listening P3 Q11–15')),

  // Listening P4 — key: C A C B B
  listen('ket5-l4-16', 'A2', 'You will hear two friends talking about eating healthy food.',
    [['F', 'I like fried food, but when that doctor came into our biology lesson and explained about our hearts, I decided to eat more salads.'],
     ['M', "Yes, he said most people don't eat enough fresh food."],
     ['F', "We're going to do the chapter in our textbook about healthy foods next lesson."],
     ['M', 'Instead of watching that video about cooking tasty, healthy food?'],
     ['F', 'Yes.']],
    [['Why are they talking about eating healthy food?', ["They've just read about it.", "They've just watched a video about it.", "They've just listened to a talk about it."], 'C']], S('Listening P4 Q16')),
  listen('ket5-l4-17', 'A2', 'You will hear a boy talking about his history project.',
    [['M', "I've finished my history project! My neighbour, Mrs Ashton, is eighty years old, so I wanted to ask her about my project, but she's gone to the USA to visit her grandchildren. So I went and joined a group going round the museum. I asked the group leader loads of questions, and I found out everything I wanted to know!"]],
    [['Who gave him some information about it?', ['a person who works as a guide', 'a woman who lives near him', 'a teacher he knows'], 'A']], S('Listening P4 Q17')),
  listen('ket5-l4-18', 'A2', 'You will hear a girl talking about her clothes.',
    [['F', "We stayed in a hotel near the beach this summer and there was a skateboard park. Some other kids there lent me their board and showed me how to skate. I'd really like to do that as a hobby, but I need some gloves. They're important so that you don't hurt yourself. I'm getting some special ones for my birthday."]],
    [['Why does she want to buy some new clothes?', ['to look nice at a party', 'to go on holiday', 'to play a new sport'], 'C']], S('Listening P4 Q18')),
  listen('ket5-l4-19', 'A2', 'You will hear a teacher talking about a problem.',
    [['F', "Before you go and have your lunch break, can I just tell you that a pipe has broken, and there's water coming out of it. You won't be able to have your volleyball match inside today because there's water all over the court. You'll have to play outside, but I'm sure that'll be fine."]],
    [['Where is there a problem?', ['in the playground', 'in the sports hall', 'in the cafeteria'], 'B']], S('Listening P4 Q19')),
  listen('ket5-l4-20', 'A2', 'You will hear a brother and sister talking about their pet rabbit.',
    [['M', 'Have you given our rabbit something to eat this morning?'],
     ['F', 'Yes, little Doris seemed very hungry. She was making funny little noises, just like she was trying to say something to me.'],
     ['M', "Yeah, she does that when I'm getting the dirt out of her fur. There are hairs everywhere after that. It's horrible."],
     ['F', 'I hate that, too.']],
    [["What don't they like about having pets?", ['talking to them', 'brushing them', 'giving them food'], 'B']], S('Listening P4 Q20')),
];
