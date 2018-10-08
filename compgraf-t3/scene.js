const STD={
    color:[1,1,1,1],
    difuse:[1,0,0,1],//red
    specular:[1,1,1,1],
    ambient:[0,0,0,0],
    color_sphere:[1,0,0,1],//red
};

const prot_Scene = {
    solids:[],
    trace:function(P,Origin,max_t){
        let obj = {obj:undefined,dist:max_t+1};
        solids.forEach(function(element){
            let here = element.checkCollision(P,Origin,max_t);
            if (here.dist<obj.dist){
                obj = here;
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
    center:matrix([10],[10],[10]),
    radius:5,
    color_difuse:STD.color_sphere,
    color_ambient:STD.ambient,
    color_specular:STD.specular,
    checkCollision:function(P,Origin,max_t){
        let local_a = multiply(P.unit,P.unit);
        let local_b = ;
        let local_c;
        //[[TODO]]
    },
    shade:function(P){
        return this.difuse;
    }
};
function class_Sphere(){

}
class_Sphere.prototype = prot_Sphere;