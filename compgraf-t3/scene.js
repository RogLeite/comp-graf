const STD={
    color:[1,1,1,1],
};

const prot_Scene = {
    solids:[],
    trace:function(P,max_t){
        let obj = {obj:undefined,dist:max_t+1};
        solids.forEach(function(element){
            let here = element.checkCollision(P,max_t);
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
    checkCollision:function(P,max_t){
        let t=1;
        return {obj:this,dist:t};
    },
    shade:function(P){
        return STD.color;
    }
}