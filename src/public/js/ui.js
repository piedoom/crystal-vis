var canvasEl = document.getElementById("canvas");
var uiEl = document.getElementById("sidebar");
var searchbar = document.getElementById("search");
var results = document.getElementById("results")
var ghostingBar = document.getElementById("ghosting");
var ajax = {};

function populate(json){
    
}

ghostingBar.onchange = function(e){
    canvas.ghosting = e.target.value;
    console.log(e.target.value);
}

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
    return "<div onclick='changesong(this)' class='result-item' data-url=" + obj["Mp3Url"] + " \
    >" + obj["Title"] + "</div>";
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




var uiElSettings = {
    sidebarMaxWidth: "350"
}

function update(){
    canvasEl.width = window.innerWidth - uiElSettings.sidebarMaxWidth;
    canvasEl.height = window.innerHeight;

    uiEl.style.width = uiElSettings.sidebarMaxWidth + "px";
    uiEl.style.height = window.innerHeight + "px";
}

window.onresize = update;
update();