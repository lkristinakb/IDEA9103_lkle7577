# IDEA1903_Group-A
IDEA1903 Group A - Creative Coding Major Project - Individual Portion

This project is an interactive p5.js generative artwork combining a morphing flow-field, rotating circular weave patterns, animated thread-like Bézier curves, and a system of orbiting lines that leave dynamic trails. The result is a layered, continuously evolving woven-textile visual, based on Pacita Abad's "Wheels of Fortune". 

*This is the individual component of a group assignment. Group code repository can be found in the following [Link](https://github.com/kimmjr/IDEA1903_Group-A.git )*
*Main changes to the base code have been highlighted in italics below*

## File Structure
### sketch.js (main entry point)
    Handles:
    - canvas setup & resizing
    - loading the background image
    - generating weave grid positions
    - coordinating all subsystems (flow field, weaves, thread system, line system)
    - rotating the entire composition and compositing the line buffer (lineImg)
*Individual component: updated to ensure rotation and animated functions work, as well as additional .js files incorporated*

### flowfield.js
    Generates the morphing colour field:
    - samples pixel colour from a background image
    - draws a grid of pulsing, noise-offset circles
    - fades from the original image → full flow-field through progress
    - uses Perlin noise + sine modulation for organic motion
*Individual component: minor changes to circle alpha values and sine wave based animation time*

### circularWeave.js
    Defines the Weave class:
    - positions circular weave motifs on a grid
    - generates multi-layered radial woven patterns
    - uses sine-driven wobble to animate each ring
    - each weave exposes centreX, centreY for other subsystems
    - Also includes drawWeaves() which:
        - calculates rows/columns based on screen size
        - populates the global weaves array with positioned weave objects
        - wovenOverlay.js
*Individual component: updated to allow for rotation of weaves, and updated grid organisation & transformations*

### newLine.js
    Implements a line-orbiting and trail-drawing system:
    - each line orbits a weave using angle + noise motion
    - leaves fading trails using a dedicated graphics buffer
    - assigns colours from a palette with random variation
    - creates additional ellipse markers along the trail
    - LineSystem.render() handles fading + drawing to lineImg
*Individual component: updated to allow for rotation with weaves, some updates to style properties & general animation style*

### wovenOverlay.js
    Contains the Thread system:
    - groups weave nodes into rows
    - animates Bézier segments that “grow” across each row
    - adds wobble, curvature modulation, multi-layer shading
    - automatically rebuilds rows on window resize
    Includes:
    - buildRows() — sorts nodes by Y → left-to-right rows
    - drawThreadLayer() — draws each thread pass
    - drawBezierSegment() — calculates wobbling Bézier segments that grow over time
*Individual component: new file containing new set of code to create animated bezier curves "stitching" the weaves together*
