---
layout: post
title:  "food maps"
author: agnes cameron
date:  2025-01-20
description: scraping a knowledge graph of dishes from wikipedia
tags: food, ontologies
status: published
image: '/img/dishes/graph-section.png'
---

This is a write-up of a small tool that scrapes a graph of related dishes, according to the see also section of Wikipedia. I made it a couple of years ago for a project with the Knowledge Futures Group, along with [Favour Kelvin](https://favourkelvin17.medium.com/), who was doing an internship with us at the time. I've revisited it a couple of times since, including re-doing the seeding stage and improving the filtering. The code for this project is [here](https://github.com/agnescameron/related-dishes), which also contains a [JSON dump](https://github.com/agnescameron/related-dishes/blob/master/export.json) of the graph that you can import into a [neo4j](https://neo4j.com/) instance at home.

<figure class="fullwidth">
	<img src="{{ '/img/dishes/graph-section-dishes.png' | prepend: site.baseurl }}" alt="main"/>
	<span class="mainnote">a small section of linked dishes in the graph, including clusters of stuffed pastries and noodle soups, fading into sandwiches and stews</span>
</figure>


## dishes vs recipes

<span class="marginnote">
	<img src="{{ '/img/dishes/flavour-map.jpg' | prepend: site.baseurl }}" alt="vegetation health"/>a spatial map of flavours (source unknown)
</span>

This project came out of a piece of consulting work around the design of 'expert coding languages' for cooking -- the idea that, instead of being discrete entities, recipes were more like paths to particular points in a larger latent space<label for="dishrecipe" class="margin-toggle sidenote-number"></label><span class="sidenote" id="dishrecipe">a term from machine learning, 'latent space' could be paraphrased as a high dimensional 'space of possibility', within which certain points are known, but assumed to be contained within a much larger continuous space. For example -- what transformations separate a chewy cookie from a crumbly one? and what's in the middle?</span>. By changing aspects of the recipe -- cooking time, amount of butter, temperature -- you could end up in a different point in the space, and by the same token you could work backward. During the research stages of the project I got very interested in different ontologies for food (I've written about this collection [here](https://www.are.na/editorial/on-food-ontologies)).

Part of the reason I like these is there's something very deeply subjective about them -- which gets interesting as soon as you start to try and do things with computers. In the end, the project itself became already-too-vast even within the smaller use-case, though I think the idea is still pretty interesting.

As well as collecting ontologies (and getting obsessed with [industrial food texture modification manuals](/2022/08/05/soft-bread.html)), I started to sketch out my own maps. I found this idea of a continuous latent space of food (just change the dials and you change the recipe into something inbetween) both deeply exciting, and also lacking.<label for="metafont" class="margin-toggle sidenote-number"></label><span class="sidenote" id="metafont">In the years since this project, I came across a really beautiful exploration of this tension (within the context of fonts!) in Douglas Hofstader's fantastic essay <a href="https://library.agnescameron.info/artificial%20intelligence/Metafont,%20Metamathematics,%20and%20Metaphysics,%20Douglas%20Hofstader%20(1982).pdf">Metafont, Metamathematics and Metaphysics</a></span>

I thought dishes did a good job of articulating this issue: discrete *things* that couldn't be easily faded between in a continuous manner. After all, what does it mean to mark a point halfway between a blood sausage and a kimchi stew? Below is an early sketch of a schema trying to map out these different culinary relationships:

<figure>
	<img src="{{ '/img/dishes/food-space.png' | prepend: site.baseurl }}" alt="main"/>
</figure>

It felt important to have 'dish' be distinct from 'recipe'. I think of a recipe as an instance of an instruction-set, that captures *how* to make a dish (named or unnamed)<label for="dishrecipe" class="margin-toggle sidenote-number"></label><span class="sidenote" id="dishrecipe">I feel like there's also a continuum of how 'dish-like' a recipe is -- though even recipes which don't start out pointing to dishes can do, like drunk sandwiches that acquire a name after being perfected</span>, while a dish is a concept, free to associate with other entites. A graph of dishes deals with overlapping but distinct: what other dishes, cuisines, holidays, meals, events, people, places or other practices are associated with this dish? What dishes exist in the world? How is a dish described?

The answer to the last question is surprisingly sticky if you don't count recipes as a description of a dish, and it made me think about the way we articulate dishes in terms of their relationships to other foods (which I think is more broadly about being able to express something most succinctly in terms of a shared experience). It's certainly not a complete description and it's also highly subjective -- but moreso than most I think descriptions of dishes are necessarily subjective, unlike an instance of a recipe, which can also be precise.

Wikipedia's 'see also' section felt like a good place to start with this as it's so ambiguous, and there are no hard rules -- things can be related as they have similar ingredients, a similar form factor and/or textural qualities, or are made using a similar process -- it seems like editors mostly go on vibe.

## the scraper

<span class="marginnote">
	<img src="{{ '/img/dishes/crawler_screenshot.png' | prepend: site.baseurl }}" alt="vegetation health"/>the crawler (affectionately known as 'the worm') crawling through recipes
</span>

The scraper starts on a page for a particular dish, and extracts links from the 'See Also' section, which contains links to other pages the editor thinks are related. These pages might be other dishes (we want these!) but could also be random things. For example, here's the See Also section for [Borscht](https://en.wikipedia.org/wiki/Borscht):

<figure>
	<img src="{{ '/img/dishes/borscht-see-also.png' | prepend: site.baseurl }}" alt="main"/>
</figure>

We want our crawler to visit [shchi](https://en.wikipedia.org/wiki/Shchi) and [cabbage soup](https://en.wikipedia.org/wiki/Cabbage_soup), as these are both dishes, but we want it to skip the other links<label for="grandsoup" class="margin-toggle sidenote-number"></label> <input id="grandsoup" class="margin-toggle"/><span class="sidenote">though I'm really taken with the strangely unpatriotic <a href="https://en.wikipedia.org/wiki/Three_grand_soups">three grand soups</a></span> 

To decide which pages we are interested in knowing more about, the crawler goes through each link in the 'See Also' section of the page fetches all the categories that the page belongs to. If none of the category titles contain the any of the words 'dishes', 'bread', 'dessert', 'pudding', 'pastries' (pluralised because of the way categories are worded<label for="swedish" class="margin-toggle sidenote-number"></label> <input id="swedish" class="margin-toggle"/><span class="sidenote">Initially I actually used the singular 'dish' but then had the issue of collecting multiple pages with categories containing the word 'Swedish', which also has 'dish' as a substring, and had to kill the crawler as it attempted to index every member of Sweden's parliament... (second footnote -- I wrote the original tool before learning regular expressions)</span>) then the page is skipped as it's probably *not* primarily a page about a food. If the page does seem to be a dish, then the scraper creates a relationship between it and the page it was linked from, and adds it to a list of pages to crawl next. For example, here are the categories for shchi:

<figure>
	<img src="{{ '/img/dishes/schchi-categories.png' | prepend: site.baseurl }}" alt="main"/>
</figure>

When a page is crawled, or if it's found to contain no relevant categories, it's added to an array of pages to skip, as it's already been scraped. Eventually, the crawler runs out of paths its already been down, and grinds to a halt (current endpoint, itself very funny, is [Jubilee chicken](https://en.wikipedia.org/wiki/Jubilee_chicken))

The crawler also scrapes the categories associated with the page it's crawling, and adds them to the graph too. This is nice later on, as you get to see which categories have the most overlap in terms of dishes.

### seeding

<span class="marginnote">
	<img src="{{ '/img/dishes/national_dishes.png' | prepend: site.baseurl }}" alt="vegetation health"/>the wikipedia list of national dishes
</span>

In order to crawl a good section of the graph, we had to come up with a set of 'seed dishes' that would spread the crawler initially over a range of different cuisines and types of food, rather than just trying to go from a single start point. To get a good range of cuisines, we started with the [Wikipedia Category of National Dishes](https://en.wikipedia.org/wiki/Category:National_dishes), plus a set of random links from [List of Desserts](https://en.wikipedia.org/wiki/List_of_desserts) to balance a bias in national dishes toward savory foods. (I might have over-compensated for this, however, as the final graph ended up quite dessert-y).

### filtering unhelpful categories

I wanted to include a broader range of categories in the graph than was used to filter pages -- e.g. a page probably doesn't contain a dish if it doesn't belong to any categories containing the word 'dish', but there might be categories relevant to its culinary qualities (like 'pickle', 'pastry', 'cookie') that still contain useful information for clustering. As such, the filtering involved iteratively picking out terms common to 'wikipedia metadata' and other less useful categories.

### limitations

There are a number of obvious limitations to this -- namely, this is only working on english-language Wikipedia, which probably has regional biases as to what dishes (and links *between* dishes) are included. There's also the major issue that links in the main text don't get included in See Also -- potentially missing loads of important links. It's also not certain whether this method gets all the pages marked 'dish' -- I haven't come up with a good metric to determine what proportion of 'dish' articles are successfully indexed by the crawler, because there's no singular category 'dish' on Wikipedia. I think the way to do this would be something like:

* filter all categories by the category criteria used
* for each of these categories, get the list of [categoryMembers](https://pypi.org/project/Wikipedia-API/)
* remove duplicates and count, potentially use this to seed the next round

I've also been fairly un-systematic with the script -- earlier versions allowed pages that belonged to categories involving 'bread', which I took out as there were a lot of bready pages that weren't really dishes, but am now considering putting back in. (cake is also another possibility)

## exploring the data

The Python script dumps all the relationships between pages and categories into a big Neo4j graph database instance, using the `py-neo4j` package. Dishes that are linked to one another are defined by an `isRelatedTo` link -- and links from dishes to categories by `hasCategory`. The only node types are `Dish` and `Category`. Here's a small subsection of the network, showing dishes and categories linked to pho and adjacent soups:

<figure>
	<img src="{{ '/img/dishes/pho.png' | prepend: site.baseurl }}" alt="main"/>
</figure>


I found Neo4j's desktop tool initially quite clunky, but after a while began to enjoy playing around with the data. Here's a query in their Cypher query language that maps out a path (travelling only by related dishes, not categories) from Hummus to Turducken.<label for="whystar" class="margin-toggle sidenote-number"></label><span class="sidenote" id="whystar">the lack of arrows around the -[:isRelatedTo*]- part of the query is to allow the arrows to be taken in either direction: if you insist on them being unidirectional, the graph gets much harder to traverse, as not all pages that link a dish in the 'see also' section are linked back by it... in a way this is also a fun separate analysis to run</span>

```
match p=shortestPath( (k:Dish {name: "Pizza"})-[:isRelatedTo*]-(a:Dish {name: "Banana cake"}) ) return p
```

And here is the resultant graph. Note the 'offal corridor'<label for="offal" class="margin-toggle sidenote-number"></label> of associations leading us through staple dishes into stuffed monstrosoties:

<span class="sidenote" id="offal">
	<img src="{{ '/img/dishes/stomach.png' | prepend: site.baseurl }}" alt="vegetation health"/>
</span>


<figure>
	<img src="{{ '/img/dishes/hummus-turducken.png' | prepend: site.baseurl }}" alt="main"/>
</figure>


Here's another, from Banana Cake to Lavash:

<figure>
	<img src="{{ '/img/dishes/banana-lavash.png' | prepend: site.baseurl }}" alt="main"/>
</figure>

<span class="marginnote">
	<img src="{{ '/img/dishes/halo-halo.png' | prepend: site.baseurl }}" alt="vegetation health"/>a tightly related cluster around halo-halo
</span>

One thing I like about this is the train of associations: they flip between flavour, technique, form, cuisine and culture, forming loose chains of association. You start to see the same 'nodal' pages a lot that bridge between different form factors of food -- [Khachapuri](https://en.wikipedia.org/wiki/Khachapuri), for example, provides an important bridge between stuffed dishes and flatbreads. Another common node that acts as a cultural bridge is fusion cuisine, for example the Hawaiian noodle dish [Saimin](https://en.wikipedia.org/wiki/Saimin) crops up a lot in chains between European and East Asian cuisines.

You also develop a sense for parts of Wikipedia where the dishes are highly clustered -- like this tight-knit group around [Halo-Halo](https://en.wikipedia.org/wiki/Halo-halo), or within Indonesian cuisine, itself maybe an articulation of the great degree of mixing and cross-influence within e.g. east asian desserts.

Because the categories are also scraped, you can do nice things like this:

```
match (n:Dish)-[r:hasCategory]->(c where lower(c.name) contains "pastries")
return n
```

This gets all the dishes that have a category name containing the string 'pastries', and threads them together. It's so big! I thought it was nice to put the whole thing laid out (there's more writing after).

<figure class="fullwidth">
	<img src="{{ '/img/dishes/pastry-graph.png' | prepend: site.baseurl }}" alt="main"/>
</figure>

<!-- <span class="marginnote">
	<img src="{{ '/img/dishes/french.png' | prepend: site.baseurl }}" alt="vegetation health"/>obsessed with the french separatist pastry corner
</span>
 -->
I really like seeing which things get connected (and by what!) and which are left unconnected, or small islands at the edge of the graph (like the French separatist patisserie corner! macaron -> petits fours).

## getting from A to B

<span class="marginnote">
	<img src="{{ '/img/dishes/gunkel_foodstuffs.jpg' | prepend: site.baseurl }}" alt="vegetation health"/>a small version of Patrick Gunkel's <i>An Idea Tree</i> (<a href="https://d2w9rnfcy7mm78.cloudfront.net/11943271/original_6623d9e3186d998f66f3566d274f83b7.jpg?1620932343?bc=0">full size here</a>)
</span>


A big influence on this project is the work of [Patrick Gunkel](http://ideonomy.mit.edu/), founder and core proponent of the field of _ideonomy_-- the science of ideas. Many years ago my friend SJ introduced me to Gunkel's work, via the masterpiece *'An Idea Tree'* (small version right), which takes the initial idea of allanto (sausage-like) foods, andd follows multiple 'hints' and 'interpretations' to theorise, for example, the appearence of mochi ice cream some decades before its introduction into Gunkel's native Texas.

This tree of sausage-inspired innovation follows a surprisingly similar set of jumps to the map of dishes, albeit with the latter feeling less self-consciously 'innovative'. The forking, folding path -- the 'staple' hint, the 'deep frying' hint -- unfolds layers of different ideas and techniques that have built up between cuisines over time.

<figure>
	<img src="{{ '/img/dishes/beauties-gunkel.jpg' | prepend: site.baseurl }}" alt="main"/>
</figure>

I'm a big admirer of Gunkel's broader work for his interest in applying extraordinarily thorough, scientific and detailed methods to further the understanding of fleeting, subjective and slippery ideas. His articulations don't pin them down, so much as flesh them out -- expanding their descriptive possibilities by searching for many definitions within them. It's a form of inquiry that feels genuinely *inquisitive*, and is also extremely funny -- a couple of my other favourites are his map of mutual analogousness of ['Examples and Sources of Beauty'](https://ideonomy.mit.edu/scanned-charts/pic044.html), and another tree ['Illusions re: A Stone'](https://d2w9rnfcy7mm78.cloudfront.net/33837629/original_ed5eb0ea5fb755ee2426593e579d45a8.jpg?1737415310?bc=0).

<!-- ## trying some more complex queries

### addendum: graphcommons image graveyard

When I first sat down to write this tool up (in 2022!) I used a site called [graphcommons](https://graphcommons.com/) to host it online. While it still exists, all my old graphs were wiped and there's now a limit of 500 nodes in the free plan (way too few even just to host the dishes, let alone the categories!). So -- no graphcommons, but I've added the screenshots I got at the time for posterity. I remember it being really user-friendly and it had some great clustering tools! (iirc it was also a big pain to export the Neo4j data in the right format...)

I wish I'd taken better notes of the things I'd found! I remember it being really fun to try out different clustering algorithms and see how things got grouped together by category. Here's a screenshot of the 'flatbread' cluster, bordering the 'stuffed cluster' (hello, khachapuri!).
 -->
