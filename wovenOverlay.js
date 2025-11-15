class BezierAnimator {
  constructor(weaves) {
    this.weaves = weaves;
    this.indexA = 0;
    this.indexB = 1;
    this.t = 0;              // interpolation factor
    this.speed = 0.01;       // how fast the animation moves
    this.curveOffset = 100;  // vertical offset for the curve
  }

  update() {
    this.t += this.speed;
    if (this.t > 1) {
      this.t = 0;
      this.indexA = this.indexB;
      this.indexB = (this.indexB + 1) % this.weaves.length;
    }
  }

display() {
    if (this.weaves.length < 2) return;

    let a = this.weaves[this.indexA];
    let b = this.weaves[this.indexB];

    // Interpolated end point
    let x = lerp(a.centreX, b.centreX, this.t);
    let y = lerp(a.centreY, b.centreY, this.t);

    // Control points for smooth curve
    let cx1 = lerp(a.centreX, b.centreX, 0.25);
    let cy1 = lerp(a.centreY, b.centreY, 0.25) - 100;
    let cx2 = lerp(a.centreX, b.centreX, 0.75);
    let cy2 = lerp(a.centreY, b.centreY, 0.75) - 100;

    stroke(0);
    strokeWeight(2);
    noFill();

    // Draw relative to your transformed origin
    // If the main canvas has translate(width/2, height/2) and rotation, apply the same here
    push();
    translate(width/2, height/2);
    rotate(frameCount * 0.2);
    let pulse = 1 + 0.8 * sin(frameCount*0.02);
    scale(pulse);

    // Offset the Bezier points relative to center (like your weaves)
    bezier(
        a.centreX - width/2, a.centreY - height/2,
        cx1 - width/2, cy1 - height/2,
        cx2 - width/2, cy2 - height/2,
        x - width/2, y - height/2
    );
    pop();
}
}