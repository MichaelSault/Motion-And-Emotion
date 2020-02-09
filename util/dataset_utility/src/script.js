var p5_canvas;
var DSUTIL_STATE;
var currentGestureCollection, currentGesture;

var gestureClasses = {
    SPIRAL_CW: 0,
    SPIRAL_CCW: 1,
    GREATER: 2,
    LESSER: 3,
    properties: {
        0: {name: "Clockwise Spiral", value: 0, key: "SPIRAL_CW"},
        1: {name: "Counter-Clockwise Spiral", value: 1, key: "SPIRAL_CCW"},
        2: {name: "Greater (Expand)", value: 2, key: "GREATER"},
        3: {name: "Lesser (Expand)", value: 3, key: "LESSER"}
    }
};

class state{
    constructor(){
        this.drawing = false;
        this.currentGestureClass = gestureClasses["SPIRAL_CW"];
        this.verbose = false;
    };
    updateState = function (){
        if(mouseIsPressed)
            DSUTIL_STATE.drawing = true;
        else
            DSUTIL_STATE.drawing = false;
    }

    updateGesture = function() {
        var ddn_currentGesture = document.getElementById('ddn_gestureClasses');
        this.currentGestureClass = gestureClasses[ddn_currentGesture.value];
        if(this.verbose)
            console.log("updateGesture: ",this.currentGestureClass)
    }
}

class point{
    constructor(ix,iy){
        this.x = ix;
        this.y = iy;
    }
}

class gesture{
    constructor(){
        this.gestureClass = DSUTIL_STATE.currentGestureClass;
        this.points = [];
    }
}

class gestureCollection{
    constructor(){
        this.gestures = [];
        this.totalCount = 0;
        this.gestureCounts = [0,0,0,0]; //[spiral_cw, spiral_ccw, greater, lesser]
    }

    addGesture = function(g){
        this.gestures.push(g);
        this.totalCount++;
        this.gestureCounts[g.gestureClass]++;

        if(DSUTIL_STATE.verbose)
            console.log("gestureCollection > addGesture: ", g, totalCount, gestureCounts);
    }

    popGesture = function() {
        if(this.totalCount > 0){
            this.totalCount--;
            this.gestureCounts[this.gestures.pop().gestureClass]--;
            if(DSUTIL_STATE.verbose)
                console.log("gestureCollection > popGesture: ", totalCount, gestureCounts);
        }   
    }
}

//p5js
function setup() {
    //data
    DSUTIL_STATE = new state();
    currentGesture = new gesture();
    currentGestureCollection = new gestureCollection();
    ddn_gestureClasses_onChange();
    updateStats();

    //canvas
    p5_canvas = createCanvas(500,500);
    p5_canvas.parent('canvascontainer');
    background(0,0,0);
    frameRate(9999);
    strokeWeight(6);
}

//p5js
function draw() {
    background(0, 0, 0);
    DSUTIL_STATE.updateState();
    stroke(255,255,255);
    if(DSUTIL_STATE.drawing){
        beginShape();
        currentGesture.points.forEach(p => { 
            curveVertex(p.x, p.y);
        });
        endShape();
    } else if(currentGestureCollection.gestures.length > 0) {
        beginShape();
        currentGestureCollection.gestures[currentGestureCollection.gestures.length - 1].points.forEach(p => { 
            curveVertex(p.x, p.y); 
        });
        endShape();
    }
    fill(0,0,0);
        
}

//p5js
function mouseDragged() {
    console.log('here');
    if(DSUTIL_STATE.drawing && (0 <= mouseX && mouseX <= 500) && (0 <= mouseY && mouseY <= 500)){
        currentGesture.points.push(new point(mouseX, mouseY));
    }
        
}

//p5js
function mouseReleased(){
    if((0 <= mouseX && mouseX <= 500) && (0 <= mouseY && mouseY <= 500)){
        currentGestureCollection.addGesture(currentGesture);
        currentGesture = new gesture();
        updateStats();
    }
}

//controls
function ddn_gestureClasses_onChange(){
    //Update state with new gestureClass
    DSUTIL_STATE.updateGesture();

    //Update text on webpage with new info
    document.getElementById("txt_currentGestureClass").innerText = gestureClasses.properties[DSUTIL_STATE.currentGestureClass].name;
    updateStats();

    //Refresh current drawing
    currentGesture = new gesture();


}

//controls
function btn_undoGesture_onClick(){
    currentGestureCollection.popGesture();
    updateStats();
}


//controls
function btn_exportGestures_onClick(){
    if(currentGestureCollection.totalCount > 0)
        try {
            var hdn_export = document.createElement('a');
            hdn_export.href = 'data:text/json;charset=utf-8,' + 
                encodeURIComponent(JSON.stringify(currentGestureCollection));
            hdn_export.target = '_blank';
            hdn_export.download = 'gdcu_export.json';
            document.body.appendChild(hdn_export);
            hdn_export.click();
            document.body.removeChild(hdn_export);
        } catch (e) {
            console.log(e);
        }
}

//stats
function updateStats(){
    var txt_currGestureClassCount = document.getElementById("txt_currentGestureClassCount");
    var txt_totalGestureCount = document.getElementById("txt_totalGestureCount");

    txt_currGestureClassCount.innerText = currentGestureCollection.gestureCounts[DSUTIL_STATE.currentGestureClass];
    txt_totalGestureCount.innerText = currentGestureCollection.totalCount;
}

//keyboard handler
document.addEventListener('keydown', function(event){
    if(event.ctrlKey && event.key == 'z')
        btn_undoGesture_onClick();
});