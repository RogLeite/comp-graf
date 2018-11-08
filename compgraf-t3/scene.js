const STD={
    color:[1,1,1,1],
    difuse:[1,0,0,1],//red
    specular:[1,1,1,1],
    ambient:[0.2,0.2,0.2,1],
    color_sphere:[1,0,0,1],//red
    color_box:[0.7,0.7,0,1],//yellow
    origin:auxVec3_create(0,0,0),
    background_color:[0,0,0,1],
    light:[0.8,0.8,0.8,1],
    specular_coeficient:40,
};

var printed = 100;
function phong(scene,obj,point){
    let total_color = auxVec3_create(0,0,0);

    //PARA CADA LUZ: DIFUSA E ESPECULAR
    let l_difuse=vec3.create();
    let l_specular = vec3.create();
    scene.lights.forEach(
        function(light_elem){

            // let p=function(){
            //     let d=vec3.create();
            //     vec3.sub(d,light_elem.origin,point.origin);
            //     vec3.normalize(d,d);

            //     let obj = this;
            //     let P = function (t){
            //         let temp = vec3.create();
            //         vec3.scale(temp,d,t);
            //         vec3.add(temp,temp,point.origin);
            //         return temp;
            //     };
            //     P.unit = vec3.create();
            //     vec3.normalize(P.unit,d);
            //     P.d = d;
            //     P.getT = function(p){
            //         return vec3.length(p)/vec3.length(this.d);
            //     };
            //     return P;
            // }();
            // let temp_origin = vec3.create();
            // vec3.scaleAndAdd(temp_origin,point.origin,p.unit,0.5);
            // let intersect = scene.trace(p,temp_origin,Infinity);
            // if(!intersect){
                //DIFUSA
                let part = auxVec3_specialMultiply(light_elem.RGB_intensity,obj.color_difuse);
                let L = vec3.create();
                vec3.subtract(L,light_elem.origin,point.origin);
                vec3.normalize(L,L);
                vec3.scale(part,part,vec3.dot(L,point.normal));
                vec3.add(l_difuse,l_difuse,part);

                //SPECULAR
                
                let l_v = vec3.create();
                vec3.sub(l_v,scene.cameras[0].extr.eye,point.origin);
                vec3.normalize(l_v,l_v);
                

                let l_r = vec3.create();
                vec3.scale(l_r,point.normal,vec3.dot(l_v,point.origin)*2);
                vec3.sub(l_r,l_r,l_v);
                vec3.normalize(l_r,l_r);
                
                part = auxVec3_specialMultiply(light_elem.RGB_intensity,obj.color_specular);
                if(vec3.dot(l_r,l_v)>0){
                    vec3.scale(part,part,vec3.dot(l_r,L)**obj.specular_n);
                    vec3.add(l_specular,l_specular,part);
                }
            //}
        }
    );
    vec3.add(total_color,total_color,l_difuse);
    vec3.add(total_color,total_color,l_specular);

    //AMBIENTE
    let l_ambient = auxVec3_specialMultiply(scene.color_ambient,obj.color_difuse);
    vec3.add(total_color,total_color,l_ambient);


    return total_color;
}

const prot_Scene = {
    solids:[],
    cameras:[],
    lights:[],
    background_color:STD.background_color,
    color_difuse:STD.background_color,
    color_ambient:STD.ambient,
    insertCam:function(cam){
        cam.extr.scene = this;
        this.cameras.push(cam);
    },
    insertSolid:function(solid){
        this.solids.push(solid);
        solid.scene = this;
    },
    insertLight:function(light){
        this.lights.push(light);
        light.scene = this;
    },
    trace:function(P,Origin,max_t){
        let obj = {obj:undefined,dist:Infinity};
        this.solids.forEach(function(element){
            let here = element.checkCollision(P,Origin,max_t);
            if(here){//se houve colisão
                //console.log("colisão com "+here.obj.name+" dist = "+here.dist);
                if (here.dist<obj.dist){//se está mais proximo da camera
                    // if(printed>0&&obj.obj){
                    //     console.log(here.obj.name+" está mais próximo que "+obj.obj.name);
                    //     printed--;
                    // }
                    obj = here;
                    //console.log("esteve mais próximo");
                }
            }
        });
        if (obj.dist === Infinity){//se nãoatingiu nada
            return undefined;
        }
        else{
            return obj.obj.shade(P,obj.dist,obj.normal);
        }
    }

};

function class_Scene(){

}

class_Scene.prototype = prot_Scene;






const prot_Light = {
    name:"prot_Light",
    scene:undefined,
    origin:STD.origin,
    RGB_intensity:STD.light,
};
function class_Light(){
    
}
class_Light.prototype = prot_Light;


const prot_Solid = {
    name:"prot_Solid",
    scene:undefined,
    origin:STD.origin,
    color_difuse:STD.difuse,
    color_specular:STD.specular,
    color_ambient:STD.ambient,
    specular_n:STD.specular_coeficient,
    checkCollision:function(P,Origin,max_t){
        let t=1;
        return {obj:this,dist:t};
    },
    shade:function(P,t,normal){
        return this.color_difuse;
    }
}

const prot_Sphere = {
    name:"prot_Sphere",
    scene:prot_Solid.scene,
    origin:prot_Solid.origin,
    radius:5,
    color_difuse:STD.color_sphere,
    color_ambient:prot_Solid.color_ambient,
    color_specular:prot_Solid.color_specular,
    specular_n:prot_Solid.specular_n,
    checkCollision:function(P,Origin,max_t){
        
        let local_a = vec3.dot(P.d,P.d);
        
        let partial_1 = vec3.create();
        vec3.sub(partial_1,Origin,this.origin);//(o-c)
        let partial_2 = vec3.create();
        vec3.scale(partial_2,P.d,2);
        
        let local_b = vec3.dot(partial_2,partial_1);
        
        
        let local_c = vec3.dot(partial_1,partial_1)-this.radius**2;
        
        
        let delta = local_b**2 - 4*local_a*local_c;
        
        if(delta<0){
            return false;
        }else{
            let t1 = (-local_b-Math.sqrt(delta))/(2*local_a);
            let t2 = (-local_b+Math.sqrt(delta))/(2*local_a);
            // if(printed>0){
            //     //console.log("vec3.length(P.unit) = "+vec3.length(P.unit));
            //     console.log("min(t1,t2) = "+Math.min(t1,t2));
            //     console.log("max(t1,t2) = "+Math.max(t1,t2));
            //     printed--;
            // }
            let l_normal = vec3.create();
            vec3.sub(l_normal,P(Math.min(t1,t2)),this.origin);
            vec3.normalize(l_normal,l_normal);
            //console.log("normal da esfera = "+l_normal);
            return {obj:this,dist:Math.min(t1,t2),normal:l_normal};
        }
    },
    shade:function(P,t,n){
        // shader da esfera
        //console.log("\t e = "+n);
        let p = phong(this.scene,this,{origin:P(t),normal:n});
        let c = [p[r],p[g],p[b],1];
        //console.log("cor da esfera = "+c);
        return c;
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
    color_ambient:prot_Solid.color_ambient,
    color_specular:prot_Solid.color_specular,
    specular_n:prot_Solid.specular_n,
    checkCollision:function(pnt,Origin,max_t){
        
        //[[TODO]] detecção de caixas alinhadas aos eixos

        //testa em x
        let result = testRecCollision(this,pnt,Origin,x,y,z,this.height,this.length);
        if(result){
            return result;
        }
        //testa em y
        result = testRecCollision(this,pnt,Origin,y,z,x,this.length,this.width);
        if(result){
            return result;
        }
        //testa em z
        result = testRecCollision(this,pnt,Origin,z,x,y,this.width,this.height);
        
        return result;
    },
    shade:function(P,t,n){
        //origin é o ponto de interseção com a esfera
        let p = phong(this.scene,this,{origin:P(t),normal:n});
        
        //Ajeita num array de pixel
        let c = [p[r],p[g],p[b],1];
        return c;

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