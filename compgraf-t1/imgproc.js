var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var activeImg;
var r = 0;
var g = 1;
var b = 2;
var a = 3;


var lum = function(pixel){
    return 0.3*pixel[r]+0.59*pixel[g]+0.11*pixel[b];
};

var lumOperator = function (imgData){
    let newData = ctx.createImageData(imgData);
    let padding = 0;
    forEachPixel(imgData,
        function (imgData,x,y){
            let old = getPixel(imgData,x,y);
            let L = lum(old);
            setPixel(newData,x,y,[L,L,L,old[a]]);
        },
        padding
    );
    //alert("Lum operator");
    return newData;
};

var gaussianFilter = function (imgData){

    //gaussian matrix 3x3
    let cst = 1/16;
    let gM3x3 =[
        [cst*1,cst*2,cst*1],
        [cst*2,cst*4,cst*2],
        [cst*1,cst*2,cst*1]
    ];
    let padding3x3 = 1;
    
    let newData = ctx.createImageData(imgData);
   
    forEachPixel(imgData,
        function(imgData,x,y){
            
        },
        padding3x3
    );

    alert("gaussian filter");
    return newData;
};


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
    ctx.putImageData(activeImg,0,0,0,0,canvas.clientWidth,canvas.clientHeight);
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


//Pixel operations+++++++++++++++++++++++++++++++++++++++++++++++++

function getPixel(imgData,x,y){
    let pixel = [];
    for (let i = 0; i < 4; i++) {
        pixel.push(imgData.data[i + convertX(x,imgData) + convertY(y,imgData)]);
    }
    return pixel;
}

function setPixel(imgData,x,y,pixel){
    for (let i = 0; i < 4; i++) {
        imgData.data[i + convertX(x,imgData) + convertY(y,imgData)] = pixel[i];
    }
}

function convertX(x,imgData){
    return x*4;
}

function convertY(y,imgData){
    return y*imgData.width*4;
}
function forEachPixel(imgData,apply,padding){
    let pad = 0;
    if (padding) {
        pad = padding;
    }
    for (let x = 0+pad; x < imgData.width-pad; x++) {
        for (let y = 0+pad; y < imgData.height-pad; y++) {
            apply(imgData,x,y);
        }
    }
}

//--------------------------------------------------------