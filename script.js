//
// VARIABLE DECLARATIONS
//

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
let color = fgColor.value;
let drawingToggle;
let eraserMode = false;

//
// INITIAL SETUP
//

// create initial grid of 16x16 & add etchASketch to the placeholder
createGrid("16");
etchASketch.classList.add("container");
etchASketch.setAttribute("draggable", false);
placeholder.appendChild(etchASketch);

//
// EVENT LISTENERS
//

// resizing grid
slider.onchange = function () {
  removeGrid();
  createGrid(this.value);
};

// bg-color change: set bg-color of squares that haven't been 'changed' (drawn in)
bgColor.addEventListener("change", bgColorEvent, false);
bgColor.addEventListener("input", bgColorEvent, false);

// clear button: reset grid
clearBtn.onclick = () => eraseDrawing();

// mousedown: enable drawing mode
etchASketch.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    // left click: draw in fgColor
    color = fgColor.value;
    toggleDrawingMode("x");
    // right click: draw in bgColor (erase)
  } else if (e.button === 2) {
    color = bgColor.value;
    eraserMode = true;
    toggleDrawingMode("x");
  }
  e.target.style.backgroundColor = color;
});

// mouseup: disable drawing mode
document.addEventListener("mouseup", (e) => {
  toggleDrawingMode();
  eraserMode = false;
});

// prevent default: right click
if (document.addEventListener) {
  document.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    false
  );
} else {
  document.attachEvent("oncontextmenu", (e) => {
    window.event.returnValue = false;
  });
}

// prevent default: drag & drop
// this was having a negative effect on toggleDrawingMode
etchASketch.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

etchASketch.addEventListener("drop", (e) => {
  e.preventDefault();
});

//
// FUNCTIONS
//

// toggle drawing functionality: add/remove eventlistener
function toggleDrawingMode(x) {
  // var = !var was inconsistent, causing the drawing functionality
  // to occasionally invert (mouseup: drawing, mousedown: stop drawing)
  if (x) etchASketch.addEventListener("mouseover", colorMe);
  else etchASketch.removeEventListener("mouseover", colorMe);
}

// mouseover callback: highlights square based on fgColor value
let colorMe = function (square) {
  square.target.style.backgroundColor = color;
  // remove dataset to allow bg-color changes to work on erased squares
  if (eraserMode) square.target.removeAttribute("data-changed");
  else square.target.setAttribute("data-changed", true);
};

// create etch-a-sketch grid
function createGrid(size) {
  // create "size" number of rows
  for (let row = 0; row < size; row++) {
    rows[row] = document.createElement("div");
    rows[row].classList.add("row");
    rows[row].setAttribute("draggable", false);

    // within each row, create "size" number of squares
    for (let square = 0; square < size; square++) {
      // prevent each iteration from overwriting the previous 1-16
      let sq = size * row + square;
      squares[sq] = document.createElement("div");
      squares[sq].classList.add("square");
      squares[sq].style.backgroundColor = bgColor.value;
      squares[sq].setAttribute("draggable", false);
      rows[row].appendChild(squares[sq]);
    }
    // append current row of squares to final container
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

// change bg-color for all squares that haven't been drawn in yet
function bgColorEvent(e) {
  squares.forEach((square) => {
    if (!square.dataset.changed) square.style.backgroundColor = e.target.value;
  });
}
