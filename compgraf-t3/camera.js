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
    pxMatrix:[],
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
        this.intr.fov_rad = this.intr.fov_deg*Math.PI/180;
        let partial = subtract(this.extr.eye,this.extr.center);
        this.intr.ze=normalize(partial);//divide pela norma
        partial = cross(this.extr.up,this.intr.ze);//crossproduct
        this.intr.xe=normalize(partial);
        this.intr.ye=cross(this.extr.ze,this.extr.xe);
        this.intr.df = this.intr.near;
        this.intr.altura = 2*this.intr.df*Math.tan(this.intr.fov_rad/2);
        this.intr.base = (this.intr.w/this.intr.h)*this.intr.altura;
    },
    rayTrace:function(scene){
        //for every pixel

        for(let i=0;i<this.intr.w;i++){
            if(!this.pxMatrix[i]){
                this.pxMatrix.push([]);
            }
            for(let j=0;j<this.intr.h;j++){
                let P = this.makeP(i,j);
                let pixel = scene.trace(P,this.extr.eye);
                if(!this.pxMatrix[i][j]){
                    this.pxMatrix[i].push([]);
                }
                pxMatrix[i][j] = pixel;
            }
        }
    },
    makeP:function(i,j){
        let d=makeD(i,j);
        function P(t){
            return(add(this.extr.eye,multiply(-t,d)));
        };
        P.unit = normalize(mult(-1,d));
        return P;
    },
    makeD:function(i,j){
        let local_z = multiply(-this.intr.df,this.intr.ze);
        let local_y = multiply(this.intr.altura*(j/this.intr.h-1/2),this.intr.ye);
        let local_x = multiply(this.intr.base*(i/this.intr.w-1/2),this.intr.xe);
        let partial_sum = sum(local_x,local_y);
        let d = sum(partial_sum,local_z);
        return d;
    },

};
function class_Camera(eye,up){
    this.eye = eye;
    this.up = up;
}
class_Camera.prototype = prot_Camera;

function paintScene(evt){
    let newData = ctx.createImageData(imgData);

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