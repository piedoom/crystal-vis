"use strict";
var app;
var audio;
var canvas;
var playStates;
var processing;
var canvasStates;
var ui;
var helper;
var waveStates;

app = {
    // set some object properties
    canvas: canvas,
    audio: audio,
    // functions
    // initialize stuff
    init: function(){
        canvas.init();
        audio.init();
        // set up some handlers
        document.querySelector("#playButton").onclick = audio.toggle;
    }
};

// handle UI changes, etc.
ui = {
    spacingWidth: function(amount){
        return (canvasEl.width / amount);
    }
}

helper = {
    to_px: function (num){
        return (num + "px");
    }
}

// handles all canvas DRAWING
canvasStates = {
    PLAY: 1,
    PAUSE: 2
} 

// handles wave state
waveStates = {
    FREQUENCY: 1,
    WAVEFORM: 2
}

// a bunch of visualization objects for different effects
// must have a name, init, frame, draw, and last.
// init: stuff to do at the beginning of the lifetime of the effect. called once (or when changed to)
// frame: stuff to draw at the beginning of each frame (e.g. - beginPath())
// draw: stuff to draw for each datapoint
// last: stuff to do at the end of the frame
var vis = [
    {
        name: "bars",
        init: function(ctx){
            
        },
        frame: function(ctx){
            
        },
        draw: function(i, data, time, ctx){
            ctx.fillRect(ui.spacingWidth(data.length) * i, 0, 4, canvasEl.height / 255 * data[i] + 4)
        },
        last: function(ctx){}
    },
    {
        name: "lines",
        particles: [],
        init: function(ctx){
            
        },
        frame: function(ctx){
            ctx.beginPath();
        },
        draw: function(i, data, time, ctx){
            

            // main audio stuff
            ctx.lineTo(ui.spacingWidth(data.length) * i, canvasEl.height / 2 + (data[i] * (canvasEl.height /512))); 
            ctx.lineTo(ui.spacingWidth(data.length) * i, canvasEl.height / 2 - (data[i] * (canvasEl.height /512))); 
        },
        last: function(ctx){
            ctx.stroke();
        }
    },
]

canvas = {
    element: document.querySelector("#canvas"),
    ctx: null,
    effect: 1,
    ghosting: 0.0,
    canvasState: canvasStates.PLAY,
    init: function(){
        this.ctx = this.element.getContext("2d"),
        this.ctx.save();

        this.ctx.fillStyle = "#6ec90e";
        this.ctx.strokeStyle = "#6ec90e";
        this.ctx.save();

        vis[this.effect].init(this.ctx);

        requestAnimationFrame(this.drawFrame.bind(this));
    },
    changeState: function(newState){
        console.log(this.canvasState);
        this.canvasState = (newState);
        requestAnimationFrame(this.drawFrame.bind(this));
    },
    // MAIN DRAWING LOOP
    drawFrame: function(timestamp){
        // if currently paused, dont draw
        if (this.canvasState == canvasStates.PAUSE){
            return;
        }

        // reset to a blank canvas
        this.clearFrame();

        // get audio data for this frame
        var data = audio.getFrequencyData();

        // set up the frame for the current effect
        vis[this.effect].frame(this.ctx);

        // draw
        for (var i = 0; i < data.length; i++){
            vis[this.effect].draw(i, data, timestamp, this.ctx);
        }

        // finish up the frame
        vis[this.effect].last(this.ctx);
        requestAnimationFrame(this.drawFrame.bind(this));
    },

    clearFrame: function(){
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0,0,0," + (1 - this.ghosting) + ")";
        this.ctx.fillRect(0,0,this.element.width,this.element.height);
        this.ctx.restore();
    }
};

// handles all audio playing stuff
// set up a state
playStates = {
    PLAYING: 1,
    PAUSED: 2
};

audio = {
    // set some constants
    DEFAULT_SONG: "/media/song1.mp3",
    element: document.createElement("audio"),
    playState: playStates.PAUSED,
    NUM_SAMPLES: 512,

    // properties
    analyzerNode: null,
    audioCtx: null,
    sourceNode: null,

    // initialize
    init: function(){
        // set our audio to the default track
        this.changeSong(this.DEFAULT_SONG);
        // set some default properties
        this.element.loop = true;
        this.element.oncanplay = this.createWebAudioContextWithAnalyzerNode(this.element);
    },

    changeState: function(newState){
        if (this.playState != newState){
            this.playState = newState;
        }
    },

    // methods
    play: function(){
        this.element.play();
        this.changeState(playStates.PLAYING); 
        //canvas.changeState(canvasStates.PLAY);
        console.log("Playing song");  
    },
    stop: function(){
        this.element.pause();
        this.element.currentTime = 0;
        this.changeState(playStates.PAUSED); 
        //canvas.changeState(canvasStates.PAUSE);
        console.log("Stopping song")
    },
    pause: function(){
        this.element.pause();
        this.changeState(playStates.PAUSED); 
        //canvas.changeState(canvasStates.PAUSE);
        console.log("Pausing song");
    },
    uiToggle: function(){
        var button = document.getElementById("playButton");
        if (audio.playState == playStates.PAUSED){
            button.innerHTML = "play"
        }else{
            button.innerHTML = "pause"
        }
    },
    toggle: function(){
        if (audio.playState != playStates.PLAYING){
            audio.play();
        }else{
            audio.pause();
        }
        audio.uiToggle();
    },
    

    // change our current song
    changeSong: function(uri){
        if (typeof uri === "string"){
            // load our new song
            this.element.src = uri;
            console.log("Changed song to " + uri)
            if (this.playState == playStates.PLAYING){
                this.element.oncanplay = audio.play();
            }
            //audio.uiToggle();
        }
    },

    // create analyzer stuff
    createWebAudioContextWithAnalyzerNode: function (audioElement) {
        console.log("audio ready");
        // create new AudioContext
        // The || is because WebAudio has not been standardized across browsers yet
        // http://webaudio.github.io/web-audio-api/#the-audiocontext-interface
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext);
        
        // create an analyser node
        this.analyzerNode = this.audioCtx.createAnalyser();
        
        // fft stands for Fast Fourier Transform
        this.analyzerNode.fftSize = this.NUM_SAMPLES;
        
        // this is where we hook up the <audio> element to the analyzerNode
        this.sourceNode = this.audioCtx.createMediaElementSource(audioElement); 
        this.sourceNode.connect(this.analyzerNode);
        
        // here we connect to the destination i.e. speakers
        this.analyzerNode.connect(this.audioCtx.destination);
        return this.analyzerNode;
    },

    getFrequencyData: function(){ 
        // this schedules a call to the update() method in 1/60 seconds        
        // create a new array of 8-bit integers (0-255)
        var data = new Uint8Array(this.NUM_SAMPLES/2); 
        // populate the array with the frequency data
        // notice these arrays can be passed "by reference" 
        this.analyzerNode.getByteFrequencyData(data);
        return data//.slice(0,50);
        
        //this.waveformData = this.analyzerNode.getByteTimeDomainData(data);
    },

    getWaveformData: function(){ 
        // this schedules a call to the update() method in 1/60 seconds        
        // create a new array of 8-bit integers (0-255)
        var data = new Uint8Array(this.NUM_SAMPLES/2); 
        // populate the array with the frequency data
        // notice these arrays can be passed "by reference" 
        this.analyzerNode.getByteTimeDomainData(data);
        return data//.slice(0,50);
        
        //this.waveformData = this.analyzerNode.getByteTimeDomainData(data);
    } 
};



// start our application
function init(){
    app.init();
}

window.onload = init;
