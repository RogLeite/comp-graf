var canvas =document.getElementById("canvas");
var gbox = document.getElementById("gamma-value");
var mbox = document.getElementById("median-radius");
var ctx = canvas.getContext("2d");
var activeImg;
var r = 0;
var g = 1;
var b = 2;
var a = 3;
var qtdParColor = a;

//gamma value
var gval = 1.1;

var medianRadius = 1;

function setGVal(){
    gval = gbox.value;
}

function setMedianRadius(){
    if (mbox.value === 1){
        medianRadius = 1;
    }else if(mbox.value === 2){
        medianRadius = 2;
    }
}

var colorSpaceTransform = function(x,y,imgData,newData,operator){
    let oldPx = getPixel(imgData,x,y);
    let newPx = operator(oldPx);
    //alert("oldPixel = "+oldPx+"\nnewPixel = "+newPx);
    setPixel(newData,x,y,newPx);
};

var maskedFilterTransform = function(x,y,imgData,newData,mask,padding){
    let reference = getPxMatrix(imgData,x,y,padding);
    let newPx = getModPixel(reference,mask);
    setPixel(newData,x,y,newPx);
};

var medianFilterTransform = function(x,y,imgData,newData,radius){
    let reference = getPxMatrix(imgData,x,y,radius);
    //alert("reference = "+reference);
    let newPx = getMedianPx(reference);
    setPixel(newData,x,y,newPx);
};

var medianFilter = function (imgData){
    let newData = ctx.createImageData(imgData);
    setMedianRadius();
    //alert("median radius = "+medianRadius);
    let padding = 0;
    forEachPixel(imgData,
        function (x,y){
            medianFilterTransform(x,y,imgData,newData,medianRadius);
        },
        padding
    );
    //alert("Lum operator");
    return newData;
};


var neg = function(pixel){
    //alert("pixel = "+pixel);
    let newPx = [];
    for(let i=0; i<qtdParColor;i++){
        newPx.push((255-pixel[i]));
    }
    newPx.push(pixel[a]);
    return newPx;
};
var negativeOperator = function (imgData){
    let newData = ctx.createImageData(imgData);
    let padding = 0;
    forEachPixel(imgData,
        function (x,y){
            colorSpaceTransform(x,y,imgData,newData,neg);
        },
        padding
    );
    //alert("Lum operator");
    return newData;
};


var lum = function(pixel){
    //alert("pixel = "+pixel);
    let L = 0.3*pixel[r]+0.59*pixel[g]+0.11*pixel[b];
    return [L,L,L,pixel[a]];
};
var lumOperator = function (imgData){
    let newData = ctx.createImageData(imgData);
    let padding = 0;
    forEachPixel(imgData,
        function (x,y){
            colorSpaceTransform(x,y,imgData,newData,lum);
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
        function(x,y){
            maskedFilterTransform(x,y,imgData,newData,gM3x3,padding3x3);
        },
        padding3x3
    );

    //alert("gaussian filter");
    return newData;
};


var edgeDetection = function (imgData){

    //sobel edge detection matrix 3x3
    let sobel3x3 =[
        [0,-1,0],
        [-1,4,-1],
        [0,-1,0]
    ];
    let padding3x3 = 1;
    
    let newData = ctx.createImageData(imgData);
   
    forEachPixel(imgData,
        function(x,y){
            maskedFilterTransform(x,y,imgData,newData,sobel3x3,padding3x3);
        },
        padding3x3
    );

    //alert("gaussian filter");
    return newData;
}

var gaussianFilter5x5 = function (imgData){

    //gaussian matrix 5x5
    let cst = 1/273;
    let gM5x5 =[
        [cst*1,cst*4,cst*7,cst*4,cst*1],
        [cst*4,cst*16,cst*26,cst*16,cst*4],
        [cst*7,cst*26,cst*41,cst*26,cst*7],
        [cst*4,cst*16,cst*26,cst*16,cst*4],
        [cst*1,cst*4,cst*7,cst*4,cst*1]
    ];
    //alert(total);

    let padding5x5 = 2;
    
    let newData = ctx.createImageData(imgData);
   
    forEachPixel(imgData,
        function(x,y){
            maskedFilterTransform(x,y,imgData,newData,gM5x5,padding5x5);
        },
        padding5x5
    );

    //alert("gaussian filter");
    return newData;
};


var gamma = function(pixel){
    let newPx = [];
    for (let i=0;i<qtdParColor;i++){
        newPx.push(Math.pow(pixel[i],1/gval));
    }
    newPx.push(pixel[a]);
    return newPx;
};

var gammaCorrection = function(imgData){
    let newData = ctx.createImageData(imgData);
    let padding = 0;
    setGVal();
    forEachPixel(imgData,
        function (x,y){
            colorSpaceTransform(x,y,imgData,newData,gamma);
        },
        padding
    );
    //alert("gamma operator");
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
function thirdButton(){
    buttonPushed(edgeDetection);
}

function fourthButton(){
    buttonPushed(gaussianFilter5x5);
}
function fifthButton(){
    buttonPushed(gammaCorrection);
}

function sixthButton(){
    buttonPushed(medianFilter);
}
function seventhButton(){
    buttonPushed(negativeOperator);
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

//Pixel Matrix Operations++++++++++++++++++++++++++++++
function getMedianPx(pxMatrix){
    //alert("pxMatrix = "+pxMatrix);
    let pxArray = turnArray(pxMatrix);
    //alert("pxArray = "+pxArray+"\n.length = "+pxArray.length);
    let middle = Math.floor(pxArray.length/2);
    //alert("middle = "+middle);
    let median = [];
    for(let i=0;i<qtdParColor;i++){
        sortPxs(pxArray,i);
        median.push(pxArray[middle][i]);
    }
    median.push(255);
    return median;
}

function turnArray(m) {
    let a = [];
    //alert("m.length = "+m.length);
    for(let i=0;i<m.length;i++){
       // alert("m[i].length = "+m[i].length);
        for(let j=0;j<m[i].length;j++){
            a.push(m[i][j]);
            //alert("a = "+a+"\nm[i][j] = "+m[i][j]);
        }
    }
    return a;
}

function sortPxs(pxArray,color){
    pxArray.sort(function(a,b){
        return (a[color]-b[color]);
    });
}

function getPxMatrix(iData,x,y,radius){
    let newMatrix = [];
    for(let j = y-radius;j<=y+radius;j++){
        let newArray = [];
        for (let i = x-radius; i <= x+radius; i++) {
            newArray.push(getPixel(iData,i,j));
        }
        //alert("newArray "+newArray);
        newMatrix.push(newArray);

        //alert("newMatrix "+newMatrix);
    }
    //alert(newMatrix);
    return newMatrix;
}

function getModPixel(ref,filter) {
    let weightedMatrix = multFilter(ref,filter);
    
    /* 
    let total = [0,0,0];
    for(let i = 0;i<weightedMatrix.length;i++){
        for(let j=0;j<weightedMatrix[i].length;j++){
            for(let color=0;color<qtdParColor;color++){
                total[color]+=weightedMatrix[i][j][color];
            }
        }
    }
    alert(total+" || "+ref); */
    let px = sumPxMatrix(weightedMatrix);
    //alert(px);
    return px;
}

function multFilter(ref,filter){4
    let newMatrix = [];
    for (let i = 0; i < filter.length; i++) {
        let newArray = [];
        for(let j = 0;j<filter[i].length;j++){
            let newPx = [];
            for(let color = 0;color<qtdParColor;color++){
                newPx.push(Math.ceil(ref[i][j][color]*filter[i][j]));//[[todo]]
            }
            newPx.push(ref[i][j][a]);
            //alert("newPx "+newPx);
            newArray.push(newPx);  
        }
        newMatrix.push(newArray);
    }
    //alert("newMatrix "+newMatrix);
    return newMatrix;
}

function sumPxMatrix(matrix){
    let newPx = [0,0,0,0];
    for(let color = 0;color<qtdParColor;color++){
        for (let i = 0; i < matrix.length; i++) {
            for(let j = 0;j<matrix[i].length;j++){
                newPx[color]+=matrix[i][j][color];
            }
        }
    }
    newPx[a] = matrix[Math.floor(matrix.length/2)][Math.floor(matrix[0].length/2)][a];
    return newPx;
}
//---------------------------------------------------------------

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
            apply(x,y);
        }
    }
}

//--------------------------------------------------------