# MagicMarkup

## About

Easily create mockups in Inkscape, without jumping through hoops!

This is currently a work-in-progress, but it's starting to work! (:


## Getting Started

To use MagicMockup, simply include the following JavaScript in 
your SVG file (directly between the `<svg>` and `<def>` tags):

    <script xlink:href="magicmockup.js" type="text/ecmascript"/>

Inkscape plays nicely with the script tags, so you only have to
add it once per file, and you can save as much as you want.

To make regions of the document clickable, have each frame as a
layer and give the layer an id. For the clickable shape, add
some directives in the object properties dialog inside of the
"Description" entry.

You invoke a directive as `directive=layerName`, e.g. `next=Layer2`.
You can add multiple directives by putting each directive on a new line.

We currently support the following directives:

* next=layer : Show only the specified layer
* show=layer1,layer2.. : Show the specified layers
* hide=layer1,layer2.. : Hide the specified layers
* toggle=layer1,layer2.. : Toggle the specified layers
* fadeOut=layer,seconds(1),easing(linear) : fade out the specified layer in &lt;seconds&gt;seconds (1sec default) with &lt;easing&gt; easing function (`linear` by default). Easing functions supported are `swing`, and `linear`.

Now, you can make interactive mockups! Also,
clickable areas (buttons, etc.) are indicated by a mouse pointer.

More directives are planned. Stay tuned! We're planning
on adding inter-document linking as well.

## Developing

MagicMarkup is written in CoffeeScript and uses jQuery. You'll
need CoffeeScript installed to develop.

You may install CoffeeScript either via:

    gem install coffee-script
  
...or...

    npm install coffee-script
  
...Depending on if you are using Ruby & Gem or Node.js & NPM.
As CoffeeScript is JavaScript, we suggest installing Node.js
and using `npm` for installation.

Build magicmockup.js using `cake build` - this will compile magicmockup.coffee and concatenate it with the dependencies in the deps/ directory.

There is a really simple script included for helping you to
remember the commands to start a test webserver (based on Python —
although any web server would work).


## TODO

* More Directives
* Easier setup (no SVG hand-editing, even if it's just copy/paste)
* External document links
* Animations
* External directive file (possibly)

More details in our EtherPad discussion:
http://ietherpad.com/g6KdUcpNIH


## Authors
* Máirín Duffy
* Garrett LeSage

## Credits
* jQuery (jquery.com)
* jQuery SVG plugin by Keith Wood (http://keith-wood.name/svg.html)
