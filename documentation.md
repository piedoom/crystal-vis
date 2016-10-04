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

Okay, kind of dropped the ball on the other analyzer node :(.  Got a little too invested in the extra stuff, and now it's 4AM.  Oops.

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




