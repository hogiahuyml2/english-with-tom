import requests,json,time,sys,warnings,re
warnings.filterwarnings('ignore')
H={'User-Agent':'EWT-reading/1.0 (education; contact hogiahuyml2@gmail.com)'}
SIMPLE="""Cat Dog Apple Banana Milk Bread Rice Egg Tea Coffee Pizza Water Sun Moon Rain Snow Football Tennis Bicycle School Family Birthday Christmas Rabbit Horse Cow Fish Bird Tree Flower Rose Pencil Book Clock Bus Train Car House Kitchen Garden Doctor Teacher Farmer Spring Summer Autumn Winter Breakfast Lunch Dinner Hospital Library Market Restaurant Airport Beach Mountain River Lake Forest Desert Island Elephant Lion Tiger Monkey Penguin Dolphin Bee Butterfly Chocolate Cheese Honey Orange Potato Tomato Carrot Pasta Sandwich Ice_cream Music Piano Guitar Painting Photograph Telephone Television Computer Internet Robot Airplane Ship Bridge Castle Museum Zoo Circus Swimming Cycling Running Basketball Volleyball Chess Cooking Camping Fishing Gardening Shopping Money Time Calendar Colour Rainbow Weather Wind Fire Earth Planet Star Volcano Earthquake Recycling Glass Paper Plastic Wool Cotton Silk Bamboo Sleep Dream Exercise Vitamin Tooth Heart Brain Eye Ear Hand""".split()
EN="""Sleep Memory Urbanization Renewable_energy Biodiversity Globalization Placebo Cognitive_bias Inflation Printing_press Industrial_Revolution Great_Barrier_Reef Artificial_intelligence Time_management Microplastics Minimalism Circular_economy Social_media Coral_bleaching Solar_power Wind_power Electric_car Public_transport Remote_work Sustainable_development Climate_change_adaptation Water_scarcity Deforestation Ocean_acidification Antibiotic_resistance Vaccination Mental_health Meditation Nutrition Obesity Sedentary_lifestyle Bilingualism Language_acquisition Critical_thinking Learning_styles Gamification Open-plan_office Tourism Overtourism Cultural_heritage Museum Architecture Gothic_architecture Renaissance Silk_Road Panama_Canal Suez_Canal Transcontinental_railroad Space_exploration Apollo_11 International_Space_Station Mars Black_hole Photosynthesis Plate_tectonics Tsunami Hurricane Monsoon Great_Wall_of_China Machu_Picchu Petra Venice Amsterdam Tokyo Singapore Marathon Olympic_Games Chess Jazz Impressionism Cinema_of_India Bollywood Coffee Tea Chocolate Cheese Sushi Fast_food Veganism Fair_trade Minimum_wage Unemployment Entrepreneurship Supply_and_demand Cryptocurrency Cybersecurity Privacy Digital_divide E-commerce""".split()
out={}
def fetch(host,title):
    r=requests.get('https://%s.wikipedia.org/w/api.php'%host,params={'action':'query','prop':'extracts|info','explaintext':1,'redirects':1,'titles':title.replace('_',' '),'format':'json','inprop':'url'},headers=H,timeout=30)
    pg=list(r.json()['query']['pages'].values())[0]
    return {'title':pg.get('title'),'url':pg.get('fullurl'),'text':pg.get('extract','')}
for host,lst in (('simple',SIMPLE),('en',EN)):
    for t in lst:
        try:
            d=fetch(host,t)
            if len(d['text'])>200: out[host+':'+t]=d
        except Exception as e: print('ERR',host,t,e,file=sys.stderr)
        time.sleep(0.15)
    print(host,len(out),file=sys.stderr)
json.dump(out,open('/tmp/ewt-read/wiki_raw.json','w'),ensure_ascii=False)
