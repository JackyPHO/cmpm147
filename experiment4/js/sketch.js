// sketch.js - purpose and description here
// Author: Jacky Ho
// Date:
"use strict";

// Global variables. These will mostly be overwritten in setup().
let camera_offset;
let camera_velocity;
let worldSeed;
let clouds = [];
let stars = [];

function preload() {
}

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent("canvas-container");

  camera_offset = new p5.Vector(-width / 2, height / 2);
  camera_velocity = new p5.Vector(0, 0);

  let label = createP();
  label.html("World key: ");
  label.parent("canvas-container");

  let input = createInput("xyzzy");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("WASD keys scroll. Day and Night Cycle").parent("canvas-container");

}

function h32(str, seed = 0) {
  let h = seed ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x5bd1e995);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function rebuildWorld(key) {
  worldSeed = h32(key, 0);
  console.log("World seed changed:", worldSeed); // Debug
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function draw() {
  // Keyboard controls!
  if (keyIsDown(65)) {
    camera_velocity.x -= 0.5;
  }
  if (keyIsDown(68)) {
    camera_velocity.x += 0.5;
  }
  if (keyIsDown(87)) {
    camera_velocity.y -= 0.5;
  }
  if (keyIsDown(83)) {
    camera_velocity.y += 0.5;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.95); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }
  let h = hour();
  let m = minute();

  if (h >= 6 && h < 19) {
    background(128, 229, 255);
    if (mouseIsPressed){
      push();
      fill(250);
      noStroke();
      ellipse(mouseX, mouseY, 70, 50);
      ellipse(mouseX + 10, mouseY + 10, 70, 50);
      ellipse(mouseX - 20, mouseY + 10, 70, 50);
      pop();
    }
    drawClouds(camera_offset);

    let minsLeft = (19 - h) * 60 - m;
    document.getElementById("timeDisplay").textContent =
      `${int(minsLeft / 60)} hour ${minsLeft % 60} minutes until night`;

  } else {
    background(0, 26, 102);
    if (mouseIsPressed){
      push();
      fill(250);
      noStroke();
      star(mouseX, mouseY, 3, 7, 5);
      pop();
    }
    drawStars(camera_offset);
    let nextDay = h < 6 ? 6 - h : 24 - h + 6;
    let minsLeft = nextDay * 60 - m;
    document.getElementById("timeDisplay").textContent =
      `${int(minsLeft / 60)} hour ${minsLeft % 60} minutes until day`;
  }
  camera_velocity.x += 0.07;
}

function drawClouds(camera) {
  push();
  translate(-camera.x, -camera.y);

  let spacing = 500; // distance between chunks

  let cx = Math.floor(camera.x / spacing);
  let cy = Math.floor(camera.y / spacing);

  for (let y = cy - 5; y <= cy + 5; y++) {
    for (let x = cx - 5; x <= cx + 5; x++) {
      let seed = worldSeed + x * 10000 + y;
      randomSeed(seed);

      for (let i = 0; i < 3; i++) {
        let ex = x * spacing + random(-spacing / 2, spacing / 2);
        let ey = y * spacing + random(-spacing / 2, spacing / 2);

        fill(250);
        noStroke();
        ellipse(ex, ey, 70, 50);
        ellipse(ex + 10, ey + 10, 70, 50);
        ellipse(ex - 20, ey + 10, 70, 50);
      }
    }
  }
  for (let c of clouds){
    ellipse(c.x, c.y, 70, 50);
    ellipse(c.x + 10, c.y + 10, 70, 50);
    ellipse(c.x - 20, c.y + 10, 70, 50);
  }
    
  pop();
}
function drawStars(camera) {
  push();
  translate(-camera.x, -camera.y);

  let spacing = 200; // distance between chunks

  let cx = Math.floor(camera.x / spacing);
  let cy = Math.floor(camera.y / spacing);

  for (let y = cy - 10; y <= cy + 10; y++) {
    for (let x = cx - 10; x <= cx + 10; x++) {
      let seed = worldSeed + x * 10000 + y;
      randomSeed(seed);

      for (let i = 0; i < 3; i++) {
        let ex = x * spacing + random(-spacing / 2, spacing / 2);
        let ey = y * spacing + random(-spacing / 2, spacing / 2);

        fill(250);
        noStroke();
        star(ex, ey, 3, 7, 5);
      }
    }
  }
  for (let s of stars){
    star(s.x, s.y, 3, 7, 5);
  }
  pop();
}
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
function mousePressed() {
  let worldX = mouseX + camera_offset.x;
  let worldY = mouseY + camera_offset.y;
  clouds.push({ x: worldX, y: worldY });
  stars.push({ x: worldX, y: worldY });
}