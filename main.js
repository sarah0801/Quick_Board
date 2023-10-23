const color = document.getElementById("color")
const lineWidth = document.querySelector("#line-width")

//DOM 초기화
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const colorBtns = document.querySelectorAll(".pallet button");
const eraserBtn = document.querySelector("#eraser");
const downloadBtn = document.querySelector("#download");

//그리기 설정
let isDrawing = false;
let isErasing = false;

ctx.lineWidth = 5;
ctx.strokeStyle = "red";

//이벤트 리스너
function startDrawing(){
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function drawing(){
    if(!isDrawing) return;
    if(isErasing){
        //지우개
        ctx.clearRect(e.offsetX, e.offsetY, 20, 20);
    }
    else{
        //그리기
       ctx.lineTo(e.offsetX, e.offsetY);
       ctx.stroke();
    }
}

function stopDrawing(){
    isDrawing = false;
    ctx.closePath();
}

function startErasing(e){
    isErasing = true;
    colorBtns.forEach((button) => button.classList.remove("selected"));
    e.currentTarget.classList.add("selected");
}

function downloadCanvas() {
    const image = canvas.toDataURL("image/png", 1.0);
    const linkEl = document.createElement("a");
    linkEl.href = image;
    linkEl.download = "QuickBoard";
    linkEl.click();
}

function changeColor(e){
    isErasing = false;
    ctx.strokeStyle = e.currentTarget.dataset.color;

    //내가 선택한 색상 활성화
    colorBtns.forEach((button) => {
        if (button === e.currentTarget) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }
    });
    eraserBtn.classList.remove("selected");
}

//이벤트 연결
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDrawing);
colorBtns.forEach((button) => button.addEventListener("click", changeColor));
eraserBtn.addEventListener("click", startErasing);
downloadBtn.addEventListener("click", downloadCanvas);

canvas.width = 800;
canvas.height = 800;
ctx.lineWidth = lineWidth.value;
let isPainting = false;

function onMove(event){
    if(isPainting){
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting(){
    isPainting = true;
}

function canclePainting(){
    isPainting = false;
    ctx.beginPath();
}

function onlineChangeWidth(event){
    ctx.lineWidth = event.target.value;
}

function onColorChange(event){
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", canclePainting);
canvas.addEventListener("mouseleave", canclePainting);

lineWidth.addEventListener("change", onlineChangeWidth);

color.addEventListener("change", oncolorChange);