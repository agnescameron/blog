---
layout: post
title:  "wikipedia snack map"
author: agnes cameron
date:  2022-08-23
description: scraping a knowledge graph of dishes
tags: food, ontologies
status: draft
image: 
---

This is a write-up of a small tool that scrapes a graph of related dishes using Wikipedia's 'See Also' section. I made a couple of years ago for a project with the Knowledge Futures Group, along with [Favour Kelvin](https://favourkelvin17.medium.com/), who was doing an internship with us at the time. I've revisited it a couple of times since, including re-doing the seeding stage and adding some more filters for results. The code for this project is [here](https://github.com/agnescameron/related-dishes), and I also published browsable versions of the dish graph [with](https://graphcommons.com/graphs/1339108d-ac64-4cd6-b960-8b6605623ffa) (note -- this one is much slower) and [without](https://graphcommons.com/graphs/3d5ed7d2-1940-47c0-8a4b-64f519562b09) categories on [GraphCommons](https://graphcommons.com/).

## dish discovery

This project came out of a different piece of work around the design of 'expert coding languages' for cooking -- the idea that, instead of being discrete entities, recipes were more like paths to particular points in latent space. By changing aspects of the recipe -- cooking time, amount of butter, temperature -- you could end up in a different point in the space, and by the same token you could work backward. During the research stages of the project I got very interested in different ontologies for food (I've written about this collection [here](https://www.are.na/editorial/on-food-ontologies)).

As well as collecting ontologies, I started to sketch out my own. One thing that interested me a lot was, within this idea of a continuous latent space, there *are* also lots of discrete objects (though they too can have fuzzy edges). The 'dish' is one of these -- featuring here in one of the early ontology sketches I made:

<figure>
	<img src="{{ '/img/dishes/food-space.png' | prepend: site.baseurl }}" alt="main"/>
</figure>


It felt important to have an entity 'dish' distinct from 'recipe' -- a recipe is an instance of an instruction that captures how to make a dish (named or unnamed)<label for="dishrecipe" class="margin-toggle sidenote-number"></label><span class="sidenote" id="dishrecipe">I feel like there's also a continuum of how 'dish-like' a recipe is -- though even recipes which don't start out pointing to dishes can do, like drunk sandwiches that acquire a name after being perfected</span>, while a dish is a concept, free to associate with other entites. A graph of dishes deals with overlapping but distinct: what other dishes, cuisines, holidays, meals, events, people, places or other practices are associated with this dish? What dishes exist in the world? How is a dish described?

The answer to the last question is surprisingly sticky if you don't count recipes as a description of a dish, and it made me think about the way we articulate dishes in terms of their relationships to other foods (which I think is more broadly about being able to express something most succinctly in terms of a shared experience). It's certainly not a complete description and it's also highly subjective -- but moreso than most I think descriptions of dishes are necessarily subjective, unlike an instance of a recipe, which can also be precise.

Wikipedia's 'see also' section felt like a good place to start with this as it's so ambiguous, and there are no hard rules -- things can be related as they have similar ingredients, a similar form factor and/or textural qualities, or are made using a similar process -- it seems like editors mostly go on vibe.

## how it works

The scraper starts on a page for a particular dish, and extracts links from the 'See Also' section, which contains links to pages that whoever edited the page thought were related. It then fetches all the categories applied to that page -- if none of the category titles contain the any of the words 'dishes', 'bread', 'dessert', 'pudding', 'pastries' (pluralised because of the way categories are worded<label for="swedish" class="margin-toggle sidenote-number"></label> <input id="swedish" class="margin-toggle"/><span class="sidenote">Initially I actually used the singular 'dish' but then had the issue of collecting multiple pages with categories containing the word 'Swedish', which also has 'dish' as a substring, and had to kill the crawler as it attempted to index every member of Sweden's parliament...</span>) then the page is skipped as it's probably *not* primarily a page about a food. (There's a bit of a bias toward sweet goods here, though arguably on Wikipedia savory foods are more often classed as a dish... perhaps I should expand to things like 'pickle'). If the page does seem to be a dish, then the scraper creates a relationship between it and the page it was linked from, as well as a relationship between that page and each of the categories it belongs to (which I thought would be interesting extra metadata).

Each time a page is visited, or found to contain no relevant categories, it's added to an array of pages to skip, as it's already been scraped. As the graph is explored further and further it slowly has fewer paths that it hasn't already been down, and pages slowly get knitted together. 

### seeding

In order to crawl a good section of the graph, we had to come up with a set of 'seed dishes' that would spread the crawler over a range of different cuisines and types of food. Initially these were chosen semi-randomly to get a good range; in the second range I started from the [Wikipedia Category of National Dishes](https://en.wikipedia.org/wiki/Category:National_dishes), plus a set of random links from [List of Desserts](https://en.wikipedia.org/wiki/List_of_desserts) to balance a bias in national dishes toward savory foods. (I might have over-compensated for this, however, as the final graph ended up quite dessert-y).

### limitations

I haven't come up with a good metric to determine what proportion of 'dish' articles are successfully indexed by the crawler. I think the way to do this goes something like:

```
> filter all categories by the category criteria used
> for each of these categories, get the list of [categoryMembers](https://pypi.org/project/Wikipedia-API/)
> remove duplicates and count, potentially use this to seed the next round
```

Another quite quite obvious thing I could do is to link pages back to already-visited nodes, so those relationships get recorded. At present, the 'don't visit' list doesn't distinguish *why* a node shouldn't be visited, but that wouldn't be hard to change and would mean that e.g. it would be possible to find closed loops in the graph (currently the graph is ??I think?? acyclic because of the way the crawler operates).

## the data

I started out with the Neo4j browser tool -- I don't love Neo4j honestly, I find the UX of the desktop tool a bit clunky and their vibe a bit corporate -- and wrote some queries in their Cypher language to try and learn a bit more about the data and also clean it up a bit. After thinking about wanting to put the data online while writing this post, I ended up in a small graph-data-publishing rabbithole to GraphCommons, which also has some basic browsing/clustering/analysis options, and the advantage of much nicer design.

Ultimately I think if I were wanting to do this seriously, the best approach would be to get comfortable writing command line queries to Neo4j and visualising them myself, as Cypher (and the related APOC plugin) are definitely powerful graph query tools.

### filtering unhelpful categories

I wanted to include a broader range of categories in the graph than was used to filter pages -- e.g. a page probably doesn't contain a dish if it doesn't belong to any categories containing the word 'dish', but there might be categories relevant to its culinary qualities (like 'pickle', 'pastry', 'cookie') that still contain useful information. As such, the filtering involved iteratively picking out terms common to 'wikipedia metadata' and other less useful categories. The full filtering query is below:

```
MATCH (s1:Dish)-[r:hasCategory]->(s2:Category)
WHERE NOT (s2.name CONTAINS "Article") AND NOT (s2.name CONTAINS "error") AND NOT (s2.name CONTAINS "description") AND NOT (s2.name CONTAINS "stub") AND NOT (s2.name CONTAINS "Wikidata") AND NOT (s2.name CONTAINS "CS1") AND NOT (s2.name CONTAINS "language") AND NOT (s2.name CONTAINS "category") AND NOT (s2.name CONTAINS "article") AND NOT (s2.name CONTAINS "Page") AND NOT (s2.name CONTAINS "identifier") AND NOT (s2.name CONTAINS "text") AND NOT (s2.name CONTAINS "template") AND NOT (s2.name CONTAINS "date") AND NOT (s2.name CONTAINS "Wikipedia") AND NOT (s2.name CONTAINS "edit") AND NOT (s2.name CONTAINS "Engvar")
RETURN "Dish" AS SRC_NODE_TYPE, s1.name AS SRC_NODE_NAME, "hasCategory" AS EDGE_TYPE, "Category" AS TRG_NODE_TYPE, s2.name as TRG_NODE_NAME
```

yeesh! The nice thing was this markedly reduced the number of category nodes, meaning that the reduced graph could fit into a single graphCommons instance.


```
match (n:Dish)-[r:hasCategory]->(c where c.name contains "pastries")
return n
```


## graphs and maps

One of the 

[Patrick Gunkel's](http://ideonomy.mit.edu/)

Importance of lists, thinking about paths through food-space, moving from dish to disg

Recently I've also been spending a lot of time looking at medieval maps, after buying a copy of Rouben Galichian's [Countries South of the Caucasus in Medieval Maps](https://www.are.na/block/17715287) when I was in Armenia. 


One thing that the links reminded me of was Medieval Islamic maps in the [Balkhī School](https://en.wikipedia.org/wiki/Abu_Zayd_al-Balkhi) style, which instead of showing a scaled depiction of space , and are often compared to Harry Beck's map of the [London Underground]().


### finding routes


```
match p=shortestPath( (k:Dish {name: "Lavash"})-[:isRelatedTo*]-(a:Dish {name: "Banana cake"}) ) return p
```

### clustering


