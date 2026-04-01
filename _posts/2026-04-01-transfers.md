---
layout: post
title:  "knitout and kniterate 3"
author: agnes cameron
date:  2026-04-01
description: ribbers, tests, transfers, and casting off
status: draft
image: 
---

This week I learned 2-bed knitting on the domestic machine, and made some progress on the Knitout-> Kniterate code visualiser. We also managed to get a bunch of tests to run on the Kniterate, most of which worked fairly well. We also visited an exhibition of some work by visiting students from NAFA (National Academy of Fine Art Singapore), which featured a really great and inspiring bit of Kniterate work.

### making friends with the ribber

This past weekend, Rosie and I went to Knitworks to do a [workshop](https://knitworkslondon.com/products/advanced-ribbing-attachment) on the Brother ribber. Neither of us had worked with one before, and it was really useful for getting a material understanding of what's happening on a 2-bed machine.

We practiced a cast-on, different ribs, and experimented with plating and racking (which might be a nice thing to re-create on the Kniterate). After the session, I went to my studio to set up the ribber that had come with my Brother machine, but that I'd not used before! It was pretty straightforward to set up: the hardest part was figuring out how to attach the brackets to the ribber as they'd been taken off. These are sprung, to allow the bed to latch up and down.

## kniterate testing

### testing the waste section

The first thing we did at Chelsea was to test the waste section sample we'd generated before. All I needed to do was add a set of rows of front bed knitting. I decided to do this by using the waste generation file as intended -- I made a rectangle on the front bed, and then appended the waste section using a script.

This turned out this was easier said than done: the lines I'd added to the cast-on section messed up the carrier directions because I was bringing them in twice: once in the tucked section and once again in the kniterate-style introduction that happens further up. In the end I ended up adding a few extra rows to hack this together so we had something to test with, but I'll need to sort this out properly later on.

The tests went well: B was quite pleased with the double introduction as it means the yarns are brought in early on, getting around an issue with yarn height on their kniterate, and saves her from manually bringing the carriers in. It was really cool seeing our code turn from code into actual, knitted material -- and in seeing the correspondences between the knitout and kniterate-editor based cast-on.

We encountered another issue, which is that bringing carriers 'out' from the right hand side means that they trail over the whole knit to move to the Home position. For now we just move the 'out' statement to the end (as they're not as important in kniterate anyway), but the other way around this would be to always ensure the drawthread ends up on the RHS (thinking about it, this is non-ideal as it fixes the cast-on direction of the input file... so we won't do that). 

<span class="marginnote">
B said that bringing carriers 'in' and 'out' was more of a Shima thing -- when they're not being knit they just sit there, they don't do that much.
</span>

Once we'd got this working, we made a couple of test samples -- one with a 1x1 rib, one with a fisherman's rib (same as the waste section). Both of these knitted well, though they could have been a little tighter.

### casting off

The next thing to test was casting off (after B spent about 20 minutes manually casting off the first sample). Initally, I got a castoff pattern 

Casting off (in US-based knitout 'binding off') 

B remarked that this was 'very shima-y' (probably because we uncritically grabbed it from the )

does any of Gabrielle's code have a kniterate bindoff?

Adapted to match the one from the kniterate editor

refactoring the code to work with the front end
going through it line by line and trying to understand what's happening

lots!!

taking stuff out without breaking it
main issue: having carriers on the right side
change this to being a state variable

```
k.xfer("f" + n, "b" + n);
k.rack(1.0);
k.xfer("b" + n, "f" + (n+1));
k.rack(0.25);
if ((n-min) % 2 === 1) {
	k.tuck("+", "b" + n, Carrier); // every other stitch held by back bed
}
k.knit("+", "f" + (n+1), Carrier);
if (n+2 <= max) {
	k.miss("+", "f" + (n+2), Carrier);
}
k.rack(0.0);
```
<figure>
    <img src="{{ '/img/kniterate-code/correspondence.png' | prepend: site.baseurl }}" alt="main"/>
    <span class="mainnote">The end result file, plus details of where we think it corresponds to the visualisation in the knitout editor. Without being able to go from .kc -> .k or from .kc -> Kniterate Editor, we won't know how correct this is until we try it on the machine!</span>
</figure>


updated code to match kniterate editor

```
k.xfer("f" + n, "b" + n);  // front to rear transfer
k.rack(1.0); // rack 1
k.xfer("b" + n, "f" + (n+1));
k.rack(0.25);
k.knit("+", "f" + (n+1), Carrier);
k.rack(0.0);
```

<figure>
    <div class="subfig">
        <img src="{{ '/img/kniterate-3/kniterate-bindoff.png' | prepend: site.baseurl }}"/>
    </div>
    <div class="subfig">
        <img src="{{ '/img/kniterate-3/knitout-bindoff-2.png' | prepend: site.baseurl }}"/>
    </div><br>
    <span class="mainnote">the kniterate editor bindoff, compared to the equivalent in knitout</span>
</figure>

she does this here
https://github.com/gabrielle-ohlson/knitout-kniterate-3D/blob/c65ca94077a890da58b95498d2742eedf12e381a/knitout_kniterate_3D/knit3D.py#L2116


```
	k.xfer(f'b{x}', f'f{x}')
	k.rack(1)
	k.xfer(f'f{x}', f'b{x-1}')
	k.rack(0)
	[...]
	k.knit('-', f'b{x-1}', c)
```

the ... part
```
if x != xferNeedle+count-1:
	if not asDecMethod and (xferNeedle+count) - x == 30: k.rollerAdvance(0)
	elif x < xferNeedle+count-4 and (asDecMethod or (xferNeedle+count) - x < 30): k.addRollerAdvance(-50)
	k.drop(f'b{x+1}')
if not asDecMethod and (xferNeedle+count) - x >= 30: k.addRollerAdvance(50)
```

## knitout -> kniterate editor

### updating the interface

first thing to do was add kcode export button. this was pretty straightforward, just used gabrielle's code.

### auto exporting the waste section

This requires a more in-depth refactor, partly also to overcome some of the issues we ran into 

### understanding kcode

first thing to do was add kcode export button. this was pretty straightforward, just used gabrielle's code.

### ideas for helper functions

Kniterate's "do my transfers" function is really good and helpful. It's also quite complicated but I wonder if there's a nice higher level js function that can handle simple cases -- e.g. manage transfers between 2 rows.



## NAFA Kniterate Sample

In the Triangle Space at Chelsea

This made me think about using elastic to do shaping in the 
Papers 

### next steps

Double bed jacquard.