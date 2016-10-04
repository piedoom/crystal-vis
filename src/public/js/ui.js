var canvasEl = document.getElementById("canvas");
var uiEl = document.getElementById("sidebar");
var searchbar = document.getElementById("search");
var results = document.getElementById("results")
var ghostingBar = document.getElementById("ghosting");
var hslStroke = document.getElementById("strokeHue");
var hslFill = document.getElementById("fillHue");
var visualizerSelect = document.getElementById("visSelect");
var filSelect = document.getElementById("filSelect");
var dataSelect = document.getElementById("dataSelect");
var volumeSlider = document.getElementById("volume");

var ajax = {};

function init(){
    // populate the selection    
    for (var i = 0; i <vis.length; i++){
        item = vis[i];
        var opt = createOption(i, item.name)
        visualizerSelect.appendChild(opt);
    }

    for (var i = 0; i < filters.length; i++){
        item = filters[i];
        var opt = createOption(i, item.name)
        filSelect.appendChild(opt);
    }

    
}

function createOption(val, name){
    opt = document.createElement('option');
    opt.value = val;
    opt.innerHTML = name;
    return opt;
}

// change the current visualizer
visSelect.onchange = function(e){
    canvas.effect = e.target.value;
}

filSelect.onchange = function(e){
    canvas.filter = e.target.value;
}

dataSelect.onchange = function(e){
    // console.log(e.target.value);
    canvas.dataSource = e.target.value;
}

// change volume
volumeSlider.oninput = function(e){
    audio.gainNode.gain.value = e.target.value;
}

// change stuff for the hslStroke bar
hslStroke.oninput = function(e){
    color = hslFromDegrees(e.target.value)
    // change slider thumb background color
    e.target.style.backgroundColor = color;
    // change canvas color
    canvas.changeStrokeColor(color);
}

// change stuff for the hslFill bar
hslFill.oninput = function(e){
    color = hslFromDegrees(e.target.value)
    // change slider thumb background color
    e.target.style.backgroundColor = color;
    // change canvas color
    canvas.changeFillColor(color);
}

function hslFromDegrees(degrees){
    return "hsl(" + degrees + ",87%,42%)";
}

// change the amount of ghosting occuring with the visualizer
ghostingBar.oninput = function(e){
    canvas.ghosting = e.target.value;
    // console.log(e.target.value);
}

// perform a search with the clyp api
searchbar.onkeyup = function(e){
    ajax.get("/search/" + e.target.value, null, function(js){
        results.innerHTML = "";
        console.dir(js);
        json = JSON.parse(js);
        for (var i = 0; i < json.length; i++){
            results.style.color = "white";
            results.innerHTML += buildResult(json[i]);
        }
    });
}

// build a UI element from json
function buildResult(obj){
    return "<div onclick='changesong(this)' class='result-item' data-url=" + mp3Get(obj["Mp3Url"]) + " \
    >" + obj["Title"] + "</div>";
}

// get around CORS stuff
function mp3Get(url){
    return "/song/" + url.split('/').pop();
}

function changesong(e){
    audio.changeSong(e.dataset.url);
}

// standard get request
ajax.x = function () {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    }
    var versions = [
        "MSXML2.XmlHttp.6.0",
        "MSXML2.XmlHttp.5.0",
        "MSXML2.XmlHttp.4.0",
        "MSXML2.XmlHttp.3.0",
        "MSXML2.XmlHttp.2.0",
        "Microsoft.XmlHttp"
    ];

    var xhr;
    for (var i = 0; i < versions.length; i++) {
        try {
            xhr = new ActiveXObject(versions[i]);
            break;
        } catch (e) {
        }
    }
    return xhr;
};

ajax.send = function (url, callback, method, data, async) {
    if (async === undefined) {
        async = true;
    }
    var x = ajax.x();
    x.open(method, url, async);
    x.onreadystatechange = function () {
        if (x.readyState == 4) {
            callback(x.responseText)
        }
    };
    if (method == 'POST') {
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    x.send(data)
};

ajax.get = function (url, data, callback, async) {
    var query = [];
    for (var key in data) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};


// general UI settings
var uiElSettings = {
    sidebarMaxWidth: "350"
}

// fires whenever windowresized
function update(){
    canvasEl.width = window.innerWidth - uiElSettings.sidebarMaxWidth;
    canvasEl.height = window.innerHeight;

    uiEl.style.width = uiElSettings.sidebarMaxWidth + "px";
    uiEl.style.height = window.innerHeight + "px";
}

window.onresize = update;
update();
init();