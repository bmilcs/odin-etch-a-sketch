const body = document.getElementsByTagName("body")[0];
const placeholder = document.getElementById("etch-a-sketch");
const etchASketch = document.createElement("div");
const slider = document.getElementById("grid-size-range");
const clearBtn = document.getElementById("clear-btn");
const rainbowBtn = document.getElementById("rainbow-btn");
const fgColor = document.getElementById("fg-color");
const bgColor = document.getElementById("bg-color");
const rows = [];
const squares = [];
let drawingToggle;
let oldBackgroundColor = "rgb(255, 255, 255)";

// draw initial grid of 16x16
createGrid("16");

// setup main etch-a-sketch container
etchASketch.classList.add("container");
etchASketch.setAttribute("draggable", false);

// add container to etchASketch placeholder
placeholder.appendChild(etchASketch);

//
// EVENT LISTENERS
//

// slider onchange: set sizeOfGrid to slider.value
slider.onchange = function () {
  removeGrid();
  createGrid(this.value);
};

// bg-color change: set color of squares that haven't been drawn yet
bgColor.onchange = function () {
  squares.forEach((square) => {
    if (!square.dataset.changed) square.style.backgroundColor = this.value;
  });
  oldBackgroundColor = this.value;
};

// clear button: reset grid
clearBtn.onclick = () => eraseDrawing();

// mousedown: enable drawing mode
document.addEventListener("mousedown", (e) => {
  toggleDrawing("x");
});

// mouseup: disable drawing mode
document.addEventListener("mouseup", (e) => {
  toggleDrawing();
});

// // right click: eraser
// etchASketch.addEventListener("contextmenu", (e) => {
//   console.log("eraser mode activated")
// }

// drag & drop was affecting drawing mode / affecting toggle
etchASketch.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

etchASketch.addEventListener("drop", (e) => {
  e.preventDefault();
});

//
// FUNCTIONS
//

// create etch-a-sketch grid
function createGrid(size) {
  for (let row = 0; row < size; row++) {
    rows[row] = document.createElement("div");
    rows[row].classList.add("row");
    rows[row].setAttribute("draggable", false);

    // within each row, create sizeOfGrid number of squares:
    for (let square = 0; square < size; square++) {
      // prevent each iteration from overwriting the previous 1-16
      let sq = size * row + square;
      squares[sq] = document.createElement("div");
      squares[sq].classList.add("square");
      squares[sq].style.backgroundColor = bgColor.value;
      squares[sq].setAttribute("draggable", false);
      rows[row].appendChild(squares[sq]);
    }
    // append row of 16 squares to final container
    etchASketch.appendChild(rows[row]);
  }
}

// remove all rows from the container
function removeGrid() {
  while (etchASketch.firstChild) {
    etchASketch.removeChild(etchASketch.firstChild);
  }
}

// erase drawing / set all squares to bg-color
function eraseDrawing() {
  squares.forEach((square) => {
    square.style.backgroundColor = bgColor.value;
    square.removeAttribute("data-changed");
  });
}

// toggle drawing functionality
function toggleDrawing(x) {
  // var = !var was inconsistent, causing the drawing functionality
  // to occasionally invert (mouseup: drawing, mousedown: stop drawing)
  if (x) etchASketch.addEventListener("mouseover", colorMe);
  else etchASketch.removeEventListener("mouseover", colorMe);
}

// mouseover callback: highlights square based on fgColor value
let colorMe = function (square) {
  square.target.style.backgroundColor = fgColor.value;
  square.target.setAttribute("data-changed", true);
};
