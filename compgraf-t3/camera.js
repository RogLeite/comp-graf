var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

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
        far:100
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

};
function class_Camera(eye,up){
    this.eye = eye;
}
class_Camera.prototype = prot_Camera;

function paintScene(evt){

}