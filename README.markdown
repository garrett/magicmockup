# MagicMockup

## About

Easily create mockups in Inkscape, without jumping through hoops!

This is currently a work-in-progress, but it's starting to work! (:


## Getting Started

To use MagicMockup, simply include the following JavaScript in 
your SVG file (directly between the `<svg>` and `<def>` tags):

    <script xlink:href="magicmockup.js" type="text/ecmascript"/>

If you're using Inkscape 0.48, you can add MagicMockup right in
Inkscape:
 1. Go to File > Document Properties...
 1. Click on the Scripting tab
 1. Enter the path to magicmockup.js in the textbox and click Add
 1. You'll see magicmockup.js added to the list of scripts

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

## Inkscape template
For your convenience, we've added InteractiveMockup.svg to use as an Inkscape template file. It has the magicmockup.js script tag already included.

To use it, copy the file to the templates folder in your Inkscape user directory.
* on Linux/Mac, it's ./config/inkscape/templates/
* on Windows, it's %APPDATA%\\Inkscape\templates\

Then, when you open Inkscape, go to File > New, and choose InteractiveMockup from the list of presets.

## Developing

MagicMarkup is written in CoffeeScript and uses jQuery. You'll
need CoffeeScript installed to develop.

You may install CoffeeScript via:

    npm install coffeescript
  
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


## Authors
* Máirín Duffy
* Garrett LeSage

## Credits
* jQuery (jquery.com)
* jQuery SVG plugin by Keith Wood (http://keith-wood.name/svg.html)
