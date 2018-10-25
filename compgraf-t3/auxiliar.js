
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