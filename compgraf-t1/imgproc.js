var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var activeImg;
var r = 0;
var g = 1;
var b = 2;
var a = 3;
var lumOperator = function (imgData){
    alert("Lum operator");
    return imgData;
}



var gaussianFilter = function (imgData){
    alert("gaussian filter");
    return imgData;
}



function onShowImage(img){
    setActive(img);
    drawActive();
}

function firstButton(){
    buttonPushed(lumOperator);
}
function secondButton(){
    buttonPushed(gaussianFilter);
}

//in case activeImg is img object
function drawActive(){
    ctx.drawImage(activeImg,0,0,canvas.clientWidth,canvas.clientHeight);
}

//In case activeImg is ImageData
function putActive(){
    ctx.putImageData(activeImg,0,0/*,canvas.clientWidth,canvas.clientHeight*/);
}

function getData(){
    let data = ctx.getImageData(0,0,canvas.clientWidth,canvas.clientHeight);
    return data;
}

function setActive(img){
    activeImg = img;
}

function buttonPushed(filter){
    let data = getData();
    let img = filter(data);
    setActive(img);
    putActive();
}

function getPixel(imgData,x,y){
    let pixel = [];
    for (let i = 0; i < 4; i++) {
        pixel.push(imgData.data[i + convertX(x,imgData) + convertY(y,imgData)]);
    }
    return pixel;
}

function convertX(x,imgData){
    return x*imgData.width*4;
}

function convertY(y,imgData){
    return y*4;
}