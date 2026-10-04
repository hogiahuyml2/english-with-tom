'use strict';
const { notice, cloze, fill, passage, listen } = require('./lib');
const S = (p) => 'Cambridge B1 Preliminary for Schools Trainer · Test 4 · ' + p;

module.exports = [
  // Reading P1 — key: A B B C C
  notice('pet4-r1-1', 'B1', "Marta\nI won't be ready in time to catch the bus into town with you, so I'll get a lift there with Mum instead. See you at the shopping centre at about 3 p.m.\nLena", 'Lena is',
    ['suggesting that Marta travels into town without her.', 'offering Marta a lift into town instead of catching the bus.', 'checking the time she arranged to meet Marta at the shopping centre.'], 'A', S('Reading P1 Q1')),
  notice('pet4-r1-2', 'B1', "New Message\nFrom: Coach\nTo: Hockey team\n\nYou played well in last week's game, but we'll need extra practice before our match against Anbridge next month – they're good. So see you on Saturday, usual place, 1 p.m. – or call me.", null,
    ["The coach needs team members to tell him if they're available for a match.", 'The coach wants to help the team improve their performance before they play again.', "The coach is congratulating the netball team for winning their game last week."], 'B', S('Reading P1 Q2')),
  notice('pet4-r1-3', 'B1', 'Please give staff at the desk your college student number before using any of the computers in the Study Centre.', null,
    ['Staff at the desk will show you how to use the computers here.', 'These computers are reserved only for students at this college.', "If you're not a college student, ask staff for permission to use a computer."], 'B', S('Reading P1 Q3')),
  notice('pet4-r1-4', 'B1', "Tom\nThe sports shop called – the one on Hatton Street. They've finally repaired your tennis racket! Will you have time to collect it, or shall I do it on my way home from work?\nMum", 'What does Mum want to know?',
    ["how to find the sports shop that's repaired Tom's racket", 'whether the sports shop will still be open when she finishes work', 'if Tom is going to be available to pick up his racket'], 'C', S('Reading P1 Q4')),
  notice('pet4-r1-5', 'B1', 'Milton Music Store\nSecond-hand guitars and violins for sale.\nVery reasonable prices.\nNew instruments also available.\nCall: 08413 672 521', null,
    ['This store has more second-hand instruments available than new ones.', 'You can only buy instruments here that other people have already used.', "This store doesn't charge a lot for instruments that aren't new."], 'C', S('Reading P1 Q5')),

  // Reading P3 — key: D B A C C
  passage('pet4-r3', 'B1', 'Cross-country skiing in Sweden (by Jenna Walton, aged 15)',
`Last year, Mum and I wanted to try a winter sport called cross-country skiing – travelling on skis across the countryside. And pictures of one area in Sweden, with people skiing along through forests on wonderful white snow, persuaded us that destination was a good choice. We hadn't done much skiing, though, so weren't sure how difficult cross-country skiing was, compared with skiing fast down steep mountains. But we signed up to join a group of people, of all ages, plus a guide.

We'd read about the place we went to before we left, so we knew it was close to where Sweden ends and Norway starts. And our family knew we couldn't text home, as there was no internet connection – and actually, it was relaxing to be far from anywhere, or anyone. What we hadn't realised was that from there, we'd be able to see amazing coloured lights in the sky, which appeared at certain times of year, called the Northern Lights – what a sight!

On our first day there, I hated getting up in the dark, but it meant I saw the sun come up over the forest, so I was glad I did. And sunshine was forecast for the week, I was delighted to hear! But the real problem was my 15kg rucksack, full of food and clothes – I had no idea it would weigh that much. Anyway, we skied for hours across mainly flat snow. Having special light skis was supposed to help us climb the few hills there were – although I still couldn't do it!

Finally we stopped for the night. It wasn't until we'd reached our hut that our guide mentioned we'd just crossed a frozen lake to get there – but nothing surprised us by that point! Anyway, he gave us all jobs to do – cutting fire wood and cooking food – and soon we were having dinner, made from whatever food we'd brought – a strange mix, but it tasted delicious. And everywhere was so peaceful outside that none of us stayed awake long.

Mum and I want to try another winter sports trip, maybe snowboarding. But we'll probably end up just as exhausted as we were after this trip!`,
    [['Jenna and her mum decided to go cross-country skiing in Sweden because', ['they wanted a change from mountain skiing holidays.', "they'd heard the sport would be easier than skiing down hills.", "they'd met a group of people who wanted to go, too.", 'they found a place there that they were keen to visit.'], 'D'],
     ['After their arrival, what did they discover about where they were staying?', ['It wasn\'t far from the border with another country.', 'They could get great views of a spectacular natural event.', "It was at a point where they couldn't use technology.", "They weren't near local people or their homes."], 'B'],
     ['How did Jenna feel about the long trips through the snow on skis?', ['surprised she had to carry such a heavy bag', 'pleased about the weight of the skis she was given', "glad that going uphill wasn't as hard as she'd thought", "worried the good weather they were having wouldn't last"], 'A'],
     ['Regarding their accommodation, Jenna says everyone', ['had difficulties getting to sleep there.', 'was unhappy at the quality of the food.', 'had to help out with all the housework.', 'was shocked to hear details of their journey there.'], 'C'],
     ['What would Jenna text to a friend about her trip?', ["One reason we chose this trip was that we thought we'd be among loads of trees, which we love – but that hasn't happened so far.", "The people in our group were really friendly – but they were all Mum's age and older, really.", "I'm not used to getting out of bed so early to do things! But it was worth it, as the sunrise was wonderful.", "Mum and I have agreed that although the trip was great, we might attempt something less tiring on our next winter holiday."], 'C']],
    S('Reading P3 Q11–15')),

  // Reading P5 — key: B C A B A D
  cloze('pet4-r5-21', 'vocab', 'B1', 'The wild birds known as ravens are thought to be very clever. In fact, they can solve some quite ____ problems, especially when they\'re trying to get food.', ['expert', 'complicated', 'heavy', 'confused'], 'B', S('Reading P5 Q21')),
  cloze('pet4-r5-22', 'vocab', 'B1', 'One bird was filmed taking a box of nuts from a bird table and ____ it onto the ground, so that it would break and the bird could eat the nuts inside!', ['letting', 'falling', 'dropping', 'leaving'], 'C', S('Reading P5 Q22')),
  cloze('pet4-r5-23', 'vocab', 'B1', 'Scientists also ____ that the birds could actually use stones as tools.', ['noticed', 'advised', 'watched', 'studied'], 'A', S('Reading P5 Q23')),
  cloze('pet4-r5-24', 'vocab', 'B1', 'Scientists taught five birds to use tools to ____ out simple tasks.', ['take', 'carry', 'make', 'check'], 'B', S('Reading P5 Q24')),
  cloze('pet4-r5-25', 'vocab', 'B1', 'The birds soon became very ____ at doing this.', ['experienced', 'intelligent', 'correct', 'keen'], 'A', S('Reading P5 Q25')),
  cloze('pet4-r5-26', 'vocab', 'B1', 'For the next experiment, the birds were given a small ____ of tools to choose from.', ['group', 'total', 'amount', 'number'], 'D', S('Reading P5 Q26')),

  // Reading P6 — key: never/not · have · where · of · keep · it
  fill('pet4-r6-27', 'B1', "Welcome to my blog! That's for anyone who's new and has ____ visited this site before!", ['never', 'not'], S('Reading P6 Q27')),
  fill('pet4-r6-28', 'B1', "But if you ____ seen some of my blogs, then you'll know I like sharing ideas about creative writing and how to do it.", 'have', S('Reading P6 Q28')),
  fill('pet4-r6-29', 'B1', "At the moment, I'm sitting at my desk in my room, ____ I do most of my writing.", 'where', S('Reading P6 Q29')),
  fill('pet4-r6-30', 'B1', "I'll often update my diary or something, too – and this blog, ____ course!", 'of', S('Reading P6 Q30')),
  fill('pet4-r6-31', 'B1', 'I recently discovered the most important thing is just to ____ going once you\'ve started writing.', 'keep', S('Reading P6 Q31')),
  fill('pet4-r6-32', 'B1', "And ____ doesn't matter how bad your writing is at the beginning, because you can always go back and make improvements.", 'it', S('Reading P6 Q32')),

  // Listening P2 — key: B C C A C B
  listen('pet4-l2-8', 'B1', 'You will hear two friends talking about travelling into the town centre.',
    [['M', "Hi, Angela. Waiting for the bus again? It's just as quick to walk into town from here, you know."],
     ['F', "I know it's strange, especially as it takes 15 minutes to walk here from home, but I work in a shop in town on Saturdays with a friend. She lives further out of town, so she gets the bus in. It's a bit more sociable if we go together."],
     ['M', "But how do you know which one she'll be on?"],
     ['F', 'The buses come every 10 minutes on weekdays, but only once an hour on Saturdays, so I know exactly which one to get!']],
    [['Why does the girl prefer taking the bus to the town centre?', ["There's a bus stop near her home.", 'She meets someone she knows on it.', 'The service is very frequent.'], 'B']], S('Listening P2 Q8')),
  listen('pet4-l2-9', 'B1', "You will hear two friends talking about a music video they've seen.",
    [['M', "Have you seen the video for Lionheart's new song yet?"],
     ['F', "Yes, I watched it last night. It's really not like their other stuff, but I couldn't stop listening to it."],
     ['M', "Maybe I'll start to like it once I've heard it a few more times. I don't think I've ever seen such an incredible video, though."],
     ['F', 'I think they hired a Hollywood director to make it – you can tell because of the quality.'],
     ['M', 'The dancing looked like something from another planet!'],
     ['F', "I thought it was the costumes that created that effect. The routines themselves were quite like other videos I've seen."]],
    [['The friends agree that', ['the song is excellent.', 'the dancing is original.', 'the video is well made.'], 'C']], S('Listening P2 Q9')),
  listen('pet4-l2-10', 'B1', 'You will hear two friends talking about buying a mobile phone.',
    [['F', 'My parents say I can get a new phone for my birthday.'],
     ['M', "Hey, that's great. So which model are you going to choose? Reading what phone buyers have written about their phones is probably more reliable than listening to a sales assistant telling you which one is best. I've heard that some phone companies give stores money for selling more of their phones, especially the newer, more expensive ones, so I'm not sure you could trust what they'd say."],
     ['F', "That's useful to know. I'll ask my parents what they think is the best way to choose, too."],
     ['M', 'Good idea.']],
    [['The boy thinks the girl should', ['get the newest model.', 'go to the phone shop.', 'look at lots of reviews.'], 'C']], S('Listening P2 Q10')),
  listen('pet4-l2-11', 'B1', 'You will hear two friends talking about school.',
    [['M', "You don't usually look so happy at the end of a school day."],
     ['F', "That's because we've usually been given a load of maths problems to do for the next day. Not today, though."],
     ['M', "But you're good at maths – you usually get high marks."],
     ['F', 'I know, but it still takes time. Anyway, you know I finished that physics project last week?'],
     ['M', 'Yeah...'],
     ['F', 'Well, the teacher was so impressed with it, she gave me a book.'],
     ['M', "Wow, that's great. Next thing you know, they'll make you captain of the football team."],
     ['F', "That'd be unbelievable, but fairly unlikely as I hardly ever play football."]],
    [['The girl is feeling pleased because she', ['was given a reward for her school work.', 'was chosen to play in a sports match.', 'got a high mark for her homework.'], 'A']], S('Listening P2 Q11')),
  listen('pet4-l2-12', 'B1', 'You will hear a boy telling his friend about a family visit to some relatives.',
    [['F', 'How was the weekend away?'],
     ['M', 'Good, thanks. I had a really nice time with my cousins – we get on really well, and I always miss them for a few days after we come home. My aunt and uncle love having us there too, although he got a bit angry when my brother broke one of their vases.'],
     ['F', 'Oh, dear!'],
     ['M', "Fortunately, it wasn't an old one, but I've never heard my uncle shout like that before. Visiting them for only a weekend's a bit cruel in a way. It feels like you've only just arrived and suddenly it's time to go."]],
    [['How did he feel about it?', ['worried that he annoyed someone', 'upset that they stayed so long', 'sorry when they had to leave'], 'C']], S('Listening P2 Q12')),
  listen('pet4-l2-13', 'B1', 'You will hear two friends talking about a new swimming pool.',
    [['M', "Have you tried the new pool? It's awesome."],
     ['F', "I went with my family last week. I had a few goes on those tubes with the water in – you know, the ones you can go down really fast and end up in the pool."],
     ['M', 'Oh yes, that was amazing.'],
     ['F', "I think I'd go back just to play on them. Lots of teenagers used the old pool too, but only because they didn't have anywhere else to go. The water in this new one is nowhere near as warm, but it's better in a way because it keeps you moving."],
     ['M', 'True.']],
    [['What did the girl like best about it?', ['The water is very warm.', 'There are fun things to do.', 'Lots of young people use it.'], 'B']], S('Listening P2 Q13')),

  // Listening P4 — key: B C A C B A
  listen('pet4-l4', 'B1', 'You will hear an interview with a 17-year-old boy called Erik who went cycling across the USA with his dad.',
    [['F', "Erik, you've recently returned from a cycle trip with your dad across the USA. Why did you want to do this ride?"],
     ['M', "I suppose the usual reason for doing something as mad as cycling five thousand kilometres in just two months is to make thousands of pounds for various charities. We certainly did that, and spent large amounts of time with each other too, which was wonderful. We decided to go, though, because we fancied doing something really different during the summer holidays."],
     ['F', 'What made you choose to go across the USA and not other countries?'],
     ['M', "We'd thought about going through Central Asia, but you need lots of different visas, all of which take ages to arrange. With the USA, there was none of that – one country means one visa. It's a shame that I didn't get to practise speaking any other languages, though. I'd wondered about how safe some of the cities would be, but they were fine."],
     ['F', 'How did you feel as you set off?'],
     ['M', "I was expecting to be so keen to set off that I wouldn't be able to sit still. When the time arrived, though, my dad and I both felt pretty calm, which I found quite amazing. I don't think either of us had any worries about not finishing the ride – we were very confident."],
     ['F', 'What was a typical day like?'],
     ['M', "Every day was different. Some were good and some were quite difficult, but all were good experience. It wasn't actually how far we rode that made a day good or bad, it was more what happened. Having a long conversation with some of the local people seemed to make us even happier than feeling the sun on our faces."],
     ['F', 'And how did you and your dad get along?'],
     ['M', "We've always got on really well, so although we didn't agree about everything on the trip, we were always able to deal with any arguments, which didn't happen often. And although we spoke about a few of the things that are important to us, over the two months we learned it was OK to spend a few hours saying absolutely nothing, too."],
     ['F', 'And have you got plans for doing more cycling?'],
     ['M', "I'm in my final year at school now, and I need to do well to get to university, so it wouldn't be the best time for me to go cycling across Australia, or wherever. Rather than just going out on weekend rides, though, I'd much prefer to enter some competitions – over shorter distances of course! I've never tried that before."],
     ['F', 'Good luck, Erik!']],
    [['Erik and his dad wanted to do a long cycle ride to', ['make money for charity.', 'break their usual routine.', 'spend lots of time together.'], 'B'],
     ['Why did they choose to cycle in the USA and not in other countries?', ['To avoid difficulties with language.', 'They thought it would be safer.', 'It was easier to organise.'], 'C'],
     ['How did Erik feel as they were setting off?', ['surprised at how relaxed they were', "excited about all the things they'd see", "nervous they wouldn't succeed"], 'A'],
     ["Erik's favourite days were those on which", ["they didn't cycle as far as usual.", 'the weather was warm and dry.', 'they had a chance to be sociable.'], 'C'],
     ['Erik says that during the ride, he and his dad', ['talked about many personal issues.', 'became comfortable with silence.', 'disagreed about many things.'], 'B'],
     ['In the future, Erik plans to', ['start taking part in races.', 'go on another long ride.', 'only cycle during his free time.'], 'A']],
    S('Listening P4 Q20–25')),
];
