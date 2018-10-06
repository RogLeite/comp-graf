
//Pixel operations+++++++++++++++++++++++++++++++++++++++++++++++++

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