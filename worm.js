const fps = 20; // changed from 30 - kim
const baseFreq = 0.4;
const freqRange = 0.3;
const displacement = 2; // changed from 4 - kim
const amplitude = 50;
const baseAmplitude = 50;
const amplitudeRange = 10;
const baseSize = 4; // changed from 10 - kim
const baseDecay = 50;
const decayRange = 10;

// Equation for worm movement
function movementCalculation(x, y, idx, amp, freq, displacement, trj, decay) {
  // Amplitude calculation
  const tmpY = amp * Math.exp(-idx / decay) * sin(idx * displacement * 360 * freq / fps);
  // Displacement calculation
  const tmpX = idx * displacement;
  // Rotation and displacement
  const newX = x + cos(trj) * tmpX - sin(trj) * tmpY;
  const newY = y + sin(trj) * tmpX + cos(trj) * tmpY;
  return { x: newX, y: newY };
}

class ThreadingWorm {
  constructor(startX, startY) {
    this.frequency = baseFreq + random() * freqRange - freqRange / 2;
    this.displacement = 2; // changed from 4 - kim
    this.decay = baseDecay + random() * decayRange - decayRange / 2;
    this.amplitude = baseAmplitude + random() * amplitudeRange - amplitudeRange / 2;
    this.reset(startX, startY);
  }

  reset(startX, startY) {
    this.idx = 0;
    this.startX = startX;
    this.startY = startY;
    this.curX = 0;
    this.curY = 0;
    this.trajectory = 360 * random();
  }

  update() {
    if (this.curX < 0 || this.curX > width || this.curY < 0 || this.curY > height) {
      this.reset(this.startX, this.startY);
    }

    const newPos = movementCalculation(this.startX, this.startY, this.idx, this.amplitude, this.frequency, this.displacement, this.trajectory, this.decay);
    this.curX = newPos.x;
    this.curY = newPos.y;
    this.idx++;
  }

  render(graphics) {
    frameRate(fps);
    const scaling = this.startX * this.startY;

    // pulsating size
    const size = baseSize + sin(this.idx * 3 + scaling * 45) * 2;


    // smoothly shifting colors over time
    const r = sin(this.idx * 2 + scaling * 30) * 127 + 128;
    const g = sin(this.idx * 2 + scaling * 50 + 120) * 127 + 128;
    const b = sin(this.idx * 2 + scaling * 80 + 240) * 127 + 128;

    graphics.noStroke();
    graphics.fill(r, g, b);
    graphics.circle(this.curX, this.curY, size);

    // optional orbiting red satellite for each dot
    const orbitAngle = this.idx * 5 + scaling * 30;
    const orbitRadius = 10 + sin(this.idx * 2 + scaling * 100) * 5;
    const orbitX = this.curX + cos(orbitAngle) * orbitRadius;
    const orbitY = this.curY + sin(orbitAngle) * orbitRadius;

    graphics.fill(255, 0, 0);
    graphics.circle(orbitX, orbitY, 3);
  }
};