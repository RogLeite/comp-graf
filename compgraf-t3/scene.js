
import * as my_math from 'mathjs';

const STD={
    color:[1,1,1,1],
    difuse:[1,0,0,1],//red
    specular:[1,1,1,1],
    ambient:[0,0,0,0],
    color_sphere:[1,0,0,1],//red
};

const prot_Scene = {
    solids:[],
    cameras:[],
    lights:[],
    insertCam:function(cam){
        cam.extr.scene = this;
        this.cameras.push(cam);
    },
    trace:function(P,Origin,max_t){
        let obj = {obj:undefined,dist:max_t+1};
        solids.forEach(function(element){
            let here = element.checkCollision(P,Origin,max_t);
            if(here){//se houve colisão
                if (here.dist<obj.dist){
                    obj = here;
                }
            }
        });
        return obj.shade(P);
    }

};

function class_Scene(){

}

class_Scene.prototype = prot_Scene;


const prot_Solid = {
    color_difuse:STD.difuse,
    color_specular:STD.specular,
    color_ambient:STD.ambient,
    checkCollision:function(P,Origin,max_t){
        let t=1;
        return {obj:this,dist:t};
    },
    shade:function(P){
        return STD.color;
    }
}

const prot_Sphere = {
    //[[TODO]]
    center:my_math.matrix([10],[10],[10]),
    radius:5,
    color_difuse:STD.color_sphere,
    color_ambient:STD.ambient,
    color_specular:STD.specular,
    checkCollision:function(P,Origin,max_t){
        let local_a = my_math.multiply(P.unit,P.unit);
        let local_b = my_math.multiply(my_math.multiply(2,P.unit),my_math.add(Origin,my_math.multiply(-1,this.center)));
        let local_c = my_math.add(my_math.multiply(my_math.add(Origin,my_math.multiply(-1,this.center)),my_math.add(Origin,my_math.multiply(-1,this.center))),-Math.pow(this.radius,2));
        let delta = Math.pow(local_b,2) - 4*local_a*local_c;
        if(delta<0){
            return false;
        } else if(delta===0){
            let t1 = -local_b/(2*local_a);
            return {obj:this,t:t1};
        }else{
            let t1 = -local_b-Math.sqrt(delta)/(2*local_a);
            let t2 = -local_b+Math.sqrt(delta)/(2*local_a);
            return {obj:this,t:Math.min(t1,t2)};
        }
    },
    shade:function(P){
        //[[TODO]] shader da esfera
        return this.difuse;

    }
};
function class_Sphere(){

}
class_Sphere.prototype = prot_Sphere;