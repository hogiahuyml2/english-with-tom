'use strict';
// Cambridge Complete First for Schools — Student's Book (without answers).
// Sách KHÔNG kèm đáp án → mọi mục ở đây có key:'assistant' (đáp án do người biên soạn suy luận, chỉ giữ câu chắc chắn,
// chỉ có 1 đáp án hợp lý). Giáo viên nên xem lại trong trang quản lý ngân hàng đề.
const { cloze, fill, wordform, passage } = require('./lib');
const A = 'assistant';
const S = (p) => "Cambridge Complete First for Schools Student's Book · " + p;

module.exports = [
  // ── Use of English Part 1 — "Ice skating – my passion" (p.20) ──
  cloze('fce-ice-1', 'vocab', 'B1', 'I remember seeing a poster at my local leisure centre ____ ice-skating lessons.', ['taking', 'advertising', 'giving', 'teaching'], 'B', S('p.20 · UoE Part 1 Q1'), A),
  cloze('fce-ice-2', 'grammar', 'B1', 'I begged my dad to ____ me have a go.', ['allow', 'let', 'permit', 'enable'], 'B', S('p.20 · UoE Part 1 Q2'), A),
  cloze('fce-ice-3', 'grammar', 'B1', 'He agreed ____ I promised not to break any bones.', ['as long as', 'as soon as', 'as far as', 'as much as'], 'A', S('p.20 · UoE Part 1 Q3'), A),
  cloze('fce-ice-4', 'vocab', 'B1', 'I soon got used to the ice underneath my feet and was thrilled by the ____ of sliding across the ice.', ['emotion', 'attention', 'feeling', 'touch'], 'C', S('p.20 · UoE Part 1 Q4'), A),
  cloze('fce-ice-5', 'grammar', 'B1', 'I was ____ of falling at first, but I picked it up quite quickly and then it felt so exciting!', ['worried', 'alarmed', 'anxious', 'scared'], 'D', S('p.20 · UoE Part 1 Q5'), A),
  cloze('fce-ice-6', 'vocab', 'B2', 'I soon became much more confident about ____ risks.', ['doing', 'taking', 'making', 'having'], 'B', S('p.20 · UoE Part 1 Q6'), A),
  cloze('fce-ice-7', 'vocab', 'B2', 'Next year, I am hoping to ____ an international event in Switzerland.', ['take', 'make', 'enter', 'participate'], 'C', S('p.20 · UoE Part 1 Q7'), A),
  cloze('fce-ice-8', 'vocab', 'B1', 'I have also kept the promise I ____ to my dad – I have never fallen and injured myself while ice skating!', ['made', 'did', 'said', 'told'], 'A', S('p.20 · UoE Part 1 Q8'), A),

  // ── Part 1 — "How to eat sushi" (p.46) ──
  cloze('fce-sushi-1', 'vocab', 'B2', 'Use chopsticks for sashimi, but for the other ____ of sushi, it\'s acceptable, and even recommended, to use your hands.', ['makes', 'groups', 'types', 'sets'], 'C', S('p.46 · UoE Part 1 Q1'), A),
  cloze('fce-sushi-3', 'vocab', 'B2', 'Dip nigiri into the soy sauce fish-side first and do this only ____.', ['shortly', 'briefly', 'directly', 'immediately'], 'B', S('p.46 · UoE Part 1 Q3'), A),
  cloze('fce-sushi-4', 'vocab', 'B2', 'If you dip the rice side into the sauce, the sushi may ____ apart.', ['become', 'fall', 'get', 'go'], 'B', S('p.46 · UoE Part 1 Q4'), A),
  cloze('fce-sushi-5', 'vocab', 'B2', 'As a ____ rule, pieces of sushi should be eaten in a single bite – that\'s the traditional way.', ['general', 'broad', 'normal', 'familiar'], 'A', S('p.46 · UoE Part 1 Q5'), A),
  cloze('fce-sushi-6', 'vocab', 'B1', 'If you want to ____ more wasabi, you can simply put it onto your fish using chopsticks.', ['spread', 'place', 'add', 'lay'], 'C', S('p.46 · UoE Part 1 Q6'), A),
  cloze('fce-sushi-7', 'vocab', 'C1', 'Never mix wasabi with soy sauce as the ____ flavours will overpower the sushi.', ['gathered', 'joined', 'united', 'combined'], 'D', S('p.46 · UoE Part 1 Q7'), A),
  cloze('fce-sushi-8', 'vocab', 'B2', "Don't treat pickled ginger as something to put on the dish. It is ____ to be eaten between servings.", ['proposed', 'suggested', 'instructed', 'meant'], 'D', S('p.46 · UoE Part 1 Q8'), A),

  // ── Part 1 — "I want your job: Stunt performer" (p.90) ──
  cloze('fce-stunt-1', 'vocab', 'B2', 'Have you ever watched a film and wondered how the actors manage to perform incredibly ____ things like jumping from tall buildings?', ['impressive', 'excellent', 'impossible', 'tremendous'], 'A', S('p.90 · UoE Part 1 Q1'), A),
  cloze('fce-stunt-2', 'vocab', 'B2', "In fact, they don't do these things at all! The ____ performers are the stunt men and women.", ['exact', 'original', 'right', 'real'], 'D', S('p.90 · UoE Part 1 Q2'), A),
  cloze('fce-stunt-3', 'vocab', 'B2', 'The performers are stunt men or women who ____ the place of the film star.', ['remove', 'make', 'take', 'do'], 'C', S('p.90 · UoE Part 1 Q3'), A),
  cloze('fce-stunt-4', 'vocab', 'B2', 'In order to pursue a ____ as a stunt person, you have to be good at several sports.', ['career', 'job', 'work', 'position'], 'A', S('p.90 · UoE Part 1 Q4'), A),
  cloze('fce-stunt-5', 'vocab', 'C1', 'Preparation is ____ to the success of a scene, so every single action is planned very carefully.', ['recommended', 'required', 'crucial', 'advisable'], 'C', S('p.90 · UoE Part 1 Q5'), A),
  cloze('fce-stunt-6', 'vocab', 'C1', 'In fact, it is often the ____ that it takes longer to prepare for the scene than to film it!', ['truth', 'matter', 'event', 'case'], 'D', S('p.90 · UoE Part 1 Q6'), A),
  cloze('fce-stunt-7', 'vocab', 'B2', 'There are plenty of websites that can ____ you with all the information you need.', ['offer', 'lend', 'provide', 'recommend'], 'C', S('p.90 · UoE Part 1 Q7'), A),
  cloze('fce-stunt-8', 'vocab', 'B2', 'And who knows? It might just turn ____ to be the perfect job for you!', ['in', 'out', 'over', 'on'], 'B', S('p.90 · UoE Part 1 Q8'), A),

  // ── Part 1 — "Not just a hobby" (p.132) ──
  cloze('fce-dog-1', 'grammar', 'B1', 'My mother and father have an unusual hobby. They train puppies to ____ guide dogs for blind people.', ['convert to', 'become', 'begin', 'turn into'], 'B', S('p.132 · UoE Part 1 Q1'), A),
  cloze('fce-dog-3', 'vocab', 'B2', 'My sister and I just keep ____ on them when they are out.', ['a look', 'an eye', 'a view', 'a control'], 'B', S('p.132 · UoE Part 1 Q3'), A),
  cloze('fce-dog-4', 'vocab', 'B1', 'We all ____ the puppies for regular walks.', ['take', 'go', 'have', 'give'], 'A', S('p.132 · UoE Part 1 Q4'), A),
  cloze('fce-dog-5', 'vocab', 'B2', 'My parents teach the puppies how to ____ to different situations, such as crossing a busy road.', ['reply', 'respond', 'answer', 'return'], 'B', S('p.132 · UoE Part 1 Q5'), A),
  cloze('fce-dog-6', 'vocab', 'C1', 'They also teach the puppies how to behave when they ____ people and other dogs.', ['encounter', 'experience', 'attend', 'undergo'], 'A', S('p.132 · UoE Part 1 Q6'), A),
  cloze('fce-dog-7', 'vocab', 'B2', 'It is very important for a guide dog to stay calm and focused and not to get ____ from its work.', ['entertained', 'confused', 'distracted', 'disturbed'], 'C', S('p.132 · UoE Part 1 Q7'), A),

  // ── Vocabulary and grammar review — shoppers (p.117) ──
  cloze('fce-shop-1', 'vocab', 'B2', 'We\'re always hunting for ____, and many of us plan our shopping and do not just buy on impulse.', ['values', 'cheapness', 'bargains', 'decreases'], 'C', S('p.117 · Vocabulary review Q1'), A),
  cloze('fce-shop-2', 'vocab', 'B2', 'Many of us plan our shopping and do not just ____ into shops and buy on impulse.', ['jump', 'pop', 'enter', 'pass'], 'B', S('p.117 · Vocabulary review Q2'), A),
  cloze('fce-shop-4', 'vocab', 'B2', 'Many of my friends\' parents have a lot of influence on what they buy, even if they have ____ the money themselves from a part-time job.', ['earned', 'won', 'lent', 'borrowed'], 'A', S('p.117 · Vocabulary review Q4'), A),
  cloze('fce-shop-5', 'vocab', 'B2', 'We worry about our parents\' reaction to the clothes we ____.', ['invest', 'achieve', 'purchase', 'earn'], 'C', S('p.117 · Vocabulary review Q5'), A),
  cloze('fce-shop-6', 'vocab', 'B2', 'The shops in my area operate in a highly ____ environment.', ['competent', 'competitive', 'contested', 'combative'], 'B', S('p.117 · Vocabulary review Q6'), A),
  cloze('fce-shop-7', 'vocab', 'C1', "The shops have to make sure they ____ for young people's tastes by having a wide range of fashion clothes.", ['offer', 'cater', 'sell', 'supply'], 'B', S('p.117 · Vocabulary review Q7'), A),
  cloze('fce-shop-8', 'vocab', 'C1', 'The shops have a wide range of fashion clothes in ____ at any one time.', ['stock', 'shelf', 'place', 'existence'], 'A', S('p.117 · Vocabulary review Q8'), A),

  // ── Use of English Part 2 (điền 1 từ) — "How do you manage your money?" (p.13) ──
  fill('fce-money-1', 'B1', 'A recent survey asked teenagers ____ their money comes from and about their spending habits.', 'where', S('p.13 · UoE Part 2 Q1'), A),
  fill('fce-money-2', 'A2', 'Just over 80% of the teenagers surveyed received regular pocket money ____ their parents.', 'from', S('p.13 · UoE Part 2 Q2'), A),
  fill('fce-money-3', 'A2', 'About half of these had to ____ housework in return for their pocket money.', 'do', S('p.13 · UoE Part 2 Q3'), A),
  fill('fce-money-4', 'B1', 'Just under 10% received no money but said that their parents bought ____ essential items, such as clothes.', 'them', S('p.13 · UoE Part 2 Q4'), A),
  fill('fce-money-5', 'B1', 'A further 12% chose ____ get a part-time job.', 'to', S('p.13 · UoE Part 2 Q5'), A),
  fill('fce-money-6', 'B1', 'Reasons ____ seeking employment included having more money to spend.', 'for', S('p.13 · UoE Part 2 Q6'), A),
  fill('fce-money-7', 'B1', 'Some teenagers were saving up for a large purchase such ____ a car.', 'as', S('p.13 · UoE Part 2 Q7'), A),
  fill('fce-money-8', 'A2', 'When asked about ____ spending habits, about half of the teenagers surveyed said that they spent all their money each month.', 'their', S('p.13 · UoE Part 2 Q8'), A),

  // ── Part 2 — "How I like to shop" (p.107) ──
  fill('fce-how-1', 'B2', "Some adults think that teenagers shop online because they spend so much time online. That isn't actually true, at ____ not for me and my friends.", 'least', S('p.107 · UoE Part 2 Q1'), A),
  fill('fce-how-2', 'B1', "It's very convenient, as I can order exactly ____ I want.", 'what', S('p.107 · UoE Part 2 Q2'), A),
  fill('fce-how-3', 'B2', 'There are no huge crowds of people to put ____ with either.', 'up', S('p.107 · UoE Part 2 Q3'), A),
  fill('fce-how-5', 'B1', "I never buy T-shirts and stuff like that online, as you can't try anything ____ before you buy.", 'on', S('p.107 · UoE Part 2 Q5'), A),
  fill('fce-how-6', 'B1', 'Sometimes things look quite different ____ real life.', 'in', S('p.107 · UoE Part 2 Q6'), A),
  fill('fce-how-7', 'B2', 'A blue jumper might turn ____ to be green!', 'out', S('p.107 · UoE Part 2 Q7'), A),
  fill('fce-how-8', 'B2', "I'd much ____ spend time with friends in a shopping centre than sit at home in front of my computer.", 'rather', S('p.107 · UoE Part 2 Q8'), A),

  // ── Part 2 — "The smallest house in Britain" (p.144) ──
  fill('fce-house-1', 'B1', 'The smallest house in Britain is located in the town of Conwy in Wales. It is ____ as Quay House and is a popular tourist attraction.', 'known', S('p.144 · UoE Part 2 Q1'), A),
  fill('fce-house-2', 'A2', 'This tiny house has ____ floor area of 3.05 metres by 1.8 metres.', 'a', S('p.144 · UoE Part 2 Q2'), A),
  fill('fce-house-3', 'B1', 'It was built in the 16th century and remained ____ use until 1900.', 'in', S('p.144 · UoE Part 2 Q3'), A),
  fill('fce-house-4', 'B1', 'The last person to live there was a local fisherman called Robert Jones, ____ happened to be very tall.', 'who', S('p.144 · UoE Part 2 Q4'), A),
  fill('fce-house-5', 'B2', 'The rooms were so small that he couldn\'t stand up in them fully. Eventually, he ____ up moving out because it was so uncomfortable.', ['ended', 'wound'], S('p.144 · UoE Part 2 Q5'), A),
  fill('fce-house-6', 'B2', "However, ____ the house is very small, it's still extremely practical.", ['although', 'though', 'while', 'whilst'], S('p.144 · UoE Part 2 Q6'), A),
  fill('fce-house-7', 'B2', "So, if you're ever in Conwy, why ____ pop in and see it for yourself?", 'not', S('p.144 · UoE Part 2 Q7'), A),
  fill('fce-house-8', 'B1', "It's well worth a visit! And it certainly won't take up too much of ____ time!", 'your', S('p.144 · UoE Part 2 Q8'), A),

  // ── Part 2 — "Volunteering" (p.69) ──
  fill('fce-vol-1', 'B2', 'Whatever your interests, there will be a volunteering role ____ is ideal for you.', ['that', 'which'], S('p.69 · UoE Part 2 Q1'), A),
  fill('fce-vol-2', 'B1', 'If you like animals, why ____ take dogs for a walk at an animal rescue centre?', 'not', S('p.69 · UoE Part 2 Q2'), A),
  fill('fce-vol-4', 'C1', 'Not ____ is volunteering fun, but it can also teach you useful new skills such as team work and problem solving.', 'only', S('p.69 · UoE Part 2 Q4'), A),
  fill('fce-vol-5', 'B2', 'Volunteering can teach you useful new skills ____ as team work and problem solving.', 'such', S('p.69 · UoE Part 2 Q5'), A),
  fill('fce-vol-6', 'B2', 'Another benefit is that you can meet new people who might turn ____ to be good friends too!', 'out', S('p.69 · UoE Part 2 Q6'), A),
  fill('fce-vol-7', 'B2', "It can also develop your confidence as well as your general knowledge, and you'll always have ____ interesting to talk about.", 'something', S('p.69 · UoE Part 2 Q7'), A),
  fill('fce-vol-8', 'B2', 'So, what are you waiting for? ____ volunteering a try!', 'give', S('p.69 · UoE Part 2 Q8'), A),
  fill('fce-baby-1', 'B1', 'Most people think that babysitting is one of ____ easiest jobs available to young people.', 'the', S('p.69 · UoE Part 2 (babysitting) Q1'), A),
  fill('fce-baby-6', 'B1', 'I had decided that a good way to earn some extra cash would be to look for ____ babysitting job, and it didn\'t take long for me to find one.', 'a', S('p.69 · UoE Part 2 (babysitting) Q6'), A),
  fill('fce-baby-9', 'B1', 'I expected to look after perfect children who would behave well and listen to me all ____ time.', 'the', S('p.69 · UoE Part 2 (babysitting) Q9'), A),

  // ── Use of English Part 3 (tạo từ) — "A bus journey" (p.33) ──
  wordform('fce-wf-bus-1', 'B2', 'Sophie was very pleased to find the bus was fairly ____ – a lot cheaper than the train.', 'EXPENSE', 'inexpensive', S('p.33 · UoE Part 3 Q1'), A),
  wordform('fce-wf-bus-2', 'B2', 'The bus felt really ____, with big leather seats.', 'LUXURY', 'luxurious', S('p.33 · UoE Part 3 Q2'), A),
  wordform('fce-wf-bus-3', 'B2', 'The big leather seats were a lot more ____ than the ones on the buses back home.', 'COMFORT', 'comfortable', S('p.33 · UoE Part 3 Q3'), A),
  wordform('fce-wf-bus-4', 'C1', 'Although the train would have been ____ faster, she was looking forward to stopping at the Sunsan Services.', 'CONSIDER', 'considerably', S('p.33 · UoE Part 3 Q4'), A),
  wordform('fce-wf-bus-5', 'B2', 'She was therefore ____ when she could get off and buy some snacks and take some photos.', 'DELIGHT', 'delighted', S('p.33 · UoE Part 3 Q5'), A),
  wordform('fce-wf-bus-6', 'B2', 'She could even ____ some of the places she had seen in the films.', 'IDENTITY', 'identify', S('p.33 · UoE Part 3 Q6'), A),
  wordform('fce-wf-bus-7', 'B2', 'She was glad when the bus started again as she was ____ about getting to Pusan.', 'ENTHUSIASM', 'enthusiastic', S('p.33 · UoE Part 3 Q7'), A),
  wordform('fce-wf-bus-8', 'B2', 'It was 5 hours before they finally arrived, but Sophie had had a ____ time getting there!', 'MARVEL', ['marvellous', 'marvelous'], S('p.33 · UoE Part 3 Q8'), A),

  // ── Part 3 — tiền tố phủ định (p.123) ──
  wordform('fce-wf-neg-1', 'B2', 'You must not ____ your seatbelt until the plane has landed.', 'FASTEN', 'unfasten', S('p.123 · UoE Part 3 · negative prefixes Q1'), A),
  wordform('fce-wf-neg-2', 'B2', "I'm sorry to ____ you, but you haven't passed the test.", 'APPOINT', 'disappoint', S('p.123 · UoE Part 3 · negative prefixes Q2'), A),
  wordform('fce-wf-neg-3', 'B2', 'You must be very careful with the saw. If you ____ it, you could injure yourself.', 'USE', 'misuse', S('p.123 · UoE Part 3 · negative prefixes Q3'), A),
  wordform('fce-wf-neg-4', 'B2', "I couldn't ____ my shoelaces because the knots were too tight.", 'TIE', 'untie', S('p.123 · UoE Part 3 · negative prefixes Q4'), A),
  wordform('fce-wf-neg-5', 'B2', 'My surname is very unusual, which means that many people ____ it.', 'SPELL', 'misspell', S('p.123 · UoE Part 3 · negative prefixes Q5'), A),
  wordform('fce-wf-neg-6', 'B2', 'I saw George at the party an hour ago, but now he seems to have ____.', 'APPEAR', 'disappeared', S('p.123 · UoE Part 3 · negative prefixes Q6'), A),
  wordform('fce-wf-neg-7', 'B2', 'I was so tired that I fell asleep on my bed without getting ____.', 'DRESS', 'undressed', S('p.123 · UoE Part 3 · negative prefixes Q7'), A),
  wordform('fce-wf-neg-8', 'C1', 'We were told that the test was today, but we must have been ____ as we had a normal lesson.', 'INFORM', 'misinformed', S('p.123 · UoE Part 3 · negative prefixes Q8'), A),

  // ── Reading Part 5 (đọc hiểu B2) — mỗi bài chọn 4 câu có đáp án rõ ràng ──
  passage('fce-r5-job', 'B2', 'My first job',
`When I was 16, life seemed so unfair because just about everyone I knew had a weekend job and I didn't. They were lucky enough to have a 'hook up'. That's when someone like your parents, or a friend, gets one for you so you don't have to waste time reading through countless job advertisements. But then one of my mates got a Saturday job as a cleaner in a big hotel down the road from my house, so when there was an opening, I joined her. Now, I know what you're thinking. 'I'm not cleaning for anybody.' I was thinking the same. But it paid the usual hotel rate of £5 an hour and anyway, cleaning couldn't be that difficult, could it?

There was a lot more to the job than you might expect. First, I'd collect my cart from the storeroom and load it with all the supplies I needed – a pile of fresh sheets and towels, as well as toiletries like shampoo and soap. Then I set to work on cleaning the rooms. I made the beds, vacuumed the carpets, cleaned the baths and dusted the furniture. Such was the reality of my very first job. It wasn't particularly fun. In fact, it could be really unpleasant at times, especially at the beginning. The first time I made a bed, I didn't fold the sheets correctly and the manager made me do it all over again. But one of my colleagues showed me exactly what to do and I took notes, just like I did in school. It took ages for me to get it right but when I did, I felt happy and confident, and it wasn't long before I could make a bed in no time at all!

The guests were mostly pleasant and I even learned new words in a few different languages by speaking to some of them. However, on a few occasions, they would get annoyed because they had returned to their room to find me there cleaning it. Then there were a few guests who left stuff like empty pizza boxes and clothing on the floor, making it just about impossible for me to do any cleaning at all. But the worst thing was when we lost clothes guests had asked to be dry cleaned – occasionally I'd forget to put a ticket on an item, and it would simply disappear!

Although it wasn't well paid, the job enabled me to party with my friends and keep my mobile phone in credit. It wasn't just the money that made it all worthwhile. For the first time I was able to spend time with adults other than my parents and teachers. I had always thought that it would be difficult to get on with them, but as long as I was willing to work as hard as them, we all got on fine. They didn't have any authority over me either – we were all the same – pushing the same carts and cleaning the same number of rooms. And if I didn't want to do the work, these grown-ups wouldn't try to twist my arm. They wouldn't yell at me or punish me, it was up to me to motivate myself. That was one very important lesson for me to learn and one I never got taught in school.`,
    [["What best describes Jenny's feelings in the first paragraph?", ['She had assumed finding a job would be easy.', 'She envied people she knew who already had jobs.', 'She was unwilling to find a job.', 'She was surprised at the number of job opportunities available.'], 'B'],
     ["What do we learn about Jenny's job in the first two paragraphs?", ['It was better paid than she expected.', 'It was easy to do.', 'It took a long time to complete each task.', 'It was more challenging than she thought it would be.'], 'D'],
     ["What best describes Jenny's relationship with her colleagues?", ['She felt she had little in common with them.', 'She felt that she was expected to do more work than them.', 'She felt that they treated her as an equal.', 'She felt they worked harder than she did.'], 'C'],
     ["What does 'twist my arm' mean in the last paragraph?", ['try to prevent me from doing something', "persuade me to do something I don't want to do", "pretend to agree with me when they don't", "threaten to hurt me if I don't agree to do something"], 'B']],
    S("pp.64–65 · Reading Part 5"), A),

  passage('fce-r5-tech', 'B2', 'Our month in a tech-free house',
`It's dinner time in the Green household, a family of four from Melbourne, Australia. Susan Green sets the table, as her husband Michael and two children emerge from the kitchen with dishes of food. As the family take their seats at the table, an awkward silence descends. 14-year-old Carolyn plays restlessly with a fork, while 16-year-old Billy frowns at the dish of broccoli in front of him. Meanwhile, Michael reaches absently for an object that isn't there, an unmistakable look of disappointment on his face. In this typical family scene, one thing is missing. There is not a single mobile phone on the table or anywhere in the room. The Greens are experiencing their first evening without electronic devices, as part of a month-long experiment to see if going without technology will make them a happier family.

The use of electronic devices has increased dramatically over the past 10 years, and recent studies suggest that they may be responsible for decreased levels of happiness. Susan Green had noticed these worrying tendencies in her own family. 'I was aware of the obvious dangers to teenagers who spend too much time online,' she says. 'I was regularly telling Billy to turn off his game and go and get some fresh air, or Carolyn to stop chatting with her friends and get some sleep. That's just a normal part of family life today. What worried me more is that their constant mobile phone use was affecting their social interactions. Even when they invited their friends over, I would find them all sitting together looking at their phones and not talking!'

Susan's concerns prompted her to carry out her own research into the issue. When she came across an article in a weekend newspaper about people who gave up using electronic devices for a month, she was keen to try it with her own family. However, she realised that it was going to take more than reading an article to persuade them. 'I found some of the research mentioned in the article very worrying, particularly the increased risks of anxiety and depression in young people, but I doubted that my family would be convinced,' she says. 'But I wanted to avoid financial rewards, as they felt a bit too individualistic.' In the end, the promise of a fun family day out at a theme park persuaded the Greens to go tech-free for a whole month.

The Green family's experiment is now over, but they have made a commitment to try and stick to some of the principles that they established during their tech-free month. 'Mobile phones and tablets are strictly banned during mealtimes,' says Michael. 'And we have agreed to have a tech-free weekend activity each week, where we all leave our phones at home.' Susan feels delighted with the results of the experiment and is certain that it helped her to achieve her aim of improving her family's happiness. 'We now devote more time to one another than we did when we used to spend every waking hour glued to our screens,' she says.`,
    [['What does the first paragraph suggest about the Green family?', ["They don't normally have dinner together.", 'They prefer to be quiet during mealtimes.', 'They often complain about their food.', 'They normally use their phones during mealtimes.'], 'D'],
     ["Why was Susan Green worried about her children's use of electronic devices?", ['They were going to bed later than usual.', 'They had stopped spending time with their friends.', 'Their relationships with other people had changed.', 'They were not spending enough time outside.'], 'C'],
     ["How did Susan convince her family to go 'tech-free' for a month?", ['by getting them to read an article on the subject', 'by giving them money', 'by trying to scare them', 'by arranging an activity for them'], 'D'],
     ['Which of the following is true about the Green family after the experiment?', ['They no longer use mobile phones at home.', 'They are very happy to have their phones back.', 'They regularly do some activities without their phones.', 'They always leave their phones at home when they go out.'], 'C']],
    S('pp.97–98 · Reading Part 5'), A),

  passage('fce-r5-stuff', 'B2', 'I got rid of nearly everything I owned!',
`When the people first came round they were all sitting around drinking tea nervously and occasionally glancing at the cupboards. I didn't like the atmosphere and found the whole situation unsettling. I was beginning to wonder why I had asked these people round to go through my stuff and take what they wanted. Then my sister Louise arrived at the door. Without putting down her bag or saying hello, she headed for the bedroom, determination on her face. She couldn't get there quick enough. 'I knew she'd be the competition!' cried my friend Rosa, jumping off the sofa and heading in the same direction. This is what happens when you open your home to friends, family and neighbours, telling them they can help themselves to everything within it. Moments later, Rosa and Louise reappeared with armfuls of clothes and pot plants. I was surprised that they hadn't taken the whole lot.

Last month, I moved abroad for two years to study, taking just a single suitcase with me. I couldn't afford to keep my flat, so when it came to my possessions, extreme measures were called for. Some of my stuff, like old novels and pairs of jeans, I could cope with giving away. But there was a list of things like precious paintings and my childhood teddy bear that I couldn't bring myself to let go. I just wasn't up to that. So, I decided to offer these things up for long-term loan. It's not recycling, or even freecycling: I'm calling it 'sharecycling'. It was my beloved tent that formed the premise of it. I made the decision as I thought about the pointlessness of putting stuff into storage for two years. Instead, I imagined someone I loved putting my tent onto their back and setting off into the countryside in the summer sunshine. I was moving to the other side of the world, but this made it feel as though I would still, in some small way, be with my friends. And once I'd come up with the idea, it just grew and grew. I decided to give away everything – the plants on the balcony, the computer games, the chairs, even the towels in the bathroom.

To get rid of it all, I had an open house, inviting everyone I knew to take my belongings. 'This is just like supervised stealing!' said one friend, as she loaded books by the handful into a carrier bag. I became like a sales assistant. I recommended novels, waved toys at babies, and brought out coats and jeans for people to try on.

Now I am sitting in a flat on the other side of the world as the last of the monsoon rains pour down outside, turning the pavements into mud and sending the street sellers sheltering under doorways and umbrellas. I feel very far from my home, and from my stuff. That list I made of the things I want back? I'm not sure how much I'll need it. So far, I haven't missed any of my pictures, or that strange purse shaped like a mouse which I've had since I was seven years old. Instead, I've missed my family, my friends, and my city.

And my 'sharecycling' plan ties me back to them. A friend took my tent to a music festival. And my favourite picture ended up on the wall of my best friend's flat back home. This is what gives me a real buzz: the thought of all my bits and pieces in my friends' lives, a physical reminder of our ties. It's like I've pressed 'pause' on my city life rather than 'stop', making the move easier. It shows I'm not ready to travel around the world forever with just a laptop.`,
    [["What best describes Eva's feelings in the first paragraph?", ['She felt happy that her guests were enjoying themselves.', 'She felt uncomfortable at first.', 'She wanted her guests to leave as quickly as possible.', 'She felt she was expected to do too much for her guests.'], 'B'],
     ["What does 'unsettling' mean in the first paragraph?", ['worrying', 'comforting', 'exciting', 'surprising'], 'A'],
     ["What is meant by 'a real buzz' in the final paragraph?", ['an interesting topic of conversation', 'a low, continuous sound', 'a sudden memory from a long time ago', 'a strong feeling of excitement'], 'D'],
     ["What best describes Eva's experience of giving away her things?", ['It was enjoyable but she will be glad to get them back.', 'It was a lot harder to do than she expected.', 'It made her value people more than things.', 'She was surprised at how strange it felt.'], 'C']],
    S('pp.108–109 · Reading Part 5'), A),
];
