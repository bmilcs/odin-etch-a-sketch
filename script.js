const body = document.getElementsByTagName("body")[0];
const etchASketch = document.getElementById("etch-a-sketch");
const container = document.createElement("div");
const slider = document.getElementById("grid-size-range");
const clearBtn = document.getElementById("clear-btn");
const rainbowBtn = document.getElementById("rainbow-btn");
const rows = [];
const squares = [];
const clrNeutral900 = "#000000";
const clrNeutral100 = "#ffffff";
let sizeOfGrid = 16;
let drawingToggle;

console.log(etchASketch);

createGrid(sizeOfGrid);

// setup main etch-a-sketch container
container.classList.add("container");
container.setAttribute("draggable", false);

// add container > section element > body element
etchASketch.appendChild(container);

// slider onchange: set sizeOfGrid to slider.value
slider.onchange = function () {
  removeGrid();
  createGrid(this.value);
  console.log("grid resizing: " + this.value);
};

// clear button: reset grid
clearBtn.onclick = () => resetGrid();

// mousedown: enable drawing
document.addEventListener("mousedown", (e) => {
  toggleDrawing("x");
});

// mouseup: disable drawing
document.addEventListener("mouseup", (e) => {
  toggleDrawing();
});

// enable drawing function
function toggleDrawing(x) {
  // var = !var was inconsistent, causing the drawing functionality
  // to occasionally invert (mouseup: drawing, mousedown: stop drawing)
  if (x) container.addEventListener("mouseover", colorMe);
  else container.removeEventListener("mouseover", colorMe);
}

// create etch-a-sketch grid
function createGrid(newSize) {
  for (let row = 0; row < newSize; row++) {
    console.log(rows[row]);
    rows[row] = document.createElement("div");
    rows[row].classList.add("row");
    rows[row].setAttribute("draggable", false);

    // within each row, create sizeOfGrid number of squares:
    for (let square = 0; square < newSize; square++) {
      // prevent each iteration from overwriting the previous 1-16
      let sq = newSize * row + square;
      squares[sq] = document.createElement("div");
      squares[sq].classList.add("square");
      squares[sq].setAttribute("draggable", false);
      rows[row].appendChild(squares[sq]);
    }
    // append row of 16 squares to final container
    container.appendChild(rows[row]);
  }
}

// remove all rows from the container
function removeGrid() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

// mouseover callback: highlights square via css properties
let colorMe = function (square) {
  // console.log(square.target);
  square.target.classList.add("color-me");
};

// reset grid background-color / wipe drawing
function resetGrid() {
  squares.forEach((square) => {
    square.classList.remove("color-me");
  });
}

// drag & drop was preventing drawing mode from toggling on/off
container.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

container.addEventListener("drop", (e) => {
  e.preventDefault();
});
