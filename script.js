//
// VARIABLE DECLARATIONS
//

const body = document.getElementsByTagName("body")[0];
const placeholder = document.getElementById("etch-a-sketch");
const etchASketch = document.createElement("div");
const slider = document.getElementById("grid-size-range");
const clearBtn = document.getElementById("clear-btn");
const toggleGridBtn = document.getElementById("toggle-grid-btn");
const shaderModeBtn = document.getElementById("shader-mode-btn");
const fgColor = document.getElementById("fg-color");
const bgColor = document.getElementById("bg-color");
const instructions = document.getElementById("instructions");
const rows = [];
const squares = [];
const colorPurple = "hsl(253, 60%, 48%)";
let color = fgColor.value;
let drawingToggle;
let eraserMode = false;
let shaderMode = false;

//
// INITIAL SETUP
//

// create initial grid of 16x16 & add etchASketch to the placeholder
createGrid("32");
etchASketch.classList.add("container");
etchASketch.setAttribute("draggable", false);
placeholder.appendChild(etchASketch);

//
// EVENT LISTENERS
//

// bg-color picker: set bg-color of squares that don't contain the "data-changed" attribute
bgColor.addEventListener("change", bgColorEvent, false);
bgColor.addEventListener("input", bgColorEvent, false);

slider.onchange = function () {
  removeGrid();
  createGrid(this.value);
};

clearBtn.onclick = () => eraseDrawing();

// toggle the border on grid squares
toggleGridBtn.onclick = () => {
  if (squares[0].style.border === "0px")
    squares.forEach((square) => (square.style.border = "1px solid #00000033"));
  else squares.forEach((square) => (square.style.border = "0"));
};

// toggle shader mode
shaderModeBtn.addEventListener("click", (e) => {
  shaderMode = !shaderMode;
  if (shaderMode) {
    shaderModeBtn.style.backgroundColor = colorPurple;
    shaderModeBtn.style.color = "white";
    shaderModeBtn.style.fontWeight = "800";
    instructions.textContent = "right click: increase color lightness";
  } else {
    shaderModeBtn.style.backgroundColor = "white";
    shaderModeBtn.style.color = "black";
    shaderModeBtn.style.fontWeight = "400";
    instructions.textContent = "right click: eraser";
  }
});

// mousedown: drawing functionality
etchASketch.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    color = fgColor.value;
  } else if (e.button === 2) {
    color = bgColor.value;
    eraserMode = true;
  }
  // colorMe: draw on click, drawing mode: draw on mouse hover
  colorMe(e);
  toggleDrawingMode("x");
});

// mouseup: disable drawing mode
document.addEventListener("mouseup", (e) => {
  toggleDrawingMode();
  eraserMode = false;
});

// prevent default: right click
// right click is used for eraser & shader mode
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
// this was randomly preventing drawing mode from working
etchASketch.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

etchASketch.addEventListener("drop", (e) => {
  e.preventDefault();
});

//
// FUNCTIONS
//

function toggleDrawingMode(x) {
  // var = !var was inconsistent, causing the drawing functionality
  // to occasionally invert (mouseup: drawing, mousedown: stop drawing)
  if (x) etchASketch.addEventListener("mouseover", colorMe);
  else etchASketch.removeEventListener("mouseover", colorMe);
}

// click & mouseover callback
let colorMe = function (e) {
  if (shaderMode)
    e.target.style.backgroundColor = shadeMe(e.target.style.backgroundColor);
  else e.target.style.backgroundColor = color;

  // "data-changed" attribute determines whether or not the bg-color picker overwrites
  // a square's background color.
  if (e.target.style.backgroundColor == convertHexToRGB(bgColor.value))
    e.target.removeAttribute("data-changed");
  else e.target.setAttribute("data-changed", true);
};

// shadeMe: increases or decreases color lightness of a square on each consecutive pass
// this function receives an "rgb(x,x,x)" value
let shadeMe = function (rgb) {
  // remove "rgb(" and ")" from the input and convert it to hsl
  let rgbValues = rgb.slice(4, -1).split(",");
  let hslValues = convertRGBToHSL(rgbValues[0], rgbValues[1], rgbValues[2]);

  // extract the lightness value of the hsl color
  let hslTemp = hslValues.slice(4, -2).split(",");
  let hslLightness = +hslTemp[2];

  // eraserMode is triggered on right click > lighten color
  if (eraserMode) {
    if (hslLightness > 90) hslLightness = 100;
    else hslLightness += 10;
  } else {
    // on left click > darken color
    if (hslLightness < 10) hslLightness = 0;
    else hslLightness -= 10;
  }

  // add the modified lightness value to the original color
  hslValues = hslValues.replace(/[\d.]+(\%\))/i, hslLightness + "$1");
  return hslValues;
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

//
// UTILITY FUNCTIONS
// Source: https://css-tricks.com/converting-color-spaces-in-javascript/
//

function convertRGBToHSL(r, g, b) {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;
  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return "hsl(" + h + "," + s + "%," + l + "%)";
}

function convertHexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return "rgb(" + +r + ", " + +g + ", " + +b + ")";
}
