var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var activeImg;
var r = 0;
var g = 1;
var b = 2;
var a = 3;
var qtdParColor = a;

var lum = function(pixel){
    return 0.3*pixel[r]+0.59*pixel[g]+0.11*pixel[b];
};

var lumOperator = function (imgData){
    let newData = ctx.createImageData(imgData);
    let padding = 0;
    forEachPixel(imgData,
        function (x,y){
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
    let total = 0;
    for(let i = 0;i<3;i++){
        for(let j=0;j<3;j++){
            total+=gM3x3[i][j];
        }
    }
    alert(total);

    let padding3x3 = 1;
    
    let newData = ctx.createImageData(imgData);
   
    forEachPixel(imgData,
        function(x,y){
            let reference = getPxMatrix(imgData,x,y,padding3x3);
            let newPx = getModPixel(reference,gM3x3);
            if (newPx === null){
                alert("newPx null");
            }
            setPixel(newData,x,y,newPx);
        },
        padding3x3
    );

    //alert("gaussian filter");
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

//Pixel Matrix Operations++++++++++++++++++++++++++++++
function getPxMatrix(iData,x,y,radius){
    let newMatrix = [];
    for(let j = y-radius;j<y+radius;j++){
        let newArray = [];
        for (let i = x-radius; i < x+radius; i++) {
            newArray.push(getPixel(iData,i,j));
        }
        newMatrix.push(newArray);
    }
    return newMatrix;
}

function getModPixel(ref,filter) {
    let weightedMatrix = multFilter(ref,filter);
    let px = sumPxMatrix(weightedMatrix);
    return px;
}

function multFilter(ref,filter){4
    let newMatrix = [];
    for (let i = 0; i < ref.length; i++) {
        let newArray = [];
        for(let j = 0;j<ref[i].length;j++){
            let newPx = [];
            for(let color = 0;color<qtdParColor;color++){
                newPx.push(Math.floor(ref[i][j][color]*filter[i][j]));//[[todo]]
            }
            newPx.push(ref[i][j][a]);
            newArray.push(newPx);  
        }
        newMatrix.push(newArray);
    }
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
    newPx[a] = matrix[matrix.length/2][matrix[0].length/2][a];
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