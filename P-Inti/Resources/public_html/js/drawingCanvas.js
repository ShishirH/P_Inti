"use strict";
console.log("Entered drawing area!");
var canvasArea = null,
    btnClear = null,
    btnSave = null,
    inputColor = null,
    inputSize = null,
    ctx = null,
    canvasWidth = 900,
    canvasHeight = 500,
    isDrawing = false,
    lineWidth = 3;

function initialize() {
    canvasArea = document.querySelector("#canvas-area");
    canvasArea.width = canvasWidth;
    canvasArea.height = canvasHeight;

    ctx = canvasArea.getContext("2d");

    btnClear = document.querySelector("#clear");
    btnSave = document.querySelector("#save");
    inputColor = document.querySelector("#color");
    inputSize = document.querySelector("#size");

    window.onmouseup = function () {
        isDrawing = false;
        ctx.beginPath();
    }

    canvasArea.onmousedown = function (e) {
        isDrawing = true;
    }

    canvasArea.onmousemove = function (e) {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.lineWidth = lineWidth * 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, lineWidth, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    }

    btnClear.onclick = function () {
        ctx.clearRect(0, 0, canvasArea.width, canvasArea.height);
    }

    btnSave.onclick = function () {
        canvasArea.toBlob(function (blob) {
            var link = document.createElement("a");
            link.download = "draw.png";
            link.href = URL.createObjectURL(blob);
            link.dispatchEvent(new MouseEvent('click'));
        }, 'image/png', 1);
    }

    inputColor.onchange = function () {
        ctx.fillStyle = this.value;
        ctx.strokeStyle = this.value;
    }

    inputSize.onchange = function () {
        lineWidth = this.value;
    }
}

window.onload = initialize;