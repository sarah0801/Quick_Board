const saveBtn = document.getElementById("save");
const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");
const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const modeBtn = document.getElementById("mode-btn");
const circleBtn = document.getElementById("circle-btn");
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
let isPainting = false;
let isFilling = false;

//원 그리기
let isDrawingCircle = false;
let circleStartX, circleStartY;

function startDrawingCircle(event) {
  if (event.buttons !== 1) return; // 왼쪽 버튼(마우스 클릭)이 아니면 리턴
  isDrawingCircle = true;
  circleStartX = event.offsetX;
  circleStartY = event.offsetY;
}

function drawCircle(event) {
  if (!isDrawingCircle) return; // 그리기 동작이 아니라면 리턴
  const circleRadius = Math.sqrt(
    Math.pow(event.offsetX - circleStartX, 2) +
    Math.pow(event.offsetY - circleStartY, 2)
  );

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // 기존에 그려진 것을 지우기
  ctx.beginPath();
  ctx.arc(circleStartX, circleStartY, circleRadius, 0, 2 * Math.PI);
  ctx.stroke();
}

function stopDrawingCircle() {
  if (isDrawingCircle) {
    isDrawingCircle = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // 그림이 끝났을 때 마지막 테두리를 지우기
  }
}

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

function OnSquareClick(event) {
    switch (event.type) {
      case "mousedown":
        console.log("mousedown");
        shape.startPainting.down(event);
        break;
      case "mousemove":
        console.log("mousemove");
        shape.onMove.move(event);
        break;
      case "mouseup":
        console.log("mouseup");
        shape.cancelPainting.up(event);
        break;
      case "mouseleave":
        shape.cancelPainting.up(event);
        console.log("mouseout");
        break;
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
circleBtn.addEventListener("mousedown", startDrawingCircle);
canvas.addEventListener("mousemove", drawCircle);
canvas.addEventListener("mouseup", stopDrawingCircle);
canvas.addEventListener("mouseleave", stopDrawingCircle);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);