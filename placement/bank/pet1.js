'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge B1 Preliminary for Schools Trainer · Test 1 · ' + p;

module.exports = [
  // Reading P1 — key: A C C B A
  notice('pet1-r1-1', 'B1', "Anton,\nWhen you see your sister at the basketball match later, can you make sure she remembers that Dad's coming to fetch her instead of me? I've tried ringing, but her phone's off.\nThanks,\nMum", null,
    ['Anton has to check his sister knows about the arrangements for getting home.', 'Anton should remind his sister to switch her phone back on.', "Anton needs to ask his sister if she's taking part in a sports event later."], 'A', S('Reading P1 Q1')),
  notice('pet1-r1-2', 'B1', 'From the famous novel by Ben Whitham:\na film about a bear\'s adventures.\n"Fun for all the family!"', 'This film is',
    ['about a family of wild animals.', 'not suitable for people under a certain age.', 'based on a popular fiction book.'], 'C', S('Reading P1 Q2')),
  notice('pet1-r1-3', 'B1', 'New Message\nFrom: Mrs Hoskins\nTo: All students\n\nBefore the end of term, please return all books you have borrowed from the library, or see someone at the desk if you want to have them for the summer holiday.', null,
    ["You must take back all the library books you've got before the summer holiday.", 'If there are library books you want, borrow them before the end of term.', 'To keep any library books for holiday reading, ask staff at the desk.'], 'C', S('Reading P1 Q3')),
  notice('pet1-r1-4', 'B1', "Tina,\nWhen you come round tonight, can you bring that earring you found outside school the other day? I think I know who it belongs to, so I'll return it.\nThanks,\nNicola", null,
    ['Nicola is telling Tina to return something she was lent recently.', 'Nicola is hoping she can give a lost item back to its owner.', 'Nicola is asking for help to find a lost earring belonging to her.'], 'B', S('Reading P1 Q4')),
  notice('pet1-r1-5', 'B1', "BIKES FOR HIRE\nAdult cycles always available\nChildren's cycles – book in advance\n8 a.m. – 9 p.m.\nOnly €20 per day", null,
    ["Families may not find suitable bikes for everyone unless they've reserved them.", 'You can always find a range of bikes for hire here.', "Bikes aren't available for customers' use in the evenings."], 'A', S('Reading P1 Q5')),

  // Reading P3 — key: D A C B D
  passage('pet1-r3', 'B1', 'Our Great Ocean Road adventure (by Donna Waverley)',
`My family and I recently went to Australia, to see my grandparents. But before we visited them, we went sightseeing along the Great Ocean Road, on the Australian coast.

Dad had intended to drive, but even though he was used to driving miles without getting exhausted, he then read on the website that the road wouldn't be an easy drive, with a number of sharp bends. Anyway, we thought he deserved to enjoy the fantastic views too, which he couldn't do as our driver. So instead, we persuaded him to book discount bus tickets and off we went.

Our first stop was where wild kangaroos lived – and Dad and I were taking a walk when a big one appeared! For a moment, it seemed to consider coming towards us, which made me slightly nervous – but then it went off along the road, stopping to check if we were following. Although it was with us a while, I was so excited I didn't even manage to pull out my camera. Then it looked back once more, and went off into the bushes.

That wasn't the only wildlife we saw. I thought it unlikely we'd see Australia's famous koala bears during our short visit, as I'd heard they were rare – but we weren't disappointed at our next stop. In fact, we discovered there were roughly six million in that area! Sadly, some gum trees they were in had very few leaves left, which people told us was because of the koalas, although I'd read that lack of water is actually the problem. Still, I guess they looked cute, and were easy to find – we just followed the tourists looking up into the trees!

Dad had booked a campsite for the night, with ready-made tents – for an adventure! I wasn't sure about that, but they were actually luxury tents, within walking distance of some famous rocks and other places we hoped to visit. However, Dad also said the sounds of wild creatures would help us sleep. That sounded worrying – until the 'wild creatures' turned out to be frogs! So I was embarrassed by my fears – and kept awake by the frogs! But we had fun making meals together – we'd brought food, as we knew there'd be nowhere to eat.

In fact, this whole trip was fantastic!`,
    [["Donna's Dad decided not to drive the Great Ocean Road himself because", ["he realised he wouldn't enjoy the views as much.", 'he thought it would be too tiring for him.', 'he discovered the bus would be a cheaper option.', 'he found out the route was very challenging.'], 'D'],
     ['When Donna saw a kangaroo along the route, she was', ['worried that it might approach her.', 'amazed at the size of it.', "sad that it didn't stay with them long.", 'disappointed that she had forgotten her camera.'], 'A'],
     ['Donna says that the koala bears they saw were', ['responsible for damage to the trees.', 'even more attractive than people had told her.', "more common than she'd expected.", 'very skilled at hiding away from tourists.'], 'C'],
     ["What was Donna's opinion of the place where they stayed?", ["She found it was less comfortable than she'd hoped.", 'She liked the fact that it was convenient for sightseeing.', 'She enjoyed hearing the sounds of nature as she slept.', 'She was disappointed there was no restaurant nearby.'], 'B'],
     ['What might Donna write in her blog during the trip?', ["The bus we're travelling on is pretty comfortable, with great views from the window. Grandma and Grandad are enjoying it, too!", "We can see quite a lot as we drive along. I just wish we could stop and get out to explore properly.", "Yesterday we went to see some huge rocks near our campsite – and we were really impressed! I'm surprised they're not well known.", "I wasn't looking forward to camping, in case there were wild animals, but we haven't seen anything at all dangerous, so I feel silly now!"], 'D']],
    S('Reading P3 Q11–15')),

  // Reading P5 — key: C B A D C B
  cloze('pet1-r5-21', 'vocab', 'B1', 'Many cities have parks for people to enjoy. And it\'s very ____ to find wonderful sculptures in them.', ['usual', 'general', 'common', 'familiar'], 'C', S('Reading P5 Q21')),
  cloze('pet1-r5-22', 'vocab', 'B1', 'When the temperature ____ at the end of winter, the ice sculptures all disappear – because they\'re made of ice!', ['develops', 'rises', 'grows', 'builds'], 'B', S('Reading P5 Q22')),
  cloze('pet1-r5-23', 'vocab', 'B1', 'The ice is brought from a lake ____ near the sculpture park.', ['located', 'arranged', 'contained', 'attached'], 'A', S('Reading P5 Q23')),
  cloze('pet1-r5-24', 'vocab', 'B1', "The ice is said to be so clear that visitors can read a newspaper through it – even though the individual pieces are over one metre ____!", ['heavy', 'large', 'strong', 'thick'], 'D', S('Reading P5 Q24')),
  cloze('pet1-r5-25', 'vocab', 'B1', 'Visitors also have the ____ to make their own ice sculptures if they wish, at special classes.', ['occasion', 'benefit', 'opportunity', 'ability'], 'C', S('Reading P5 Q25')),
  cloze('pet1-r5-26', 'vocab', 'B1', "There's a children's play park, too, where ____ everything is made of ice, including sculptures of favourite animals.", ['totally', 'absolutely', 'completely', 'fully'], 'B', S('Reading P5 Q26')),

  // Reading P6 — key: not in where did why have
  fill('pet1-r6-27', 'B1', 'I\'ve just been to the museum in our city. That was my first visit, believe it or ____!', 'not', S('Reading P6 Q27')),
  fill('pet1-r6-28', 'B1', 'I wanted to collect some information for our class history project. We have to hand it ____ soon, don\'t we?', 'in', S('Reading P6 Q28')),
  fill('pet1-r6-29', 'B1', 'I went to the Ancient History section, ____ the museum keeps all its ancient Egyptian stuff.', 'where', S('Reading P6 Q29')),
  fill('pet1-r6-30', 'B1', 'There were some amazing statues of various animals, so I drew some pictures of them and then ____ some research about them online when I got home.', 'did', S('Reading P6 Q30')),
  fill('pet1-r6-31', 'B1', "I've still got some work to do on my project, so I'll need to go back to the museum again soon. In fact, ____ don't we go together?", 'why', S('Reading P6 Q31')),
  fill('pet1-r6-32', 'B1', "I don't think you've been there before, ____ you? I'm sure you'll find something that you could use for your project.", 'have', S('Reading P6 Q32')),

  // Listening P2 — key: C A A B C B
  listen('pet1-l2-8', 'B1', "You will hear two friends talking about a film they've just seen.",
    [['F', 'That was a great film.'],
     ['M', "If you're into that kind of thing. I haven't seen anything as bad as that for a long time."],
     ['F', "Oh, I didn't know that you don't like horror movies."],
     ['M', "I usually do, but I'm not sure that's how I'd describe that film – there was only one bit I found at all scary. It's strange because the main characters were played by two quite big stars, but I don't know how they got to be so famous if that's the best they can do. It was all very disappointing..."],
     ['F', 'Oh, dear!']],
    [["Why didn't the boy enjoy the film?", ['It was very frightening.', 'It lasted too long.', 'It had terrible acting.'], 'C']], S('Listening P2 Q8')),
  listen('pet1-l2-9', 'B1', 'You will hear two friends talking about some biology homework.',
    [['F', "How's your biology homework going?"],
     ['M', "Not very well. I can't work out what I have to do."],
     ['F', "In that case, it probably won't be much use looking online. You can find all the information you need there, but if you don't know what to do with it, it's not really going to help you. Have you seen Mr Benson about it?"],
     ['M', 'No, not yet.'],
     ['F', 'It might be best, as he set the homework in the first place. Take your coursebook with you when you go so he can explain everything to you using that.'],
     ['M', 'Good idea!']],
    [['The girl suggests that the boy should', ['ask his teacher for help.', 'get information from the internet.', 'look in the biology textbook.'], 'A']], S('Listening P2 Q9')),
  listen('pet1-l2-10', 'B1', "You will hear two friends talking about an interview with a singer they've seen on TV.",
    [['F', 'Did you see that interview with Denny Starr?'],
     ['M', "I did. He seemed so nervous at the beginning. And it wasn't that the guy asking the questions was especially rude or asked him anything difficult."],
     ['F', "I know. But once he relaxed a bit, he really spoke about lots of things I didn't know anything about."],
     ['M', "I don't think I've ever heard him talk in so much detail about his life before. In other interviews I've heard, he's generally given answers that had very little to do with what he's been asked."],
     ['F', "Yes, like he didn't really understand the question."],
     ['M', 'Exactly.']],
    [['They agree that', ["the singer's answers were interesting.", 'the interviewer was quite rude.', 'the questions were confusing.'], 'A']], S('Listening P2 Q10')),
  listen('pet1-l2-11', 'B1', 'You will hear a girl telling her friend about a diving trip.',
    [['M', 'How was the diving trip?'],
     ['F', "It was great, but I learned to dive in a swimming pool where the water doesn't move around much. Going underwater in the sea was a completely different experience. I seemed to become totally unable to do all those things that I got so good at in the pool."],
     ['M', "So is it something you'd like to have another go at?"],
     ['F', "I'll think about it, but if I do, I need to make sure I go with my cousin Martin again. It gave me a bit more confidence to be underwater with someone I knew."]],
    [['How did the girl feel about it?', ['sure she will go again', 'glad she went with a relative', 'pleased with her diving skills'], 'B']], S('Listening P2 Q11')),
  listen('pet1-l2-12', 'B1', 'You will hear a girl talking to a friend about basketball.',
    [['F', 'Hey, did you see the big basketball game last night?'],
     ['M', 'I did, yeah.'],
     ['F', "That was awesome when their star player jumped so high he nearly landed on that cameraman! Wouldn't you love to be able to do that? You'd be a great player – you're real tall."],
     ['M', "I guess. I can't say I understand much about the rules, though."],
     ['F', 'Some of them are quite complicated, especially the ones about how long you can hold onto the ball for. But the best way to understand them is to play – that way you\'d learn them as you were having fun.'],
     ['M', 'Maybe one day.']],
    [['The girl is trying to', ['explain the rules of the game.', 'describe a game she took part in.', 'encourage the boy to start playing.'], 'C']], S('Listening P2 Q12')),
  listen('pet1-l2-13', 'B1', 'You will hear a boy talking about a trip to a city with his family.',
    [['F', 'How was London?'],
     ['M', 'Great, except we got lost.'],
     ['F', 'Oh no! How?'],
     ['M', "My dad had this guide book which was at least 20 years old. We told him lots of things would be different now, so most of what was in it would be wrong. Even though it was old, it was probably more accurate than the information a guy on the street gave us for getting to Big Ben – we ended up somewhere completely different! We only used the book for getting around on the Underground in the end – the map's almost the same as it was back then."]],
    [["Why did the boy's family get lost?", ["They couldn't understand their map.", 'Someone gave them the wrong directions.', 'The guidebook contained incorrect information.'], 'B']], S('Listening P2 Q13')),

  // Listening P4 — key: C B A C C A
  listen('pet1-l4', 'B1', 'You will hear an interview with a 15-year-old girl called Andrea, who plays ice hockey for her National Under-16s Team.',
    [['M', "Welcome, Andrea. You're an expert ice hockey player now, but when did you start playing?"],
     ['F', "Not until about three years ago actually, so quite recently. I've come a long way quite quickly. I've always loved sport, though, and have played basketball since I was five or six. I gave that up for a while when I got into football about five years ago, but started playing again once I'd lost interest in football."],
     ['M', 'How did you first become interested in playing ice hockey?'],
     ['F', "My brother's into it, and I used to go to his games. His team wasn't very good, though, so I didn't think of it as something I actually wanted to do. That moment came when there was a professional match on a sports programme I was watching. I knew then I wanted to try it, and fortunately a couple of friends did too so we all started playing together."],
     ['M', 'You sometimes play against boys\' teams. How important is that?'],
     ['F', "Very. There are as many girls playing ice hockey now as there are boys, which is great. Attitudes towards us have always been positive, in my experience. I want to do better against boys somehow – I'm not sure why – which really helps to develop my talents."],
     ['M', 'How did you feel when you were chosen for the national under-16s team?'],
     ['F', "I'd been really happy with how I'd been playing for my club, and felt I could do just as well at a higher level. There'd been a lot of talk about me being picked, so I kind of knew it was coming. It was great for my parents too – they felt great having a daughter in the national team!"],
     ['M', 'Are the national team matches your favourite games?'],
     ['F', "Not always, even though some of them are big games and appear on national television. If a game's close because both teams are good, then it's fantastic for the crowd to see, and better to play in because of that. It's far more interesting than scoring loads of goals because we're so much better than the other team."],
     ['M', 'Any advice for people wanting to start playing ice hockey?'],
     ['F', "You can spend hours reading books about what you can and can't do, but there's no better way of becoming good than playing. So borrow some skates and a stick if you need to – you can buy your own later – and join a team so you can start playing straightaway."],
     ['M', 'Thank you, Andrea!']],
    [['Which sport does Andrea say she started playing first?', ['football', 'ice hockey', 'basketball'], 'C'],
     ['Andrea says that she first started playing ice hockey after', ['watching a family member play.', 'seeing a game on television.', 'talking about it with her friends.'], 'B'],
     ['Why does Andrea think that playing against boys is important?', ['It improves her own playing skills.', 'It proves there are many girls playing the sport.', 'It increases respect for female players.'], 'A'],
     ['How did Andrea feel when she was chosen for the national under-16s team?', ['surprised to be asked', 'sorry to leave her club', 'confident in her abilities'], 'C'],
     ["Andrea's favourite games are those which are", ['easy to win.', 'shown on TV.', 'exciting to watch.'], 'C'],
     ['Andrea says that people who want to start playing ice hockey should', ['find a club.', 'buy good equipment.', 'learn the rules.'], 'A']],
    S('Listening P4 Q20–25')),
];
