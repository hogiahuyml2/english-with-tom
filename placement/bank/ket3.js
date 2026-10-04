'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge A2 Key for Schools Trainer · Test 3 · ' + p;

module.exports = [
  // R&W P1 — key: C C A C B C
  notice('ket3-r1-1', 'A2', "John,\nYou know I said that football practice will be on Wednesday ... Well, it isn't – it's on Thursday. Sorry!\nSee you there.\nCheers, Adam",
    'Why has Adam written this message?', ['to ask if John wants to play football', "to tell John that Adam can't play football", 'to let John know about a change of plan'], 'C', S('R&W P1 Q1')),
  notice('ket3-r1-2', 'A2', 'SCHOOL FESTIVAL OF BOOKS\nMeet Ralph Sparks.\nHear how he got ideas for his books, including History of Exploring the New World.\nThurs 9 a.m. Room D31.',
    'Pupils can', ['buy books.', 'read about explorers.', 'come and listen to a writer.'], 'C', S('R&W P1 Q2')),
  notice('ket3-r1-3', 'A2', "Science Museum trip next Friday\nTickets are available for $4 (for coach transport to the museum, and for museum entry).\nIf you're interested, see Mr Goss.", null,
    ['You can now buy tickets for the museum trip.', 'Tell Mr Goss how you want to travel to the museum.', 'Mr Goss will tell you if you need a ticket to the museum.'], 'A', S('R&W P1 Q3')),
  notice('ket3-r1-4', 'A2', "From: Lizzie\nTo: Jenny\n\nJenny,\nI think I left my scarf in your flat after the party. Have you seen it? Otherwise I'll buy another one.\nLizzie",
    'Why has Lizzie written this?', ['to invite Jenny to a party', 'to tell Jenny about a shopping trip', "to ask about something that she's lost"], 'C', S('R&W P1 Q4')),
  notice('ket3-r1-5', 'A2', "Hi Dave,\nI broke my tennis racket. Can I use yours? I'll give it back in maths tomorrow. By the way, wasn't the homework difficult?\nMike",
    'Mike wants to', ['play tennis with Dave.', 'borrow something from Dave.', 'get help from Dave with the homework.'], 'B', S('R&W P1 Q5')),
  notice('ket3-r1-6', 'A2', 'Mr Gregson is away today. Class 3, at 9 a.m., please go and join Class 4 in Room 7C for geography. Mr Gregson will be back tomorrow.', null,
    ["There isn't a geography lesson tomorrow.", "Class 4's lesson is happening at a different time today.", 'There will be more people in Room 7C than usual today.'], 'C', S('R&W P1 Q6')),

  // R&W P3 — key: B B C B C
  passage('ket3-r3', 'A2', 'A young fashion designer',
`Lots of people become good at something when they are young. And quite a lot of children know what career they want to follow when they are older. But not everyone opens their own company. This is exactly what Isabella Rose Taylor has done. She started designing clothes when she was eight years old.

At the time, she was a keen painter. She used a lot of reds, blues and yellows, and these colours helped her to think of new clothes which she could make.

When she started designing and making clothes, Isabella just made clothes for fun. But people liked her designs, so soon she started selling them online. Now she has a business and takes part in fashion shows. She runs her business from the family home, where she has made one room into an office, and another into a studio where the clothes are made.

Isabella has also found time to finish school and get a college degree. She's intelligent, and she has thousands of followers online who love her stuff. It's brilliant that she already has people who work for her. Above all, she really knows what is needed to succeed in the world of fashion. And I am sure that she will.

'The way I see it is I get to follow my dream and be a teenager at the same time. I think I'm pretty lucky,' she says.`,
    [['What does the writer say is unusual about Isabella Rose Taylor?', ['She planned her future career when she was very young.', 'She started her own business when she was very young.', 'She got interested in fashion when she was very young.'], 'B'],
     ['What does Isabella say about painting and making clothes?', ['It is important to paint good pictures of clothes.', 'The colours in her paintings gave her ideas for clothes to make.', 'She uses paint to put her favourite colours on the clothes she makes.'], 'B'],
     ["What do we learn about Isabella's home?", ['Everything for her business is done in the same room at home.', "Her home is too small, so she's looking for another one.", "She's made changes to her home so that she can work there."], 'C'],
     ['Why does the writer think that Isabella will do well in the future?', ['She is already very popular online.', 'She understands the fashion business.', 'She has brilliant people who work for her.'], 'B'],
     ['What is the best title for the article?', ["The girl who can't wait to start working in fashion soon", 'The problem with working and studying', 'A hobby that is becoming a career'], 'C']],
    S('R&W P3 Q14–18')),

  // R&W P4 — key: A B A C B A
  cloze('ket3-r4-19', 'vocab', 'A2', "Jordan lives on a small Scottish island. There, the school had to ____ because there weren't any other pupils.", ['close', 'complete', 'finish'], 'A', S('R&W P4 Q19')),
  cloze('ket3-r4-20', 'vocab', 'A2', 'His family have a boat, but it is small, and they ____ use it in good weather.', ['almost', 'only', 'nearly'], 'B', S('R&W P4 Q20')),
  cloze('ket3-r4-21', 'vocab', 'A2', 'A much larger boat is ____ in bad weather.', ['needed', 'liked', 'had'], 'A', S('R&W P4 Q21')),
  cloze('ket3-r4-22', 'vocab', 'A2', 'So every day, Jordan has to ____ the ferry across the sea to go to school.', ['travel', 'make', 'catch'], 'C', S('R&W P4 Q22')),
  cloze('ket3-r4-23', 'vocab', 'A2', "Sometimes he phones home to say that he's ____ the night at a friend's house instead.", ['resting', 'staying', 'sleeping'], 'B', S('R&W P4 Q23')),
  cloze('ket3-r4-24', 'vocab', 'A2', "'I know I have to travel a long ____ to school each day,' he says. 'But I don't mind.'", ['way', 'transport', 'mile'], 'A', S('R&W P4 Q24')),

  // R&W P5 — key: a much to for have / 've would / 'd
  fill('ket3-r5-25', 'A1', 'This is the best holiday ever! Plakias is such ____ beautiful place.', 'a', S('R&W P5 Q25')),
  fill('ket3-r5-26', 'A2', 'For breakfast, you can have as ____ as you want.', 'much', S('R&W P5 Q26')),
  fill('ket3-r5-27', 'A2', "There's lots for everyone in my family ____ do, so we're all enjoying it.", 'to', S('R&W P5 Q27')),
  fill('ket3-r5-28', 'A2', "Tomorrow I'm going to try windsurfing ____ the first time.", 'for', S('R&W P5 Q28')),
  fill('ket3-r5-29', 'A2', "I'm really excited because I ____ never done it before, but Dad says it's easy.", ['have', "'ve", "I've"], S('R&W P5 Q29')),
  fill('ket3-r5-30', 'A2', 'In fact, I love it here so much that I ____ like to come back next year!', ['would', "'d", "I'd"], S('R&W P5 Q30')),

  // Listening P3 — key: C B A C B
  listen('ket3-l3', 'A2', 'You will hear Hitomi talking to her friend Freddie about her visit to Hardin Castle.',
    [['F', 'Hi, Freddie. I went to Hardin Castle on Saturday.'],
     ['M', 'Did you go with your family or was it a class trip, Hitomi?'],
     ['F', 'My class visited a factory. I went with the family who live next door to us.'],
     ['M', "But the weather wasn't good on Saturday..."],
     ['F', "Yeah, it rained, but I didn't mind. It wasn't cold and windy like today. Today's worse!"],
     ['M', "I went to Hardin Castle last year. I saw the dining room... but I liked upstairs better, especially the Queen's bathroom."],
     ['F', 'Me too! I thought the yellow bedroom was strange. Why did you go to the castle? Was it to take photos? I know that\'s your hobby.'],
     ['M', 'To get some information about wild birds. And I saw my history teacher when I was there!'],
     ['F', 'Did you talk to him?'],
     ['M', "Yes. There are lots of interesting things to do at the castle. Next week, there's a race. You have to run five kilometres. Then, next month, you can see some cars that are over fifty years old!"],
     ['F', 'Do they do painting courses?'],
     ['M', "The next one's next summer!"]],
    [['Who did Hitomi go to Hardin Castle with?', ['her classmates', 'her family', 'her neighbours'], 'C'],
     ['What was the weather like?', ['cold', 'wet', 'windy'], 'B'],
     ['What do Hitomi and Freddie both like best at Hardin Castle?', ["the Queen's bathroom", 'the yellow bedroom', 'the dining room'], 'A'],
     ['Freddie went to the castle because he wanted', ['to learn about history.', 'to take photos.', 'to find out about birds.'], 'C'],
     ["What's on at the castle next month?", ['a running race', 'an exhibition of old cars', 'a painting course'], 'B']],
    S('Listening P3 Q11–15')),

  // Listening P4 — key: B C A B B
  listen('ket3-l4-16', 'A2', 'You will hear a girl talking about a video.',
    [['F', "I liked that film about animals that live in the Amazon Forest. It started by showing the different places different animals like to live in, and all that bit was clear. The next bit was difficult though. I needed my mum to explain it to me! Then the last part was good and I didn't have any problems understanding it."]],
    [["Which part of the video didn't she understand?", ['the beginning', 'the middle', 'the end'], 'B']], S('Listening P4 Q16')),
  listen('ket3-l4-17', 'A2', 'You will hear two friends talking about a concert.',
    [['F', "I didn't like the school concert yesterday, mainly because the musicians hadn't practised enough. They were really bad, I think."],
     ['M', "Really? I think they played well, but I've never heard music like that before or seen some of those instruments before."],
     ['F', 'It must be interesting to play new stuff, I guess.'],
     ['M', "Exactly! Doing the same thing's awful."]],
    [["What's the boy's opinion of the concert?", ['It was boring.', 'It was terrible.', 'It was unusual.'], 'C']], S('Listening P4 Q17')),
  listen('ket3-l4-18', 'A2', 'You will hear a boy talking to his dad about going to the city centre.',
    [['M2', 'When are we going to the city centre?'],
     ['M', 'I just want to see the end of this football match. Then, we can go.'],
     ['M2', "Shall I phone Mum now to say we'll be at the café in the main square in 30 minutes?"],
     ['M', 'Yes, please. And could you ask her to get today\'s newspaper for me?'],
     ['M2', 'Sure.']],
    [['Why are they going to the city centre?', ['to meet someone', 'to buy something', 'to watch something'], 'A']], S('Listening P4 Q18')),
  listen('ket3-l4-19', 'A2', 'You will hear a teacher talking to his class.',
    [['M', "Listen, everyone. Because you still need some photos to add to your geography project, we're allowed to go to the park today! I know you love working there, but you must still make sure you do your school work carefully. We're coming back to the classroom at ten, so that we have time to put everything away."]],
    [['What information is he giving his students?', ["They're going to start a new project.", "They're going to have their lesson outside.", "They're going to have a longer lesson."], 'B']], S('Listening P4 Q19')),
  listen('ket3-l4-20', 'A2', 'You will hear a boy talking about his sister, Emma.',
    [['M', "My sister Emma got married last week to a guy she met in Paris. And now she lives in an apartment above that restaurant called Marco's in Green Street. She finished studying art and design last year and has just got a job drawing pictures for a book! Her husband travels a lot in his job, showing tourists round different cities."]],
    [['Who has Emma married?', ['an artist', 'a tour guide', 'a cook'], 'B']], S('Listening P4 Q20')),
];
