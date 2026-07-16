---
layout: post
title:  "kniterate notes 8"
author: agnes cameron
date:  2026-07-09
description: material programming goes to local first conference
status: draft
image: "/img/kniterate-8/image4.jpg"
---

<p class="topnote">This is the eighth in a series of blog posts about the <a href="https://cci.arts.ac.uk/~material/">Material Programming Project</a>. We are developing malleable knitting software for the <a href="https://www.kniterate.com/">Kniterate</a>, a semi-industrial knitting machine. This post is mostly about running a workshop as part of Lab Day at a <a href="https://www.localfirstconf.com/">Local First Conference</a>, and successfully doing some long distance knitting. The first post, on the Knitout project, is available <a href="https://soup.agnescameron.info/2025/09/20/kniterate.html">here</a>.</p>

## Knitting at Lab Day

We were invited to [Local First Conference](https://www.localfirstconf.com/) by [Ink and Switch](https://www.inkandswitch.com/) to demo the knitting software we'd been making as an example of 'malleable software' at their Lab Day. 'Lab Day' is a day at the end of the 3 days given over to demos both of different Ink and Switch projects, and an open program where other attendees can share their work. In the spirit of practical engagement with the medium, we got in touch with the extremely lovely people at [Berlin Textile Co-Op](https://www.berlintextilecoop.com/) who kindly agreed to let us run our experimental files on their Kniterate for a day.<label for="thanks" class="margin-toggle sidenote-number"></label><input id="thanks" class="margin-toggle"/><span class="sidenote">everyone at every stage of this process was so generous and supportive and kind to us and it's been a really cool couple of weeks for malleable knitting as a result! Thanks Boris Peter Sara Leonie Chee Mimi and everyone else <3</span>

As the Kniterate can't (easily) be moved, the day was structured two parts: in the morning we'd demo the software and get people to make Knitout files, and in the afternoon head to the co-op and knit them out. B also wasn't able to make it to Berlin in the end, so we ran the afternoon session via video link; B with the Kniterate in Chelsea, and me with the Kniterate in Friedrichshain. This format actually turned out to work really well, and let us test out a bunch of really exciting files.

### Patternwitch + Plating

Following on from our conversations about colour the previous week, Mimi developed a tiny paint tool called 'Patternwitch', which lets you paint a bitmap and then underneath in automerge it writes them into a big array of arrays. It's already a nice demo of [Automerge](https://automerge.org/)/Patchwork because if you go and edit the array the image updates in realtime and vice versa. Chee and Mimi included it in their malleable software talk, which was also so cool and funny. 

Chee's crab demo from [last week](/2026/07/09/colourwork.html) was running off a Patternwitch array, but wasn't going to hang together very well as knit fabric. I considered using jacquard after spending a bit of time with the CMU image processing code, but this was also a bit stressful to test on the Berlin Co-op machine as jacquard can be quite intense on the machine.

I decided instead to test out a technique called plating, which allows you to make a 2-colour design by threading the carrier using two threads and then alternating front and back beds<label for="plating" class="margin-toggle sidenote-number"></label><input id="plating" class="margin-toggle"/><span class="sidenote">for more on plating, take a look at the notes from the first student workshop back in <a href="/2026/03/07/kniterate-notes.html#rib-and-knit-structure">March</a>, where we used it extensively.</span> If the carrier is properly threaded, colour 1 gets pushed to the front, and colour 2 gets pushed to the back. As it only uses one bed at a time, this is way less stressful for the machine: a good candidate for testing in a new environment.

Gratifyingly this was 1) easy to code and 2) worked really really well. I went over to the co-op to meet Sara and Leonie the day before, and we tested out a little patternwitch horse. The file itself is a bit underwhelming, but the issue was that we set up the plating feeder wrong: everything else went well!

### [cute bug](https://en.wikipedia.org/wiki/Green_stink_bug) report

automerge concatenates arrays -- obvi an error but also so nice to get a material feel for automerge!
like, ahh, that's an automerge flavoured issue

### demo-ing the software
Maybe predictably? when I was demoing the software in the morning people were not so interested in making knit files but really _really_ interested in hearing about and seeing pictures of the industrial knitting machines, and learning more generally about how knit fabric is constructed. It's funny because in all the student workshops we were working a lot with students who had a fairly unique level of access to machine knitting contexts, and while excited about the kniterate were also at a point of being ready to get really stuck in with the different editors.

Anyway, I had a pres


### testing jacquard

B was on call in Chelsea and knitted the 'riskier' jacquard files. It was funny, we spend so much time talking and thinking and writing code and you also need to make the thing.

david hockney photocopier paintings, mail art

ink+switch scarf

## Local First

The conference as a whole was great. Probably my favourite talk that I made it to apart from the Malleable Software one was Lilith's talk about Backstitch<sidenote>
When I talked to B about it she said it was so interesting <a href="https://www.inkandswitch.com/project/jacquard/">how</a> <a href="https://www.inkandswitch.com/project/patchwork/">many</a> <a href="https://www.inkandswitch.com/project/untangle/">of</a> the metaphors Ink+Switch use are about textiles.</sidenote>, a version control system for the Godot game engine. As one of the people often tasked with un-breaking students' collaborative Unity git projects, this was an issue close to my heart and through hearing about it I also got a much stronger sense for the power of Automerge.


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

One of the people who joined used Claude to generate a Knitout-JS script. It was super interesting: bc of code online, targeted Shima. file looked fine but uncertain about some of the commands.

The design looked beautiful but I got nervous about running it on the textiles co-op machine. This made me realise a few things:
* machines have stakes and you gotta be careful with them.
* actually this is maybe one of the only ways *to* get ai generated knit patterns onto industrial machines

## Opinionated Software

Early on in the conference I had a really nice conversation with Todd where he asked if you could think about knit kind of like pixels -- it reminded me of the Alvin Ray Smith paper "a pixel is not a little square" -- like, yes you can, but you need to be thinking about pixels in the expanded sense.


a pixel is not a little square -- point samples -- points on a graph. a stitch is a node in a network! its colour is almost irrelevant.


This turned out to be a somewhat popular line of questioning, and over the course of the conference I felt like I had to really articulate what my mental model of knit was. I think what I came to was that knitted stitches are points on a network and are both geometric and textured and coloured all at once -- but it's true that there's also a rastered-ness to them that is really pixelly if you're not careful.

I remember Ilana once saying that she doesn't tend to be very interested in jacquards -- for her they don't feel like the real craft of knit, which is a lot subtler. I can see that-- it's like something transposed on top of another medium that doesn't always care for what's underneath. Treating a knit stitch like a little square can do it a disservice or make it the only way to think about it. I feel the same way when students make bad-quality embroidery files by pressing the 'make embroidery file' button in Ink/Stitch.

In a way it's cool that even a representation so pixelly as most knit software manages to be so unpixel in the end, 

cmu knitout visualiser needs to depixel.

"There are no pixels in this world, only geometry" Compilation of Unscheduled Knitting Representations paper (read it)

really crazy thesis attached in KTRG

on lab day in the morning when everyone came round, people were so interested in the autoknit software.

## Teaching and Learning Fund Presentation

B and I also did our presentation to the UAL Teaching+Learning fund, who gave us a grant to make so many of the workshops happen. It was great also to see the other things people had done: some people from Painting had done a conference on pigment, that was super cool, theory and practice.
