var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


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
function testVect3(){
    const v2 = auxVec3_create(0,1,0);
    const v1 = auxVec3_create(1,0,0);
    console.log(vec3.dot(v1,v2));
}

var prot_Camera = {
    pxMatrix:[],
    extr:{
        scene:{},
        eye:auxVec3_create(1,1,1),
        up:auxVec3_create(0,1,0),
        center:auxVec3_create(2,2,2),
    },
    intr:{
        xe:auxVec3_create(1,0,0),
        ye:auxVec3_create(0,1,0),
        ze:auxVec3_create(0,0,1),
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
        vec3.add(this.extr.eye,this.extr.eye,eye);
        this.update();
    },
    update:function(){
        this.intr.fov_rad = this.intr.fov_deg*Math.PI/180;
        let partial = vec3.create();
        vec3.scaleAndAdd(partial,this.extr.eye,this.extr.center,-1);
        vec3.normalize(this.intr.ze,partial);
        vec3.cross(partial,this.extr.up,this.intr.ze);
        vec3.normalize(this.intr.xe,partial);
        vec3.cross(this.intr.ye,this.intr.ze,this.intr.xe);
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
    makeD:function(i,j){
        let local_z = vec3.create();
        vec3.scale(local_z,this.intr.ze,-this.intr.df);
        let local_y = vec3.create();
        vec3.scale(local_y,this.intr.ye,this.intr.altura*(j/this.intr.h-1/2));
        let local_x = vec3.create();//serve como retorno
        vec3.multiply(local_x,this.intr.xe,this.intr.base*(i/this.intr.w-1/2));

        vec3.add(local_x,local_x,local_y);
        vec3.add(local_x,local_x,local_z);
        return local_x;
    },
    makeP:function(i,j){
        let d=this.makeD(i,j);
        let obj = this;
        function P(t){
            let temp = vec3.create();
            vec3.scaleAndAdd(temp,obj.extr.eye,d,-t);
            return temp;
        };
        P.unit = vec3.create();
        vec3.scale(P.unit,d,-1);
        vec3.normalize(P.unit,P.unit);
        return P;
    },

};
function class_Camera(eye,up){
    this.eye = eye;
    this.up = up;
}
class_Camera.prototype = prot_Camera;

function paintCam(evt){
    let newData = ctx.createImageData(ctx.getImageData(0,0,canvas.clientWidth,canvas.clientHeight));

    var main_cam = new class_Camera();
    main_cam.extr.eye = auxVec3_create(100,40,40);
    main_cam.extr.center = auxVec3_create(0,0,0);
    main_cam.extr.up = auxVec3_create(0,1,0);
    main_cam.intr.near = 30;
    main_cam.intr.far = 230;
    main_cam.intr.w = 230;
    main_cam.intr.h = 230;
    
    
    main_cam.update();
    var main_scene = new class_Scene();
    main_scene.insertCam(main_cam);
    
    var sphere1 = new class_Sphere();
    sphere1.origin = auxVec3_create(0,20,0);
    sphere1.radius = 25;
    sphere1.color_difuse = [0,0,1,1];
    sphere1.name = "sphere1";
    
    main_scene.insertSolid(sphere1);
    
    
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