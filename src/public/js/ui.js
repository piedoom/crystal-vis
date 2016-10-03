var canvasEl = document.getElementById("canvas");
var uiEl = document.getElementById("sidebar");

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