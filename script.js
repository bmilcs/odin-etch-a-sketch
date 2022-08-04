const body = document.getElementsByTagName("body")[0];
const section = document.createElement("section");
const container = document.createElement("div");
const rows = [];
const squares = [];
const clrNeutral900 = "#000000";
const clrNeutral100 = "#ffffff";
let drawingToggle;
let sizeOfGrid = 64;

// spacebar: clears screen of painted div's
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 32) {
    resetGrid();
  }
});

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

// setup main etch-a-sketch container
container.classList.add("container");
container.setAttribute("draggable", false);

// create sizeOfGrid number of rows:
for (let row = 0; row < sizeOfGrid; row++) {
  rows[row] = document.createElement("div");
  rows[row].classList.add("row");
  rows[row].setAttribute("draggable", false);

  // within each row, create sizeOfGrid number of squares:
  for (let square = 0; square < sizeOfGrid; square++) {
    // prevent each iteration from overwriting the previous 1-16
    let sq = sizeOfGrid * row + square;
    squares[sq] = document.createElement("div");
    squares[sq].classList.add("square");
    squares[sq].setAttribute("draggable", false);
    rows[row].appendChild(squares[sq]);
  }
  // append row of 16 squares to final container
  container.appendChild(rows[row]);
}

// add container > section element > body element
section.appendChild(container);
body.appendChild(section);

// functions

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
