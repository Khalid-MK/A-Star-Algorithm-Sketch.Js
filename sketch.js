function removeFromArray(arr, value) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == value) arr.splice(i, 1);
  }
}

function heuristic(a, b) {
  // var d = dist(a.i, a.j, b.i, b.j);
  // Manhattan Distance
  var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

var cols = 100;
var rows = 100;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var path = [];
var start;
var end;
var w, h;

function Spot(i, j) {
  this.i = i;
  this.j = j;

  // Total Distance ( g + h )
  this.f = 0;
  // Score
  this.g = 0;
  // Heuristic
  this.h = 0;

  this.neighbors = [];

  this.previous = undefined;

  this.wall = false

  if (random(1) < 0.3) this.wall = true;

  this.show = function(color) {
    if (this.wall) {
      fill(0)
      noStroke()
      // ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
      rect(this.i * w, this.j * h, w - 1, h - 1);
    }
    // else fill(color);

  }

  this.addNeighbords = function(grid) {
    var i = this.i;
    var j = this.j;

    if (i < cols - 1) this.neighbors.push(grid[i + 1][j]);
    if (i > 0) this.neighbors.push(grid[i - 1][j]);
    if (j < rows - 1) this.neighbors.push(grid[i][j + 1]);
    if (j > 0) this.neighbors.push(grid[i][j - 1]);

    // Diagonal Path 
    if (i > 0 && j > 0) this.neighbors.push(grid[i - 1][j - 1]);
    if (i < cols - 1 && j > 0) this.neighbors.push(grid[i + 1][j - 1]);
    if (i > 0 && j < rows - 1) this.neighbors.push(grid[i - 1][j + 1]);
    if (i < cols - 1 && j < rows - 1) this.neighbors.push(grid[i + 1][j + 1]);
  }
}

function setup() {
  createCanvas(400, 400);

  console.log("A* Started");

  w = width / cols;
  h = height / rows;

  for (var k = 0; k < cols; k++) {
    grid[k] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbords(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = end.wall = false;

  openSet.push(start);
}

function draw() {

  if (openSet.length > 0) {
    // Logic

    var winner = 0
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) winner = i;
    }

    var current = openSet[winner];

    if (openSet[winner] === end) {
      noLoop();
      console.log("Done!!");

    }

    removeFromArray(openSet, current);

    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;

        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
          newPath = true;
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current
        }
      }
    }
  } else {
    console.log("No Solution")
    noLoop();
    return;
  }

  background(255);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255))
    }
  }

  for (var i = 0; i < closedSet.length; i++) {
    // closedSet[i].show(color(255, 0, 0))
  }

  for (var i = 0; i < openSet.length; i++) {
    // openSet[i].show(color(0, 255, 0))
  }

  // Correct Path
  path = [];
  var temp = current;

  path.push(temp)

  while (temp.previous) {
    path.push(temp.previous)
    temp = temp.previous
  }

  for (var i = 0; i < path.length; i++) {
    // path[i].show(color(0, 0, 255))
  }

  noFill();
  stroke(255, 114, 0);
  strokeWeight(w / 2)
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2)
  }
  endShape();


}