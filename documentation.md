# IGME 330 Documentation
Alexander Lozada

-------

Bugs
=====

Okay, thought I might as well go over these first.  Note that these might be fixed on my [github](https://github.com/piedoom/crystal-vis/) before you grade it.

- [ ] Vis disappears when resizing

(this is all I found but I'm sure I'll find more...)

Requirements
======

1. Usability
2. Design:

I think the app is very polished in terms of UI!  I spent a lot of time making things look pretty with CSS.  Everything is clearly labeled
and responsive.

3. Canvas

All requirements are accounted for!

4. Web Audio API

Uses analyzer and gain nodes.

6. Code

I wrote everything and tried to make it as nice as possible!  I know there are some global variables (things kept breaking when I changed them :(

But everything else should be nice.  I even set it up so that you can easily write new effects/filters without touching HTML.

Actual Documentation
======

#### Technology
Because I needed a server for this project, I opted for using [Kemal](htp://Kemalcr.com) with Crystal.
They're both upcoming technologies, so I thought this might be a good chance to learn!  

Most of my code is in the "src" folder.  The server lives at "vis.cr".  There, you'll find various simple routes that make the application work properly.
Most notable, perhaps, is the following: 

```ruby
get "/song/:id" do |env|
  env.response.headers["Access-Control-Allow-Origin"] = "*"
  env.response.content_type = "audio/mpeg"
  id = env.params.url["id"]
  file = HTTP::Client.get "http://a.clyp.it/#{id}"
  file.body
end
```

Because of CORs, I have basically set up a proxy to audio files so I can control their headers.  It works pretty well!

Kemal also uses `ecr`, or embedded crystal like Rails uses `erb`.  The main app is in the views folder.  It's actually just straight up HTML and
doesn't use any templating.

Building
======

To build, you'll need a Mac or Linux box and Crystal installed.  Navigate to the root directory, and execute the following.

```
shards install
```

This will install dependencies.  To run, execute:

```bash
crystal src/vis.cr
```

And then open `localhost:3000`.

Files
======

The rest of the files live in the `public` folder.

### `main.js`

This file is where most of the logic of the app resides.

`app`: sets some basic properties for the application.  (Doing this over, `app` would contain everything in this file.)

`ui`: has a basic helper for determining spacing.

`helper`: contains a basic helper for converting to CSS values

`canvasStates`: enum for determining the state of the canvas, Paused or Playing

`waveStates`: enum for determining if we are using the Frequency or Waveform of the sample

`vis`: holds an array of visualization objects that are then used in the draw method.  Each object contains a name property, and a few functions

- `frame`: executes every frame
- `draw`: executes for every data point
- `last`: executes at the end of every frame

Set up this way, I can easily write new visualizers without touching any HTML.

`filters`: likewise, filters contain objects that apply filters to the canvas.  Each object has a name, and a filter function.

`canvas`: This is the meat of the application.  It takes the data from all of these objects and actually draws it on our canvas.

`audio`: This object contains audio data as well as basic functions like `play`.  It uses an enum to determin it's state, and changes
UI accordingly.  It also hooks up the analyzer node to analyze the song.

What went right (and wrong)
======

After making 99% of the application, I realized how I could better structure
objects to make things more maintainable.  Right now, there's some
overlap between UI and Audio processing.  I think each object should
have only one purpose, and each module should have one goal.  

The API thing worked great!  Using Kemal was an adventure since it
has like 0 documentation, but I managed to make it work.  That was fun.

Given more energy, I would write some more impressive visualizations.
Right now they're a little lacklustre.  I would probably have a background
canvas layer so two visualizations could be played at once.

Future
======

I was actually looking for audio visualization stuff earlier and couldn't find anything decent.  I'd like to condense this stuff
and make it a module of some sort.

Resources
======

I'm using the clyp.it API to fetch songs.  The intial song is a local file,
and I made that one.  I used MDN for documentation.

Grade Myself
======

Grading myself based on effort and time, I would give myself 100%.  
Based on the ruberic, I notice I forgot gradients, so I would give myself
a 93% :).  But also I totally went above and beyond by making my own server 
and using git, so... 170%.
