// started playing around the the worms to make them smaller and to go around the circles on the page



class LineSystem {
  constructor(weaves) {
    let numLines = floor(width / 20); // Line count based on screen size
    let dynamicRadius = width / 12;   // Radius scales with canvas width

    this.weaves = weaves;
    this.lines = [];
    for (let i = 0; i < numLines; i++) {
      let targetIndex = i % this.weaves.length; // evenly distribute lines across weaves
      this.lines.push(new Line(this.weaves[targetIndex], 1, dynamicRadius));
    }
  }

  update() {
    for (let l of this.lines) {
      l.update();
    }
  }

  display(graphics) {
    for (let l of this.lines) {
      l.display(graphics);
    }
  }

  render(graphics) {
    graphics.push();
    graphics.erase(20, 20); // adjust number for faster fade
    graphics.rect(0, 0, width, height);
    graphics.noErase();
    graphics.pop();

    this.update();
    this.display(graphics);

    image(graphics, 0, 0, width, height);
  }
}

class Line {
  constructor(targetWeave, speed, radius) {
    this.targetWeave = targetWeave;
    this.speed = speed;
    this.radius = radius;
    this.angle = random(360);
    this.points = [];
    this.maxTrail = 400; // trail length
    this.noiseOffset = random(1000);

    // Assign a random color from a chosen palette
    const lineColors = [
      color(201, 85, 159),    // Purple
      color(229, 37, 37),     // Red
      color(33, 144, 69),     // Green
      color(14, 76, 139),     // Blue
      color(14, 40, 20),      // Black
      color(239, 120, 25)     // Orange
    ];
    this.color = lineColors[floor(random(lineColors.length))];
  }

  update() {
    if (!this.targetWeave) return;

    // Organic weaving using Perlin noise
    let dynamicRadius = this.radius + sin(frameCount * 0.02) * 20;
    let wobble = map(noise(this.noiseOffset), 0, 1, -15, 15);

    let x = this.targetWeave.centreX + cos(this.angle) * (dynamicRadius + wobble);
    let y = this.targetWeave.centreY + sin(this.angle) * (dynamicRadius + wobble);

    this.angle += this.speed;
    this.noiseOffset += 0.01;

    this.points.push({ x, y });
    if (this.points.length > this.maxTrail) {
      this.points.shift();
    }

    // Fade out after a defined period
    if (frameCount % 300 === 0) this.points = [];
  }

  display(graphics) {
    // Draw main line 
    graphics.noFill();
    graphics.stroke(red(this.color), green(this.color), blue(this.color), 80);
    graphics.strokeWeight(3);
    graphics.beginShape();
    for (let p of this.points) {
      graphics.vertex(p.x, p.y);
    }
    graphics.endShape();

    // Draw small circles along the line
    for (let i = 0; i < this.points.length; i += 8) {
      let p = this.points[i];
      graphics.fill(red(this.color), green(this.color), blue(this.color), 80);
      graphics.noStroke();
      graphics.ellipse(p.x, p.y, 7, 7);
    }
  }
}

