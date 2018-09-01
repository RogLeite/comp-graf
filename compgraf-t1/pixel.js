
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
    return x*imgData.width*4;
}

function convertY(y,imgData){
    return y*4;
}

export {getPixel,setPixel};