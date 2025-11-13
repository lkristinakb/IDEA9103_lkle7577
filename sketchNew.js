

let img;

let weaves = [];
let weaveSpacing = 6;

let threadingWorms = [];
let threadingWormsImg;
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
  threadingWormsImg = createGraphics(width, height);

  // Initialize line system
  lineSystem = new LineSystem(weaves);

  for (const weave of weaves) {
    for (let i = 0; i < 3; ++i) {
      threadingWorms.push(new ThreadingWorm(weave.centreX, weave.centreY));
    }
  }

}

function draw() {
  background(255, 20);

  // Draw flow field from circular weave logic
  drawFlowField();
  noTint();

  // Render lines using LineSystem
  lineSystem.render(lineImg);

  // Draw weaves on top
  push();
  for (const weave of weaves) {
    weave.update();
    weave.display();
  }
  pop();

  push();
  threadingWormsImg.push();
  threadingWormsImg.erase(20, 20);
  threadingWormsImg.rect(0, 0, width, height);
  threadingWormsImg.noErase();
  threadingWormsImg.pop();

  for (const worm of threadingWorms) {
    worm.update();
    worm.render(threadingWormsImg);
    console.log("Worm pos: ", worm.curX, "  ", worm.curY)
  }
  image(threadingWormsImg, 0, 0, width, height);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  img.resize(width, height);

  drawWeaves();
}

