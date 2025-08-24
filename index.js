/********************************************************************
 * Star Pattern Library — 100 print* functions (solid / hollow)
 * Author: Lalit Patharia
 * Usage:
 *   printTriangle('solid', 5);
 *   printDiamond('hollow', 7);
 *   printRectangle('solid', 5, 12);
 ********************************************************************/

// ---------- Core Helpers ----------
const isValidType = (type) => type === "solid" || type === "hollow";
const clampSize = (n) => Math.max(1, Math.floor(n || 1));
const repeat = (ch, n) => (n > 0 ? ch.repeat(n) : "");
const out = (line) => console.log(line);

// Generic renderer for (height x width) grid using a predicate
function renderGrid(height, width, type, fillPred, borderPred) {
  height = clampSize(height);
  width = clampSize(width ?? height);

  for (let r = 0; r < height; r++) {
    let line = "";
    for (let c = 0; c < width; c++) {
      const fill = fillPred(r, c, height, width);
      if (!fill) {
        line += "  ";
        continue;
      }
      if (type === "solid") {
        line += "* ";
      } else {
        const border = borderPred
          ? borderPred(r, c, height, width)
          : isEdge(r, c, height, width);
        line += border ? "* " : "  ";
      }
    }
    out(line);
  }
}

const isEdge = (r, c, h, w) => r === 0 || c === 0 || r === h - 1 || c === w - 1;

// Triangular row-writer (single centered line builder)
function printCenteredRow(spacesLeft, stars, type, isHollow, isLastRow) {
  let line = repeat("  ", spacesLeft);
  if (type === "solid" || !isHollow || stars <= 2 || isLastRow) {
    line += repeat("* ", stars);
  } else {
    line += "* " + repeat("  ", Math.max(0, stars - 2)) + "* ";
  }
  out(line);
}

// ---------- Shape Primitives (reused across many patterns) ----------

// Right triangle (left aligned). Options: { inverted: boolean }
function drawRightTriangle(type, height, { inverted = false } = {}) {
  height = clampSize(height);
  for (let row = 1; row <= height; row++) {
    const n = inverted ? height - row + 1 : row;
    if (type === "solid" || n <= 2 || (row === height && !inverted)) {
      out(repeat("* ", n));
    } else {
      // hollow: only first, last in row, and last baseline
      const inner = Math.max(0, n - 2);
      out("* " + repeat("  ", inner) + "* ");
    }
  }
}

// Right triangle (right aligned). Options: { inverted: boolean }
function drawRightTriangleRight(type, height, { inverted = false } = {}) {
  height = clampSize(height);
  for (let row = 1; row <= height; row++) {
    const n = inverted ? height - row + 1 : row;
    const spaces = height - n;
    if (type === "solid" || n <= 2 || (row === height && !inverted)) {
      out(repeat("  ", spaces) + repeat("* ", n));
    } else {
      out(
        repeat("  ", spaces) + "* " + repeat("  ", Math.max(0, n - 2)) + "* "
      );
    }
  }
}

// Isosceles triangle (upright / inverted)
function drawIsosceles(type, height, { inverted = false } = {}) {
  height = clampSize(height);
  if (!inverted) {
    for (let row = 1; row <= height; row++) {
      const stars = 2 * row - 1;
      printCenteredRow(height - row, stars, type, true, row === height);
    }
  } else {
    for (let row = height; row >= 1; row--) {
      const stars = 2 * row - 1;
      printCenteredRow(height - row, stars, type, true, row === height);
    }
  }
}

// Diamond based on two isosceles triangles
function drawDiamond(type, height) {
  height = clampSize(height);
  // top
  for (let row = 1; row <= height; row++) {
    const stars = 2 * row - 1;
    printCenteredRow(height - row, stars, type, true, row === height);
  }
  // bottom
  for (let row = height - 1; row >= 1; row--) {
    const stars = 2 * row - 1;
    printCenteredRow(height - row, stars, type, true, row === height - 1);
  }
}

// Sandglass / hourglass
function drawHourglass(type, height) {
  height = clampSize(height);
  // top inverted triangle
  for (let row = height; row >= 1; row--) {
    const stars = 2 * row - 1;
    printCenteredRow(height - row, stars, type, true, row === height);
  }
  // bottom triangle
  for (let row = 2; row <= height; row++) {
    const stars = 2 * row - 1;
    printCenteredRow(height - row, stars, type, true, row === height);
  }
}

// Rectangle / Square
function drawRectangle(type, height, width) {
  renderGrid(
    height,
    width,
    type,
    () => true,
    (r, c, h, w) => isEdge(r, c, h, w)
  );
}

// X / Cross
function drawX(type, size) {
  size = clampSize(size);
  renderGrid(
    size,
    size,
    type,
    (r, c, h, w) => r === c || r + c === w - 1,
    () => true // X is always just its border lines
  );
}

// Plus (+) centered
function drawPlus(type, size) {
  size = Math.max(3, clampSize(size) | 1); // force odd >=3
  const mid = Math.floor(size / 2);
  renderGrid(
    size,
    size,
    type,
    (r, c) => r === mid || c === mid,
    () => true
  );
}

// Checkerboard
function drawCheckerboard(type, size) {
  renderGrid(
    size,
    size,
    type,
    (r, c) => (r + c) % 2 === 0,
    () => true
  );
}

// Arrows
function drawUpArrow(type, size) {
  size = Math.max(3, clampSize(size) | 1);
  const head = Math.ceil(size / 2);
  // head (isosceles)
  for (let row = 1; row <= head; row++) {
    const stars = 2 * row - 1;
    printCenteredRow(head - row, stars, type, true, row === head);
  }
  // stem
  const stemWidth = Math.max(1, Math.floor(size / 3));
  const pad = Math.floor((2 * head - 1 - stemWidth) / 2);
  for (let i = 0; i < size - head; i++) {
    if (type === "solid" || stemWidth <= 2) {
      out(repeat("  ", pad) + repeat("* ", stemWidth));
    } else {
      out(
        repeat("  ", pad) +
          "* " +
          repeat("  ", Math.max(0, stemWidth - 2)) +
          "* "
      );
    }
  }
}
function drawDownArrow(type, size) {
  size = Math.max(3, clampSize(size) | 1);
  const head = Math.ceil(size / 2);
  // stem
  const stemWidth = Math.max(1, Math.floor(size / 3));
  const pad = Math.floor((2 * head - 1 - stemWidth) / 2);
  for (let i = 0; i < size - head; i++) {
    if (type === "solid" || stemWidth <= 2) {
      out(repeat("  ", pad) + repeat("* ", stemWidth));
    } else {
      out(
        repeat("  ", pad) +
          "* " +
          repeat("  ", Math.max(0, stemWidth - 2)) +
          "* "
      );
    }
  }
  // head
  for (let row = head; row >= 1; row--) {
    const stars = 2 * row - 1;
    printCenteredRow(head - row, stars, type, true, row === head);
  }
}
function drawLeftArrow(type, size) {
  size = Math.max(3, clampSize(size) | 1);
  const mid = Math.floor(size / 2);
  renderGrid(
    size,
    size,
    type,
    (r, c, h, w) =>
      (c <= mid - r && r <= mid) ||
      (c <= r - mid && r >= mid) ||
      (c === mid && r === mid),
    () => true
  );
}
function drawRightArrow(type, size) {
  size = Math.max(3, clampSize(size) | 1);
  const mid = Math.floor(size / 2);
  renderGrid(
    size,
    size,
    type,
    (r, c, h, w) =>
      (c >= mid + r - (h - 1) && r <= mid) ||
      (c >= h - 1 - (r - mid) && r >= mid) ||
      (c === mid && r === mid),
    () => true
  );
}

// Zigzag
function drawZigZag(type, height, width) {
  height = Math.max(3, clampSize(height));
  width = Math.max(3, clampSize(width ?? height * 2));
  renderGrid(
    height,
    width,
    type,
    (r, c, h, w) => (c - r) % (h - 1) === 0,
    () => true
  );
}

// Waves (polyline)
function drawWave(type, height, width) {
  height = Math.max(3, clampSize(height));
  width = Math.max(3, clampSize(width ?? height * 3));
  renderGrid(
    height,
    width,
    type,
    (r, c, h, w) => {
      const period = Math.max(2, Math.floor(w / 6));
      const y = Math.floor(
        ((h - 1) / 2) * (1 - Math.sin((2 * Math.PI * c) / period))
      );
      return r === y;
    },
    () => true
  );
}

// Concentric squares
function drawConcentricSquares(type, size) {
  size = Math.max(3, clampSize(size) | 1);
  renderGrid(
    size,
    size,
    type,
    () => true,
    (r, c, h, w) => {
      const k = Math.min(r, c, h - 1 - r, w - 1 - c);
      return (
        k % 2 === 0 &&
        (r === k || c === k || r === h - 1 - k || c === w - 1 - k)
      );
    }
  );
}

// Concentric diamonds
function drawConcentricDiamonds(type, size) {
  size = Math.max(3, clampSize(size) | 1);
  const mid = Math.floor(size / 2);
  renderGrid(
    size,
    size,
    type,
    (r, c) => {
      const d = Math.abs(r - mid) + Math.abs(c - mid);
      return d <= mid && (type === "solid" || d % 2 === mid % 2);
    },
    (r, c) => {
      const d = Math.abs(r - mid) + Math.abs(c - mid);
      return (
        d === mid || (mid >= 2 && d === mid - 2) || (mid >= 4 && d === mid - 4)
      );
    }
  );
}

// Butterfly
function drawButterfly(type, size) {
  size = clampSize(size);
  // upper wings
  for (let r = 1; r <= size; r++) {
    const stars = r;
    const spaces = 2 * (size - r);
    if (type === "solid" || r <= 2 || r === size) {
      out(repeat("* ", stars) + repeat("  ", spaces) + repeat("* ", stars));
    } else {
      out(
        "* " +
          repeat("  ", Math.max(0, stars - 2)) +
          "* " +
          repeat("  ", spaces) +
          "* " +
          repeat("  ", Math.max(0, stars - 2)) +
          "* "
      );
    }
  }
  // lower wings
  for (let r = size; r >= 1; r--) {
    const stars = r;
    const spaces = 2 * (size - r);
    if (type === "solid" || r <= 2 || r === size) {
      out(repeat("* ", stars) + repeat("  ", spaces) + repeat("* ", stars));
    } else {
      out(
        "* " +
          repeat("  ", Math.max(0, stars - 2)) +
          "* " +
          repeat("  ", spaces) +
          "* " +
          repeat("  ", Math.max(0, stars - 2)) +
          "* "
      );
    }
  }
}

// Hollow diagonals box
function drawBorderWithDiagonals(type, size) {
  size = Math.max(3, clampSize(size));
  renderGrid(
    size,
    size,
    type,
    (r, c, h, w) => isEdge(r, c, h, w) || r === c || r + c === w - 1,
    () => true
  );
}

// Frame (thick border)
function drawFrame(type, size, thickness = 2) {
  size = Math.max(3, clampSize(size));
  thickness = Math.max(1, Math.floor(thickness));
  renderGrid(
    size,
    size,
    type,
    () => true,
    (r, c, h, w) =>
      r < thickness || c < thickness || r >= h - thickness || c >= w - thickness
  );
}

// Hollow circle approximation (diamond-ish using radius)
function drawCircle(type, size) {
  size = Math.max(5, clampSize(size) | 1);
  const mid = Math.floor(size / 2);
  const R = mid;
  renderGrid(
    size,
    size,
    type,
    (r, c) => {
      const d2 = (r - mid) * (r - mid) + (c - mid) * (c - mid);
      return d2 <= R * R;
    },
    (r, c) => {
      const d = Math.sqrt((r - mid) ** 2 + (c - mid) ** 2);
      return Math.abs(d - R) < 0.7;
    }
  );
}

// Staircase (ascending / descending)
function drawStaircase(type, steps, { descending = false } = {}) {
  steps = clampSize(steps);
  for (let s = 1; s <= steps; s++) {
    const w = descending ? steps - s + 1 : s;
    if (type === "solid" || w <= 2 || (s === steps && !descending)) {
      out(repeat("* ", w));
    } else {
      out("* " + repeat("  ", Math.max(0, w - 2)) + "* ");
    }
  }
}

// Mountains (VVVV pattern)
function drawMountains(type, peaks, width) {
  peaks = clampSize(peaks);
  width = Math.max(5, clampSize(width ?? peaks * 6));
  const height = Math.ceil(width / 4);
  renderGrid(
    height,
    width,
    type,
    (r, c, h, w) => {
      const p = Math.floor(c / (w / peaks));
      const segW = Math.floor(w / peaks);
      const insideC = c - p * segW;
      const up = insideC <= segW / 2 ? insideC : segW - insideC;
      return r === h - 1 - Math.floor((up / (segW / 2)) * (h - 1));
    },
    () => true
  );
}

// Diamonds grid (rhombus tiling)
function drawDiamondGrid(type, size) {
  size = Math.max(5, clampSize(size) | 1);
  const cell = Math.max(3, Math.floor(size / 3));
  const h = size,
    w = size * 2 - 1;
  renderGrid(
    h,
    w,
    type,
    (r, c) => {
      const mid = Math.floor(cell / 2);
      const cc = c % cell;
      const d = Math.abs((r % cell) - mid) + Math.abs(cc - mid);
      return d === mid || (type === "solid" && d <= mid);
    },
    () => true
  );
}

// Herringbone
function drawHerringbone(type, height, width) {
  height = Math.max(4, clampSize(height));
  width = Math.max(6, clampSize(width ?? height * 3));
  renderGrid(
    height,
    width,
    type,
    (r, c, h, w) => (r + c) % 6 === 0 || (r - c) % 6 === 0,
    () => true
  );
}

// Bricks
function drawBricks(type, rows, cols) {
  rows = Math.max(3, clampSize(rows));
  cols = Math.max(6, clampSize(cols));
  renderGrid(
    rows,
    cols,
    type,
    (r, c, h, w) => (r % 2 === 0 ? c % 3 !== 2 : (c + 1) % 3 !== 2),
    () => true
  );
}

// ---------- Public API: 100 functions ----------
// Note: Many map to primitives with different options.
// All follow (type='solid', size=5) unless noted.

function assert(type, size) {
  size = clampSize(size);
  if (!isValidType(type)) {
    console.log(
      "Invalid input. Type must be 'hollow' or 'solid' and size must be positive."
    );
    return null;
  }
  return size;
}

// 1–10 Basic triangles
const printTriangle = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawRightTriangle(type, s);
};
const printTriangleInverted = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawRightTriangle(type, s, { inverted: true });
};
const printRightAlignedTriangle = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawRightTriangleRight(type, s);
};
const printRightAlignedTriangleInverted = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawRightTriangleRight(type, s, { inverted: true });
};
const printIsosceles = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawIsosceles(type, s);
};
const printIsoscelesInverted = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawIsosceles(type, s, { inverted: true });
};
const printPyramid = (type = "solid", size = 5) => printIsosceles(type, size);
const printInvertedPyramid = (type = "solid", size = 5) =>
  printIsoscelesInverted(type, size);
const printDiamond = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawDiamond(type, s);
};
const printHourglass = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawHourglass(type, s);
};

// 11–20 Squares / rectangles / frames
const printSquare = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawRectangle(type, s, s);
};
const printRectangle = (type = "solid", height = 5, width = 10) => {
  height = clampSize(height);
  width = clampSize(width);
  if (!isValidType(type))
    return console.log("Invalid input. Type must be 'hollow' or 'solid'.");
  drawRectangle(type, height, width);
};
const printFrameThin = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  drawFrame(type, s, 1);
};
const printFrameThick = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawFrame(type, s, 3);
};
const printBorderWithDiagonals = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  drawBorderWithDiagonals(type, s);
};
const printConcentricSquares = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawConcentricSquares(type, s);
};
const printConcentricDiamonds = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawConcentricDiamonds(type, s);
};
const printCheckerboard = (type = "solid", size = 8) => {
  const s = assert(type, size);
  if (!s) return;
  drawCheckerboard(type, s);
};
const printCircle = (type = "solid", size = 11) => {
  const s = assert(type, size);
  if (!s) return;
  drawCircle(type, s);
};
const printDiamondGrid = (type = "solid", size = 11) => {
  const s = assert(type, size);
  if (!s) return;
  drawDiamondGrid(type, s);
};

// 21–30 Crosses and lines
const printX = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  drawX(type, s);
};
const printPlus = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  drawPlus(type, s);
};
const printT = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => r === 0 || c === Math.floor(w / 2),
    () => true
  );
};
const printY = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c) =>
      (r <= mid && (c === r || c === s - 1 - r)) || (r > mid && c === mid),
    () => true
  );
};
const printV = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) =>
      (c === r && r >= Math.floor(h / 2)) ||
      (c === w - 1 - r && r >= Math.floor(h / 2)),
    () => true
  );
};
const printW = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) =>
      (c === 0 && r === h - 1) ||
      (c === w - 1 && r === h - 1) ||
      c === Math.floor(r / 2) ||
      c === w - 1 - Math.floor(r / 2),
    () => true
  );
};
const printZ = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => r === 0 || r === h - 1 || r + c === w - 1,
    () => true
  );
};
const printN = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => c === 0 || c === w - 1 || r === c,
    () => true
  );
};
const printH = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => c === 0 || c === w - 1 || r === mid,
    () => true
  );
};
const printI = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => r === 0 || r === h - 1 || c === mid,
    () => true
  );
};

// 31–40 Arrows and pointers
const printUpArrow = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawUpArrow(type, s);
};
const printDownArrow = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawDownArrow(type, s);
};
const printLeftArrow = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawLeftArrow(type, s);
};
const printRightArrow = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawRightArrow(type, s);
};
const printCaretUp = (type = "solid", size = 7) =>
  printIsoscelesInverted(type, size);
const printCaretDown = (type = "solid", size = 7) => printIsosceles(type, size);
const printCaretLeft = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s * 2 - 1,
    s * 2 - 1,
    type,
    (r, c, h, w) =>
      Math.abs(r - (h - 1) / 2) + Math.abs(c - (w - 1) / 2) <= (w - 1) / 2 &&
      c <= (w - 1) / 2,
    (r, c, h, w) =>
      Math.abs(r - (h - 1) / 2) + Math.abs(c - (w - 1) / 2) === (w - 1) / 2 &&
      c <= (w - 1) / 2
  );
};
const printCaretRight = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s * 2 - 1,
    s * 2 - 1,
    type,
    (r, c, h, w) =>
      Math.abs(r - (h - 1) / 2) + Math.abs(c - (w - 1) / 2) <= (w - 1) / 2 &&
      c >= (w - 1) / 2,
    (r, c, h, w) =>
      Math.abs(r - (h - 1) / 2) + Math.abs(c - (w - 1) / 2) === (w - 1) / 2 &&
      c >= (w - 1) / 2
  );
};
const printChevronUp = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s * 2 - 1,
    type,
    (r, c, h, w) => c === r || c === w - 1 - r,
    () => true
  );
};
const printChevronDown = (type = "solid", size = 7) =>
  printChevronUp(type, size);

// 41–50 Waves, zigzags, stairs, mountains
const printZigZag = (type = "solid", height = 5, width) => {
  if (!isValidType(type)) return console.log("Invalid input.");
  drawZigZag(type, height, width);
};
const printWave = (type = "solid", height = 7, width) => {
  if (!isValidType(type)) return console.log("Invalid input.");
  drawWave(type, height, width);
};
const printStaircase = (type = "solid", steps = 6) => {
  const s = assert(type, steps);
  if (!s) return;
  drawStaircase(type, s);
};
const printReverseStaircase = (type = "solid", steps = 6) => {
  const s = assert(type, steps);
  if (!s) return;
  drawStaircase(type, s, { descending: true });
};
const printMountains = (type = "solid", peaks = 3, width) => {
  if (!isValidType(type)) return console.log("Invalid input.");
  drawMountains(type, peaks, width);
};
const printValleys = (type = "solid", peaks = 3, width) =>
  printMountains(type, peaks, width);
const printFence = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s * 2,
    type,
    (r, c, h, w) => r === h - 1 || (r % 2 === 0 && c % 4 === 0),
    () => true
  );
};
const printLattice = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c) => (r + c) % 3 === 0 || (r - c + 999) % 3 === 0,
    () => true
  );
};
const printHerringbone = (type = "solid", height = 9, width) => {
  if (!isValidType(type)) return console.log("Invalid input.");
  drawHerringbone(type, height, width);
};
const printBricks = (type = "solid", rows = 8, cols) => {
  cols = clampSize(cols ?? rows * 2);
  if (!isValidType(type)) return console.log("Invalid input.");
  drawBricks(type, rows, cols);
};

// 51–60 Butterflies & hourglass variants
const printButterfly = (type = "solid", size = 6) => {
  const s = assert(type, size);
  if (!s) return;
  drawButterfly(type, s);
};
const printDoubleHourglass = (type = "solid", size = 5) => {
  const s = assert(type, size);
  if (!s) return;
  drawHourglass(type, s);
  drawHourglass(type, s);
};
const printBowTie = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s * 2 - 1,
    type,
    (r, c, h, w) => c === r || c === w - 1 - r || r === Math.floor(h / 2),
    () => true
  );
};
const printSandClock = (type = "solid", size = 7) => printHourglass(type, size);
const printKite = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  drawDiamond(type, s);
};
const printStarOutline = (type = "hollow", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawConcentricDiamonds("hollow", s);
};
const printCrosshair = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c) =>
      r === mid ||
      c === mid ||
      r === 0 ||
      c === 0 ||
      r === s - 1 ||
      c === s - 1,
    () => true
  );
};
const printAsterisk = (type = "solid", size = 9) => printCrosshair(type, size);
const printTarget = (type = "solid", size = 11) => {
  const s = assert(type, size);
  if (!s) return;
  drawConcentricSquares(type, s);
};
const printSnowflake = (type = "solid", size = 11) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => r === mid || c === mid || r === c || r + c === w - 1,
    () => true
  );
};

// 61–70 Grids & meshes
const printGrid = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c) => r % 2 === 0 || c % 2 === 0,
    () => true
  );
};
const printDottedGrid = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c) => r % 2 === 0 && c % 2 === 0,
    () => true
  );
};
const printHashGrid = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c) => r % 3 === 0 || c % 3 === 0,
    () => true
  );
};
const printWeave = (type = "solid", size = 10) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c) => r % 4 <= 1 || c % 4 <= 1,
    () => true
  );
};
const printNet = (type = "solid", size = 10) => printWeave(type, size);
const printCorners = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const t = Math.max(1, Math.floor(s / 6));
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) =>
      (r < t && c < t) ||
      (r < t && c >= w - t) ||
      (r >= h - t && c < t) ||
      (r >= h - t && c >= w - t),
    () => true
  );
};
const printCornerDiagonals = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => r === c || r + c === w - 1 || isEdge(r, c, h, w),
    () => true
  );
};
const printBoxWithCenter = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => isEdge(r, c, h, w) || (r === mid && c === mid),
    () => true
  );
};
const printFourBoxes = (type = "solid", size = 10) => {
  const s = assert(type, size);
  if (!s) return;
  const midR = Math.floor(s / 2),
    midC = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c) => r === midR || c === midC || isEdge(r, c, s, s),
    () => true
  );
};
const printNineGrid = (type = "solid", size = 12) => {
  const s = assert(type, size);
  if (!s) return;
  const a = Math.floor(s / 3);
  renderGrid(
    s,
    s,
    type,
    (r, c) => r % a === 0 || c % a === 0,
    () => true
  );
};

// 71–80 Shapes & glyphs
const printHeart = (type = "solid", size = 12) => {
  const s = assert(type, size);
  if (!s) return;
  const h = s,
    w = 2 * s;
  renderGrid(
    h,
    w,
    type,
    (r, c, h2, w2) => {
      const x = c - w2 / 2,
        y = h2 / 2 - r;
      const a = (x * x + y * y - (s * 0.25) ** 2) ** 3 - x * x * y * y * y;
      return a <= 0;
    },
    (r, c, h2, w2) => false
  );
};
const printRhombus = (type = "solid", size = 7) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s * 2 - 1,
    type,
    (r, c, h, w) => Math.abs(c - (w - 1) / 2) <= r,
    (r, c, h, w) => Math.abs(c - (w - 1) / 2) === r || r === h - 1
  );
};
const printParallelogram = (type = "solid", size = 6) => {
  const s = assert(type, size);
  if (!s) return;
  for (let r = 0; r < s; r++) {
    const pad = s - 1 - r;
    if (type === "solid" || s <= 2 || r === 0 || r === s - 1) {
      out(repeat("  ", pad) + repeat("* ", s));
    } else {
      out(repeat("  ", pad) + "* " + repeat("  ", s - 2) + "* ");
    }
  }
};
const printTrapezium = (type = "solid", size = 6) => {
  const s = assert(type, size);
  if (!s) return;
  for (let r = 0; r < s; r++) {
    const base = s + r;
    const pad = s - 1 - r;
    printCenteredRow(pad, base, type, true, r === s - 1);
  }
};
const printPentagon = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const h = s,
    w = 2 * s;
  renderGrid(
    h,
    w,
    type,
    (r, c, h2, w2) =>
      r >= Math.floor(h2 / 3) &&
      Math.abs(c - (w2 - 1) / 2) <= r - Math.floor(h2 / 3),
    (r, c, h2, w2) =>
      r === h2 - 1 ||
      r === Math.floor(h2 / 3) ||
      Math.abs(c - (w2 - 1) / 2) === r - Math.floor(h2 / 3)
  );
};
const printHexagon = (type = "solid", size = 8) => {
  const s = assert(type, size);
  if (!s) return;
  const h = s,
    w = 2 * s;
  renderGrid(
    h,
    w,
    type,
    (r, c, h2, w2) => Math.abs(r - h2 / 2) + Math.abs(c - w2 / 2) <= h2 / 2,
    (r, c, h2, w2) =>
      Math.abs(Math.abs(r - h2 / 2) + Math.abs(c - w2 / 2) - h2 / 2) < 0.6
  );
};
const printOctagon = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const t = Math.max(1, Math.floor(s / 3));
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => (r >= t && r < h - t) || (c >= t && c < w - t),
    (r, c, h, w) =>
      r === t ||
      r === h - 1 - t ||
      c === t ||
      c === w - 1 - t ||
      isEdge(r, c, h, w)
  );
};
const printDiamondTall = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawDiamond(type, Math.ceil(s * 1.2));
};
const printDiamondWide = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawDiamond(type, s);
};
const printLeaf = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c) => Math.abs(r - mid) + Math.abs(c - mid) <= mid,
    (r, c) => Math.abs(r - mid) + Math.abs(c - mid) === mid
  );
};

// 81–90 Fancy fills & ornaments
const printSpiralBox = (type = "solid", size = 11) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    () => true,
    (r, c, h, w) => {
      const k = Math.min(r, c, h - 1 - r, w - 1 - c);
      const rr = r - k,
        cc = c - k,
        hh = h - 2 * k,
        ww = w - 2 * k;
      return (
        rr === 0 ||
        cc === 0 ||
        (rr === hh - 1 && cc <= ww - 1) ||
        (cc === ww - 1 && rr <= hh - 1)
      );
    }
  );
};
const printDiagonalStripes = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c) => (r - c) % 3 === 0,
    () => true
  );
};
const printAntiDiagonalStripes = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) => (r + c) % 3 === 0,
    () => true
  );
};
const printCrossStripes = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c) => (r + c) % 3 === 0 || (r - c + 999) % 3 === 0,
    () => true
  );
};
const printDotDiamond = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c) => Math.abs(r - mid) + Math.abs(c - mid) === mid,
    () => true
  );
};
const printStarBurst = (type = "solid", size = 11) => {
  const s = assert(type, size);
  if (!s) return;
  const mid = Math.floor(s / 2);
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) =>
      r === mid ||
      c === mid ||
      r === c ||
      r + c === w - 1 ||
      (r === mid - 1 && c % 2 === 0) ||
      (c === mid - 1 && r % 2 === 0),
    () => true
  );
};
const printSun = (type = "solid", size = 11) => printStarBurst(type, size);
const printFlower = (type = "solid", size = 11) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s,
    type,
    (r, c, h, w) =>
      (r % 3 === 0 || c % 3 === 0) &&
      Math.abs(r - Math.floor(h / 2)) + Math.abs(c - Math.floor(w / 2)) <=
        Math.floor(s / 2),
    () => true
  );
};
const printCrown = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s * 2 - 1,
    type,
    (r, c, h, w) =>
      r === h - 1 ||
      c === r ||
      c === w - 1 - r ||
      (r < Math.floor(h / 2) &&
        (c === Math.floor(w / 4) || c === Math.floor((3 * w) / 4))),
    () => true
  );
};
const printTorch = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  drawUpArrow(type, s);
};

// 91–100 Misc & aliases to complete 100
const printFenceDense = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s * 2,
    type,
    (r, c, h, w) => r === h - 1 || c % 3 === 0,
    () => true
  );
};
const printStepsRight = (type = "solid", size = 7) =>
  printStaircase(type, size);
const printStepsLeft = (type = "solid", size = 7) =>
  printReverseStaircase(type, size);
const printMountainRange = (type = "solid", size = 12) =>
  printMountains(type, 3, size * 2);
const printValleyRange = (type = "solid", size = 12) =>
  printValleys(type, 3, size * 2);
const printLadder = (type = "solid", size = 9) => {
  const s = assert(type, size);
  if (!s) return;
  renderGrid(
    s,
    s * 2,
    type,
    (r, c, h, w) => c % Math.max(3, Math.floor(w / 6)) === 0 || r % 2 === 0,
    () => true
  );
};
const printRipple = (type = "solid", size = 9) =>
  printWave(type, size, size * 3);
const printMesh = (type = "solid", size = 10) => printWeave(type, size);
const printKiteTall = (type = "solid", size = 11) =>
  printDiamond(type, Math.ceil(size * 1.3));
const printKiteWide = (type = "solid", size = 11) => printDiamond(type, size);

// ----- Export note: All functions are already in scope and named. -----
// Quick smoke demo (comment out if bundling):
// printDiamond('solid', 7);

// printDiamond("hollow");


// starname.js
// Render any NAME with "*" using dynamic stroke logic (no predefined ASCII grids).
// Run: node starname.js "Lalit"  |  defaults to "LALIT" size= nine, thickness=1

// ---------- tiny drawing helpers ----------
function makeCanvas(n, fill = " ") {
  return Array.from({ length: n }, () => Array(n).fill(fill));
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function dot(grid, x, y, t = 1) {
  const n = grid.length, r = Math.max(0, Math.floor((t - 1) / 2));
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < n && xx >= 0 && xx < n) grid[yy][xx] = "*";
    }
  }
}
function line(grid, x1, y1, x2, y2, t = 1) { // Bresenham
  let dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
  let dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    dot(grid, x1, y1, t);
    if (x1 === x2 && y1 === y2) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x1 += sx; }
    if (e2 <= dx) { err += dx; y1 += sy; }
  }
}
function hLine(grid, y, x1, x2, t = 1) { line(grid, x1, y, x2, y, t); }
function vLine(grid, x, y1, y2, t = 1) { line(grid, x, y1, x, y2, t); }
function boxOutline(grid, x1, y1, x2, y2, t = 1) {
  hLine(grid, y1, x1, x2, t);
  hLine(grid, y2, x1, x2, t);
  vLine(grid, x1, y1, y2, t);
  vLine(grid, x2, y1, y2, t);
}

// ---------- glyphs A–Z (procedural strokes) ----------
const GLYPHS = {
  A: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2), pad = 1;
    line(g, 0, n - 1, mid, 0, t);
    line(g, n - 1, n - 1, mid, 0, t);
    hLine(g, Math.floor(n / 2), pad, n - 1 - pad, t);
    return g;
  },
  B: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    hLine(g, 0, 0, n - 2, t);
    hLine(g, mid, 0, n - 2, t);
    hLine(g, n - 1, 0, n - 2, t);
    vLine(g, n - 2, 1, mid - 1, t);
    vLine(g, n - 2, mid + 1, n - 2, t);
    return g;
  },
  C: (n, t) => {
    const g = makeCanvas(n);
    hLine(g, 0, 1, n - 1, t);
    vLine(g, 0, 1, n - 2, t);
    hLine(g, n - 1, 1, n - 1, t);
    return g;
  },
  D: (n, t) => {
    const g = makeCanvas(n);
    vLine(g, 0, 0, n - 1, t);
    hLine(g, 0, 0, n - 2, t);
    hLine(g, n - 1, 0, n - 2, t);
    vLine(g, n - 2, 1, n - 2, t);
    return g;
  },
  E: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    hLine(g, 0, 0, n - 1, t);
    hLine(g, mid, 0, n - 2, t);
    hLine(g, n - 1, 0, n - 1, t);
    return g;
  },
  F: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    hLine(g, 0, 0, n - 1, t);
    hLine(g, mid, 0, n - 2, t);
    return g;
  },
  G: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    hLine(g, 0, 1, n - 1, t);
    vLine(g, 0, 1, n - 2, t);
    hLine(g, n - 1, 1, n - 1, t);
    vLine(g, n - 2, mid, n - 2, t);
    hLine(g, mid, Math.floor(n / 2), n - 2, t);
    return g;
  },
  H: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    vLine(g, n - 1, 0, n - 1, t);
    hLine(g, mid, 0, n - 1, t);
    return g;
  },
  I: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    hLine(g, 0, 0, n - 1, t);
    hLine(g, n - 1, 0, n - 1, t);
    vLine(g, mid, 0, n - 1, t);
    return g;
  },
  J: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    hLine(g, 0, 0, n - 1, t);
    vLine(g, mid, 0, n - 2, t);
    hLine(g, n - 1, 1, mid, t);
    vLine(g, 1, n - 3, n - 1, t);
    return g;
  },
  K: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    line(g, 1, mid, n - 2, 0, t);
    line(g, 1, mid, n - 2, n - 1, t);
    return g;
  },
  L: (n, t) => {
    const g = makeCanvas(n);
    vLine(g, 0, 0, n - 1, t);
    hLine(g, n - 1, 0, n - 1, t);
    return g;
  },
  M: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    vLine(g, n - 1, 0, n - 1, t);
    line(g, 0, 0, mid, Math.floor(n / 2), t);
    line(g, n - 1, 0, mid, Math.floor(n / 2), t);
    return g;
  },
  N: (n, t) => {
    const g = makeCanvas(n);
    vLine(g, 0, 0, n - 1, t);
    vLine(g, n - 1, 0, n - 1, t);
    line(g, 0, 0, n - 1, n - 1, t);
    return g;
  },
  O: (n, t) => {
    const g = makeCanvas(n), p = 1;
    boxOutline(g, p, p, n - 1 - p, n - 1 - p, t);
    return g;
  },
  P: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    hLine(g, 0, 0, n - 2, t);
    hLine(g, mid, 0, n - 2, t);
    vLine(g, n - 2, 1, mid - 1, t);
    return g;
  },
  Q: (n, t) => {
    const g = GLYPHS.O(n, t);
    line(g, n - 3, n - 3, n - 1, n - 1, t);
    return g;
  },
  R: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    vLine(g, 0, 0, n - 1, t);
    hLine(g, 0, 0, n - 2, t);
    hLine(g, mid, 0, n - 2, t);
    vLine(g, n - 2, 1, mid - 1, t);
    line(g, 1, mid, n - 2, n - 1, t);
    return g;
  },
  S: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    hLine(g, 0, 0, n - 1, t);
    hLine(g, mid, 0, n - 1, t);
    hLine(g, n - 1, 0, n - 1, t);
    vLine(g, 0, 1, mid - 1, t);
    vLine(g, n - 1, mid + 1, n - 2, t);
    return g;
  },
  T: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    hLine(g, 0, 0, n - 1, t);
    vLine(g, mid, 0, n - 1, t);
    return g;
  },
  U: (n, t) => {
    const g = makeCanvas(n), p = 1;
    vLine(g, 0, 0, n - 2, t);
    vLine(g, n - 1, 0, n - 2, t);
    hLine(g, n - 1, p, n - 1 - p, t);
    return g;
  },
  V: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    line(g, 0, 0, mid, n - 1, t);
    line(g, n - 1, 0, mid, n - 1, t);
    return g;
  },
  W: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2), q = Math.floor(n / 4);
    line(g, 0, 0, q, n - 1, t);                 // left down
    line(g, q, n - 1, mid, Math.floor(n / 2), t); // up to center ridge
    line(g, mid, Math.floor(n / 2), n - 1 - q, n - 1, t); // down
    line(g, n - 1, 0, n - 1 - q, n - 1, t);     // right down
    return g;
  },
  X: (n, t) => {
    const g = makeCanvas(n);
    line(g, 0, 0, n - 1, n - 1, t);
    line(g, n - 1, 0, 0, n - 1, t);
    return g;
  },
  Y: (n, t) => {
    const g = makeCanvas(n), mid = Math.floor(n / 2);
    line(g, 0, 0, mid, mid, t);
    line(g, n - 1, 0, mid, mid, t);
    vLine(g, mid, mid, n - 1, t);
    return g;
  },
  Z: (n, t) => {
    const g = makeCanvas(n);
    hLine(g, 0, 0, n - 1, t);
    line(g, n - 1, 0, 0, n - 1, t); // anti-diagonal
    hLine(g, n - 1, 0, n - 1, t);
    return g;
  },
};

// Space: just blanks
function blank(n) { return makeCanvas(n); }

// ---------- compose & print ----------
function renderLetter(ch, size = 9, thickness = 1) {
  ch = ch.toUpperCase();
  if (ch === " ") return blank(size);
  if (!GLYPHS[ch]) return fallbackGlyph(size, thickness, ch);
  // ensure minimum odd size for better symmetry
  const n = Math.max(5, size | 0);
  const t = Math.max(1, thickness | 0);
  const g = GLYPHS[ch](n, t);
  return g.map(row => row.join(""));
}

function fallbackGlyph(n, t, ch) { // draw a box with the char in the middle
  const g = makeCanvas(n);
  boxOutline(g, 0, 0, n - 1, n - 1, t);
  const mid = Math.floor(n / 2);
  const s = String(ch)[0];
  const line = g[mid];
  // place the char centered (purely cosmetic)
  const idx = clamp(mid, 0, n - 1);
  line[idx] = s;
  return g.map(r => r.join(""));
}

function renderName(name, size = 9, thickness = 1, gap = 2) {
  const blocks = [...name].map(ch => renderLetter(ch, size, thickness));
  const rows = blocks[0]?.length || size;
  const spacer = " ".repeat(gap);
  const lines = [];
  for (let r = 0; r < rows; r++) {
    lines.push(blocks.map(b => b[r]).join(spacer));
  }
  return lines;
}

function printName(name = "LALIT", size = 9, thickness = 1, gap = 2) {
  renderName(name, size, thickness, gap).forEach(l => console.log(l));
}


module.exports = {
  printTriangle,
  printTriangleInverted,
  printRightAlignedTriangle,
  printRightAlignedTriangleInverted,
  printIsosceles,
  printIsoscelesInverted,
  printPyramid,
  printInvertedPyramid,
  printDiamond,
  printHourglass,
  printSquare,
  printRectangle,
  printFrameThin,
  printFrameThick,
  printBorderWithDiagonals,
  printConcentricSquares,
  printConcentricDiamonds,
  printCheckerboard,
  printCircle,
  printDiamondGrid,
  printX,
  printPlus,
  printT,
  printY,
  printV,
  printW,
  printZ,
  printN,
  printH,
  printI,
  printUpArrow,
  printDownArrow,
  printLeftArrow,
  printRightArrow,
  printCaretUp,
  printCaretDown,
  printCaretLeft,
  printCaretRight,
  printChevronUp,
  printChevronDown,
  printZigZag,
  printWave,
  printStaircase,
  printReverseStaircase,
  printMountains,
  printValleys,
  printFence,
  printLattice,
  printHerringbone,
  printBricks,
  printButterfly,
  printDoubleHourglass,
  printBowTie,
  printSandClock,
  printKite,
  printStarOutline,
  printCrosshair,
  printAsterisk,
  printTarget,
  printSnowflake,
  printGrid,
  printDottedGrid,
  printHashGrid,
  printWeave,
  printNet,
  printCorners,
  printCornerDiagonals,
  printBoxWithCenter,
  printFourBoxes,
  printNineGrid,
  printHeart,
  printRhombus,
  printParallelogram,
  printTrapezium,
  printPentagon,
  printHexagon,
  printOctagon,
  printDiamondTall,
  printDiamondWide,
  printLeaf,
  printSpiralBox,
  printDiagonalStripes,
  printAntiDiagonalStripes,
  printCrossStripes,
  printDotDiamond,
  printStarBurst,
  printSun,
  printFlower,
  printCrown,
  printTorch,
  printFenceDense,
  printStepsRight,
  printStepsLeft,
  printMountainRange,
  printValleyRange,
  printLadder,
  printRipple,
  printMesh,
  printKiteTall,
  printKiteWide,
  printName
};
