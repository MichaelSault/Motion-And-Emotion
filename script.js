var ci;
var images = ['pinguin1.bmp', 'pinguin3.bmp', 'scie1.bmp', 'scie2.bmp'];
var mdir = './media/';
var gui_currentFile, gui, ci, a;
var recording = false;
var playing = false;
var respawning_gui = false;
var gui_currentFile, gui_xPos, gui_yPos, gui_xScale, gui_yScale, gui_rotation, gui_sheerX, gui_sheerY, gui_reset, canvas;
var rotating = false;
var rdirection = 0;
var growing = false;
var shrink = 0;
var stretching = false;
var thin = 0;
var enlarging = false;
var enlarge_toggle = 0;
var pulsing = false;
var pulse_toggle = false;
var pdirection = 0;
var bouncing = false;
var bounce_toggle = false;
var bdirection = 0;
var wadling = false;
var waddle_toggle = false;
var wdirection = 0;

class pathplay {
    constructor() {
        this.start = 0;
        this.end = 0;
        this.current = 0;
        this.status = "";

        this.loadPath = function (l) {
            this.start = 0;
            this.end = l.length;
        };

        this.goForward = function () {
            if (this.current < this.end) {
                this.current++;
                console.log("Current frame: ", this.current);
                return 0;
            } else {
                return -1;
            }

        };

        this.goBackward = function () {
            if (this.current > this.start) {
                this.current--;
                return 0;
            } else {
                return -1;
            }

        };

        this.stop = function () {
            this.current = this.start;
            this.status = "STOPPED";
        };

        this.pause = function () {
            this.status = "PAUSED";
        };
    }
}

class recpath {
    constructor() {
        this.x = [];
        this.y = [];
        this.length = 0;
        this.push = function (x, y) {
            this.x.push(x);
            this.y.push(y);
            this.length++;
        };
        this.clear = function () {
            this.x = [];
            this.y = [];
            this.length = 0;
        };
    }
}

class recpaths {
    constructor() {
        this.saves = [];
        this.length = 0;
        this.selectedPath = new recpath();

        this.push = function (p) {
            this.saves.push(p);
            this.length++;
        };

        this.selectPath = function (index) {
            this.selectedPath.x = this.saves[index].x;
            this.selectedPath.y = this.saves[index].y;
            this.selectedPath.length = this.saves[index].length;
        };
    }
}

class newimage {
    constructor() {
        this.imageSelector = images[0];
        this.image = loadImage(mdir + images[0]);
        this.x = this.y = 0;
        this.scaleX = this.scaleY = this.xyRatio = 1;
        this.lockRatio = false;
        this.rotation = 0;
        this.shearX = this.shearY = 0;
        this.id = -1;
    }

    reset() {
        this.imageSelector = images[0];
        this.x = this.y = 0;
        this.scaleX = this.scaleY = this.xyRatio = 1;
        this.lockRatio = false;
        this.rotation = 0;
        this.shearX = this.shearY = 0;
    }
}

class imagecollection {
    constructor(){
        this.imageList = [];

        this.get_imageListForExport = function() {
            var elist = [];
            this.imageList.forEach(i => {
                let ei = {
                    imageSelector: i.imageSelector,
                    x: i.x, y: i.y, scaleX: i.scaleX, scaleY: i.scaleY, xyRatio : i.xyRatio,
                    lockRatio: i.lockRatio, rotation: i.rotation, shearX: i.shearX, shearY: i.shearY,
                    id: i.id
                };
                elist.push(ei);
            });
            return elist;
        };
    }
}


var p = new recpath();
var paths = new recpaths();
var play = new pathplay();
var maincollection = new imagecollection();
var imageList = maincollection.imageList;

function setup() {
    var cc = document.getElementById("canvascontainer");
    var t = document.getElementById("top");
    canvas = createCanvas(cc.clientWidth, window.innerHeight-t.clientHeight - document.getElementById("ctrl_images").clientHeight);
    canvas.parent('canvascontainer');
    imageMode(CENTER);
    imageList.push(new newimage());
    ci = imageList[0];
    ci.id = 0;
    angleMode(DEGREES);
    frameRate(9999);
    fill('#000000');
}



function draw() {
    background(255, 255, 255);
    imageList.forEach(i => {
        push();
        shearX(i.shearX);
        shearY(i.shearY);
        translate(i.x + (i.image.width * i.scaleX / 2), i.y + (i.image.height * i.scaleY / 2));
        rotate(i.rotation);
        image(i.image, 0, 0, i.image.width * i.scaleX, i.image.height * i.scaleY);
        pop();
        //translate(-(i.x + (i.image.width * i.scaleX / 2)), -(i.y + (i.image.height * i.scaleY / 2)));
        //rotate(0);
    });

    if (recording)
        for (var i = 0; i < p.length; i++)
            ellipse(p.x[i], p.y[i], 5, 5);

    if (playing) {
        playNextFrame();
    }

    if(rotating){
        rotation();
    }

    if(growing){
        grow();
    }

    if (stretching){
        strech();
    }

    if (enlarging){
        enlarge();
    }

    if (pulsing){
        pulse();
    }

    if (bouncing){
        bounce();
    }

    if (wadling){
        waddle();
    }
}

window.addEventListener("keydown", handlekeydown, true);


function handlekeydown(e) {
  console.log("debug");
  console.log("keycode: "+e.keyCode);

//thin and widden(a and d)
  if (e.keyCode == 65) {    //z to make thin
    if (thin == 0 && stretching) {  
        thin = 1;
    }else {
        thin = 1;
        if (stretching){
            stretching = false;
        } else stretching = true;
    }
  } else if (e.keyCode == 68) { //x to make fat
    if (thin == 1 && stretching) {  
        thin = 0;
    }else {
        thin = 0;
        if (stretching){
            stretching = false;
        } else stretching = true;
    }

//grow tall and short (w and s)
  } else if (e.keyCode == 83) { //c to make short
    if (shrink == 0 && growing) {  
        shrink = 1;
    }else {
        shrink = 1;
        if (growing){
            growing = false;
        } else growing = true;
    }
  } else if (e.keyCode == 87) { //v to make tall
    if (shrink == 1 && growing) {  
        shrink = 0;
    }else {
        shrink = 0;
        if (growing){
            growing = false;
        } else growing = true;
    }

//elarge and shrink both x and y (use r and f)
  } else if (e.keyCode == 70) { //r to make big
    if (enlarge_toggle == 0 && enlarging) {  
        enlarge_toggle = 1;
    }else {
        enlarge_toggle = 1;
        if (enlarging){
            enlarging = false;
        } else enlarging = true;
    }
  } else if (e.keyCode == 82) { //f to make small
    if (enlarge_toggle == 1 && enlarging) {  
        enlarge_toggle = 0;
    }else {
        enlarge_toggle = 0;
        if (enlarging){
            enlarging = false;
        } else enlarging = true;
    }

//rotate either direction (use q and e)
  } else if (e.keyCode == 69) { //e rotates left
    if (rdirection == 1 && rotating) {
        rdirection = 0;
    } else {
        rdirection = 0;
        if (rotating){
            rotating = false;
        } else {
            rotating = true;
        }
    }
  } else if (e.keyCode == 81) { //q rotates right
    if (rdirection == 0 && rotating) {
        rdirection = 1;
    } else {
        rdirection = 1;
        if (rotating){
            rotating = false;
        } else {
            rotating = true;
        }
    }
}
}

function button_pulse(){
//pulse by pressing 2
    if (pulsing) {
        pulsing = false;
        console.log("pulsing is false");
    } else {
        pulsing = true;
        console.log("pulsing is true");
    }
}

function button_bounce(){
//bounce by pressing 3
    if (bouncing) {
       bouncing = false;
        console.log("bouncing is false");
    } else {
        bouncing = true;
        console.log("bouncing is true");
    }
}

function button_waddle(){
//shake or waddle by pressing 1
    if (wadling) {
        wadling = false;
        console.log("wadling is false");
    } else {
        wadling = true;
        console.log("wadling is true");
    }
}

function button_anistop(){
    wadling = false;
    bouncing = false;
    pulsing = false;
}

//animation functions
function strech(){
    if (thin == 0) {
        if (ci.scaleX <= 2) {
            ci.scaleX = ci.scaleX + 0.01;
        } else stretching = false;
    }
    else if (thin == 1) {
        if (ci.scaleX >= 0.1) {
            ci.scaleX = ci.scaleX - 0.01;
        } else stretching = false;
    }
}

function grow(){
    if (shrink == 0) {
        if (ci.scaleY <= 2) {
            ci.scaleY = ci.scaleY + 0.01;
        } else growing = false;
    }
    else if (shrink == 1) {
        if (ci.scaleY >= 0.1) {
            ci.scaleY = ci.scaleY - 0.01;
        } else growing = false;
    }
}

function enlarge(){
    if (enlarge_toggle == 0) {
        if (ci.scaleX <= 2 || ci.scaleY <= 2) {
            ci.scaleX = ci.scaleX + 0.01;
            ci.scaleY = ci.scaleY + 0.01;
        } else enlarging = false;
    }
    else if (enlarge_toggle == 1) {
        if (ci.scaleX >= 0.1 || ci.scaleY >= 0.1) {
            ci.scaleX = ci.scaleX - 0.01;
            ci.scaleY = ci.scaleY - 0.01;
        } else enlarging = false;
    }
}

function rotation() {
    if (rdirection == 0) {
        ci.rotation = ci.rotation + 1;
    }
    else if (rdirection == 1) {
        ci.rotation = ci.rotation - 1;
    }
}

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); 
        } while(d2-d < ms);
}

//idle animation functions
function waddle(){
    if ((wdirection < 20) && (waddle_toggle == false)) {
        ci.rotation = ci.rotation + .5;
        wdirection++;
    } else if ((wdirection > 20) && (waddle_toggle == true)){
        ci.rotation = ci.rotation - .5;
        wdirection--;
    } else if ((wdirection == 20)){
        if (waddle_toggle == true) {
            wdirection = wdirection - 40;
            waddle_toggle = false;
        } else if (waddle_toggle == false) {
            wdirection = wdirection + 40;
            waddle_toggle = true;
        }
    }
}

function bounce(){
    if ((bdirection < 50) && (bounce_toggle == false)) {
        ci.scaleY = ci.scaleY + 0.001;
        bdirection++;
    } else if ((bdirection > 50) && (bounce_toggle == true)){
        ci.scaleY = ci.scaleY - 0.001;
        bdirection--;
    } else if ((bdirection == 50)){
        if (bounce_toggle == true) {
            bdirection = bdirection - 50;
            bounce_toggle = false;
        } else if (bounce_toggle == false) {
            bdirection = bdirection + 50;
            bounce_toggle = true;
        }
    }
}

function pulse(){
    if ((pdirection < 50) && (pulse_toggle == false)) {
        ci.scaleX = ci.scaleX + 0.001;
        pdirection++;
    } else if ((pdirection > 50) && (pulse_toggle == true)){
        ci.scaleX = ci.scaleX - 0.001;
        pdirection--;
    } else if ((pdirection == 50)){
        if (pulse_toggle == true) {
            pdirection = pdirection - 50;
            pulse_toggle = false;
        } else if (pulse_toggle == false) {
            pdirection = pdirection + 50;
            pulse_toggle = true;
        }
    }
}


window.onload = function () {
    gui = new dat.GUI();
    var gui_fManip = gui.addFolder('Manipulate');

    //manipulation
    gui_xPos = gui_fManip.add(ci, 'x', 0, canvas.width-551).listen().name('Move Horizontally');
    gui_yPos = gui_fManip.add(ci, 'y', 0, window.height - 551).listen().name('Move Vertically');
    gui_xScale = gui_fManip.add(ci, 'scaleX', 0, 2).listen().name('Stretch Horizontally');
    gui_yScale = gui_fManip.add(ci, 'scaleY', 0, 2).listen().name('Stretch Vertically');
    gui_rotation = gui_fManip.add(ci, 'rotation', 0, 359).listen().name('Rotate');
    gui_sheerX = gui_fManip.add(ci, 'shearX', -90, 90).listen();
    gui_sheerY = gui_fManip.add(ci, 'shearY', -90, 90).listen();
    gui_reset = gui_fManip.add(ci, 'reset').name('Reset Settings');

    window.respawnGUI = function () {
        var temp_ci = ci;
        gui_fManip.remove(gui_xPos);
        gui_fManip.remove(gui_yPos);
        gui_fManip.remove(gui_xScale);
        gui_fManip.remove(gui_yScale);
        gui_fManip.remove(gui_rotation);
        gui_fManip.remove(gui_sheerX);
        gui_fManip.remove(gui_sheerY);
        gui_fManip.remove(gui_reset);

        //manipulation
        gui_xPos = gui_fManip.add(ci, 'x', 0, canvas.width - ci.image.width).listen().name('Move Horizontally');
        gui_yPos = gui_fManip.add(ci, 'y', 0, canvas.height - ci.image.height).listen().name('Move Vertically');
        gui_xScale = gui_fManip.add(ci, 'scaleX', 0, 2).listen().name('Stretch Horizontally');
        gui_yScale = gui_fManip.add(ci, 'scaleY', 0, 2).listen().name('Stretch Vertically');
        gui_rotation = gui_fManip.add(ci, 'rotation', 0, 359).listen().name('Rotate');
        gui_sheerX = gui_fManip.add(ci, 'shearX', -90, 90).listen();
        gui_sheerY = gui_fManip.add(ci, 'shearY', -90, 90).listen();
        gui_reset = gui_fManip.add(ci, 'reset').name('Reset Settings');

        // gui_xPos.setValue(temp_ci.x);
        // gui_yPos.setValue(temp_ci.y);
        // gui_xScale.setValue(temp_ci.scaleX);
        // gui_yScale.setValue(temp_ci.scaleY);
        // gui_rotation.setValue(temp_ci.rotation);
        // gui_sheerX.setValue(temp_ci.shearX);
        // gui_sheerY.setValue(temp_ci.shearY);
        respawning_gui = false;
    };

    gui_fManip.open();

    var btn_play = document.getElementById("playpath");
    var btn_stop = document.getElementById("stoppath");
    var btn_pause = document.getElementById("pausepath");
    var btn_record = document.getElementById("rec");
    var ddn_savedPaths = document.getElementById("savedpaths");
    var ddn_selectimage = document.getElementById("selectnewimage");
    var btn_addImage = document.getElementById("addnewimage");
    var btn_delImage = document.getElementById("removenewimage");
    var ddn_displayimage = document.getElementById("displayedimage");

    var i1 = document.createElement('option');
    i1.text = "Image #1";
    i1.value = 0;
    ddn_selectimage.appendChild(i1);
    btn_play.disabled = btn_pause.disabled = btn_stop.disabled = ddn_savedPaths.disabled = true;
    btn_record.disabled = false;

    for (var i in images) {
        var i2 = document.createElement('option');
        i2.text = images[i];
        i2.value = mdir + images[i];
        ddn_displayimage.appendChild(i2);
    }
};

function getMousePosition() {
    return [mouseX, mouseY];
}

function toggleRecord() {

    var btn_play = document.getElementById("playpath");
    var btn_stop = document.getElementById("stoppath");
    var btn_pause = document.getElementById("pausepath");
    var ddn_savedPaths = document.getElementById("savedpaths");

    if (recording) {
        paths.push(p);
        p = new recpath();
        updateDropdowns();
    } else {
        btn_pause.disabled = btn_play.disabled = btn_stop.disabled = ddn_savedPaths.disabled = true;
    }

    recording = !recording;
    document.getElementById('rec').textContent = recording ? "Recording..." : "Record Movement";
}

function mouseDragged() {
    if (recording) {
        p.push(mouseX, mouseY);
    }
}

function updateCurrentImage() {
    var ddn_selectimage = document.getElementById("selectnewimage");
    var ddn_displayimage = document.getElementById("displayedimage");
    ci = imageList[ddn_selectimage.value];
    for (var i in ddn_displayimage.options) {
        if (ddn_displayimage.options[i].text != ci.imageSelector)
            ddn_displayimage.options[i].selected = false;
        else
            ddn_displayimage.options[i].selected = true;
    }

    respawning_gui = true;
    respawnGUI();
}

function updateDisplayedImage() {
    var ddn_displayimage = document.getElementById("displayedimage");
    ci.imageSelector = ddn_displayimage.options[ddn_displayimage.selectedIndex].text;
    ci.image = loadImage(ddn_displayimage.options[ddn_displayimage.selectedIndex].value);
}

function addNewImage() {
    var i = new newimage();
    i.id = imageList.length;
    imageList.push(i);
    updateDropdowns();
}

function updateDropdowns() {
    var ddn_savedPaths = document.getElementById("savedpaths");
    var btn_play = document.getElementById("playpath");

    if (paths.length > 0) {
        ddn_savedPaths.disabled = false;
        ddn_savedPaths.length = 0;

        var i = 0;
        paths.saves.forEach(sp => {
            var opt = document.createElement('option');
            opt.text = "Path #" + (i + 1);
            opt.value = i;
            ddn_savedPaths.appendChild(opt);
            i++;
        });

        if (ddn_savedPaths.value == -1) {
            btn_play.disabled = true;
        } else {
            btn_play.disabled = false;
        }
    } else {
        ddn_savedPaths.disabled = true;
        btn_play.disabled = true;
    }

    var ddn_selectmage = document.getElementById("selectnewimage");
    if (imageList.length > 0) {
        ddn_selectmage.disabled = false;
        ddn_selectmage.length = 0;
        var i = 0;
        imageList.forEach(im => {
            var o = document.createElement('option');
            o.text = "Image #" + (i + 1);
            o.value = i;
            ddn_selectmage.appendChild(o);
            i++;
        });
    } else {
        ddn_selectmage.disabled = true;
    }
    respawning_gui = true;
    respawnGUI();
}

function playSelectedPath() {
    var btn_play = document.getElementById("playpath");
    var btn_stop = document.getElementById("stoppath");
    var btn_pause = document.getElementById("pausepath");
    var ddn_savedPaths = document.getElementById("savedpaths");
    ddn_savedPaths.disabled = btn_play.disabled = playing = true;
    btn_pause.disabled = btn_stop.disabled = false;
    paths.selectPath(ddn_savedPaths.value);
    play.loadPath(paths.selectedPath);

}

function playNextFrame() {
    ci.x = paths.selectedPath.x[play.current];
    ci.y = paths.selectedPath.y[play.current];
    var status = play.goForward();
    if (status == -1) {
        console.log("Last frame reached, stopping");
        stopSelectedPath(0);
    }

}

function stopSelectedPath(stopcode) {
    var btn_play = document.getElementById("playpath");
    var btn_stop = document.getElementById("stoppath");
    var btn_pause = document.getElementById("pausepath");
    var ddn_savedPaths = document.getElementById("savedpaths");

    console.log("Stopped at: ", play.current);
    playing = false;
    ddn_savedPaths.disabled = btn_play.disabled = false;
    btn_pause.disabled = btn_stop.disabled = true;

    if (stopcode == 0) {
        play.stop();
        ci.reset();
        console.log("Reached end of playback");
    } else if (stopcode == 1) {
        play.stop();
        ci.reset();
        console.log("Playback stopped manually");
    } else if (stopcode == 2) {
        play.pause();
        console.log("Playback paused");
    }
}

function exportConfig() {
    try {
        var hdn_export = document.createElement('a');
        hdn_export.href = 'data:text/json;charset=utf-8,' + 
            encodeURIComponent(
                JSON.stringify({    ePaths: JSON.stringify(paths), 
                                    eImages: JSON.stringify(maincollection.get_imageListForExport())})
            );
        hdn_export.target = '_blank';
        hdn_export.download = 'MnE_config.json';
        document.body.appendChild(hdn_export);
        hdn_export.click();
        document.body.removeChild(hdn_export);
    } catch (e) {
        console.log(e);
    }
}

function importConfig() {
    var importFile = document.getElementById('ixc').files[0];
    var fr = new FileReader();
    fr.readAsText(importFile);
    fr.onload = function () {
        var temp = JSON.parse(fr.result);
        var temp_paths = JSON.parse(temp.ePaths);
        var temp_images = JSON.parse(temp.eImages);

        //import paths
        paths = new recpaths();
        paths.length = temp_paths.length;
        for (var i = 0; i < temp_paths.length; i++) {
            var tPath = new recpath();
            tPath.length = temp_paths.saves[i].length;
            for (var j = 0; j < temp_paths.saves[i].length; j++) {
                tPath.push(temp_paths.saves[i].x[j], temp_paths.saves[i].y[j]);
            }
            paths.push(tPath);
        }

        //import images
        maincollection = new imagecollection();
        imageList = maincollection.imageList;
        temp_images.forEach(ei => {
            var temp_image = new newimage();
            temp_image.imageSelector = ei.imageSelector;
            temp_image.image = loadImage(mdir+ei.imageSelector);
            temp_image.x = ei.x;
            temp_image.y = ei.y;
            temp_image.scaleX = ei.scaleX;
            temp_image.scaleY = ei.scaleY;
            temp_image.xyRatio = ei.xyRatio;
            temp_image.lockRatio = ei.lockRatio;
            temp_image.rotation = ei.rotation;
            temp_image.shearX = ei.shearX;
            temp_image.shearY = ei.shearY;
            imageList.push(temp_image);
        });

        updateDropdowns();
        alert("Sucessfully uploaded");
    };
}