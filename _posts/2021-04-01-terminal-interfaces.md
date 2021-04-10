---
layout: post
author: agnes cameron
title: giving a talk in the terminal
date:  2021-04-10
description: powerpoint is quaking
tags: terminals, tricks
status: published
image: /img/terminals/presentation.png
---

A few weeks ago I got invited to give a talk as part of a panel on "The Interfaces of AI Art Practices", one I was initially somewhat surprised to be asked to give, identifying neither as an artist, nor someone that works primarily with "AI" in the sense that that term is often used, nor even someone who really thinks about interfaces very much<label for="panellists" class="margin-toggle sidenote-number"></label><input id="panellists" class="margin-toggle"/><span class="sidenote">in direct contrast to the other two panellists, [Christian Ulrik Andersen](https://mitpress.mit.edu/contributors/christian-ulrik-andersen) and [Rebecca Fiebrink](https://www.arts.ac.uk/creative-computing-institute/people/rebecca-fiebrink) who made [Wekinator](http://www.wekinator.org/)</span>. Nonetheless, it was a nice opportunity to think a bit more about my relationship to computers and work in general, maybe moreso than if I'd have felt like an obvious fit to the subject matter.

I won't give a full recount of what I said here -- there's a [recording](https://www.serpentinegalleries.org/art-and-ideas/the-interfaces-of-ai-art-practices/) of the full panel online, along with a summary writeup, but I had a few thoughts that didn't make it in, and some dumb notes on using terminal as a presentation software.


<span class="fullwidth">
	<img src="{{ '/img/terminals/presentation.png' | prepend: site.baseurl }}" alt="agnes (top right hand corner) on zoom talking about a set of terminal interfaces on a shared screen" />
</span>

I decided to reflect on both my enthusiasm for terminal interfaces, and the idea of AI in the expanded sense -- specifically, what it means to have machines that act intelligently in the world, and some of my thoughts about what it means to consider computers as 'embodied' agents with environmental awareness. It's an alignment that's a bit tenuous -- terminals are no more a 'real' representation than any other interface to computation processes, just a different standpoint on what a computer is doing. Perhaps it's more accurate to say that the terminal gives you a way of engaging with the affordances of a computer much more directly, while GUIs can hamper that engagement with uneccessary pauses or simplifications. <label for="panellists" class="margin-toggle sidenote-number"></label><input id="panellists" class="margin-toggle"/><span class="sidenote">there's a <a href="https://www.brandur.org/interfaces">nice article</a> on this by Stripe engineer Brandur</span>

As part of the [Bell Labs project](https://soup.agnescameron.info/2021/03/21/bell-system.html) I'd also been reading Rob Pike's piece [Help: A Minimalist Global User Interface](http://doc.cat-v.org/plan_9/1st_edition/help/), along with some other writing on interfaces to come out of the plan9 crew. What struck me most about it was a real clarity that an interface is just a window on a process, and that processes aren't all bound up in separate windows. When I read this paper, I had this really vivid vision of windows being like windows in a house, giving you a view onto a river: a flowing part of a much larger process taking place, with each view connected by this larger context but giving you a different perspective. Which is like, funny if you read the paper because of how basic the illiustrations are, but I guess that's what good writing is for.

## giving a talk in terminal

Of course, this was mostly a performative choice, and I'm not sure how much I'd recommend the terminal as presentation software.<label for="panellists" class="margin-toggle sidenote-number"></label><input id="panellists" class="margin-toggle"/><span class="sidenote">I'm reminded of a study that I can't seem to find, where they took a bunch of academics who liked and didn't like LaTeX, and got both groups to typeset papers in Word and in LaTeX. In both cases, the Word paper was typeset considerably faster (though I don't recall if anyone asked who had more fun...)</span> That said, I wanted to run a number of different pieces of code as part of the talk, and it was nice to be able to run them directly in the window.

The talk was written as a python script: it might have been a little more effective at certain things in bash, but I had been using python system calls very recently and figured it would be quicker and easier to debug. Most 'slides' (text in a terminal, along with some accompanying imagery or a script) were handled by this helper function:

```
def standard_slide(text, cmd):
	os.system(cmd)
	os.system('clear')
	input(text)
```

This first runs a command (e.g. running a script, opening an image), then clears the aftermath of that process and the last slide, then prints the slide text to the terminal, such that with another keypress the next slide gets triggered.

e.g.

```
standard_slide("3. permaculture network \n\n \\
with gary zhexi zhang \n \\
for schloss solitude web residency", \\
"open -a Firefox http://root.schloss-post.com")
```

The most challenging part was figuring out how to run very different processes as part of the same script, and have them return properly without breaking. In the end, I did this for everything except the Node app that I wrote as a testing interface for the Mozilla bots project, which had to be run in a separate window launched using Applescript. This was actually my first time writing any applescript: it felt a little silly because of the natural-language like interface, but also did a lot that would have been hard to achieve with pure system calls.

```
"""osascript -e 'tell application "Terminal" \\
to do script with command \\
"node /Users/agnes/etc/bot/index.js"'"""
```

Mostly, this exercise has given me some impetus to rewrite the helper command I keep in my bash profile to do some more elaborate tasks (currently just limited to navigating to directories and opening new windows with a specific profile).s