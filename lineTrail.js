// I have created a separate function for this 


let trailArr = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.drawingContext.getContextAttributes().willReadFrequently = true;
  // background(255);
  angleMode(DEGREES);

  // Initialize organic line  trailArr
  for (let i = 0; i < 8; i++) {
    trailArr.push(new LineTrail(random(width), random(height), 0.5, 150));
  }
}

function draw() {
  // background(255, 20); // Fading effect for  trailArr

  // Update and display  trailArr
  for (let t of trailArr) {
    t.update();
    t.display();
  }
}

class LineTrail {
  constructor(x, y, speed, length) {
    this.points = [];
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.length = length;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
  }

  update() {
    // Organic movement using Perlin noise
    let angle = noise(this.noiseOffsetX, this.noiseOffsetY) * 360;
    this.x += cos(radians(angle)) * this.speed;
    this.y += sin(radians(angle)) * this.speed;

    // Update noise offsets for smooth wandering
    this.noiseOffsetX += 0.01;
    this.noiseOffsetY += 0.01;

    // Add new point
    this.points.push({ x: this.x, y: this.y });

    // Limit trail length
    if (this.points.length > this.length) {
      this.points.shift();
    }
  }

  display() {
    noFill();
    stroke(0, 50);
    strokeWeight(1);
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();

    // Draw small circles along the line
    for (let i = 0; i < this.points.length; i += 5) {
      let p = this.points[i];
      fill(0);
      noStroke();
      ellipse(p.x, p.y, 4, 4);
    }
  }
}