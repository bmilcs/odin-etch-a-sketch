const body = document.getElementsByTagName("body")[0];
const container = document.createElement("div");
const rows = [];
const squares = [];
const clrNeutral900 = "#000000";
const clrNeutral100 = "#ffffff";
let sizeOfGrid = 100;

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

    // squares[squareNumber].classList.add("colorMe")
    squares[squareNumber].addEventListener(
      "mouseover",
      () => (squares[squareNumber].style.backgroundColor = "black")
    );

    rows[row].appendChild(squares[squareNumber]);
  }
  container.appendChild(rows[row]);
}

function resetGrid() {
  squares.forEach((square) => {
    square.style.backgroundColor = "white";
  });
}

container.classList.add("container");
body.appendChild(container);
