---
layout: post
title:  "knitout and kniterate"
author: agnes cameron
date:  2025-09-20
description: making friends with the knitout file format
tags: textiles, open-source
status: published
image: 
---

I've been working on a research project with B Claxton and Claire Anderson from the Smart Textiles Lab at Chelsea College of Arts. At the moment we're running a reading group and building an index of open source knit tools, which we're attempting to use with their kniterate machine.

Knitout is an open interchange industrial knit file format designed by the Textiles Lab at Carnegie Mellon University. This group's research is extremely interesting, and they're one of the major sources of new pieces of knit software/research. We decided to try and get some of their example knitout patterns working on the Kniterate machine, I'm recording what we have tried here.

## what is knitout?

One of the more confusing things you first encounter when trying to use knitout is that tools for using/generating it are strewn across a number of different repositories and websites, and piecing them together can be a bit tricky. To make things simpler and get more verbose error messages, we've downloaded everything locally.

The other thing about knitout is that it seems to have been developed *primarily* with the Shima in mind, and there are a bunch of settings (eg carriers, the inhook and outhook commands) that don't work on the Kniterate. To resolve this, CMU have published a script that takes in a knitout file and adapts it for the kniterate specifically.

Our current workflow is as follows:
* use a js file to create the initial kniterate file. I used the example they gave for stripes, but after some failed attempts with lots of waste yarn bunching, I made it 40 stitches wide rather than 20. As far as I can tell, all this does is prints out lines to a knitout file but programatically

```
node stripes.js > stripes-example.k
```

* use the knitout-alter-kniterate file, from the knitout-kniterate backend extras folder, to take the original knitout file and adapt it for the kniterate. (input: `stripes-example.k`, output `stripes-example-kniterate.k`)

```
node knitout-alter-kniterate.js
```

* use the waste-section.js file to prepend a waste section to the file. This is also in the knitout-kniterate backend extras folder. Sometimes depending on the settings used (this happened when we used the '0' setting on the cast on style; was fine otherwise), this can skip out one of the commands needed to bring in a carrier; we resolved this by manually editing the file to add the line `in 3` to bring the third carrier in. (input: `stripes-example.k`, output `stripes-example-kniterate.k`)

```
node waste-section.js
```

```
Roller advance: 100
Stitch number: 5
Speed number: 150
Carrier to use for waste yarn: 6 --> this is our waste yarn
Carrier to use for draw thread: 1 --> draw thread yarn
Cast on style: Open tube
```

* use the knitout-frontend visualiser to check that the file looks okay!
* use the knitout-to-kcode file to transform the final file (knitout -> kniterate -> waste yarn) into a .kc file, which makes it ready to run on the kniterate machine

We also had some issues getting the initial tension for the waste yarn set. 

The settings we specified initially for the main file were:
```
Roller advance: 450
Stitch number: 5 --> this turned out to maybe be quite important
Speed number: 150
Carrier to use for waste yarn: 6 --> this is our waste yarn
Carrier to use for draw thread: 1 --> draw thread yarn
Cast on style: Open tube
```

The waste settings we eventually went with are:




Because the kniterate machine can already be a bit sensitive, it's unclear often what's issues with the file 
