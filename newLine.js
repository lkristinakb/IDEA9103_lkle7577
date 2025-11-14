/* 
This class manages a group of animated lines that orbit around 
weaves from 251107_circularweave.js
*/


class LineSystem {
  constructor(weaves) {
    // Decide how many lines to create based on canvas width
    let numLines = floor(width / 20); // // More lines on bigger screens
    let dynamicRadius = width / 12;   // Radius scales with canvas size

    this.weaves = weaves; // Store weave positions
    this.lines = []; // Array to hold all line objects

    // Create each line and assign it to a weave
    for (let i = 0; i < numLines; i++) {
      let targetIndex = i % this.weaves.length; // Evenly distribute lines across weaves
      this.lines.push(new Line(this.weaves[targetIndex], 1, dynamicRadius));
    }
  }

  // Update all lines and calculate new positions
  update() {
    for (let l of this.lines) {
      l.update();
    }
  }

  // Draw all lines on the graphics buffer
  display(graphics) {
    for (let l of this.lines) {
      l.display(graphics);
    }
  }

  // Render the entire system with fading trails
  render(graphics) {
    graphics.push();
    graphics.erase(20, 20); // Soft erase for fading effect
    graphics.rect(0, 0, width, height); // Clear the buffer slightly
    graphics.noErase();
    graphics.pop();

    this.update(); // Move lines
    this.display(graphics); // Draw lines

    // Draw the graphics buffer on the main canvas
    image(graphics, 0, 0, width, height);
  }
}

// // This class represents a single animated line orbiting around a weave center
class Line {
  constructor(targetWeave, speed, radius) {
    this.targetWeave = targetWeave; // The center point the line orbits
    this.speed = speed; // How fast the line rotates
    this.radius = radius; // Distance from the centere
    this.angle = random(360); // Starting angle
    this.points = []; // Stores previous positions for the trail
    this.maxTrail = 400; // Maximum trail length
    this.noiseOffset = random(1000); // For perlin noise movement 

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

  // 
  update() {
    if (!this.targetWeave) return;

    // Organic weaving using Perlin noise and a wobble effect for an organic shape
    let dynamicRadius = this.radius + sin(frameCount * 0.02) * 20;
    let wobble = map(noise(this.noiseOffset), 0, 1, -15, 15);

    // Calculate new x & y based on angle and radius
    let x = this.targetWeave.centreX + cos(this.angle) * (dynamicRadius + wobble);
    let y = this.targetWeave.centreY + sin(this.angle) * (dynamicRadius + wobble);

    // Increment the angle and noise offset for continuous motion
    this.angle += this.speed;
    this.noiseOffset += 0.01;

    // Add new position to the trail
    this.points.push({ x, y });
    if (this.points.length > this.maxTrail) {
      this.points.shift();
    }

    // Fade out after a defined period
    if (frameCount % 300 === 0) this.points = [];
  }

  // Draw the line and its trail
  display(graphics) {
    // Draw main line 
    graphics.noFill();
    graphics.stroke(red(this.color), green(this.color), blue(this.color), 80); // // Semi-transparent colour
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

