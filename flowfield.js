/*
This function creates a morphing 'flow field' animation which uses an image as the base
Inspiration for this code was sourced from: 
https://editor.p5js.org/StevesMakerspace/sketches/RbULssOKQ
*/


function drawFlowField() {
  img.loadPixels(); // / Load image for colour data

  let speedFactor = 3; // This number controls how fast the morph is happening i.e larger number faster morph
  let progress = constrain((frameCount * speedFactor) / morphDuration, 0, 1); // 0= morph begins, 1=morph completed
  // Calculates how far the animation has progressed, scaled by the speed, controls it between 0 - 1


  /// Fades out the original image gradually
  tint(255, 255 * (1 - progress)); 
  image(img, 0, 0, width, height);

  // Loop through the canvas morphing circles, in a grid pattern
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {

      // Get pixel colours at x & y
      let index = (x + y * width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // Calculate brightness for the size mapping
      let brightness = (r + g + b) / 3;

      // Base size depends on brightness
      let baseSize = map(brightness, 0, 255, 2, spacing);

      // Add organic movement using Perlin noise
      let offsetX = map(noise(x * 0.01, y * 0.01, frameCount * 0.01), 0, 1, -3, 3);
      let offsetY = map(noise(x * 0.01 + 100, y * 0.01 + 100, frameCount * 0.01), 0, 1, -3, 3);

      // Animate size with sine wave for pulsating effect
      let size = baseSize + sin(frameCount * 0.05 + (x + y) * 0.01) *30;

      // As the morph animation progresses, the circles fade in smoothly from invisible to fully visible
      let alpha = lerp(0, 255, progress);

      // Draw coloured circle at x & y with offsets
      noStroke();
      fill(r, g, b, alpha);
      ellipse(x + offsetX, y + offsetY, size, size);
    }
  }
}