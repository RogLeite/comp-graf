
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

function isInRect(ox,oy,o1,o2,do1,do2){//o* = ponto-inicio
    return((ox>=o1&&ox<=o1+do1)&&(oy>=o2&&oy<=o2+do2));
}
function testRecCollision(o,pnt,Origin,i,j,k,height,length){
    let enter = undefined;
    let l_normal = auxVec3_create(0,0,0);
    if(pnt.unit[i]<0){
        enter = o.end;
        l_normal[i] = 1;
    }else if(pnt.unit>0){
        enter = o.origin;
        l_normal[i] = -1;
    }else{
        //remain undefined
    }
    let point_i = undefined;
    if (enter){
        point_i = vec3.create();
        vec3.scale(point_i,pnt.unit,(enter[i]-Origin[i])/pnt.unit[i]);
        if(isInRect(point_i[j]+Origin[j],point_i[k]+Origin[k],o.origin[j],o.origin[k],height,length)){
            return {obj:o,dist:pnt.getT(point_i),normal:l_normal};
        }
    }
    return false;

}