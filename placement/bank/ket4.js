'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge A2 Key for Schools Trainer · Test 4 · ' + p;

module.exports = [
  // R&W P1 — key: B C B B A B
  notice('ket4-r1-1', 'A2', 'COMPUTER GAMES SHOW\nBuy two tickets and get the third one half price.\nHurry! Last few days of offer. Only until the end of the week.', null,
    ['There is 30% off all tickets.', 'You can save money this week.', 'Tickets are only available this week.'], 'B', S('R&W P1 Q1')),
  notice('ket4-r1-2', 'A2', "We can only take you on the school trip if your parents have said it's OK. Please ask them to fill in the form.", null,
    ['Parents can come on the trip if they want.', 'Pupils must fill in a form and show it to their parents.', 'The school can take pupils on the trip if their parents let them go.'], 'C', S('R&W P1 Q2')),
  notice('ket4-r1-3', 'A2', "The school's sports hall is used by all pupils for gym and indoor sports. There is also an outdoor area for hockey and football.",
    'This text is', ['describing the sports lessons at the school.', 'explaining where you can do sports at the school.', 'saying that the pupils at the school are good at sports.'], 'B', S('R&W P1 Q3')),
  notice('ket4-r1-4', 'A2', "Jim,\nAny chance your mum could take me home in the car after school today?\nI forgot to bring the money for my bus ticket!\nMark",
    'What does Mark want to do?', ['borrow some money', 'travel home with Jim', 'invite Jim to visit him'], 'B', S('R&W P1 Q4')),
  notice('ket4-r1-5', 'A1', "How about joining the school singing group? It doesn't matter if you can't read music. All staff and pupils welcome! Mondays after lessons at 4 p.m.",
    'Who can join the singing group?', ['anyone at the school', 'pupils who have music lessons', 'people who can already read music'], 'A', S('R&W P1 Q5')),
  notice('ket4-r1-6', 'A2', 'If you are not well and miss a class, please ask a classmate to tell you what was taught.',
    'Who is this message for?', ['pupils who are feeling ill', "pupils who couldn't go to a lesson", 'pupils who would like to help their friends'], 'B', S('R&W P1 Q6')),

  // R&W P3 — key: A B B C C
  passage('ket4-r3', 'A2', 'An amazing stay at the Ocean View Hotel',
`I'm usually sad to say goodbye to my cousins after visiting them in Australia. But last June I wasn't. We had to change planes in the Middle East on the way back and had to stay overnight. I just couldn't wait to get to our hotel.

The first thing I noticed in the hotel was all the glass. It was really bright, so I don't know why all the lights were on in the building! There was also loud rock music playing, which I loved (but my parents didn't)! There weren't many people waiting at the reception, so we were soon in our rooms.

The garden wasn't what I expected. 'Dad,' I said, 'you told me there was a pool!' He took me back into the reception area and then up in the lift to the 39th floor and out onto the top of the building. 'Here it is,' he said. It was amazing! Swimming under the clouds was awesome.

I've stayed in some great hotels around the world, but nothing as cool as that one! I saw photographs of it before I went, but they don't really show how large the building is. I couldn't believe it. Everything is huge – the building, the pool, the meals (which were delicious, too, by the way)! There's so much to do and see there. I hope we can go back again and stay for longer!`,
    [['The writer says that last June, she felt', ['excited about where she was going.', 'sad because she was leaving her cousins.', 'angry because of the delay in her journey.'], 'A'],
     ['What was the hotel like inside?', ['dark', 'noisy', 'busy'], 'B'],
     ["Where was the hotel's pool?", ['in the hotel garden', 'on the roof of the hotel', "close to the hotel's reception area"], 'B'],
     ['What do we learn about the writer in the last paragraph?', ["She hasn't visited many hotels in her life.", "She didn't have time to see everything in the hotel.", "She didn't know the hotel is so big."], 'C'],
     ['Why has the writer written this text?', ['to describe what the hotel looks like', 'to say how the hotel could improve', 'to explain why she loved the hotel'], 'C']],
    S('R&W P3 Q14–18')),

  // R&W P4 — key: C A B B A B
  cloze('ket4-r4-19', 'vocab', 'A2', 'The Museum of Childhood in Edinburgh is full of variety. Visitors can ____ dolls houses, toy cars and much more.', ['watch', 'look', 'see'], 'C', S('R&W P4 Q19')),
  cloze('ket4-r4-20', 'vocab', 'A2', 'There is everything from toy soldiers to board ____.', ['games', 'competitions', 'matches'], 'A', S('R&W P4 Q20')),
  cloze('ket4-r4-21', 'vocab', 'A2', 'The museum was started by a man called Patrick Murray, who ____ many toys during his life and wanted to show them to the public.', ['picked', 'collected', 'took'], 'B', S('R&W P4 Q21')),
  cloze('ket4-r4-22', 'vocab', 'A2', "But it's more than ____ a museum of toys. It explores all parts of growing up.", ['already', 'just', 'yet'], 'B', S('R&W P4 Q22')),
  cloze('ket4-r4-23', 'grammar', 'A2', 'It explores all parts of growing ____, and its exhibitions include lots of different things.', ['up', 'out', 'away'], 'A', S('R&W P4 Q23')),
  cloze('ket4-r4-24', 'vocab', 'A2', 'Its exhibitions include lots of different things, from storybooks to baby ____.', ['snack', 'food', 'meal'], 'B', S('R&W P4 Q24')),

  // R&W P5 — key: much at me a am/'m for
  fill('ket4-r5-25', 'A2', "I know you have piano lessons. I want to start too, and I remember you said your teacher doesn't charge too ____.", 'much', S('R&W P5 Q25')),
  fill('ket4-r5-26', 'A2', "What's he like? Is he good ____ explaining things?", 'at', S('R&W P5 Q26')),
  fill('ket4-r5-27', 'A1', 'Can you let ____ know soon?', 'me', S('R&W P5 Q27')),
  fill('ket4-r5-28', 'A1', "My piano teacher is called Ben. He's funny and I always have ____ good time in the lessons.", 'a', S('R&W P5 Q28')),
  fill('ket4-r5-29', 'A2', "But I don't know if I ____ getting any better!", ['am', "'m", "I'm"], S('R&W P5 Q29')),
  fill('ket4-r5-30', 'A2', "Anyway, if you're looking ____ a teacher, then I think Ben will be perfect for you.", 'for', S('R&W P5 Q30')),

  // Listening P3 — key: B B C C A
  listen('ket4-l3', 'A2', 'You will hear Tommy talking to his friend Olga about their class party.',
    [['M', "Olga, you're coming to the class party at school, aren't you?"],
     ['F', "Yes, Tommy. I'm glad it's at the end of June because I'm having my birthday party on the first of July."],
     ['M', "And the twenty-eighth's better than the twenty-fifth because it's a Friday!"],
     ['F', 'What are you going to wear?'],
     ['M', 'Either my black jeans or blue shorts.'],
     ['F', 'Wear your new black T-shirt with blue shorts.'],
     ['M', 'OK.'],
     ['F', "I'm a bit worried about the party."],
     ['M', "Why? You're not singing in front of everyone like in the school concert or playing the guitar like last year."],
     ['F', "But I've got to help make sure everything's clean and tidy after the party, and that might take a long time."],
     ['M', "I don't think so. Actually, I'll probably arrive late."],
     ['F', 'Why?'],
     ['M', "I want to be in the tennis match at my sports club. I won't have time to get the bus, but my mum will drive me to the party."],
     ['F', 'Oh, OK. Is your mum cooking some food for the party?'],
     ['M', "Yes, and we'll bring some paper plates. And you've got some balloons, haven't you?"],
     ['F', "That's right."]],
    [['Which date is the class party?', ['25th June', '28th June', '1st July'], 'B'],
     ['What does Olga think Tommy should wear to the party?', ['his black jeans', 'his blue shorts', 'his green T-shirt'], 'B'],
     ["What's Olga worried about?", ['singing at the party', 'playing the guitar', 'helping tidy up'], 'C'],
     ['Why will Tommy arrive at the party late?', ["He'll have to wait for a lift.", "There aren't many buses.", 'He wants to play tennis first.'], 'C'],
     ["What's Olga going to take to the party?", ['some balloons', 'some paper plates', 'some food'], 'A']],
    S('Listening P3 Q11–15')),

  // Listening P4 — key: B C B A A
  listen('ket4-l4-16', 'A2', 'You will hear two classmates talking together.',
    [['M', "You're at school early today! Did your dad bring you by car?"],
     ['F', 'Actually, there were no problems on the underground! I was lucky.'],
     ['M', 'But was your platform crowded? Mine was. I even thought about walking to school instead.'],
     ['F', "Not really. And the seven forty-five was on time. Walking's good if you want to be healthy, but I live quite far away."]],
    [['How did the girl come to school today?', ['by car', 'by train', 'on foot'], 'B']], S('Listening P4 Q16')),
  listen('ket4-l4-17', 'A2', 'You will hear a girl talking to a man who works at a museum.',
    [['M', "Please, don't carry your backpack round the museum."],
     ['F', "Oh, sorry. Err, I left all my school papers somewhere in a blue plastic... sort of box. And I can't find them."],
     ['M', 'Which rooms have you been in?'],
     ['F', "Well, first, I went to that one by the entrance where all the jackets and things are... Ah, that's where it is!"]],
    [["What's the girl looking for?", ['her bag', 'her coat', 'her folder'], 'C']], S('Listening P4 Q17')),
  listen('ket4-l4-18', 'A2', 'You will hear a boy talking about learning French.',
    [['M', "When I was on the school trip to France, I realised I could hardly say a word! My teacher asked our class to write to children in a French school, but after a couple of weeks everyone gave up! That didn't work, but finding funny films in French did. I like ones with talking animals!"]],
    [['How did he improve his French?', ['by visiting France', 'by watching French cartoons', 'by emailing his French penpal'], 'B']], S('Listening P4 Q18')),
  listen('ket4-l4-19', 'A2', 'You will hear a girl talking to her aunt about her hobbies.',
    [['F', 'Where are all those plastic dinosaurs you used to have?'],
     ['F2', "I gave them to the little boy next door. Whenever I have free time, I go to the riding school and I brush and feed the horses. For my birthday, Dad's giving me a camera. Then, I can go to the zoo and start getting some amazing pictures."]],
    [['Which hobby does the girl like doing now?', ['looking after animals', 'taking photos of animals', 'collecting toy animals'], 'A']], S('Listening P4 Q19')),
  listen('ket4-l4-20', 'A2', 'You will hear a headteacher talking to the whole school.',
    [['M', "First, let me say how pleased I am that the volleyball team won the summer championships! Second, you've never had somewhere nice to buy and eat lunch, but all that's changed. After this meeting, go and look next to the library! Next, if you want to borrow a guitar, violin, etc., you must see Mrs Howard before Friday."]],
    [["What's new at the school this year?", ['a cafeteria', 'a sports hall', 'a music room'], 'A']], S('Listening P4 Q20')),
];
