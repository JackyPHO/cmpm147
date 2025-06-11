// sketch.js - purpose and description here
// Author: Jacky Ho
// Date:


let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;
let overWorld = false;
let dungeon = true;

const startI = {x:8,y:15};
const startJ = {x:8,y:18};
const lookup = [[0, 1],
  [2, 5],  //North
  [3, 6],  //East
  [3, 5],  //Northeast
  [2, 7],  //South
  [0, 1],  
  [3, 7],  //Southeast 
  [0, 1],  
  [1, 6],  //West
  [1, 5],  //Northwest
  [0, 1],
  [0, 1],  
  [1, 7],  //Southwest
  [0, 1],
  [0, 1],
  [0, 1]]

function preload() {
  tilesetImage = loadImage("25101045-29e2-407a-894c-e0243cd8c7c6_tilesetP8.png");
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}
function setOverworld(){
  overWorld = true;
  dungeon = false;
  regenerateGrid();
}
function setDungeon(){
  overWorld = false;
  dungeon = true;
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#dungeonButton").mousePressed(setDungeon);
  select("#overworldButton").mousePressed(setOverworld);
  select("#asciiBox").input(reparseGrid);

  reseed();
}


function draw() {
  randomSeed(seed);
  if (dungeon)
    drawDungeon(currentGrid);
  if (overWorld)
    drawOverworld(currentGrid);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function generateGrid(numCols, numRows) {
  if(dungeon){
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        if(i > startI.x && i < startI.y && j > startJ.x && j < startJ.y)
          row.push("+");
        else
          row.push(".");
      }
      grid.push(row);
    }
    const starterCenter = {i: Math.floor((startI.x + startI.y) / 2), j: Math.floor((startJ.x + startJ.y) / 2)};
    const room1 = createRoom(grid, 3, 8, 7, 20, "+");
    const room2 = createRoom(grid, 18, 4, 23, 9, "+");
    const room3 = createRoom(grid, 18, 15, 23, 20, "+");

    connectPoints(grid, starterCenter, room1);
    connectPoints(grid, starterCenter, room2);
    connectPoints(grid, starterCenter, room3);
    return grid;
  }
  if(overWorld){
    let grid = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        let chance = Math.floor(random(10));
        if(i % 2 && j % 2 && chance === 1)
          row.push("1");
        else{
          if(chance === 3)
            row.push("2");
          else
            row.push("0");
        }
      }
      grid.push(row);
    }
    let randomY = Math.floor(random(10,15));
    let randomZ = Math.floor(random(10,15));
    for(let y = 0+randomY; y <= 24-randomY; y++){
      for(let z = 0; z <= 24; z++){
        grid[y][z] = "3";
      }
    }
    for(let z = 0+randomZ; z <= 24-randomZ; z++){
      for(let y = 0; y <= 24; y++){
        grid[y][z] = "3";
      }
    }
    return grid;
  }
}
function connectPoints(grid, from, to) {
  let {i: y1, j: x1} = from;
  let {i: y2, j: x2} = to;

  // First horizontal path (2 tiles tall)
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    if (grid[y1][x] === ".") grid[y1][x] = "+";
    if (grid[y1 + 1] && grid[y1 + 1][x] === ".") grid[y1 + 1][x] = "+";
  }

  // Then vertical path (2 tiles wide)
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    if (grid[y][x2] === ".") grid[y][x2] = "+";
    if (grid[y][x2 + 1] === ".") grid[y][x2 + 1] = "+";
  }
}

function createRoom(grid, i, j, ii, jj, sign){
  let randomY = Math.floor(random(i,ii));
  let randomZ = Math.floor(random(j,jj));
  let tiles = [];

  for(let y = i; y <= randomY; y++){
    for(let z = j; z <= randomZ; z++){
      grid[y][z] = sign;
      tiles.push({i: y, j: z});
    }
  }

  if (tiles.length > 0) {
    const randIndex = Math.floor(random(tiles.length));
    const {i: chestI, j: chestJ} = tiles[randIndex];
    grid[chestI][chestJ] = "-";
    const centerY = Math.floor((i + randomY) / 2);
    const centerZ = Math.floor((j + randomZ) / 2);
    return {i: centerY, j: centerZ};
  }
}

function gridCheck(grid, i, j, target){
  if(i >= 0 && i < grid.length && j >= 0 && j < grid[i].length){
    if (grid[i][j] == target)
      return true;
  }
  return false;
}
function gridCode(grid, i, j, target) {
  let code = 0;
  if (gridCheck(grid, i - 1, j, target)) code |= 1;  // North
  if (gridCheck(grid, i, j + 1, target)) code |= 2;  // East
  if (gridCheck(grid, i + 1, j, target)) code |= 4;  // South
  if (gridCheck(grid, i, j - 1, target)) code |= 8;  // West
  return code;
}

// The drawContext function:
function drawContext(grid, i, j, target, baseTileX, baseTileY) {
  const code = gridCode(grid, i, j, target);       // get the neighbors code
  const [offsetX, offsetY] = lookup[code] || [0, 0];          // lookup tile offsets for this code
  placeTile(i, j, baseTileX + offsetX, baseTileY + offsetY);  // place the correct tile
}
function drawDungeon(grid) {
  background(150);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      placeTile(i, j, random(3), 9);
      if (gridCheck(grid, i, j, "+")) {
        placeTile(i, j, random(3), 10);
      }
      else{
        drawContext(grid, i, j, "+", 3, 10); // draw wall around floors
      }
      if (gridCheck(grid, i, j, "-")) {
        placeTile(i, j, 5, 29);
      }
      placeTile(12, 13, 27, 27);
    }
  }
}

function drawOverworld(grid) {
  background(0, 230, 42);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, "0"))
        placeTile(i, j, Math.floor(random(4)), 0);
      if (gridCheck(grid, i, j, "1"))
        placeTile(i, j, 20, 0);
      if (gridCheck(grid, i, j, "2"))
        placeTile(i, j, Math.floor(random(26,28)), Math.floor(random(4)));
      if (gridCheck(grid, i, j, "3"))
        placeTile(i, j, Math.floor(random(4)), 7);
      else
        drawContext(grid, i, j, "3", 3, 1);
    }
  }
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    const i = Math.floor(mouseY / 16);
    const j = Math.floor(mouseX / 16);
    if (gridCheck(currentGrid, i, j, "-")) {
      currentGrid[i][j] = "+";  // remove chest
    }
  }
}