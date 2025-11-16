
class Thread {
  constructor(nodes, colWeaves, numThreads = 1, amp = 25, freq = 0.5, speed = 0.02) {
    this.nodes = nodes; //stores array of weaves, each node representing 1 weave
    this.colWeaves = colWeaves; //stores number of weaves per row 
    this.numThreads = numThreads; //stores how many threads should be drawn on grid
    this.amp = amp; //stores amplitude given to control points for bezier curves
    this.freq = freq; //stores frequency of wobble oscillation
    this.speed = speed; //determines how fast the thread "grows"

    this.buildRows(); // build rows on construction
  }

buildRows() {
  //in order to keep window resizing possible, this recalculates the rows on the screen
  this.rows = [];
  this.progress = [];

  // Group by approximate row Y
  let sortedNodes = [...this.nodes]; // creates a shallow copy of array so original array is not modified
  sortedNodes.sort(function(a, b) { 
    return a.centreY - b.centreY;
  }); //sorts copied array by the centre.y property in ascending order

  let rowTolerance = 5; // pixels tolerance for same row
  let currentRow = []; //initialises an empty array to hold nodes that belong to the current row
  let lastY = sortedNodes[0].centreY; //stores y position of the first node as a reference for the current row

  //loop through all the nodes in sortedNodes, compare its node.centreY with lastY and either add it to currentRow or start a new row
  for (let i = 0; i < sortedNodes.length; i++) {
    let node = sortedNodes[i];

    // Check if the node is close enough in Y to belong to the current row
    if (Math.abs(node.centreY - lastY) <= rowTolerance) {
        currentRow.push(node);  // Add node to current row array
    } else { //if row is too far vertically from the previous row, start a new row
        // Current row finished; sort it from left to right (X ascending)
        currentRow.sort(function(a, b) {
            return a.centreX - b.centreX;
        });

        // Add the finished row to this.rows
        this.rows.push(currentRow);

        // Initialize growth progress for this row
        this.progress.push(0);

        // Start a new row with the current node
        currentRow = [];
        currentRow.push(node);

        // Update lastY to the Y-coordinate of this new row
        lastY = node.centreY;
    }
}

  // push the last row
  if (currentRow.length) { //checks that current row has at least one node
    currentRow.sort(function(a, b) {
        return a.centreX - b.centreX;
      }); //sorts nodes in the row from left to right according to their x coordinate
    this.rows.push(currentRow); //adds sorted row to the rows array in the thread class
    this.progress.push(0); //initialises growth progress for this row to 0
}
}

  resize(newColWeaves) {
    this.colWeaves = newColWeaves;
    this.buildRows(); // rebuild rows with updated colWeaves should the window be resized
  }

  update() { //grows thread by each progress count
    for (let i = 0; i < this.progress.length; i++) {
      let max = this.rows[i].length - 1;
      if (this.progress[i] < max) {
        this.progress[i] += this.speed * (1 - this.progress[i] / max);
      }
    }
  }

  display() {
    noFill();
    strokeWeight(2);

    for (let t = 0; t < this.numThreads; t++) {

      //First layer: original curvature
      stroke(30,42,86,255); //dark blue 
      this.drawThreadLayer(t,1); //factor 1 = normal curvature

      //second layer: opposite curvature
      stroke(30,42,86,150); //lighter/different alpha
      this.drawThreadLayer(t, 0.8); //factor 0.8 = shadowed curvature
      
      //third layer: opposite curvature
      stroke(1,77,78,150); //lighter/different alpha
      strokeWeight(1);
      this.drawThreadLayer(t, -1); //factor -1 = reversed curvature
    }
  }
    drawThreadLayer(threadIndex, curvatureFactor) {
      for (let r = 0; r < this.rows.length; r++) {
        let row = this.rows[r]; //assigns current row of nodes to the variable row
        if (r % 2 === 1) row = [...row].reverse(); //if row index is odd, reverses the order of nodes

        let fullIndex = floor(this.progress[r]); //calculates how many full segments of the row should be drawn for the current frame
        let partialT = this.progress[r] - fullIndex; //calculates partial progress of the next segment

        //draw all fully completed bezier segments for this row - t parameter for thread index (for phase offset of wobble), 1 if segment is drawn completely 
        for (let i = 0; i < fullIndex; i++){ 
        this.drawBezierSegment(row[i], row[i+1], threadIndex, 1, curvatureFactor);
        }
        //draws next segment partially depending on partialT
        if (fullIndex < row.length - 1){
        this.drawBezierSegment(row[fullIndex], row[fullIndex+1], threadIndex, partialT, curvatureFactor);
        } 
      }
    }


  //draws a single bezier segment between two weave nodes
  drawBezierSegment(w1, w2, threadIndex, t, curvatureFactor) { //draws a single bezier segment between two weave nodes
    
    //calculates vertical and horizontal direction from first to second node
    let dx = w2.centreX - w1.centreX;
    let dy = w2.centreY - w1.centreY;

    //calculates the perpendicular direction from dx & dy with time based factor
    let px = -dy * 0.35 * curvatureFactor;
    let py = dx * 0.35 * curvatureFactor;
    //creates a wobble offset depending on frameCount using a sine wave
    //t adds a small phase offset for partial growth
    let wob = 3 + sin(frameCount * this.freq + threadIndex * 0.5) * this.amp;

    //calculates two control points for cubic bezier at 30% and 70% of the distance
    //wobble offset added to perpendicular direction
    let c1x = w1.centreX + dx * 0.3 + px * wob * 0.1;
    let c1y = w1.centreY + dy * 0.3 + py * wob * 0.1;
    let c2x = w1.centreX + dx * 0.7 - px * wob * 0.1;
    let c2y = w1.centreY + dy * 0.7 - py * wob * 0.1;

    //uses lerp to calculate a partial end point along segment using t, so thread "grows"
    let endX = lerp(w1.centreX, w2.centreX, t);
    let endY = lerp(w1.centreY, w2.centreY, t);

    bezier(w1.centreX, w1.centreY, c1x, c1y, c2x, c2y, endX, endY);
  }
}