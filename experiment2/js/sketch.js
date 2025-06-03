// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let seed = 0;
let leaves = [];
let lastSpawnTime = 0;
let spawnInterval = 2000; // in milliseconds (2 seconds)

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  const button = document.getElementById("reimagine");
  if (button) {
    button.addEventListener("click", reimagineFunction);
  }
  reimagineFunction();
}
function reimagineFunction() {
  background(230);
  seed++;
  leaves = [];
  for (let i = 0; i < 200; i++) {
    leaves.push(new Leaf());
  }
  fill(255);
  noStroke();
  for (let i = 0; i < 50000; i++) {
    circle(random(width), random(height), 5);
  }
}

function draw() {
  randomSeed(seed);

  // Add a new leaf every 2 seconds
  if (millis() - lastSpawnTime > spawnInterval) {
    leaves.push(new Leaf());
    lastSpawnTime = millis();
  }

  // Update and display leaves
  for (let i = leaves.length - 1; i >= 0; i--) {
    leaves[i].update();
    leaves[i].display();
  }
}

class Leaf {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0.5, 1.2);
    this.rotation = random(TWO_PI);
    this.age = 0;
    this.lifetime = random(5000, 10000);
  }

  update() {
    this.age++;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    scale(this.size);
    translate(-50, -50);

    let t = constrain(this.age / this.lifetime, 0, 1);
    let r = lerp(241, 41, t);
    let g = lerp(171, 41, t);
    let b = lerp(21, 41, t);

    fill(r, g, b);
    noStroke();

    arc(83, 80, 150, 150, radians(170), radians(270), CHORD);
    arc(10, 19, 150, 150, radians(-10), radians(90), CHORD);

    // Initialize spots array only once
    if (!this.display.spots) {
      // Create offscreen buffer for shape mask
      let pg = createGraphics(160, 160);
      pg.noStroke();
      pg.fill(255);
      pg.clear();
      pg.arc(83, 80, 100, 100, radians(170), radians(270), CHORD);
      pg.arc(10, 19, 100, 100, radians(-10), radians(90), CHORD);

      this.display.spots = [];
      let spotsCount = random(10,30);
      let attemptsLimit = 200;

      for (let i = 0; i < spotsCount; i++) {
        let px, py;
        let attempts = 0;
        do {
          px = random(0, 200);
          py = random(0, 200);
          attempts++;
          if (attempts > attemptsLimit) break;
          let c = pg.get(floor(px), floor(py));
          var inside = (c[3] > 0);
        } while (!inside);

        if (attempts <= attemptsLimit) {
          this.display.spots.push({ x: px, y: py, size: random(5, 20) });
        }
      }
    }

    // Draw the spots
    fill(41);
    noStroke();
    for (let spot of this.display.spots) {
      circle(spot.x, spot.y, spot.size);
    }

    pop();
  }

}