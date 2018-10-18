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

function testMatrix(){
    const m1 = mat2.create();
    mat2.set(m1,0,-1,1,0);
    const m2 = mat2.create();
    mat2.set(m2,2,1,1,2);
    const m3 = mat2.create();
    mat2.multiply(m3,m1,m2);
    console.log(mat2.str(m3));

}
function auxVet3_create(x,y,z){
    let temp = vet3.create();
    vet3.set(temp,x,y,z);
    return temp;
}

var prot_Camera = {
    pxMatrix:[],
    extr:{
        scene:{},
        eye:auxVet3_create(1,1,1),
        up:auxVet3_create(0,1,0),
        center:auxVet3_create(2,2,2),
    },
    intr:{
        xe:auxVet3_create(1,0,0),
        ye:auxVet3_create(0,1,0),
        ze:auxVet3_create(0,0,1),
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
        vet3.add(this.extr.eye,this.extr.eye,eye);
        this.update();
    },
    update:function(){
        this.intr.fov_rad = this.intr.fov_deg*Math.PI/180;
        let partial = vet3.create();
        vet3.scaleAndAdd(partial,this.extr.eye,this.extr.center,-1);
        vet3.normalize(this.intr.ze,partial);//divide pela norma
        vet3.cross(partial,this.extr.up,this.intr.ze);//crossproduct
        vet3.normalize(this.intr.xe,partial);
        vet3.cross(this.intr.ye,this.extr.ze,this.extr.xe);
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
            let temp = vet3.create();
            vet3.scaleAndAdd(temp,this.extr.eye,d,-t);
            return temp;
        };
        P.unit = vet3.create();
        vet3.scale(P.unit,d,-1);
        vet3.normalize(P.unit,P.unit);
        return P;
    },
    makeD:function(i,j){
        let local_z = vet3.create();
        vet3.scale(local_z,this.intr.ze,-this.intr.df);
        let local_y = vet3.create();
        vet3.scale(local_y,this.intr.ye,this.intr.altura*(j/this.intr.h-1/2));
        let local_x = vet3.create();//serve como retorno
        vet3.multiply(local_x,this.intr.xe,this.intr.base*(i/this.intr.w-1/2));

        my_math.add(local_x,local_x,local_y);
        my_math.add(local_x,local_x,local_z);
        return local_x;
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