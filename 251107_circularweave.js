
function drawWeaves(){
  weaves = [];
  
  let colWeaves = weaveSpacing;
  let rowWeaves = Math.floor(weaveSpacing*(height/width));

  let spacingX = width / colWeaves;
  let spacingY = height / rowWeaves;
  let radius = (min(spacingX, spacingY)/2);

  push();
  translate(width / 2, height / 2);

  for (let c = -1; c <= (colWeaves+1); c++) {
    for (let r=-1; r <= (rowWeaves+1); r++){

      let offsetX = (r%2) * spacingX/2;

      let x = spacingX * c + offsetX;
      let y = spacingY * r;

      weaves.push(new Weave(x,y,radius * random(0.8,1.2))); // Add each weave object to the array             
    }
  }
  pop();
  rotate(frameCount*15);
}

class Weave {
  constructor(centreX, centreY, weaveRadius) {
    this.centreX = centreX;
    this.centreY = centreY;
    this.weaveRadius = weaveRadius;
    this.strokewidth = 1;
    this.pointsOnCircle = 20;
    this.wovenLayers = 9;

    this.waveAmplitude = this.weaveRadius * 0.09;
    this.waveSpeed = 0.02; 
    this.rotationSpeed = 0.05;
    this.time = 0;

    this.overColour = color(255, 165, 0);
    this.underColour = color(255, 105, 180);
  }

  update() {
    this.time += this.waveSpeed;
  }

  display() {
    push();
    translate(this.centreX, this.centreY);
    noFill();
    rotate(frameCount * this.rotationSpeed);

    for (let n=0; n<this.wovenLayers; n++){

    push();
    this.drawCircularWeave(this.weaveRadius*(1*(n/10)), this.overColour, -1);
    this.drawCircularWeave(this.weaveRadius*1.05*(n/10), this.underColour, -1);
    pop();
    } 

    pop();
  }

  drawCircularWeave(radiusBase, colour){
    stroke(colour);
    strokeWeight(this.strokewidth);

    for (let i = 0; i < this.pointsOnCircle; i++) {
      let angle1 = (i / this.pointsOnCircle) * 360;
      let angle2 = ((i + 1) / this.pointsOnCircle) * 360;

      let wave1 = sin(angle1 * 2 + this.time * 200) * this.waveAmplitude;
      let wave2 = sin(angle2 * 2 + this.time * 200) * this.waveAmplitude;

      let r1 = (radiusBase - wave1);
      let r2 = (radiusBase - wave2);

      let x1 = r1 * cos(angle1);
      let y1 = r1 * sin(angle1);
      let x2 = r2 * cos(angle2);
      let y2 = r2 * sin(angle2);

      let cx1 = (r1 - this.waveAmplitude) * cos(angle1 - 2);
      let cy1 = (r1 + this.waveAmplitude) * sin(angle1 + 2);
      let cx2 = (r2 - this.waveAmplitude) * cos(angle2 - 2);
      let cy2 = (r2 + this.waveAmplitude) * sin(angle2 + 2);

      let cx3 = (r1 + this.waveAmplitude) * cos(angle1 - 2);
      let cy3 = (r1 - this.waveAmplitude) * sin(angle1 + 2);
      let cx4 = (r2 + this.waveAmplitude) * cos(angle2 - 2);
      let cy4 = (r2 - this.waveAmplitude) * sin(angle2 + 2);

      bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);

      bezier(x1, y1, cx3, cy3, cx4, cy4, x2, y2);
    }
  }
}