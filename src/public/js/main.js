"use strict";
(function(){
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
        document.querySelector("#playButton").onclick = audio.uiToggle;
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

canvas = {
    element: document.querySelector("#canvas"),
    ctx: null,
    canvasState: canvasStates.PAUSE,
    init: function(){
        this.ctx = this.element.getContext("2d"),
        this.ctx.save();
        requestAnimationFrame(this.drawFrame.bind(this));
    },
    changeState: function(newState){
        console.log(this.canvasState);
        this.canvasState = (newState);
        requestAnimationFrame(this.drawFrame.bind(this));
    },
    // MAIN DRAWING LOOP
    drawFrame: function(timestamp){
        if (this.canvasState == canvasStates.PAUSE){
            return;
        }

        this.clearFrame();

        var data = audio.getFrequencyData();
        for (var i = 0; i < data.length; i++){
            this.ctx.fillStyle = "#6ec90e";
            this.ctx.fillRect(ui.spacingWidth(data.length) * i, 0, 4, canvasEl.height / 255 * data[i] + 4)
        }
        requestAnimationFrame(this.drawFrame.bind(this));
    },

    clearFrame: function(){
        this.ctx.restore();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0,0,this.element.width,this.element.height);
        this.ctx.fill();
    }
};

// handles all audio playing stuff
// set up a state
playStates = {
    PLAYING: 1,
    PAUSED: 2,
    STOPPED: 3
};

audio = {
    // set some constants
    DEFAULT_SONG: "/media/song1.mp3",
    element: document.createElement("audio"),
    playState: 3,
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
    },

    changeState: function(newState){
        this.playState = newState;
    },

    // methods
    play: function(){
        this.element.play();
        this.changeState(playStates.PLAYING); 
        canvas.changeState(canvasStates.PLAY);
        console.log("Playing song")
    },
    stop: function(){
        this.element.pause();
        this.element.currentTime = 0;
        this.changeState(playStates.STOPPED); 
        canvas.changeState(canvasStates.PAUSE);
        console.log("Stopping song")
    },
    pause: function(){
        this.element.pause();
        this.changeState(playStates.PAUSED); 
        canvas.changeState(canvasStates.PAUSE);
        console.log("Pausing song")
    },
    toggle: function(){
        if (audio.playState != playStates.PLAYING){
            audio.play();
        }else{
            audio.pause();
        }
        return (audio.playState != playStates.PLAYING);
    },
    uiToggle: function(e){
        if (audio.toggle()){
            e.target.innerHTML = "play"
        }else{
            e.target.innerHTML = "pause"
        }

    },

    // change our current song
    changeSong: function(uri){
        if (typeof uri === "string"){
            // stop the currently playing song
            this.stop();
            // load our new song
            this.element.src = uri;
            console.log("Changed song to " + uri)
            this.element.oncanplay = this.createWebAudioContextWithAnalyzerNode(this.element);
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
})();