'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge A2 Key for Schools Trainer · Test 6 · ' + p;

module.exports = [
  // R&W P1 — key: B B A C B A
  notice('ket6-r1-1', 'A2', "Please don't eat ice creams here. They aren't good for our books! Please finish them outside before you come in. Thanks.",
    'Where might you see this?', ['in a café', 'in a library', 'in a picnic area'], 'B', S('R&W P1 Q1')),
  notice('ket6-r1-2', 'A2', 'FOUND\nOne school bag\nInside: one key and a phone\n\nContact Mrs Thompson if you think it might be yours.',
    'Speak to Mrs Thompson if', ["you've got an extra key.", 'you have lost something.', 'you know where the bag is.'], 'B', S('R&W P1 Q2')),
  notice('ket6-r1-3', 'A2', "Hi Linda. I have bought two tickets for the cinema tomorrow afternoon for me and Jim. But he can't come. Are you interested?\nZeta",
    'Zeta has written to', ['invite Linda to go and see a film.', "ask Linda what films she's interested in.", 'tell Linda where to meet Jim tomorrow.'], 'A', S('R&W P1 Q3')),
  notice('ket6-r1-4', 'A2', "From: Flora\nTo: Tony\n\nCongratulations, Tony! I heard that you passed maths!\nHave a great birthday.\nAnd next time I write to you, you'll be 15!\nBest wishes,\nFlora",
    'What has Tony just done?', ['met Flora', 'had a birthday', 'done well in an exam'], 'C', S('R&W P1 Q4')),
  notice('ket6-r1-5', 'A2', "NO EXIT\nThe door isn't working correctly. Use door opposite to get to the science room.", null,
    ['Please go to the science room now.', "You can't go out through this door.", 'The science laboratory is being used by other people today.'], 'B', S('R&W P1 Q5')),
  notice('ket6-r1-6', 'A2', "Tom:\nThanks to all my guests! It's brilliant you could come. Hope you've made new friends. I'll add the pictures I took soon!",
    'Tom is writing about', ['a party that he had.', 'a picture that he saw.', 'some people that he has just met.'], 'A', S('R&W P1 Q6')),

  // R&W P3 — key: A B A B C
  passage('ket6-r3', 'A2', 'Would you like to be an astronaut?',
`You don't have to be Superman to fly in space. Many men and women from many different countries have done it. For example, the European Space Agency (ESA) now has 14 astronauts from 8 different countries.

The first thing is this – you need to be sure it's the job that you really want to do. It requires a lot of hard work and several years of study at university before astronaut training even begins. Most people start this between 27 and 37 years of age. Many astronauts also train to become pilots first.

Astronauts come from all over Europe and the world, and it's important that they can speak the same languages. They have to speak English, and they are given Russian lessons. Some also learn another language, for example Japanese, as a number of astronauts are Japanese speakers.

If you are still at school and you'd like to be an astronaut when you're older, it's not too early to start developing the skills you will need. Playing video games is a great thing to do, as it helps you to think quickly and clearly. This is what you will need to do when you travel in space.

Another good thing to do is sports, especially team sports. They make you fit, of course, but more importantly, they help you learn how to do things together with your colleagues. So, maybe planning a game of football for next weekend isn't a bad idea?`,
    [['The first paragraph says that', ['lots of people can be an astronaut.', 'there are astronauts from all countries.', 'only 14 people from Europe have become astronauts.'], 'A'],
     ['The writer says', ['you need to be a pilot before you become an astronaut.', "it's important to know that being an astronaut is right for you.", 'when you start training to be an astronaut, you must be between 27 and 37.'], 'B'],
     ['Which languages do ESA astronauts know how to speak after training?', ['English and Russian', 'English and Japanese', 'English, Japanese and Russian'], 'A'],
     ['Why can playing video games be useful if you want to be an astronaut?', ['There are many video games about space travel.', 'Video games can teach you to think fast.', 'Video games help you to understand how computers work.'], 'B'],
     ['How can sports help you to become an astronaut?', ['They help you to get fit.', 'They give you something to do in your free time.', 'They help you to work well with other people.'], 'C']],
    S('R&W P3 Q14–18')),

  // R&W P4 — key: B A C A B A
  cloze('ket6-r4-19', 'vocab', 'A2', 'Alex Guo was competing ____ her brother and four other musicians under the age of 21 to win the prize.', ['over', 'against', 'after'], 'B', S('R&W P4 Q19')),
  cloze('ket6-r4-20', 'vocab', 'A2', 'Alex Guo was competing against her brother and four other musicians under the ____ of 21 to win the prize.', ['age', 'years', 'time'], 'A', S('R&W P4 Q20')),
  cloze('ket6-r4-21', 'vocab', 'A2', 'The winner was ____ after the young musicians each played on stage with a band.', ['taken', 'found', 'chosen'], 'C', S('R&W P4 Q21')),
  cloze('ket6-r4-22', 'vocab', 'A2', 'When she ____ that she was the winner, she was so excited.', ['heard', 'listened', 'agreed'], 'A', S('R&W P4 Q22')),
  cloze('ket6-r4-23', 'vocab', 'A2', "'I just couldn't ____ it,' she said.", ['guess', 'believe', 'thank'], 'B', S('R&W P4 Q23')),
  cloze('ket6-r4-24', 'vocab', 'A2', "'Music has always been a ____, but now I want it to be my job, too.'", ['hobby', 'fun', 'game'], 'A', S('R&W P4 Q24')),

  // R&W P5 — key: to · would/'d · let · for · tell/inform · on/most
  fill('ket6-r5-25', 'A2', 'It will be an excellent way ____ practise your English.', 'to', S('R&W P5 Q25')),
  fill('ket6-r5-26', 'A2', 'If you ____ like to do this, please let me know.', ['would', "'d", "you'd"], S('R&W P5 Q26')),
  fill('ket6-r5-27', 'A2', 'If you would like to do this, please ____ me know.', 'let', S('R&W P5 Q27')),
  fill('ket6-r5-28', 'A2', 'Thank you ____ your email.', 'for', S('R&W P5 Q28')),
  fill('ket6-r5-29', 'A2', 'I love talking about football, and I can ____ everybody about the team I play in on Saturday afternoons.', ['tell', 'inform'], S('R&W P5 Q29')),
  fill('ket6-r5-30', 'A2', 'I can tell everybody about the team I play in ____ Saturday afternoons.', ['on', 'most'], S('R&W P5 Q30')),

  // Listening P3 — key: A C C B C
  listen('ket6-l3', 'A2', 'You will hear Nadia and Tom talking about their new school.',
    [['F', 'Hi, Tom. We start our new school next week.'],
     ['M', 'Yes, how are you going to get there, Nadia?'],
     ['F', "It's not far, so I don't need to take a bus. I'll cycle because I'll have too many heavy books to walk there."],
     ['M', "I've got my new uniform."],
     ['F', "Me too! My jacket's fantastic!"],
     ['M', "The blue shirt's best, I think. Not boring like the trousers!"],
     ['F', 'There are a lot of students in the new school.'],
     ['M', 'I know the number exactly. Mum told me: one thousand and fifty-five. Our old school only had around eight hundred.'],
     ['F', 'My first school only had about four hundred and seventy-five children.'],
     ['M', 'Chemistry is a new subject for us.'],
     ['F', "Yes, I don't know if I'll like it, but I love maths, so I think I will. Will we study biology?"],
     ['M', "I'm not sure. We'll find out on our first day."],
     ['F', "Oh yeah, we'll talk to all our teachers before we go to our class. In the second week, they'll show us how to use the library. There'll be a quiz about it."],
     ['M', 'Great!']],
    [['How will Nadia get to their new school?', ['by bike', 'by bus', 'on foot'], 'A'],
     ["What doesn't Tom like about the school uniform?", ['the jacket', 'the shirt', 'the trousers'], 'C'],
     ['How many students are there in the new school?', ['under 500', 'about 800', 'more than 1000'], 'C'],
     ['Which subject does Nadia like?', ['chemistry', 'maths', 'biology'], 'B'],
     ['What will they do on the first day?', ['have a class quiz', 'visit the school library', 'meet all their teachers'], 'C']],
    S('Listening P3 Q11–15')),

  // Listening P4 — key: A A C A B
  listen('ket6-l4-16', 'A2', 'You will hear a teacher talking about a trip.',
    [['M', "Right. You know the museum trip's next Friday and you have to be at school at eight thirty because the bus departs at eight forty-five. The bus can't leave any later because the traffic will be bad. I'd asked you all for ten pounds, but our group tickets are cheaper, so you only have to give me eight. OK?"]],
    [['What has changed?', ['the cost', 'the time', 'the transport'], 'A']], S('Listening P4 Q16')),
  listen('ket6-l4-17', 'A2', 'You will hear two students talking about a problem.',
    [['F', "Why didn't you text me to say you'd be late?"],
     ['M', "Sorry, I couldn't. I was secretly looking at my phone in chemistry, and Mrs Clements saw me, and took it and put it in her drawer. I can't have it back until lunchtime."],
     ['F', 'Are you going home for lunch?'],
     ['M', "Yes, because I've left my maths books in my brother's backpack."]],
    [["Where's the boy's phone?", ["in the teacher's desk", "in his brother's bag", 'in his house'], 'A']], S('Listening P4 Q17')),
  listen('ket6-l4-18', 'A2', 'You will hear a boy talking about buying some boots.',
    [['M', "I got some new boots at the weekend. They're the same as the ones that singer Jason Wright's wearing in his latest video. How cool is that? The leather's a bit hard and uncomfortable, but Mum says it'll get softer when I wear them. They only have them in gold or brown. Mum made me have the brown ones!"]],
    [['Why did he buy the boots?', ["They're comfortable.", 'He likes the colour.', "They're in fashion."], 'C']], S('Listening P4 Q18')),
  listen('ket6-l4-19', 'A2', 'You will hear a girl talking about playing tennis.',
    [['F', "You'll never guess what happened during my tennis match! We played doubles and the girl I was playing with never let me hit the ball. I'm so mad at her. I know I won't be able to sleep tonight because I'll be thinking about what to say to her tomorrow. I don't even want to have supper now!"]],
    [['How does she feel after playing?', ['angry', 'hungry', 'tired'], 'A']], S('Listening P4 Q19')),
  listen('ket6-l4-20', 'A2', 'You will hear two friends talking about a new teacher.',
    [['F', 'Have you seen our new music teacher, Mr Martinez?'],
     ['M', 'He smiles a lot, which is great.'],
     ['F', 'And always wants to help you. I think he looks like that guy who plays for Manchester United.'],
     ['M', "Really? I don't think so. Mr Martinez says he didn't always get good grades at school and only became a teacher when he was forty."]],
    [['What do they like about the new teacher?', ["He's clever.", "He's friendly.", "He's famous."], 'B']], S('Listening P4 Q20')),
];
