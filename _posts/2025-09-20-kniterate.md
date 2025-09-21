---
layout: post
title:  "knitout and kniterate"
author: agnes cameron
date:  2025-09-20
description: making friends with the knitout file format
tags: textiles, open-source
status: published
image: '/img/knitout/final-waste.png'
---

I've been working on a [research project](https://cci.arts.ac.uk/~material/) with [B Claxton](https://www.instagram.com/b.clax/?hl=en) and [Claire Anderson](https://researchers.arts.ac.uk/1615-claire-anderson) from the Smart Textiles Lab at Chelsea College of Arts. At the moment we're running a reading group and building an [index of open source knit tools](https://docs.google.com/spreadsheets/d/1Mk6qIkn9i-3fB2CGQtpkl0AzOCBJlxThXYyPawyuev8/edit?gid=0#gid=0), which we're attempting to use with the Chelsea [Kniterate](https://www.kniterate.com/) machine.

[Knitout](https://textiles-lab.github.io/knitout/knitout.html) is an open interchange industrial knit file format designed by the [Textiles Lab](https://textiles-lab.github.io/) at Carnegie Mellon University. This group's research is extremely interesting, and they're one of the major sources of new pieces of knit software/research. We decided to try and get some of their knitout files working on the Kniterate machine, I'm recording what we have tried here.

<figure>
	<img src="{{ '/img/knitout/final-waste.png' | prepend: site.baseurl }}" alt="main"/>
	<span class="mainnote">an example knit file rendered in the knitout visualiser</span>
</figure>

<span class="marginnote">
	<img src="{{ '/img/knitout/vector-tiles.png' | prepend: site.baseurl }}"/>big fan of the knitout visualiser stitch svg reference file
</span>

## what is knitout?

Knitout and related tools appear to still be very much under active research/development, and documentation and tools are distributed across a few different repositories, which made piecing them together initially a bit confusing. We found [this website](https://knit.work/) (though also a work in process) helpful for getting a sense of how everything fits together. For the workflow to produce these designs, we ended up using a combination of the following tools:

* **[knitout examples](https://github.com/textiles-lab/knitout-examples/tree/master)**, a repository of example knitout files, and JS used to generate them -- some of these seem to be a little out of date
* **knitout/js [visualisation tools](https://github.com/textiles-lab/knitout-live-visualizer)**, which provide a great sanity check for .k files, and also have a live-coding feature for writing js code that generates knit
* the **[backend kniterate conversion tools](https://github.com/textiles-lab/knitout-backend-kniterate)**, to convert generic knitout files to make things run on the kniterate

To make things simpler and get more verbose error messages, we downloaded these repositories locally and ran tools from the command line, rather than using the online conversion and visualiser tools.

We *didn't* yet properly test out the npm package ([knitout-frontend-js](https://github.com/textiles-lab/knitout-frontend-js)), or the sister [python package](https://github.com/textiles-lab/knitout-frontend-py) as the example js file we used was acting more like a printer. It's possible that some of the kniterate conversion tools will be better suited to files generated in this way -- we'll try this in attempt 2.

We got the sense that Knitout has been developed *primarily* with the Shima in mind, and there are a bunch of settings (eg carrier numbers, the inhook and outhook commands) that don't work on the Kniterate. To resolve this, CMU have published a script that takes in a knitout file and adapts it for the kniterate specifically, which we are also using (more below).


## attempt 1 -- stripes

<span class="marginnote">
	 <video width=240 controls>
	  <source src="{{ '/img/knitout/kniterate-slomo.mp4' | prepend: site.baseurl }}" type="video/mp4">
	</video><br>
	slomo video I took of the machine running when we were trying to debug the waste section
</span>

We used the example ['sheet-stripes.js'](https://github.com/textiles-lab/knitout-examples/blob/master/sheet-stripes.js) from the [knitout examples repo](https://github.com/textiles-lab/knitout-examples/tree/master) to create the initial file. This file seems to come from an era predating the npm package, as it's just printing out knitout line by line to a file. More [recent examples](https://knit.work/garter-stitch/) instead use API calls to construct the knitout lines. Similarly, I think the API now has a way of writing files -- we used a pipe to directly create the .k file. After some failed attempts with lots of waste yarn bunching, we changed it to be 40 stitches wide rather than 20 (we also changed the tension when we did this though, so it could have been either).

```
$ node stripes.js > stripes-example.k
```

In order to adapt this for the machine, we then use some of the backend tools. First, we use the knitout-alter-kniterate file, from the knitout-kniterate backend [extras](https://github.com/textiles-lab/knitout-backend-kniterate/tree/master/extras) folder, to take the original knitout file and adapt it for the kniterate. (input: `stripes-example.k`, output `stripes-example-kniterate.k`)

```
$ node knitout-alter-kniterate.js
```

We used the following settings for the machine:

```
Roller advance: 450
Roller advance for transfers: 0
Main stitch number: 6
Stitch number for transfers: 5
Main speed number: 300
Speed number for transfers: 100
Would you like to change any carriers: n
```
<span class="marginnote">
	<img src="{{ '/img/knitout/final-waste-2.png' | prepend: site.baseurl }}"/>the added waste section, in the knitout visualiser
</span>

We then used the waste-section.js file (in the same folder) to prepend a waste section to the file. Sometimes depending on the settings used (this happened when we used the '0' setting on the cast on style; was fine otherwise), the file that this creates can skip out one of the knitout commands needed to bring in a carrier; we resolved this by manually editing the file to add the line `in 3` to bring the third carrier in. (input: `stripes-example-kniterate.k`, output `stripes-example-kniterate-waste.k`). 

```
$ node waste-section.js
```
It took us a few attempts to get the tension right -- here are the settings used when we got it to work.

```
Roller advance: 100
Stitch number: 5 --> this turned out to maybe be quite important
Speed number: 150
Carrier to use for waste yarn: 6 --> this is our waste yarn
Carrier to use for draw thread: 1 --> draw thread yarn
Cast on style: Open tube
```

We then used the knitout-frontend visualiser to check that the file looks okay. I ran the visualiser locally, but to be honest it would probably be exactly the same using the online version.

<span class="marginnote">
	<img src="{{ '/img/knitout/knitout.png' | prepend: site.baseurl }}"/>
	<img src="{{ '/img/knitout/kcode.png' | prepend: site.baseurl }}" />
	knitout (top) and equivalent kcode (bottom) for waste yarn section
</span>

The final step is to use the the knitout-to-kcode file to transform the final file (knitout -> kniterate -> waste yarn) into a .kc file, which makes it ready to run on the kniterate machine. This complained a bit but was otherwise fine -- though it did throw an error on the times where we were missing the `in 3` command to bring in the third carrier.

```
node knitout-to-kcode.js extras/stripes-example-kniterate-waste.k stripes.kc
```

I hadn't looked at a kcode file before, they're a super interesting format.

<figure>
	<img src="{{ '/img/knitout/stripes-sample-1.jpg' | prepend: site.baseurl }}" alt="main"/>
	<span class="mainnote">a few sample attempts, chained together -- the orange is waste yarn, and the green is the start of the stripes section. by later versions the waste section had improved a lot, but the stripe change was still causing issues</span>
</figure>

Our first attempts were not wildly successful, but we did end up learning a lot. Because the kniterate machine can already be a bit sensitive, it's unclear often what's issues with the file vs the machine being quite particular/temperamental about the way it wants to do things. After a lot of wrangling the waste yarn, in the end our main issues came with bringing the second stripe in -- but this could have had more with the way the kniterate was moving the plates with the carriage than anything else.

<span class="marginnote">
	<img src="{{ '/img/knitout/waste-end-question.png' | prepend: site.baseurl }}" alt="stitch difference between waste and main yarn"/>the main section is one stitch wider?
</span>

What was very helpful was going through the entire process -- including at different points manually debugging the knitout files -- and seeing the links between the code, the visualiser, and what was happening on the machine.

### questions/thoughts from round 1

* how do you get the machine to bind off? Knitout has a command called 'outhook' -- but this doesn't work on the kniterate. Is there an equivalent?
* why is the waste yarn addition 1 stitch less wide than the eventual pattern?
* is there a major difference between what's possible in the Python and JS packages? or the intention to be?
* at present, because the code is spread across so many repositories but -- in the case especially of the backend -- seems to need to be quite interoperable, it feels a bit like version changes between different repos might introduce a lot of issues