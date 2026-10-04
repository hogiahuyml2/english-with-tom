'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge A2 Key for Schools Trainer · Test 2 · ' + p;

module.exports = [
  // R&W P1 — key: B A B B C B
  notice('ket2-r1-1', 'A2', 'From 1 October, please do not enter the pool before you have used the shower.', null,
    ['The pool is closed on October 1st.', 'You need to wash before you swim.', 'There will be a new shower at the pool.'], 'B', S('R&W P1 Q1')),
  notice('ket2-r1-2', 'A2', 'From: Amanda\nTo: Gran\nSubject: Help with a school project\n\nHi Gran,\nDo you have any old photos showing you in your uniform when you were at school? If you do, can you send me one for school?\nThanks,\nAmanda',
    'Amanda wants her grandmother to', ['let her have a picture.', 'lend her some clothes.', 'describe her old uniform.'], 'A', S('R&W P1 Q2')),
  notice('ket2-r1-3', 'A2', 'Warning\nMemory full\nPlease delete files or click here to buy more memory.\n[ OK ]',
    'Where might you see this text?', ['in a computer shop', 'on the screen of a computer', 'on the wall in the computer classroom'], 'B', S('R&W P1 Q3')),
  notice('ket2-r1-4', 'A2', "TOMORROW'S TRIP\nTime coach leaves school: 8:50.\nPlease arrive no later than 8:40.\nThe school gates will open at about 8:30.\nThank you.",
    'What time do pupils need to get to school tomorrow?', ['about 8:30', 'by 8:40', 'at 8:50'], 'B', S('R&W P1 Q4')),
  notice('ket2-r1-5', 'A2', "PLEASE NOTE EVERYBODY\nThere's a lift if you need it, BUT use the stairs if you can.\nIt's a great way to stay fit.", null,
    ['Get the lift if you are in a hurry.', 'Use the stairs if the lift is broken.', 'Walking up and down stairs is better for you.'], 'C', S('R&W P1 Q5')),
  notice('ket2-r1-6', 'A2', "Hounslow Cinema: Special Offer\nBuy tickets to four films and you don't need to pay for the next one!\nEvery day until 5:30 p.m.", null,
    ['You can watch up to four films for free.', 'The fifth film you see during the daytime is free.', 'Cheap tickets are available for groups of four in the evenings.'], 'B', S('R&W P1 Q6')),

  // R&W P3 — key: C C B C B
  passage('ket2-r3', 'A2', 'Starting photography (by Mrs Howells, Class 3D teacher)',
`Have you ever wanted to take better pictures of your family, of your dinner or of your cat? Well, I can help you. In fact, that's what makes photography such a fantastic hobby. It doesn't matter if you have a nice new camera or just use your phone. We photographers are always trying to improve. We want today's photos to be more interesting than yesterday's.

In my photography classes, I'll show you how to find your own style, not just take the same photos as all your friends. But you'll need to be out of bed early and take pictures in the best light, before it gets too bright. We'll talk more about light in Week 1.

Actually, I've never read a book about photography, and I get bored watching videos on the net. I started to understand more about photography by looking at my own photos. I thought about what was wrong with them and decided how to do better next time. And in Week 2, I'll ask you to do the same with photos you have taken.

Do you want to know what I think? I don't think there's anyone who can't take amazing photos. Not everyone wants to, and that's cool. But if you do, come along to Room 4D on Wednesdays after lunch from 1:30 to 2:00.`,
    [['Why does Mrs Howells enjoy photography?', ['She loves using her new camera.', 'She likes taking photos of her family.', 'She enjoys trying to take better pictures.'], 'C'],
     ['What advice does Mrs Howells give?', ['Take pictures with your friends.', "Don't take photos if it is dark.", 'Take photos early in the morning.'], 'C'],
     ['How did Mrs Howells learn about photography?', ['from books', 'from her mistakes', 'from videos on the web'], 'B'],
     ['Mrs Howells believes that', ['everybody should learn photography.', 'photography is a great hobby for everyone.', 'everybody can take good photos if they want to.'], 'C'],
     ['Why has Mrs Howells written this text?', ['to ask pupils what they like photographing', 'to tell pupils about a photography course', "to answer pupils' questions about photography"], 'B']],
    S('R&W P3 Q14–18')),

  // R&W P4 — key: A C B A B B
  cloze('ket2-r4-19', 'grammar', 'A2', "Some people say the University of Al Quaraouiyine in Morocco is the world's oldest university because there has been a school in the same place ____ the year 859 AD.", ['since', 'between', 'after'], 'A', S('R&W P4 Q19')),
  cloze('ket2-r4-20', 'grammar', 'A2', 'There has been a university there ____ almost 1,100 years.', ['since', 'during', 'for'], 'C', S('R&W P4 Q20')),
  cloze('ket2-r4-21', 'grammar', 'A2', 'The University has had many famous international students ____ the years, including the great traveller, Ibn Khaldun.', ['under', 'over', 'until'], 'B', S('R&W P4 Q21')),
  cloze('ket2-r4-22', 'grammar', 'A2', "The University was started by a woman, Fatima al-Fihri, and ____ a long history of teaching women.", ['has', 'makes', 'goes'], 'A', S('R&W P4 Q22')),
  cloze('ket2-r4-23', 'vocab', 'A2', 'Dr Mahmoud was a scientist, but he decided to ____ his career and work in education.', ['give', 'change', 'take'], 'B', S('R&W P4 Q23')),
  cloze('ket2-r4-24', 'vocab', 'A2', 'After finishing at the University, many students will continue their ____ at universities in America and Europe.', ['marks', 'studies', 'information'], 'B', S('R&W P4 Q24')),

  // R&W P5 — key: by too most what have of
  fill('ket2-r5-25', 'A1', 'Last week, everyone in my class went on a trip to the theatre. We travelled ____ coach.', 'by', S('R&W P5 Q25')),
  fill('ket2-r5-26', 'A2', 'The theatre is about 10 kilometres away from school, so it was much ____ far to walk.', 'too', S('R&W P5 Q26')),
  fill('ket2-r5-27', 'A2', "The play was Romeo and Juliet. In fact, it's probably the ____ famous of all the plays that Shakespeare wrote.", 'most', S('R&W P5 Q27')),
  fill('ket2-r5-28', 'A2', "We've studied it at school, so I knew ____ it's about.", 'what', S('R&W P5 Q28')),
  fill('ket2-r5-29', 'A2', "It's a love story, but it's also the saddest play I ____ ever seen.", ['have', "'ve", 'I\'ve'], S('R&W P5 Q29')),
  fill('ket2-r5-30', 'A2', 'At the end, several ____ the people in my class were crying.', 'of', S('R&W P5 Q30')),

  // Listening P3 — key: C B B A B
  listen('ket2-l3', 'A2', 'You will hear Jasmine talking to her aunt about a camping trip.',
    [['F', 'Thank you for taking me camping with you last weekend, Aunt Lizzie.'],
     ['F2', "It was great, wasn't it, Jasmine? Especially when we went swimming. It was too windy to swim in the sea, but the lake was great anyway. Perhaps next time we can try the river."],
     ['F', 'Sleeping in a tent was new for me. I was worried about it on the first night, but I soon found out how exciting it is! My brother was very unhappy that he couldn\'t come with us.'],
     ['F2', 'Cooking was fun. Well, sometimes. It was difficult to cook the omelette, but I loved grilling the steak on a barbecue. Did you like the pasta I made?'],
     ['F', 'Yes, I was really hungry that day.'],
     ['F2', "The campsite was quite big, but it's a pity they didn't have anywhere to buy food and things. And the showers were a bit dirty, but OK. Which activity did you like best?"],
     ['F', 'Well, running in the forest was OK, but hard. But fishing was amazing, even more fun than cycling!'],
     ['F2', "I'm glad you had a good time."]],
    [['Where did Jasmine and her aunt go swimming?', ['in the sea', 'in the river', 'in the lake'], 'C'],
     ['How did Jasmine feel about sleeping in a tent to start with?', ['excited', 'afraid', 'unhappy'], 'B'],
     ['What did Jasmine\'s aunt like cooking?', ['omelette', 'steak', 'pasta'], 'B'],
     ["Jasmine's aunt thought the campsite", ['needed a shop.', 'had good showers.', 'was too small.'], 'A'],
     ['Which activity did Jasmine like best?', ['cycling', 'fishing', 'running'], 'B']],
    S('Listening P3 Q11–15')),

  // Listening P4 — key: B A C C B
  listen('ket2-l4-16', 'A2', 'You will hear a girl, Teresa, talking to her friend.',
    [['M', 'Hi Teresa, why are you waiting outside the school gates?'],
     ['F', "My aunt's picking me up today because we're going into the centre to buy some birthday presents."],
     ['M', "Do you think she'd take my brother? She knows him. He's in your class. He's talking to Mr Harrison, the new sports coach, over there."],
     ['F', "Let's ask her. That's her car."]],
    [["Who's Teresa waiting for?", ['a classmate', 'a member of her family', 'a teacher'], 'B']], S('Listening P4 Q16')),
  listen('ket2-l4-17', 'A2', 'You will hear a boy phoning his mother.',
    [['M', "Mum, I'm still at school at the moment. If it's OK with you, I'd like to go to Frank's house after school because we want to work on our science project together. All right? And Frank's mum's said I can have dinner with them too. I hope you haven't already cooked something for me."]],
    [['Why is he phoning her?', ['to ask about something', 'to give her some news', 'to say sorry for something'], 'A']], S('Listening P4 Q17')),
  listen('ket2-l4-18', 'A2', 'You will hear two friends talking about a new café.',
    [['M', "Let's go to that new café after school. Do you know where it is?"],
     ['F', "I tried to go online earlier to find out, but the wi-fi wasn't working. Isn't there a big notice about it on the wall in the library?"],
     ['M', "You're right, let's go and read it. Has anyone in our class been to the café yet?"],
     ['F', 'Sophia has.']],
    [['How will they find out where the new café is?', ["They'll ask another friend.", "They'll check on the internet.", "They'll look at a poster."], 'C']], S('Listening P4 Q18')),
  listen('ket2-l4-19', 'A2', 'You will hear a girl and her dad talking about a boat tour.',
    [['M', 'How about going on a boat tour today?'],
     ['F', "Yes! I don't mind that the weather's a bit cloudy."],
     ['M', "Uncle Pablo works for the tour company and he's telling tourists about the history of the town when they're on the boat today!"],
     ['F', "I'd love to hear him!"],
     ['M', "Me too. I'll book our tickets online. It isn't cheaper, but it's more convenient."]],
    [['Why do they decide to go on the boat tour today?', ["It's cheap today.", "The weather's good.", 'They know the guide.'], 'C']], S('Listening P4 Q19')),
  listen('ket2-l4-20', 'A2', 'You will hear a boy, Hugo, talking to his teacher.',
    [['M', 'Hugo, are you free after my lesson?'],
     ['M2', 'Yes, would you like me to take these books to the library for you?'],
     ['M', 'Thank you, but actually, Mrs Spencer, who works in the office, needs a pupil to take some boxes to the computer room.'],
     ['M2', 'OK, fine.'],
     ['M', "Thank you. I've got to show Year 6 how to upload their projects."]],
    [['What must Hugo do first?', ['help another teacher', 'help the school secretary', 'help another student'], 'B']], S('Listening P4 Q20')),
];
