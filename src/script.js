var ci;
var images = ['pinguin1.bmp', 'pinguin3.bmp', 'scie1.bmp', 'scie2.bmp'];
var mdir = '../media/';
var gui_currentFile, gui, ci, a;
var recording, showingPath = false;
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
var listlen;

class pathplay {
    constructor() {
        this.start = 0;
        this.end = 0;
        this.keyframes = [];
        this.current = 0;
        this.status = "INIT";
        this.initialConfig = [];

        this.loadPath = function (mf, ic) {
            this.start = 0;
            this.end = mf;
            this.keyframes.push(this.start);
            //this.keyframes.push(this.end);
            if(this.status != "PAUSED")
                this.initialConfig = ic;
            this.status = "LOADED";
        };

        this.goForward = function () {
            if (this.current < this.end) {
                this.current++;
                console.log("Current frame: ", this.current);
                this.status = "FORWARD";
                return 0;
            } else {
                return -1;
            }

        };

        this.goBackward = function () {
            if (this.current > this.start) {
                this.current--;
                console.log("Current frame: ", this.current);
                this.status = "BACKWARD";
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
        this.scaleX = [];
        this.scaleY = [];
        this.rotation = [];
        this.length = 0;
        this.keyframes = [];
        this.push = function (x, y) {
            this.x.push(x);
            this.y.push(y);
            this.scaleX.push(ci.scaleX);
            this.scaleY.push(ci.scaleY);
            this.rotation.push(ci.rotation);
            this.length++;
        };
        this.pushKeyFrame = function(frameid, x, y, scaleX, scaleY, rotation, rcw){
            console.log("KF: ", frameid, x, y, scaleX, scaleY, rotation, rcw);
            
            if(this.length == 0){
                this.keyframes.push(frameid);
                this.x.push(x);
                this.y.push(y);
                this.scaleX.push(scaleX);
                this.scaleY.push(scaleY);
                this.rotation.push(rotation);
                this.length++;
            } else {
                var last_kfi = this.keyframes[this.keyframes.length-1];
                this.keyframes.push(frameid);
                var d_frames = frameid - last_kfi;
                var inc_scaleX = (scaleX - this.scaleX[last_kfi])/d_frames;
                var inc_scaleY = (scaleY - this.scaleY[last_kfi])/d_frames;
                var inc_rotation;
                if(rcw){ //clockwise (0 -> 360 -> 0)
                    inc_rotation = Math.abs(rotation - this.rotation[last_kfi])/d_frames;
                } else { //counter clockwise (360 -> 0 -> 360)
                    inc_rotation = -Math.abs(rotation - this.rotation[last_kfi])/d_frames;
                }
                console.log("KFd: ", last_kfi, d_frames, inc_scaleX, inc_scaleY, inc_rotation);
                for(var i = last_kfi+1; i <= frameid; i++){
                    this.scaleX[i] = this.scaleX[i-1] + inc_scaleX;
                    this.scaleY[i] = this.scaleY[i-1] + inc_scaleY;
                    this.rotation[i] = this.rotation[i-1] + inc_rotation;
                }
                for(var i = frameid+1; i<=this.length-1; i++){
                    this.scaleX[i] = scaleX;
                    this.scaleY[i] = scaleY;
                    this.rotation[i] = rotation;
                }
            }
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
            this.selectedPath.scaleX = this.saves[index].scaleX;
            this.selectedPath.scaleY = this.saves[index].scaleY;
            this.selectedPath.rotation = this.saves[index].rotation;
            this.selectedPath.length = this.saves[index].length;
            this.selectedPath.keyframes = this.saves[index].keyframes;
        };

        this.getRecPath = function (index) {
            return this.saves[index];
        }
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
        this.selectedPath = new recpath();
        this.selectedPathIndex = 0;
    }

    reset() {
        this.imageSelector = images[0];
        this.x = this.y = 0;
        this.scaleX = this.scaleY = this.xyRatio = 1;
        this.lockRatio = false;
        this.rotation = 0;
        this.shearX = this.shearY = 0;
    }

    set_config(iimageSelector, ix, iy, iscaleX, iscaleY, ixyRatio, ilockRatio, irotation, ishearX, ishearY) {
        this.imageSelector = iimageSelector;
        this.x = ix;
        this.y = iy;
        this.scaleX = iscaleX;
        this.scaleY = iscaleY;
        this.xyRatio = ixyRatio;
        this.lockRatio = ilockRatio;
        this.rotation = irotation;
        this.shearX = ishearX;
        this.shearY = ishearY;
    }

    get_config(){
        return {
            imageSelector: this.imageSelector,
            x: this.x,
            y: this.y,
            scaleX: this.scaleX,
            scaleY: this.scaleY,
            xyRatio: this.xyRatio,
            lockRatio: this.lockRatio,
            rotation: this.rotation,
            shearX: this.shearX,
            shearY: this.shearY
        };
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
    canvas = createCanvas(1280, 720);
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
        try{
            shearX(i.shearX);
            shearY(i.shearY);
            if(playing || play.status == "PAUSED"){
                translate(i.x, i.y);    
            } else {
                translate(i.x + (i.image.width * i.scaleX / 2), i.y + (i.image.height * i.scaleY / 2));
            }
            rotate(i.rotation);
            image(i.image, 0, 0, i.image.width * i.scaleX, i.image.height * i.scaleY);
        } catch (e) {
            console.log(e);
            alert("break");
        }
        
        pop();
        //translate(-(i.x + (i.image.width * i.scaleX / 2)), -(i.y + (i.image.height * i.scaleY / 2)));
        //rotate(0);
    });

    if (recording || showingPath){

        //Draw Line
        noFill();
        beginShape();
        for (var i = 0; i < p.length; i++)
            curveVertex(p.x[i], p.y[i]);
        endShape();

        //Draw Points
        for (var i = 0; i < p.length; i++){
            if(p.keyframes.includes(i)){
                fill('#ff0000');
                ellipse(p.x[i], p.y[i], 10, 10);
            } else {
                fill('#000000');
                ellipse(p.x[i], p.y[i], 5, 5);
            }
        }
    }
        
            
        

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
    if(e.keyCode == 46){
        window.removeEventListener("keydown", handlekeydown, true);
        return;
    }
        
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
    document.getElementById('recordMessage').style.display = "none";

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
    

    var i1 = document.createElement('option');
    i1.text = "Image #1";
    i1.value = 0;
    ddn_selectimage.appendChild(i1);
    btn_play.disabled = btn_pause.disabled = btn_stop.disabled = ddn_savedPaths.disabled = true;
    btn_record.disabled = false;


    var select = document.getElementById("displayedimage");

    for (var i = 0; i < images.length; i++) {
        var opt = images[i];
        var el = document.createElement("option");

        el.textContent = opt;
        el.value = mdir + images[i];
        select.appendChild(el);
        listlen = i;
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
    var ddn_selectimage = document.getElementById("selectnewimage");

    if (recording) {
        paths.push(p);
        imageList[ddn_selectimage.value].selectPath = p;
        updateDropdowns();
    } else {
        p = new recpath();
        btn_pause.disabled = btn_play.disabled = btn_stop.disabled = ddn_savedPaths.disabled = true;
    }

    recording = !recording;
    document.getElementById('rec').textContent = recording ? "Recording..." : "Record Movement";
}

function mouseDragged() {
    if (recording) {
        if(p.length == 0){
            console.log("pframe0");
            var ic = ci.get_config();
            p.pushKeyFrame(0, mouseX, mouseY, ic.scaleX, ic.scaleY, ic.rotation, false);
        } else {
            p.push(mouseX, mouseY);
        }
    }
}

function updateCurrentImage() {
    var ddn_selectimage = document.getElementById("selectnewimage");
    var ddn_displayimage = document.getElementById("displayedimage");
    var ddn_savedPaths = document.getElementById("savedpaths");
    console.log("Updating current image: ", ddn_selectimage, ddn_displayimage, ddn_savedPaths, "\nDonezo");
    ci = imageList[ddn_selectimage.value];
    for (var i in ddn_displayimage.options) {
        if (ddn_displayimage.options[i].text != ci.imageSelector)
            ddn_displayimage.options[i].selected = false;
        else
            ddn_displayimage.options[i].selected = true;
    }
   if(int(ci.selectedPathIndex) > paths.saves.length){
        console.log("int(ci.selectedPathIndex)", int(ci.selectedPathIndex));
        ddn_savedPaths.selectedIndex = int(ci.selectedPathIndex);
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
    var btn_removenewimage = document.getElementById("removenewimage");
    if(! imageList.length < 2)
        btn_removenewimage.disabled = false;
    updateDropdowns();
}

function removeNewImage() {
    var ddn_selectnewimage = document.getElementById("selectnewimage");
    var btn_removenewimage = document.getElementById("removenewimage");
    imageList.splice(ddn_selectnewimage.value, 1);
    if(imageList.length < 2)
        btn_removenewimage.disabled = true;
    updateDropdowns();
}

function updateDropdowns() {
    var ddn_savedPaths = document.getElementById("savedpaths");
    var btn_play = document.getElementById("playpath");
    var chk_showPath = document.getElementById("showpath");

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
    
    var ddn_selectimage = document.getElementById("selectnewimage");
    var current_selection = int(ddn_selectimage.selectedIndex);
    if (imageList.length > 0) {
        ddn_selectimage.disabled = false;
        ddn_selectimage.length = 0;
        var i = 0;
        imageList.forEach(im => {
            var o = document.createElement('option');
            o.text = "Image #" + (i + 1);
            o.value = i;
            ddn_selectimage.appendChild(o);
            i++;
        });
        if(current_selection < ddn_selectimage.length)
            ddn_selectimage.selectedIndex = ddn_selectimage.current_selection;
    } else {
        ddn_selectimage.disabled = true;
    }
    respawning_gui = true;
    showSelectedPath();
    respawnGUI();
}

function playSelectedPaths() {
    var btn_play = document.getElementById("playpath");
    var btn_stop = document.getElementById("stoppath");
    var btn_pause = document.getElementById("pausepath");
    var ddn_savedPaths = document.getElementById("savedpaths");
    ddn_savedPaths.disabled = btn_play.disabled = playing = true;
    btn_pause.disabled = btn_stop.disabled = false;
    paths.selectPath(ddn_savedPaths.value);
    var configs = []
    var maxframes = 0
    imageList.forEach(i => {
        configs.push(i.get_config());
        if(paths.saves[i.selectedPathIndex].length > maxframes)
            maxframes = paths.saves[i.selectedPathIndex].length
    })
    play.loadPath(maxframes, configs);
    var maxframes = 0;
    imageList.forEach(i => {
        maxframes = paths.saves[i.selectedPathIndex].length > maxframes ? paths.saves[i.selectedPathIndex].length : maxframes;
    });
    play.end = maxframes;

}

function playNextFrame() {
    imageList.forEach(i => {
        var index = i.selectedPathIndex
        if(paths.saves[index].length < play.current)
            console.log('ix, pre', i.x, paths.saves[index].x[play.current]);
            i.x = paths.saves[index].x[play.current];
            console.log('ix, pst', i.x, paths.saves[index].x[play.current]);    
            i.y = paths.saves[index].y[play.current];
            i.scaleX = paths.saves[index].scaleX[play.current];
            i.scaleY = paths.saves[index].scaleY[play.current];
            i.rotation = paths.saves[index].rotation[play.current];
    });
    var status = play.goForward();
    if (status == -1) {
        console.log("Last frame reached, stopping");
        stopSelectedPath(0);
    }

}

function addKeyFrame() {
    var kfi = play.current;
    var ic = ci.get_config();
    var cw = true;
    if(ic.rotation != p.rotation[p.keyframes[p.keyframes.length-1]]){
        cw = confirm("Clockwise (ok) or counter-clockwise (cancel)?");
    }
    paths[ci.selectedPathIndex].pushKeyFrame(kfi, null, null, ic.scaleX, ic.scaleY, ic.rotation, cw);
}

function stopSelectedPath(stopcode) {
    var btn_play = document.getElementById("playpath");
    var btn_stop = document.getElementById("stoppath");
    var btn_pause = document.getElementById("pausepath");
    var btn_addKeyFrame = document.getElementById("addkeyframe");
    var ddn_savedPaths = document.getElementById("savedpaths");

    console.log("Stopped at: ", play.current);
    playing = false;
    ddn_savedPaths.disabled = btn_play.disabled = false;
    btn_pause.disabled = btn_stop.disabled = true;

    if (stopcode == 0) {
        play.stop();

        var ic = play.initialConfig;
        console.log('HERE, ', ic);
        for(var i=0; i < imageList.length; i++)
            imageList[i].set_config(ic[i].imageSelector, ic[i].x, ic[i].y, ic[i].scaleX, ic[i].scaleY, ic[i].xyRatio, ic[i].lockRatio, ic[i].rotation, ic[i].shearX, ic[i].shearY);
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

function updateSelectedPath(){
    if(paths.length == 0)
        return;
    
    var ddn_savedPaths = document.getElementById("savedpaths");
    var ddn_selectimage = document.getElementById("selectnewimage");
    console.log('here1');
    imageList[ddn_selectimage.value].selectedPath = paths[ddn_savedPaths.value];
    console.log('here2', imageList[ddn_selectimage.value].selectedPath, paths[ddn_savedPaths.value]);
    console.log('jere', imageList, paths)
    ci.selectedPathIndex = int(ddn_savedPaths.value);
    console.log('here3', ci.selectedPathIndex, int(ddn_savedPaths.value))
    showSelectedPath();
}

function showSelectedPath(){
    if(paths.length == 0)
        return;
    
    var chk_showPath = document.getElementById("showpath");
    var ddn_savedPaths = document.getElementById("savedpaths");

    showingPath = chk_showPath.checked;
    if (showingPath){
        paths.selectPath(ddn_savedPaths.value);
        p = paths.selectedPath;
    }
    console.log("showingPath: ",showingPath);
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


//takes user input
function addOption() {
	var x = document.getElementById("newOption").value;
    images.push(x);
    updateDropDown();
}

//adds it to the drop down
function updateDropDown() {
	listlen += 1;
    var select = document.getElementById("displayedimage");
    var opt = images[listlen];
    var el = document.createElement('option');
    el.textContent = opt;
    el.value = mdir + opt;
    select.appendChild(el);
}

