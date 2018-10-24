const STD={
    color:[1,1,1,1],
    difuse:[1,0,0,1],//red
    specular:[1,1,1,1],
    ambient:[0,0,0,0],
    color_sphere:[1,0,0,1],//red
    color_box:[1,1,0,1],//yellow
    origin:auxVec3_create(0,0,0),
    background_color:[0,0,0,1],
};

const prot_Scene = {
    solids:[],
    cameras:[],
    lights:[],
    background_color:STD.background_color,
    insertCam:function(cam){
        cam.extr.scene = this;
        this.cameras.push(cam);
    },
    insertSolid:function(solid){
        this.solids.push(solid);
        solid.scene = this;
    },
    trace:function(P,Origin,max_t){
        let obj = {obj:undefined,dist:max_t+1};
        this.solids.forEach(function(element){
            let here = element.checkCollision(P,Origin,max_t);
            if(here){//se houve colisão
                //console.log("colisão com "+here.obj.name+" dist = "+here.dist);
                if (here.dist<obj.dist){//se está mais proximo da camera
                    obj = here;
                    //console.log("esteve mais próximo");
                }
            }
        });
        if (obj.dist === max_t+1){//se nãoatingiu nada
            return this.background_color;
        }
        else{
            return obj.obj.shade(P,obj.dist);
        }
    }

};

function class_Scene(){

}

class_Scene.prototype = prot_Scene;


const prot_Solid = {
    name:"prot_Solid",
    scene:undefined,
    origin:STD.origin,
    color_difuse:STD.difuse,
    color_specular:STD.specular,
    color_ambient:STD.ambient,
    checkCollision:function(P,Origin,max_t){
        let t=1;
        return {obj:this,dist:t};
    },
    shade:function(P,t){
        return this.color_difuse;
    }
}

const prot_Sphere = {
    name:"prot_Sphere",
    scene:prot_Solid.scene,
    origin:prot_Solid.origin,
    radius:5,
    color_difuse:STD.color_sphere,
    color_ambient:prot_Solid.ambient,
    color_specular:prot_Solid.specular,
    checkCollision:function(P,Origin,max_t){
        //console.log("P.unit = "+P.unit);
        let local_a = vec3.dot(P.unit,P.unit);
        //console.log("local_a = "+local_a);
        let partial_1 = vec3.create();
        vec3.scaleAndAdd(partial_1,Origin,this.origin,-1);//(o-c)
        let partial_2 = vec3.create();
        vec3.scale(partial_2,P.unit,2);
        let local_b = vec3.dot(partial_2,partial_1);
        //console.log("local_b = "+local_b);
        let local_c = vec3.dot(partial_1,partial_1)-Math.pow(this.radius,2);
        //console.log("local_c = "+local_c);
        let delta = Math.pow(local_b,2) - 4*local_a*local_c;
        //console.log("delta = "+delta);
        if(delta<0){
            return false;
        } else if(delta===0){
            let t1 = -local_b/(2*local_a);
            //console.log("t1 = "+t1);
            let l_normal = vec3.create();
            vec3.scaleAndAdd(l_normal,P(t1),this.origin,-1);
            vec3.normalize(l_normal,l_normal);
            return {obj:this,dist:t1,normal:l_normal};
        }else{
            let t1 = -local_b-Math.sqrt(delta)/(2*local_a);
            //console.log("t1 = "+t1);
            let t2 = -local_b+Math.sqrt(delta)/(2*local_a);
            //console.log("t2 = "+t2);
            let l_normal = vec3.create();
            vec3.scaleAndAdd(l_normal,P(Math.min(t1,t2)),this.origin,-1);
            vec3.normalize(l_normal,l_normal);
            return {obj:this,dist:Math.min(t1,t2),normal:l_normal};//[[TODO]]Debug aqui, dist is NaN
        }
    },
    shade:function(P,t){
        //[[TODO]] shader da esfera
        return this.color_difuse;

    }
};
function class_Sphere(){

}
class_Sphere.prototype = prot_Sphere;


const prot_AlignedBox = {
    scene:prot_Solid.scene,
    origin:prot_Solid.origin,
    end:auxVec3_create(3,1,3),
    width:100,//dx
    height:5,//dy
    length:200,//dz
    color_difuse:STD.color_box,
    color_ambient:prot_Solid.ambient,
    color_specular:prot_Solid.specular,
    checkCollision:function(P,Origin,max_t){
        
        //[[TODO]] detecção de caixas alinhadas aos eixos
        let enter_x = undefined;
        let enter_y = undefined;
        let enter_z = undefined;
        let leave_x = undefined;
        let leave_y = undefined;
        let leave_z = undefined;
        //testa em x
        if(P.unit[x]<0){
            enter_x = Math.min(this.origin[x],this.end[x]);
            leave_x = Math.max(this.origin[x],this.end[x]);
        }else if(P.unit[x]>0){
            enter_x = Math.max(this.origin[x],this.end[x]);
            leave_x = Math.min(this.origin[x],this.end[x]);
        }else{
            //remain undefined
        }

        //testa em y
        //testa em z
    },
    shade:function(P,t){
        //[[TODO]] shader da caixa
        return this.color_difuse;

    }
};
function class_AlignedBox(origin,end){
    this.origin = origin;
    this.end = end;
    this.width = end[x]-origin[x];
    this.height = end[y]-origin[y];
    this.length = end[z]-origin[z];
}
class_AlignedBox.prototype = prot_AlignedBox;