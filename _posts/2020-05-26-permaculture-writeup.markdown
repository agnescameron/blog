---
layout: post
title:  "Permaculture Network"
date:  2020-05-26 10:23:58
tags: automata, permaculture, sakiya
status: published
---

This is a long-overdue writeup of a project that Gary and I worked on last summer. Parts of it are adapted from answers to questions that different people have asked about the project (*thanks, Callil*), and parts are new. I've been meaning to update the code from this for a while now as an ambition for this project was for it to have a life outside of 

it was made while gary and i were resident in the art institution Sakiya. https://sakiya.org
From a technical standpoint, a few things are going on at once. The first thing that happens is that the simulation auto-populates with soils, plants and animals every time you load the page. The background colours you can see denote the different land types present on the site (you can see this at the top when you click on a square: ‘a rocky outcrop’ ‘a wild meadow’ etc). These types stay constant across every simulation.
here’s an aerial shot of the landscape that it’s based on:https://d2w9rnfcy7mm78.cloudfront.net/6076218/original_0e5ce0cf025566921edd402173749a6c.png?1580793225?bc=0

Soil and rocks are distributed on these substrates according to some probability of walking onto that area and finding that soil. So — in the ‘rocky outcrop’ you mostly get limestone and dolomite, but the ‘wild meadow’ gets terra rossa, and a bit of clay.  Plants are then spawned on different soil substrates with a probability according to the kind of soil they like to be on. (all the plants are specific to the site).

The simulation itself ticks every second. Every time it loops a few things happen. One: every creature in the simulation (bees, goats, boars, people etc) move, if they want to. Most things move randomly over the kind of terrain they’re likely to be found in, apart from the goats which flock from one side to another (the site is blessed with a flock of 200 goats that come down the hill a few times a week). It is on each of these ticks that the ‘narrative’ aspect of the simulation updates. Every plant, animal, rock/soil is a separate agent, belonging to a particular group: goats are grazers, pink rock rose is a mycorrhizal, purple broad bean is a legume etc etc.

The narrative can be generated in two ways: the first and most direct is when an event occurs — at the moment, that’s just when an animal moves from square to square. When an animal enters a square, a call-and-response occurs between the animal, and the agent that’s on the top of the square (e.g. if there’s a plant then a plant, otherwise a rock or soil). There’s a matrix of mappings of the kind of interactions different agent types will have with one another: for example, when goats speak to crops or legumes (or really any plant apart from the shrubs, which are spiny and annoying), they will express love and appreciation. This is not reciprocated by the plant (which doesn’t want to be eaten), which will respond with either fear or annoyance, depending on the likelihood of being eaten vs just trodden on. As well as this matrix, each agent has a kind of personality (where we could, these are based on islamic folklore about particular plants): so a friendly agent will express warmth or annoyance differently to how a wise agent would.

The second form of narrative generation happens at random every tick: 100 or so agents are selected, and another agent chosen at random from the 9x9 square surrounding them. If the agent is a plant, and a ‘companion plant’ (in a permaculture guilds sense) is located in this square, then that is chosen with priority. At that point, just as before, an exchange occurs between the randomly selected plant and its neighbour, depending again on personality and relationship. To see the companion plants, you can click on a plant (easiest to do this in the brown ‘terrace’ area as things there are planted in guilds anyway) and the information box should show you the list of nearby companions.

At the moment we’re also working on integrating weather and light data, which might change the simulation a lot depending on how it’s implemented (still debating whether to make ‘wind’ an agent for example).
One thing I thought would be really interesting for this is to make another version based on a different ecosystem. It was made pretty quickly so there’s a couple of bits that would need to be teased out (e.g. the goats have their own function), but for the most part it’s quite modular: all of the animals and plants are defined in separate JSON objects, and the background is just made by running a python script on a bitmap to generate an array of background pixels
