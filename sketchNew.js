

let img;
let weaves = [];
let weaveSpacing = 6;
let spacing = 12;
let morphDuration = 150;
let lineImg;
let lineSystem;
let thread;
let colWeaves;
let rowWeaves;


function preload() {
  img = loadImage('assets/KT_Pathway_Avenue.jpg');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.drawingContext.getContextAttributes().willReadFrequently = true;
  angleMode(DEGREES);
  noFill();
  img.resize(width, height);

  let colWeaves = weaveSpacing;

  // Initialize weave positions
  drawWeaves();
  //makes sure that there are no undefined nodes, that all weaves are defined 
  weaves = weaves.filter(w => isFinite(w.centreX) && isFinite(w.centreY));

  thread = new Thread (weaves,8);

  // Create graphics buffers
  lineImg = createGraphics(width, height);

  // Initialize line system
  lineSystem = new LineSystem(weaves);

}

function draw() {
  background(255);

  // Draw flow field from circular weave logic
  drawFlowField();
  noTint();

  push();
    // canvas transformations
    translate(width/2, height/2);
    rotate(frameCount * 0.2);
    //let pulse = 1+0.8 * sin(frameCount*0.02);
    //scale(pulse);

    // Edit from original code - draw line buffer here so it rotates
    lineSystem.render(lineImg);
    imageMode(CENTER);
    image(lineImg, 0, 0);

    //Draw weaves
    for (const weave of weaves) {
      weave.update();
      weave.display();
   }
    // Draw thread overlay
    thread.update();
    thread.display();

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  img.resize(width, height);

  lineImg = createGraphics(width,height);

  drawWeaves();
  //makes sure that there are no undefined nodes, that all weaves are defined 
  weaves = weaves.filter(w => isFinite(w.centreX) && isFinite(w.centreY));

  //line system redraws when window is resized, following rotation  
  lineSystem = new LineSystem(weaves);
  lineSystem.render(lineImg);
  imageMode(CENTER);
  image(lineImg, 0, 0);

 // Update thread with new nodes
  thread.nodes = weaves;
  thread.buildRows(); // recalc rows with new positions

}