---
layout: post
title:  permaculture network
date:  2020-05-27
description: on goats and real/virtual ecologies
tags: automata, permaculture, sakiya
status: published
image: 'img/permaculture/full-sim.png'
---

This is a long-overdue writeup of a project that [Gary](http://zhexi.info/) and I worked on last summer, as part of a Schloss Solitude Web Residency [*Rigged Systems*](https://schloss-post.com/category/web-residents/rigged-systems/), curated by Jonas Lund. Parts of this are adapted from answers to questions that different people have asked about the project<label for="different-people" class="margin-toggle sidenote-number"></label><input id="different-people" class="margin-toggle"/><span class="sidenote">thanks, <a href="https://callil.com/">Callil</a>, and to Denise Sumi for [interviewing us](https://schloss-post.com/flora-fauna-and-folk-tales/). If you'd like to read some other writing about this piece, it was recently covered by Daphne Dragona for Transmediale's 2020 print publication, which you can download as a pdf [here](https://networkcultures.org/blog/publication/the-eternal-network/)</span>, and parts are new. An are.na channel for this project exists [here](https://www.are.na/agnes-cameron/permaculture-network), and the code is open-sourced [here](https://github.com/rokeby/permaculture). The simulation itself is online [here](http://root.schloss-post.com/).

<figure class="fullwidth">
	<img src="{{ '/img/permaculture/full-sim.png' | prepend: site.baseurl }}" alt="main"/>
	<span class="mainnote">A full view of the simulation</span>
</figure>

*Permaculture Network* is an agent-based simulation, a 'zero-player' game that was made while we were resident at [Sakiya](https://sakiya.org), an art, science and agriculture institution based in the village of Ein Qinniya, Palestine. The project came about in part because we were thinking a lot about alternative representations of land, particularly from the perspective of data-gathering. Sakiya exists on Area C land in the west bank, which Palestinians aren't allowed to build on (but which is frequently seized by Israeli settlers). One of the main routes by which land in the area is colonised in this way is through data collection: from the British Mandate to the current occupation, there’s a direct correlation between measurement of the land and its qualities and its subsequent requisitioning from Palestinian hands.

<span class="marginnote">
	<img src="{{ '/img/permaculture/aerial.png' | prepend: site.baseurl }}" alt="sakiya aerial view"/>a topographical view of Sakiya's site, which is mimicked by the view of the simulation
</span>

Initially, this project was to be the front-end for a set of networked soil sensors on the site, as setting up local soil quality monitoring has been on Sakiya's roadmap for a little while. Our intention was to find a way to give an feeling of the landscape changing over time and seasons for people external to the site, while the back-end -- only accessible to people managing the site -- would allow for direct data-gathering, and generate reports about how different parts of the permaculture farm were faring. In the end, we didn't have the equipment to set these sensors up permeanently, though we're hoping to do so in the future. More about how they'll be integrated lower down.

### technical details

The simulation explores the ecology of Sakiya through imagined conversations between plants, animals, soil, water, weather, and other human and non-human agents. The nature of these conversations is based loosely on the idea of permaculture 'guilds': plants that, when grown together, provide mutual benefit to one another. In as much as was possible, we tried very hard to re-create the actual ecology found on the site. Almost all of the agro-ecological information about the site: the soils, geology, and plant life, comes from a survey of Sakiya by agroecologist Omar Tesdell, and his team at [Makaneyyat](https://makaneyyat.org/en/).

**simulation layers**

The simulation is built around many 'layers' that can co-exist in one of the cells in the simulation grid. The background colours you can see denote the different land types present on the site (you can see this at the top when you click on a square: ‘a rocky outcrop’ ‘a wild meadow’ etc). These types compose the 'bottom layer' of the simulation, and are in the same place each time. They are generated from a JSON array which determines the 'substrate type' type for each co-ordinate, itself generated from a Python script that takes in a `.bmp` sketch of how the landscape should look, then outputs a co-ordinate map.

In hindsight, it would have been easy enough to automate this bitmap-generating process by re-writing the python script in Node, allowing the topography of the site to be manipulated much more readily, and to make it easier to adapt to different landscapes.

On top of these substrate types, soils and rocks, then plants, and finally animals, are spawned with a probability that depends on the properties of each land type, and the layers that already exist underneath. These form the 'layers' of the simulation. After the initial generation step, nothing moves apart from the animals, though in the future it would be interesting to see plants grow, die and take over one anothers' cells over a period of time.

<span class="marginnote">
	<img src="{{ '/img/permaculture/5-zone.png' | prepend: site.baseurl }}" style="width: 100%;" alt="bitmap of substrates"/>the bitmap from which the 'substrate map' is created
</span>

<span class="marginnote">
	<img src="{{ '/img/permaculture/substrates.png' | prepend: site.baseurl }}" alt="generated substrates" />the substrates generated from the co-ordinate map by the simulation
</span>

Soil and rocks are distributed according to some probability of walking onto that area and finding that soil. So — in the ‘rocky outcrop’ you mostly get limestone and dolomite, but the ‘wild meadow’ gets terra rossa, and a bit of clay. Plants are then spawned on different soil substrates with a probability according to the kind of soil they like to be on.

<span class="marginnote">
	<img src="{{ '/img/permaculture/goat-tracking.png' | prepend: site.baseurl }}" alt="generated substrates" />tracking where the goats have been during the debugging phase
</span>

Animals are restricted to the kinds of places you tend to find them: the humans mostly hang out on the path or the terraces, while the goats get everywhere. Herding the goats proved somewhat challenging (as in real life): eventually we settled on having them move slowly downhill and out of shot. Perhaps corralling them around the spring and then dispersing them again would have been more realistic.

**cells**

The aesthetic of the simulation borrows heavily from [dwarf fortress](http://www.bay12games.com/dwarves/), using ascii characters to represent different entities in the game. Whatever you see is the entity on the top layer of that cell at any given time, though if you click it brings up everything that's there.

For the animals and humans, we used the chinese characters, because of their pictograhpic appearence, largely due to '羊' (goats).

**entities**

Entities in the game (plants, animals, soils), are all defined in a set of large JSON arrays, which store their properties: one of plants, one of animals + humans, one of soil/rock types. One of the restrictions we had was that Schloss-Post only gives its residents static hosting, though in hindsight we should probably just have paid for our own servers (or auto-generated these locally), and it's something we'd definitely do for a second iteration.


```
"goat":{
	"name": "damascus goat",
	"zones": [1, 2, 3, 4, 5, 6],
	"number": 30,
	"arabic": "ماعز دمشقي",
	"latin": 'capra aegagrus hircus',
	"symbol": '羊',
	"shades": ['#ffffcc', '#ffcc66', '#cc9900'],
	"personality": "friendly",
	"speech": 'hello hello',
	"type": "grazer"
},
```

The plants have some probabilty of appearing on each substrate type, and also on each rock, based on the kind of environments they're found in, and the soil they like to grow on. These then get fed into a constructor, which makes a new entity for each square, along with space for thoughts and companions to be created as the simulation progresses.


**the simulation loop**

<span class="marginnote">
	<img src="{{ '/img/permaculture/goats.jpg' | prepend: site.baseurl }}" alt="generated substrates" />the goats (and goatherders) under the ancient oak tree
</span>


<span class="marginnote">
	<img src="{{ '/img/permaculture/antar.jpg' | prepend: site.baseurl }}" alt="generated substrates" />one of the site's cats, <i>Antar</i> (<span lang="ar" dir="rtl">عنترة</span>), named for the legendary knight <a href="https://en.wikipedia.org/wiki/Antarah_ibn_Shaddad">Antar Ibn-Shabbad</a>
</span>

The simulation clocked on a single cycle that updates every second. Every time it loops a few things happen.

1. every creature in the simulation (bees, goats, boars, people etc) move, if they want to. Most things move randomly over the kind of terrain they’re likely to be found in, apart from the goats which flock from one side to another (the site is blessed with a flock of 200 goats that come down the hill a few times a week). 

2. after everyone has moved, the ‘narrative’ aspect of the simulation updates, and conversations are generated first between new neighbours, and 100 agents randomly chosen from the grid

**narrative generation**

The narrative can be generated in two ways: the first and most direct is when an event occurs — at the moment, that’s just when an animal moves from square to square. When an animal enters a square, this initiates a call-and-response occurs between the animal, and the agent that’s on the top of the square (e.g. if there’s a plant then a plant, otherwise a rock or soil).

The second form of narrative generation happens at random every tick: 100 or so agents are selected, and another agent chosen at random from the 9x9 square surrounding them. If the agent is a plant, and a ‘companion plant’ (in a permaculture guilds sense) is located in this square, then that is chosen with priority. At that point, just as before, an exchange occurs between the randomly selected plant and its neighbour, depending again on personality and relationship. To see the companion plants, you can click on a plant (easiest to do this in the brown ‘terrace’ area as things there are planted in guilds anyway) and the information box should show you the list of nearby companions.

There’s a matrix that maps the kind of interactions different agent types will have with one another: for example, when goats speak to crops or legumes (or really any plant apart from the shrubs, which are spiny and annoying), they will express love and appreciation. This is not reciprocated by the plant (which doesn’t want to be eaten), which will respond with either fear or annoyance, depending on the likelihood of being eaten vs just trodden on. 


```
{
	"senderType": "tree",
	"receiverType": "amphibian",
	"messageType": "curiosity",
},
```

<span class="marginnote">
	<img src="{{ '/img/permaculture/conversation.png' | prepend: site.baseurl }}" alt="showing a whole conversation" />showing a whole conversation
</span>

This matrix, which was just a big JSON object, took a long time to write: with hindsight, it would have been a lot easier to use a database on the backend as a CMS, which I think we'd set up to make this project more modular.

As well as this matrix, each agent has a kind of personality (where we could, these are based on islamic folklore about particular plants): so a friendly agent will express warmth or annoyance differently to how a wise agent would.

Each narrative is expressed in the form of an inner monologue: there are *thoughts*, and then there is *speech*. This also takes a lot of inspiration from dwarf fortress: the append-only approach to character development. Right now these conversations don't really go anywhere or change anything: but it would be really cool to have them change some thing in the interaction, to influence the ecological systems they're seeking to model.

<span class="marginnote">
	<img src="{{ '/img/permaculture/narrative.png' | prepend: site.baseurl }}" alt="showing a whole conversation" />the narrative of black mustard
</span>

```
class Speech {
  constructor(sender, receiver, message, timestamp) {
    this.sender = sender;
    this.receiver = receiver;
    this.message = message;
    this.timestamp = timestamp;
  }  
}


class Thought {
  constructor(thinker, thought, timestamp) {
    this.thinker = thinker;
    this.thought = thought;
    this.timestamp = timestamp;
  }  
}
```

In each case, each entity remembers all the converasations it's had, and also all the thoughts, which get strung together in a narrative.

Additionally, every 10 seconds, the last 'thought' or 'speech' to be appended to a random agent is printed to the screen. In an earlier prototype, it would also print all the surrounding conversations, but the display was a bit hit-and-miss: sometimes it worked really well, sometimes all the blocks overlapped, and just looked quite confusing.

**seasons**

One thing we did was to include the flowering seasons of each plant, so that they would change colour over different months. It was a feature we'd basically forgotten about, then we looked back in April and the whole site had transformed. It was a really wonderful feeling: a slow change you've completely forgotten about.

<figure class="fullwidth">
	<div class="subfig">
		<img src="{{ '/img/permaculture/april.png' | prepend: site.baseurl }}" alt="april"/>
		<span class="mainnote">everything flowering in April</span>
	</div>
	<div class="subfig">
		<img src="{{ '/img/permaculture/full-sim.png' | prepend: site.baseurl }}" alt="august"/>
		<span class="mainnote">by August, everything's back to plain old green</span>
	</div>
</figure>

### future work

There's a lot of bits that could be done to this, and it feels like the most essential ideas are probably completing work on the site (though that feels pretty far off right now), and adding in a back end that could handle all of the information we're currently storing in files.

**integrating other data**

<span class="marginnote">
	<img src="{{ '/img/permaculture/lovelyweather.png' | prepend: site.baseurl }}" alt="generated substrates" /> lovely weather we're having
</span>


One thing we'd been thinking about was to use local weather data to change the state of the simulation: thinking about a game I love by Julian Glander called like [Lovely Weather We're Having](https://glander.itch.io/lovely-weather-were-having), which uses the weather forecast in your location to modulate your experience of the game.


```
function checkPlantComfort(cell, temperature) {
  var tempLevel = getTempLevel(temperature)

  switch (cell.plant.preferredTemp) {

  case("hot"):
    if(tempLevel === "warm") 
    	cell.plant.temperament += 0.2

	else if(tempLevel === "med") 
		cell.plant.temperament -= 0.1

	else cell.plant.temperament -= 0.3
	...
```

One way in which this could work would be to use a 'temperament' variable to skew the sentiments od responses and conversations. A plant that was normally effusive might become less chatty if it wasn't currently experiencing it's preferred temperature... meanwhile a cool, breezy day could really encourage the goats.

<span class="marginnote">
	<img src="{{ '/img/permaculture/weather.png' | prepend: site.baseurl }}" alt="generated substrates" /> the two nearest weather stations to Ein Qiniyya
</span>

Initially, we figured that local weather stations could be a good way to use existing data to model this part of the simulation. However, the location of these weather stations makes the use of this data fraught: in the case of Ein Qiniyya, by looking at station data from [weather underground](https://www.wunderground.com/wundermap?lat=31.928&lon=35.152), the nearest stations are in [Givat Ze'ev](https://en.wikipedia.org/wiki/Giv%27at_Ze%27ev) and [Psagot](https://en.wikipedia.org/wiki/Psagot), both illegal settlements.

It's both inevitable and frustrating that this is the case: after all, it's extremely difficult for Palestinians to get access to this kind of equipment, let alone get it on the map and expect to keep it, and it cements the lack of agency they're able to have over their environment. The work [Forensic Architecture did with Public Lab](https://forensic-architecture.org/investigation/destruction-and-return-in-al-araqib), and the villagers of Al-Araquaib -- a guerilla satellite mapping project involving homemade kites to document the destruction of Bedouin villages, and establish a historical continuity for the Bedouin in that area -- is a great example of trying get necessary information under the radar. So: no weather for now, perhaps next year!

**in other ecosystems**

One thing I thought would be really interesting would be to make a simulation based on a different ecosystem and location -- or even allow people to build their own!

Everything was made pretty quickly so there’s a couple of bits that would need to be teased out (e.g. the goats have their own function), but for the most part it’s quite modular: all of the animals and plants are defined in separate JSON objects, and the background gets made independently too. What I can imagine being nice is some kind of CMS that would allow you to upload information about your local landscape and populate the sim over time.

The other thing we could do with a backend is to have everyone watch the same simulation every day, as opposed to seeing a new one every time you load the page. This would be particularly nice if we could tie things like the light levels to Sakiya's time zone.


