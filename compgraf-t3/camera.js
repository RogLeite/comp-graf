
import * as my_math from 'mathjs';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var main_cam = new class_Camera();
main_cam.update();
var main_scene = new class_Scene();
main_scene.insertCam(main_cam);

const r = 0;
const g = 1;
const b = 2;
const a = 3;
const qtdParColor = a;

const x=0;
const y=1;
const z=2;

const m1 = my_math.matrix([[0,-1],
                        [1,0]]);
const m2 = my_math.matrix([[2,1],
                        [1,2]]);
const m3 = my_math.multiply(m1,m2);

console.log(m3);


var prot_Camera = {
    pxMatrix:[],
    extr:{
        scene:{},
        eye:my_math.matrix([1],[1],[1]),
        up:my_math.matrix([0],[1],[0]),
        center:my_math.matrix([2],[2],[2]),
    },
    intr:{
        xe:my_math.matrix([1],[0],[0]),
        ye:my_math.matrix([0],[1],[0]),
        ze:my_math.matrix([0],[0],[1]),
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
        this.extr.eye = my_math.add(this.extr.eye,eye);
        this.update();
    },
    update:function(){
        this.intr.fov_rad = this.intr.fov_deg*Math.PI/180;
        let partial = my_math.add(this.extr.eye,my_math.multiply(-1,this.extr.center));
        this.intr.ze=my_math.normalize(partial);//divide pela norma
        partial = my_math.cross(this.extr.up,this.intr.ze);//crossproduct
        this.intr.xe=my_math.normalize(partial);
        this.intr.ye=my_math.cross(this.extr.ze,this.extr.xe);
        this.intr.df = this.intr.near;
        this.intr.altura = 2*this.intr.df*Math.tan(this.intr.fov_rad/2);
        this.intr.base = (this.intr.w/this.intr.h)*this.intr.altura;
    },
    rayTrace:function(){
        let scene = this.extr.scene;
        //for every pixel

        for(let i=0;i<this.intr.w;i++){
            if(!this.pxMatrix[i]){
                this.pxMatrix.push([]);
            }
            for(let j=0;j<this.intr.h;j++){
                let P = this.makeP(i,j);
                let pixel = scene.trace(P,this.extr.eye,this.intr.far);
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
            return(my_math.add(this.extr.eye,my_math.multiply(-t,d)));
        };
        P.unit = my_math.normalize(mult(-1,d));
        return P;
    },
    makeD:function(i,j){
        let local_z = my_math.multiply(-this.intr.df,this.intr.ze);
        let local_y = my_math.multiply(this.intr.altura*(j/this.intr.h-1/2),this.intr.ye);
        let local_x = my_math.multiply(this.intr.base*(i/this.intr.w-1/2),this.intr.xe);
        let partial_sum = my_math.add(local_x,local_y);
        let d = my_math.add(partial_sum,local_z);
        return d;
    },

};
function class_Camera(eye,up){
    this.eye = eye;
    this.up = up;
}
class_Camera.prototype = prot_Camera;

function paintCam(evt){
    let newData = ctx.createImageData(imgData);
    main_cam.rayTrace();
    forEachPixel(newData,function(X,Y){
            setPixel(newData,X,Y,main_cam.pxMatrix[X,Y]);
        });
    ctx.drawImage(newData,0,0,canvas.clientWidth,canvas.clientHeight);
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