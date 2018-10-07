var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var r = 0;
var g = 1;
var b = 2;
var a = 3;
var qtdParColor = a;

const x=0;
const y=1;
const z=2;

const m1 = matrix([[0,-1],
                        [1,0]]);
const m2 = matrix([[2,1],
                        [1,2]]);
const m3 = multiply(m1,m2);

console.log(m3);


var prot_Camera = {
    extr:{
        eye:matrix([1],[1],[1]),
        up:matrix([0],[1],[0]),
        center:matrix([2],[2],[2]),
    },
    intr:{
        xe:matrix([1],[0],[0]),
        ye:matrix([0],[1],[0]),
        ze:matrix([0],[0],[1]),
        fov_deg:90,
        w:800,
        h:600,
        near:10,
        far:100,
    },
    placeCam:function(eye,up){
        this.extr.eye = eye;
        this.extr.up = up;
        this.update();
    },
    moveCamTo:function(eye){
        this.extr.eye = eye;
        this.update();
    },
    moveCamBy:function(eye){
        this.extr.eye = add(this.extr.eye,eye);
        this.update();
    },
    update:function(){
        let partial = subtract(this.extr.eye,this.extr.center);
        this.intr.ze=normalize(partial);//divide pela norma
        partial = cross(this.extr.up,this.intr.ze);//crossproduct
        this.intr.xe=normalize(partial);
        this.intr.ye=cross(this.extr.ze,this.extr.xe);
    },
    projectNear:function(scene){
        //for every pixel
        for(let i=0;i<this.intr.w;i++){
            for(let j=0;j<this.intr.h;j++){
                let P = this.makeP(i,j);
                let pixel = scene.checkCollision(P);
                //[[TODO]] decidir o q faz com o pixel
            }
            
        }
    },
    makeP:function(i,j){
        let d=makeD(i,j);
        return function(t){
            return(add(this.extr.eye,multiply(-t,d)));
        };
    },
    makeD:function(i,j){
        //[[TODO]]
    },

};
function class_Camera(eye,up){
    this.eye = eye;
}
class_Camera.prototype = prot_Camera;

function paintScene(evt){

}

//Pixel operations+++++++++++++++++++++++++++++++++++++++++++++++++

function setPixel(imgData,X,Y,pixel){
    for (let i = 0; i < 4; i++) {
        imgData.data[i + convertX(X,imgData) + convertY(Y,imgData)] = pixel[i];
    }
}

function convertX(X,imgData){
    return X*4;
}

function convertY(Y,imgData){
    return Y*imgData.width*4;
}
function forEachPixel(imgData,apply,padding){
    let pad = 0;
    if (padding) {
        pad = padding;
    }
    for (let X = 0+pad; X < imgData.width-pad; X++) {
        for (let Y = 0+pad; Y < imgData.height-pad; Y++) {
            apply(X,Y);
        }
    }
}

//--------------------------------------------------------