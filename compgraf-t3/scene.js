const STD={
    color:[1,1,1,1],
    difuse:[1,0,0,1],//red
    specular:[1,1,1,1],
    ambient:[0,0,0,0],
    color_sphere:[1,0,0,1],//red
    color_box:[1,1,0,1],//yellow
    origin:my_math.matrix([0],[0],[0]),
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
                if (here.dist<obj.dist){//se está mais proximo da camera
                    obj = here;
                }
            }
        });
        return obj.shade(P,obj.dist);
    }

};

function class_Scene(){

}

class_Scene.prototype = prot_Scene;


const prot_Solid = {
    origin:STD.origin,
    color_difuse:STD.difuse,
    color_specular:STD.specular,
    color_ambient:STD.ambient,
    checkCollision:function(P,Origin,max_t){
        let t=1;
        return {obj:this,dist:t};
    },
    shade:function(P,t){
        return this.difuse;
    }
}

const prot_Sphere = {
    origin:prot_Solid.origin,
    radius:5,
    color_difuse:STD.color_sphere,
    color_ambient:prot_Solid.ambient,
    color_specular:prot_Solid.specular,
    checkCollision:function(P,Origin,max_t){
        let local_a = my_math.multiply(P.unit,P.unit);
        let local_b = my_math.multiply(my_math.multiply(2,P.unit),my_math.add(Origin,my_math.multiply(-1,this.origin)));
        let local_c = my_math.add(my_math.multiply(my_math.add(Origin,my_math.multiply(-1,this.origin)),my_math.add(Origin,my_math.multiply(-1,this.origin))),-Math.pow(this.radius,2));
        let delta = Math.pow(local_b,2) - 4*local_a*local_c;
        if(delta<0){
            return false;
        } else if(delta===0){
            let t1 = -local_b/(2*local_a);
            let l_normal = l_math.add(P(t1),l_math.multiply(-1,this.origin));
            l_normal = l_math.normalize(l_normal);
            return {obj:this,t:t1,normal:l_normal};
        }else{
            let t1 = -local_b-Math.sqrt(delta)/(2*local_a);
            let t2 = -local_b+Math.sqrt(delta)/(2*local_a);
            let l_normal = l_math.add(P(Math.min(t1,t2)),l_math.multiply(-1,this.origin));
            l_normal = l_math.normalize(l_normal);
            return {obj:this,t:Math.min(t1,t2),normal:l_normal};
        }
    },
    shade:function(P,t){
        //[[TODO]] shader da esfera
        return this.difuse;

    }
};
function class_Sphere(){

}
class_Sphere.prototype = prot_Sphere;


const prot_Aligned_Box = {
    origin:prot_Solid.origin,
    //yu:l_math.matrix([0],[1],[0]),//y unitário
    //xz_du:l_math.matrix([1],[1],[1]),//diagonal do plano y=0(y do próprio retângulo)
    width:100,//dx
    height:5,//dy
    length:200,//dz
    color_difuse:STD.color_box,
    color_ambient:prot_Solid.ambient,
    color_specular:prot_Solid.specular,
    checkCollision:function(P,Origin,max_t){
        //let mod_diagonal = Math.sqrt(Math.pow(this.width,2)+Math.pow(this.length,2));
        //let diagonal = l_math.multiply(xz_du,mod_diagonal);
        
        //[[TODO]] detecção de caixas alinhadas aos eixos
    },
    //[[TODO]] shade
};