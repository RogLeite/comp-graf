var canvas =document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function onShowImage(img){
    ctx.drawImage(img,0,0,canvas.clientWidth,canvas.clientHeight);
}

function mediaFilter(){
    alert("Button clicked");

}