var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var activeImg;

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
    ctx.putImageData(activeImg,0,0,canvas.clientWidth,canvas.clientHeight);
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
    let img = applyFilter(data);
    setActive(img);
    putActive();
}

function applyFilter(data,filter){
    return filter(data);
}
