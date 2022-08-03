const body = document.getElementsByTagName("body")[0];
const section = document.createElement("section");
const container = document.createElement("div");
const header = document.createElement("h1");
const rows = [];
const squares = [];
const clrNeutral900 = "#000000";
const clrNeutral100 = "#ffffff";
let sizeOfGrid = 50;

// spacebar: clears screen of painted div's
document.addEventListener("keyup", (e) => {
  if (e.keyCode === 32) {
    resetGrid();
  }
});

// create 16 rows of squares
for (let row = 0; row < sizeOfGrid; row++) {
  // create the div for row
  rows[row] = document.createElement("div");
  rows[row].classList.add("row");

  // create 16 squares in current row
  for (let i = 0; i < sizeOfGrid; i++) {
    // prevent recreation of squares 1-16
    let squareNumber = sizeOfGrid * row + i;

    squares[squareNumber] = document.createElement("div");
    squares[squareNumber].classList.add("square");

    squares[squareNumber].addEventListener("mouseover", () =>
      squares[squareNumber].classList.add("color-me")
    );
    // () => (squares[squareNumber].style.backgroundColor = "black")
    // () => squares[squareNumber].classList.add("colorMe"));

    rows[row].appendChild(squares[squareNumber]);
  }
  container.appendChild(rows[row]);
}

container.classList.add("container");

// setup header
// header.textContent = "Etch-A-Sketch";
// section.appendChild(header);

// add container to section
section.appendChild(container);

body.appendChild(section);

// reset bg color / wipe drawing
function resetGrid() {
  squares.forEach((square) => {
    square.classList.remove("color-me");
  });
}
