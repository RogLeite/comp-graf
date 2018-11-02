
function auxVec3_create(x,y,z){
    let temp = vec3.create();
    vec3.set(temp,x,y,z);
    return temp;
}
function auxVec3_specialMultiply(v1,v2){
    return auxVec3_create(v1[0]*v2[0],v1[1]*v2[1],v1[2]*v2[2]);
}

function auxVec3_modulo(v){
    return auxVec3_create(Math.abs(v[0]),Math.abs(v[1]),Math.abs(v[2]));
}

function isInRect(o1,do1,o2,do2){//o* = ponto-inicio
    return((o1>0&&o1<do1)&&(o2>0&&o2<do2));
}
function testRecCollision(o,P,Origin,x,y,z,height,length){
    let enter = undefined;
    let l_normal = auxVec3_create(0,0,0);
    if(P.unit[x]<0){
        enter = o.end[x];
        l_normal[x] = 1;
    }else if(P.unit[x]>0){
        enter = o.origin[x];
        l_normal[x] = -1;
    }else{
        //remain undefined
    }
    let point_x = undefined;
    if (enter){
        point_x = vec3.create();
        vec3.scale(point_x,P.unit,(enter-Origin[x])/P.unit[x]);
        if(isInRect(point_x[y]-o.origin[y],point_x[z]-o.origin[z],height,length)){
            return {obj:o,dist:vec3.length(point_x),normal:l_normal};//[[TODO]]tem erro aqui, esse dist ta errado
        }
    }
    return false;

}