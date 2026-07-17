---
layout: post
title:  "kniterate notes 8"
author: agnes cameron
date:  2026-07-09
description: material programming goes to local first conference
status: published
image: "/img/kniterate-8/image4.jpg"
---

<p class="topnote">This is the eighth in a series of blog posts about the <a href="https://cci.arts.ac.uk/~material/">Material Programming Project</a>. We are developing malleable knitting software for the <a href="https://www.kniterate.com/">Kniterate</a>, a semi-industrial knitting machine. This post is mostly about running a workshop as part of Lab Day at a <a href="https://www.localfirstconf.com/">Local First Conference</a>, and successfully doing some long distance knitting. The first post, on the Knitout project, is available <a href="https://soup.agnescameron.info/2025/09/20/kniterate.html">here</a>.</p>

## Knitting at Lab Day

<figure>
	<img src="{{ '/img/kniterate-8/image4.jpg' | prepend: site.baseurl }}" alt="main"/>
	<span class="mainnote">knitting in the Berlin Textile Co-Op</span>
</figure>


We were invited to [Local First Conference](https://www.localfirstconf.com/) by [Ink and Switch](https://www.inkandswitch.com/) to demo the knitting software we'd been making as an example of 'malleable software' at their Lab Day. 'Lab Day' is a day at the end of the conference given over to demos both of different Ink and Switch projects, and an open program where other attendees can share their work. In the spirit of practical engagement with the medium, we got in touch with the extremely lovely people at [Berlin Textile Co-Op](https://www.berlintextilecoop.com/) who kindly agreed to let us run our experimental files on their Kniterate for a day.<label for="thanks" class="margin-toggle sidenote-number"></label><input id="thanks" class="margin-toggle"/><span class="sidenote">everyone at every stage of this process was so generous and supportive and kind to us. Thanks Chee Mimi Boris Peter Sara Leonie Ana and everyone else <3</span>

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/chee-mimi.jpg' | prepend: site.baseurl }}"/>
	chee and mimi and patternwitch LIVE on stage
</span>

As the Kniterate can't (easily) be moved, the day was structured two parts: in the morning we'd demo the software and get people to make Knitout files, and in the afternoon head to the co-op and knit them out. B also wasn't able to make it to Berlin in the end, so we ran the afternoon session via video link; B with the Kniterate in Chelsea, and me with the Kniterate in Friedrichshain. This format actually turned out to work really well, and let us test out a bunch of really exciting files.

### Patternwitch + Plating

Following on from our conversations about colour the previous week, Mimi developed a tiny paint tool called 'Patternwitch', which lets you paint a bitmap and then underneath in automerge it writes them into a big array of arrays. It's already a nice demo of [Automerge](https://automerge.org/)/Patchwork because if you go and edit the array the image updates in realtime and vice versa. Chee and Mimi included it in their part of the malleable software talk, which was a really great demo that did a great job of getting across the sense of possibility that Patchwork gives you.

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/crap-horse.jpg' | prepend: site.baseurl }}"/>
	first plating test of the horse. In this sample, the front and back beds working, but the yarn wasn't going where we want it to! Also upside-down and too loose....
</span>


<figure>
	<img src="{{ '/img/kniterate-8/pw-automerge.png' | prepend: site.baseurl }}" alt="main"/>
	<span class="mainnote">Patternwitch and raw representations as separate lenses on the same Automerge file</span>
</figure>

Chee's crab demo from [last week](/2026/07/09/colourwork.html) was running off a Patternwitch array, but wasn't going to hang together very well as knit fabric. I considered using jacquard after spending a bit of time with the CMU image processing code, but this was also a bit stressful to test on the Berlin Co-op machine as jacquard can be quite intense on the machine.

I decided instead to test out a technique called plating, which allows you to make a 2-colour design by threading the carrier using two threads and then alternating front and back beds.<label for="plating" class="margin-toggle sidenote-number"></label><input id="plating" class="margin-toggle"/><span class="sidenote">for more on plating, take a look at the notes from the first student workshop back in <a href="/2026/03/07/kniterate-notes.html#rib-and-knit-structure">March</a>, where we used it extensively.</span> If the carrier is properly threaded, colour 1 gets pushed to the front, and colour 2 gets pushed to the back. As it only uses one bed at a time, this is way less stressful for the machine: a good candidate for testing in a new environment.

Gratifyingly this was 1) easy to code and 2) worked really really well. I went over to the co-op to meet Sara and Leonie the day before, and we tested out a little Patternwitch/plating horse. The result itself is a bit underwhelming, but the issues (we set up the plating feeder wrong and needed to adjust the tensions a bit) were gladly nothing to do with the code!

<figure>
    <div class="subfigthird">
        <img src="{{ '/img/kniterate-8/kitsch-witsch.jpg' | prepend: site.baseurl }}"/>
        <span class="mainnote"></span>
    </div>
    <div class="subfigthird">
        <img src="{{ '/img/kniterate-8/kitsch-knitout.jpg' | prepend: site.baseurl }}"/>
        <span class="mainnote"></span>
    </div>
    <div class="subfigthird">
        <img src="{{ '/img/kniterate-8/laura-final.jpg' | prepend: site.baseurl }}"/>
        <span class="mainnote"></span>
    </div>
    <span class="mainnote">Laura's design end to end patternwitch -> knitout -> knit</span>
</figure>


### [cute bug](https://en.wikipedia.org/wiki/Green_stink_bug) report

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/automerge-crab-ii.png' | prepend: site.baseurl }}"/>
	Automerge array bugs with a mystery double-length row on row #9. You can see the needles alternating front/back between the different coo
</span>

As research code, Patchwork inevitably encounters some bugs, and these were gratifyingly medium-specific. One of my favourites was, early on testing the Patternwitch -> plating code, a bug would occur where some random arrays in the Patternwitch image would be twice as long.

I asked Chee and Mimi about this and they were like, "ohhhhhh, automerge". The way the Patternwitch Automerge CRDT currently handles conflicting arrays is seemingly (at least sometimes) double their length to accommodate the diverging values. I hadn't been running any consistency checks on the array->plating code, and so ended up with a bunch of really crunchy looking files. There was something very touching about this! It felt kind of amazing to be encountering a bug that existed very materially in a medium that my friends had made.

At the end of the lab day, Ana and B collaboratively edited a Patternwitch file remotely and then we knitted it out! It worked great but had some wild artefacts (and involved the addition of an array length check...).

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/collab-cat.jpg' | prepend: site.baseurl }}"/>
	Ana holding her plated cat (she also brought a bunch of samples in the morning to help us demo!)
</span>

<figure>
	<img src="{{ '/img/kniterate-8/cat-automerge-2.jpeg' | prepend: site.baseurl }}"/>
	distributed cat drawing, with my screenshare (left) and B's window (right)
</figure>

### demo-ing the software
(maybe predictably?) When I was demo-ing the software in the morning people were not so interested in making knit files but really _really_ interested in hearing about and seeing pictures of the industrial knitting machines, and learning more generally about how knit fabric is constructed. It's funny because in all the student workshops we were working a lot with students who had a fairly unique level of access to machine knitting contexts, and while excited about the kniterate were also at a point of being ready to get really stuck in with the different editors.

Gladly I'd decided to make [a presentation](/img/kniterate-8/knit-big-examples-pres.pdf) that was just a lot of pictures of different machines and software. Sara from the Textile Co-op also lent me a bunch of Kniterate samples, and Ana also brought loads, most of which were handknit, which included one we could unravel (really important for explaining knit structure).

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/marcel-sock.png' | prepend: site.baseurl }}"/>
	talking to Marcel about ribs using his socks
</span>

<figure>
    <div class="subfigthird">
        <img src="{{ '/img/kniterate-8/leonie-plating.jpg' | prepend: site.baseurl }}"/>
        <span class="mainnote"></span>
    </div>
    <div class="subfigthird">
        <img src="{{ '/img/kniterate-8/plated-elastic.jpg' | prepend: site.baseurl }}"/>
        <span class="mainnote"></span>
    </div>
    <div class="subfigthird">
        <img src="{{ '/img/kniterate-8/plated-diagonals.jpg' | prepend: site.baseurl }}"/>
        <span class="mainnote"></span>
    </div>
    <span class="mainnote">different examples from the Textile co-op where alternating front/back bed knitting is used to manipulate knit structures</span>
</figure>

Lots of the Co-op samples were knit by Leonie, who is an intern there and has experimented a lot with structural forms. Some of the most interesting ones structurally were just really simple knit files that had been cleverly structured, alternating the position of different rectangles on the front and back beds.

In trying to articulate this aspect of knit to a new audience I often fall back on ribs, both because this is almost always something someone's normally wearing (in the form of a sock or a jumper sleeve) and also because it's a really great and simple example of this form of shape manipulation. The back-front structure of a basic rib performs the same function as a telephone cord or a paper fan -- it makes an otherwise inelastic material into something stretchy, a technique long predating elastic fibres.<label for="rib" class="margin-toggle sidenote-number"></label><input id="rib" class="margin-toggle"/><span class="sidenote">I didn't manage to find out when rib originated but did find this great paper about ancient <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0204699">egyptian tabis</a> though these are alas <a href="https://en.wikipedia.org/wiki/N%C3%A5lebinding">nålebound</a> and not knit</span> My friend <a href="https://www.jifei.info/">Jifei</a> (who in many ways was my introduction to industrial knitting) had this nice term for this strand of work; the _mesoscale manipulation_ of material properties.

### knitting peoples' code

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/claude-tree.png' | prepend: site.baseurl }}"/>
	Nate's Claude tree
</span>

In addition to some of the patternwitch tests, a couple the people who joined used Claude to generate a Knitout -- one via JS, and the other directly to KCode. These were really interesting files to look at. The KCode file I vetoed as we had no way to error-check -- B mentioned that a lot of students come with AI-generated KCode files to run on the machine, but the room for error is too great.

The JS design was for a tree: it looked beautiful, but I felt pretty cautious about running it on the Textiles Co-op machine, and even after reading through some of the KCode that it generated I felt like I really wanted to read through the code properly and understand everything before we ran it. It made me want to be more familiar with the error-checking process on the CMU end (to ensure that we didn't accidentally do anything that would hurt the machine), and also made me realise a bit more explicitly that:
* machines have stakes and you gotta be careful with them
* the knitout-JS/Python route is, for better or worse, maybe one of the only ways *to* get AI-generated knit patterns onto industrial machines without integrating it directly into proprietary software (because generating KCode directly gives you loads of errors)

This reminds me of an intuition that I [wrote about](https://echo.orpheusinstituut.be/article/new-sounds) a while back, that AI code-generating tools were fundamentally a lot more expressive than, say, image-generating tools because of the difference in bandwidth.

### testing jacquard

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/mistakes.jpeg' | prepend: site.baseurl }}"/>
	a long line of issues with the Chelsea Kniterate
</span>

We were similarly pretty cautious about testing out the jacquard files generated from the CMU image processing code on the Berlin Co-op machine, as because the samples use both beds there's a lot more scope for broken needles. As B was on a video call at Chelsea, she had a go at knitting some of these 'riskier' files.<label for="hockney" class="margin-toggle sidenote-number"></label><input id="hockney" class="margin-toggle"/><span class="sidenote">There was something really nice about sending these files back and forth -- it reminded me a bit of the David Hockney <a href="https://www.lamodern.com/david-hockney-facsimile-drawings">fax machine drawings</a></span> In the morning she'd had a bunch of mechanical issues with the machine (and churned through a bunch of waste sections) but by the afternoon it was working great.

B tested out both one of the earlier plating files, and then the jacquard crab that we'd made but not tested last week. Predictably, these were quite shima-centric -- one side wasn't joined up, and the bindoff was very Shima-y, there were some bugs with specifying waste section carriers yada yada yada but... it worked! It worked great actually. The sample at the end used a really idiosyncratic tuck stitch at the back, but it worked great, and was a really nice way to round off the day.

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/crabexport.jpg' | prepend: site.baseurl }}"/>
	crabs (top left and top) on the samples board in Chelsea
</span>

<figure>
	<div class="subfig">
		<img src="{{ '/img/kniterate-8/b-crab.png' | prepend: site.baseurl }}" alt="april"/>
	</div>
	<div class="subfig">
		<img src="{{ '/img/kniterate-8/b-crab-ii.png' | prepend: site.baseurl }}" alt="august"/>
	</div>
	<span class="mainnote">B on the call with the first plated crab test (ChiMi crab)</span>
</figure>

### Opinionated Knit Software

Early on in the conference I had a really nice conversation with Todd where he asked if you could think about knit kind of like pixels -- it reminded me of the Alvin Ray Smith paper ["a pixel is not a little square"](https://library.agnescameron.info/computing%20history/A%20Pixel%20Is%20Not%20A%20Little%20Square.pdf) -- like, yes you can, but you need to be thinking about pixels in the expanded sense.


<span class="marginnote">
	<img src="{{ '/img/kniterate-8/autoknit-cone-ii.png' | prepend: site.baseurl }}"/>
	peeling the surface of the Autoknit cone into a graph of stitch locations, a bit like doing a 'slicing' operation in 3D printing software
</span>


This turned out to be a somewhat popular line of questioning, and over the course of the conference I felt like I had to really articulate what I thought a helpful mental model of knit was. The CMU [Autoknit demo](https://github.com/textiles-lab/autoknit) helped a bit, I think, as it uses a graph representation that gets across something about structure, though I think what it gains in dimensions it loses by reducing the 'point' of knit shaping to something like recreating 3D printing rather than leaning into the mesoscale weirdness that knit has the potential to explore.

I remember Ilana once saying that she doesn't tend to be very interested in jacquards -- for her they don't feel like the real craft of knit, which is a lot subtler. I can see that-- it's like something transposed on top of another medium that doesn't always care for what's underneath. I think this might be similar to the AI-bandwidth-expressiveness conversation. Treating a knit stitch like a little square can do it a disservice or make it the only way to think about it. I feel the same way when students make bad-quality embroidery files by pressing the 'make embroidery file' button in [Ink/Stitch](https://acameron.myblog.arts.ac.uk/2026/01/20/case-study-1-%e2%86%9d-pembroider/).

## Other Nice Things at Local First

The conference as a whole was great. Probably my favourite talk that I made it to apart from the Malleable Software one was Lilith's talk about [Backstitch](https://backstitch.dev/)<label for="backstitch" class="margin-toggle sidenote-number"></label><input id="backstitch" class="margin-toggle"/><span class="sidenote">When I talked to B about it she said it was so interesting <a href="https://www.inkandswitch.com/project/jacquard/">how</a> <a href="https://www.inkandswitch.com/project/patchwork/">many</a> <a href="https://www.inkandswitch.com/project/untangle/">of</a> the metaphors Ink+Switch use are about textiles.</span>, a version control system for the Godot game engine. As one of the people often tasked with un-breaking students' collaborative Unity git projects, this was an issue close to my heart and through hearing about it I also got a much stronger sense for the power of Automerge.

<span class="marginnote">
	<img src="{{ '/img/kniterate-8/scapple.png' | prepend: site.baseurl }}"/>
	scapple in action
</span>


The Malleable software talk was obviously fantastic and just so nice to see everyone up on stage doing their thing. I was really sad to miss Seph Gentle's talk about document schemas, in which my historical favourite I+S project Cambria got mentioned (pejoratively), and which seemed super exciting. Ivy's demo of [PlayBook](https://www.inkandswitch.com/project/playbook/) (I particularly enjoyed her aside about fixed toolbars in sketching applications being something 'for the first 10 minutes of using an application' and then a hindrance subsequently: it reminded me of my love for Scapple, and its totally clean interface). The Gnome developers' characterisation of their work as 'emancipatory computing'. The TLDraw Offline demo of Steve switching a lightbulb on and off.


<!-- 
cool talks:
backstitch
seph gentle?

notebooks

opinionated software

but the bindoff file uses a stitch value of 6 (looser) for those transfer rows versus 

jacquard tests

AI files

it was great showing the software to loads and loads of people who think about interfaces and getting their thoughts on it: 

### shaping
One big aspect of the software that could be better is an indication of shape

stitch maps

my answer was just, if you know you know which is a very annoying answer for a computer person to have ESPECIALLY if they don't even really know (you know).

don't like these big corny visualisations

want something lightweight and notational / symbolic -- don't want to bet into the

the CMU visualiser is useful for non-knitters as it gives you an indication and a mental model of how the fabric hangs together. it's actually pretty useful 
 -->

<!-- In a way it's cool that even a representation so pixelly as most knit software manages to be so unpixel in the end, 

cmu knitout visualiser needs to depixel.

"There are no pixels in this world, only geometry" Compilation of Unscheduled Knitting Representations paper (read it)

really crazy thesis attached in KTRG

on lab day in the morning when everyone came round, people were so interested in the autoknit software.

## Teaching and Learning Fund Presentation

B and I also did our presentation to the UAL Teaching+Learning fund, who gave us a grant to make so many of the workshops happen. It was great also to see the other things people had done: some people from Painting had done a conference on pigment, that was super cool, theory and practice. -->
