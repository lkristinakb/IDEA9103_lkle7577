

let img;
let weaves = [];
let weaveSpacing = 6;
let spacing = 12;
let morphDuration = 150;
let lineImg;
let lineSystem;

function preload() {
  img = loadImage('assets/KT_Pathway_Avenue.jpg');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.drawingContext.getContextAttributes().willReadFrequently = true;
  angleMode(DEGREES);
  noFill();
  img.resize(width, height);

  // Initialize weave positions
  drawWeaves();

  // Create graphics buffers
  lineImg = createGraphics(width, height);

  // Initialize line system
  lineSystem = new LineSystem(weaves);

  //initialise Bezier animator
  bezierAnimator = new BezierAnimator(weaves);

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
    let pulse = 1+0.8 * sin(frameCount*0.02);
    scale(pulse);

    // Edit from original code - draw line buffer here so it rotates
    lineSystem.render(lineImg);
    imageMode(CENTER);
    image(lineImg, 0, 0);

    //Animate Bezier connection
    bezierAnimator.update();
    bezierAnimator.display();

    //Draw weaves on top
    for (const weave of weaves) {
      weave.update();
      weave.display();
   }

  pop();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  img.resize(width, height);

  lineImg = createGraphics(width,height);

  drawWeaves();

  //line system redraws when window is resized, following rotation  
  lineSystem = new LineSystem(weaves);
  lineSystem.render(lineImg);
  imageMode(CENTER);
  image(lineImg, 0, 0);
  bezierAnimator = new BezierAnimator(weaves);
 
}