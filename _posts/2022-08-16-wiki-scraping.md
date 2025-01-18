---
layout: post
title:  "wikipedia snack map"
author: agnes cameron
date:  2025-01-16
description: scraping a knowledge graph of dishes
tags: food, ontologies
status: draft
image: 
---

This is a write-up of a small tool that scrapes a graph of relationships between dishes, as defined by English Wikipedia's See Also section. I made it a couple of years ago for a project with the Knowledge Futures Group, along with [Favour Kelvin](https://favourkelvin17.medium.com/), who was doing an internship with us at the time. I've revisited it a couple of times since, including re-doing the seeding stage and adding some more filters for results. The code for this project is [here](https://github.com/agnescameron/related-dishes), and I also published browsable versions of the dish graph [with](https://graphcommons.com/graphs/1339108d-ac64-4cd6-b960-8b6605623ffa) (note -- this one is much slower) and [without](https://graphcommons.com/graphs/3d5ed7d2-1940-47c0-8a4b-64f519562b09) categories on [GraphCommons](https://graphcommons.com/).

## dish discovery

<span class="marginnote">
	<img src="{{ '/img/dishes/flavour-map.jpg' | prepend: site.baseurl }}" alt="vegetation health"/>a spatial map of flavours (source unknown)
</span>

This project came out of a different piece of work around the design of 'expert coding languages' for cooking -- the idea that, instead of being discrete entities, recipes were more like paths to particular points in a larger latent space<label for="dishrecipe" class="margin-toggle sidenote-number"></label><span class="sidenote" id="dishrecipe">a term from machine learning, 'latent space' could be paraphrased as a high dimensional 'space of possibility', within which certain points are known but the space between them is undefined. for example -- what transformations separate a chewy cookie from a crumbly one? and what's in the middle?</span>. By changing aspects of the recipe -- cooking time, amount of butter, temperature -- you could end up in a different point in the space, and by the same token you could work backward. During the research stages of the project I got very interested in different ontologies for food (I've written about this collection [here](https://www.are.na/editorial/on-food-ontologies)).

As well as collecting ontologies (and getting obsessed with [industrial food texture modification manuals](/2022/08/05/soft-bread.html)), I started to sketch out my own. One thing that interested me a lot was, within this idea of a continuous latent space, there *are* also lots of discrete objects (though they too can have fuzzy edges). The 'dish' is one of these -- featuring here in one of the early ontology sketches I made:

<figure>
	<img src="{{ '/img/dishes/food-space.png' | prepend: site.baseurl }}" alt="main"/>
</figure>

It felt important to have 'dish' be distinct from 'recipe'. I think of a recipe as an instance of an instruction-set, that captures *how* to make a dish (named or unnamed)<label for="dishrecipe" class="margin-toggle sidenote-number"></label><span class="sidenote" id="dishrecipe">I feel like there's also a continuum of how 'dish-like' a recipe is -- though even recipes which don't start out pointing to dishes can do, like drunk sandwiches that acquire a name after being perfected</span>, while a dish is a concept, free to associate with other entites. A graph of dishes deals with overlapping but distinct: what other dishes, cuisines, holidays, meals, events, people, places or other practices are associated with this dish? What dishes exist in the world? How is a dish described?

The answer to the last question is surprisingly sticky if you don't count recipes as a description of a dish, and it made me think about the way we articulate dishes in terms of their relationships to other foods (which I think is more broadly about being able to express something most succinctly in terms of a shared experience). It's certainly not a complete description and it's also highly subjective -- but moreso than most I think descriptions of dishes are necessarily subjective, unlike an instance of a recipe, which can also be precise.

Wikipedia's 'see also' section felt like a good place to start with this as it's so ambiguous, and there are no hard rules -- things can be related as they have similar ingredients, a similar form factor and/or textural qualities, or are made using a similar process -- it seems like editors mostly go on vibe.

## how it works

The scraper starts on a page for a particular dish, and extracts links from the 'See Also' section, which contains links to pages that whoever was editing thinks are related. It then fetches all the categories applied to that page -- if none of the category titles contain the any of the words 'dishes', 'bread', 'dessert', 'pudding', 'pastries' (pluralised because of the way categories are worded<label for="swedish" class="margin-toggle sidenote-number"></label> <input id="swedish" class="margin-toggle"/><span class="sidenote">Initially I actually used the singular 'dish' but then had the issue of collecting multiple pages with categories containing the word 'Swedish', which also has 'dish' as a substring, and had to kill the crawler as it attempted to index every member of Sweden's parliament...</span>) then the page is skipped as it's probably *not* primarily a page about a food. (There's a bit of a bias toward sweet goods here, though arguably on Wikipedia savory foods are more often classed as a dish... perhaps I should expand to things like 'pickle'). If the page does seem to be a dish, then the scraper creates a relationship between it and the page it was linked from, as well as a relationship between that page and each of the categories it belongs to (which I thought would be interesting extra metadata).

Each time a page is visited, or found to contain no relevant categories, it's added to an array of pages to skip, as it's already been scraped. As the graph is explored further and further it slowly has fewer paths that it hasn't already been down, and pages slowly get knitted together. 

### seeding

In order to crawl a good section of the graph, we had to come up with a set of 'seed dishes' that would spread the crawler over a range of different cuisines and types of food. Initially these were chosen semi-randomly to get a good range; in the second range I started from the [Wikipedia Category of National Dishes](https://en.wikipedia.org/wiki/Category:National_dishes), plus a set of random links from [List of Desserts](https://en.wikipedia.org/wiki/List_of_desserts) to balance a bias in national dishes toward savory foods. (I might have over-compensated for this, however, as the final graph ended up quite dessert-y).

### filtering unhelpful categories

I wanted to include a broader range of categories in the graph than was used to filter pages -- e.g. a page probably doesn't contain a dish if it doesn't belong to any categories containing the word 'dish', but there might be categories relevant to its culinary qualities (like 'pickle', 'pastry', 'cookie') that still contain useful information for clustering. As such, the filtering involved iteratively picking out terms common to 'wikipedia metadata' and other less useful categories.

### limitations

There are a number of obvious limitations to this -- namely, this is only working on english-language Wikipedia, which probably has regional biases as to what dishes (and links *between* dishes) are included. There's also the major issue that links in the main text don't get included in See Also -- potentially missing loads of important links. It's also not certain whether this method gets all the pages marked 'dish' -- I haven't come up with a good metric to determine what proportion of 'dish' articles are successfully indexed by the crawler, because there's no singular category 'dish' on Wikipedia. I think the way to do this would be something like:

```
> filter all categories by the category criteria used
> for each of these categories, get the list of [categoryMembers](https://pypi.org/project/Wikipedia-API/)
> remove duplicates and count, potentially use this to seed the next round
```

## the data

The Python script crawls both pages and categories, and dumps them into a big Neo4j graph database instance. Pages that link to one another are defined by an `isRelatedTo` link -- and links to categories by `hasCategory`. I found Neo4j's desktop tool quite clunky, but found it difficult to get the hang of querying via the command line. Once I got into it, I started to enjoy playing around with the data: here's a query in their Cypher query language that maps out a route from Pizza to Banana cake.

```
match p=shortestPath( (k:Dish {name: "Pizza"})-[:isRelatedTo*]-(a:Dish {name: "Banana cake"}) ) return p
```

One thing I like about this is the train of associations: they flip between flavour, technique, form factor, cuisine and culture with different kinds of vibes cropping up. You start to see the same 'nodal' pages a lot that bridge between different form factors of food -- [Khachapuri](https://en.wikipedia.org/wiki/Khachapuri), for example, provides an important bridge between stuffed dishes and flatbreads. Another common node that acts as a cultural bridge is fusion cuisine, for example the Hawaiian noodle dish [Saimin](https://en.wikipedia.org/wiki/Saimin) crops up a lot.

You also develop a sense for parts of Wikipedia where the dishes are highly clustered -- like this tight-knit group around the Filipino dessert Halo-Halo, or within Indonesian cuisine, itself maybe an articulation of the great degree of mixing and cross-influence within e.g. east asian desserts.

```
match (n:Dish)-[r:hasCategory]->(c where c.name contains "pastries")
return n
```

After thinking about wanting to put the data online while writing this post, I ended up in a small graph-data-publishing rabbithole to GraphCommons, which also has some basic browsing/clustering/analysis options, that has a funny 

## getting from A to B

A big influence on this project is the work of [Patrick Gunkel](http://ideonomy.mit.edu/), founder and core proponent of the field of _ideonomy_-- the science of ideas -- and a strong believer in the power of the list, the map, and the oblique association.

Many years ago my friend SJ introduced me to Gunkel's work, via the masterpiece *'An Idea Tree'* (pictured right), which takes the initial idea of allanto (sausage-like) foods, andd follows multiple 'hints' and 'interpretations' to theorise, for example, the appearence of mochi ice cream some decades before its introduction into Gunkel's native Texas.

This tree of sausage-inspired innovation follows a surprisingly similar set of jumps to the map of dishes, albeit with the latter feeling less self-consciously 'innovative'. The forking, folding path -- the 'stuffed' hint, the 'discontinuity' hint -- 

I'm a big admirer of Gunkel's broader work for his interest in applying extraordinarily thorough, scientific and detailed methods to further the understanding of fleeting, subjective and slippery ideas. His articulations don't pin them down, so much as flesh them out -- expanding their descriptive possibilities by searching for many definitions within them. It's a form of inquiry that feels genuinely *inquisitive*, and is also extremely funny -- a couple of my other favourites are his map 'Examples and Sources of Beauty', and another tree 'Common Misconceptions re: A Stone'.

Another thing that the links reminded me of was Medieval Islamic maps in the [Balkhī School](https://en.wikipedia.org/wiki/Abu_Zayd_al-Balkhi) style, which instead of showing a scaled depiction of space , and are often compared to Harry Beck's map of the [London Underground]().

I also came across a 

## letter and spirit

