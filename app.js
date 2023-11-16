const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const circleBtn = document.getElementById("circle-btn");
const triangleBtn = document.getElementById("triangle-btn");
const squareBtn = document.getElementById("square-btn");
const shareBtn = document.getElementById("share-btn");
const cropBtn = document.getElementById("crop-btn");

const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const color = document.getElementById("color");
const lineWidth = document.getElementById("line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

//원 그리기
let isDrawingCircle = false;
let circleStartPoint;
let resizingCircle = false;

circleBtn.addEventListener("click", () => {
  isDrawingCircle = true;

  canvas.addEventListener("mousedown", function (event) {
    if (isDrawingCircle) {
      circleStartPoint = { x: event.offsetX, y: event.offsetY };
    }
  });
 
  canvas.addEventListener("mouseup", function (event) {
    if (isDrawingCircle) {
      const radius = calculateRadius(circleStartPoint, {
        x: event.offsetX,
        y: event.offsetY,
      });
      
      drawCircle(circleStartPoint, radius);

      isDrawingCircle = false;
    }
    resizingCircle = false;
  });

  canvas.addEventListener("mousemove", function (event) {
    if (isDrawingCircle) {
      const radius = calculateRadius(circleStartPoint, {
        x: event.offsetX,
        y: event.offsetY,
      });

      drawCircle(circleStartPoint, radius);
    }
  });
});

function calculateRadius(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}

function drawCircle(center, radius) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);

  if (isFilling) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

//삼각형 그리기
let isDrawingTriangle = false;
let triangleStartPoint;
let resizingTriangle = false;

triangleBtn.addEventListener("click", () => {
  isDrawingTriangle = true;

  canvas.addEventListener("mousedown", function (event) {
    if (isDrawingTriangle) {
      triangleStartPoint = { x: event.offsetX, y: event.offsetY };
    }
  });

  canvas.addEventListener("mouseup", function (event) {
    if (isDrawingTriangle) {
      const triangleEndPoint = { x: event.offsetX, y: event.offsetY };

      drawTriangle(triangleStartPoint, triangleEndPoint);

      isDrawingTriangle = false;
    }
    resizingTriangle = false;
  });

  canvas.addEventListener("mousemove", function (event) {
    if (isDrawingTriangle) {
      const triangleEndPoint = { x: event.offsetX, y: event.offsetY };

      drawTriangle(triangleStartPoint, triangleEndPoint);
    }
  });
});

function drawTriangle(startPoint, endPoint) {
  const midPointX = (startPoint.x + endPoint.x) / 2;
  const midPointY = (startPoint.y + endPoint.y) / 2;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.lineTo(midPointX, startPoint.y);
  ctx.closePath();

  if (isFilling) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

//사각형 그리기
let isDrawingSquare = false;
let squareStartPoint;
let selectedSquare;

squareBtn.addEventListener("click", () => {
  isDrawingSquare = true;

  canvas.addEventListener("mousedown", function (event) {
    if (isDrawingSquare) {
      squareStartPoint = { x: event.offsetX, y: event.offsetY };
    } else {
      selectedSquare = findSelectedSquare(event.offsetX, event.offsetY);
    }
  });

  canvas.addEventListener("mouseup", function (event) {
    if (isDrawingSquare) {
      const squareEndPoint = { x: event.offsetX, y: event.offsetY };

    
      drawSquare(squareStartPoint, squareEndPoint);

      isDrawingSquare = false;
    }
  });

  canvas.addEventListener("mousemove", function (event) {
    if (selectedSquare) {
      const newWidth = event.offsetX - selectedSquare.x;
      const newHeight = event.offsetY - selectedSquare.y;

      resizeSquare(selectedSquare, newWidth, newHeight);
    }
  });
});

function findSelectedSquare(x, y) {
  for (const square of squares) {
    if (
      x >= square.x &&
      x <= square.x + square.width &&
      y >= square.y &&
      y <= square.y + square.height
    ) {
      return square;
    }
  }
  return null;
}

function resizeSquare(square, newWidth, newHeight) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (isFilling) {
    ctx.fillRect(square.x, square.y, newWidth, newHeight);
  } else {
    ctx.strokeRect(square.x, square.y, newWidth, newHeight);
  }
}

function drawSquare(startPoint, endPoint) {
  const width = endPoint.x - startPoint.x;
  const height = endPoint.y - startPoint.y;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (isFilling) {
    ctx.fillRect(startPoint.x, startPoint.y, width, height);
  } else {
    ctx.strokeRect(startPoint.x, startPoint.y, width, height);
  }
}

//펜 그리기
let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
  // ctx.fill();
  ctx.beginPath();
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "68px sans-serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);