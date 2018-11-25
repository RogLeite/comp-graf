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
const n_comp = 3**(-1/2);//componentof the normalized (1,1,1) vector
var prot_Cube = {
    model:mat4.create(),
    makeModel:function(translation,rotation,scaling){
        mat4.identity(this.model);
        if(rotation&&scaling){
            mat4.fromRotationTranslationScale(this.model, rotation, translation, scaling);
        }
        else{
            mat4.translate(this.model,this.model,translation);
        }
    },
    draw:function(gl,view,proj){
        let mvp = mat4.create();
        mat4.multiply(mvp,view,this.model);
        mat4.multiply(mvp,proj,mvp);
        gl.uniformMatrix4fv(program.mvpUniform, false, mvp);
        gl.uniformMatrix4fv(program.modelUniform,false,this.model);
        
        //Desenhar
        gl.drawElements(gl.TRIANGLES, Cube.indices.length, gl.UNSIGNED_SHORT, 0);
    },
};
/* 
function Cube(translation){
    this.makeModel(translation);
    
}
 */
function Cube(translation,rotation,scaling){
    this.makeModel(translation,rotation,scaling);
    
}
Cube.prototype = prot_Cube;

Cube.bindVertexArray=function(gl){

    gl.bindVertexArray(this.vao);

};
Cube.vertices = [
    -1.0, -1.0, +1.0,//0//0
    -1.0, -1.0, +1.0,//1
    -1.0, -1.0, +1.0,//2
    -1.0, -1.0, +1.0,//3
    -1.0, -1.0, +1.0,//4
    +1.0, -1.0, +1.0,//5//1
    +1.0, -1.0, +1.0,//6
    +1.0, -1.0, +1.0,//7
    +1.0, -1.0, +1.0,//8
    -1.0, +1.0, +1.0,//9//2
    -1.0, +1.0, +1.0,//10
    -1.0, +1.0, +1.0,//11
    -1.0, +1.0, +1.0,//12
    +1.0, +1.0, +1.0,//13//3
    +1.0, +1.0, +1.0,//14
    +1.0, +1.0, +1.0,//15
    +1.0, +1.0, +1.0,//16
    +1.0, +1.0, +1.0,//17
    -1.0, +1.0, -1.0,//18//4
    -1.0, +1.0, -1.0,//19
    -1.0, +1.0, -1.0,//20
    -1.0, +1.0, -1.0,//21
    -1.0, +1.0, -1.0,//22
    +1.0, +1.0, -1.0,//23//5
    +1.0, +1.0, -1.0,//24
    +1.0, +1.0, -1.0,//25
    +1.0, +1.0, -1.0,//26
    -1.0, -1.0, -1.0,//27//6
    -1.0, -1.0, -1.0,//28
    -1.0, -1.0, -1.0,//29
    -1.0, -1.0, -1.0,//30
    +1.0, -1.0, -1.0,//31//7
    +1.0, -1.0, -1.0,//32
    +1.0, -1.0, -1.0,//33
    +1.0, -1.0, -1.0,//34
    +1.0, -1.0, -1.0//35
];
Cube.vertices.size = 3;
Cube.color = [
    1.0, 1.0, 1.0,//0
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,//1
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,//2
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,//3
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 0.0, 0.0,//4
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,//5
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,//6
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,//7
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0
    ];
Cube.color.size = 3;
Cube.normals = [
    0.0,0.0,+1.0,//0//0
    0.0,-1.0,0.0,//1
    0.0,-1.0,0.0,//2
    -1.0,0.0,0.0,//3
    -1.0,0.0,0.0,//4
    0.0,0.0,+1.0,//5//1
    0.0,0.0,+1.0,//6
    0.0,-1.0,0.0,//7
    +1.0,0.0,0.0,//8
    0.0,0.0,+1.0,//9//2
    0.0,0.0,+1.0,//10
    0.0,+1.0,0.0,//11
    -1.0,0.0,0.0,//12
    0.0,0.0,+1.0,//13//3
    0.0,+1.0,0.0,//14
    0.0,+1.0,0.0,//15
    +1.0,0.0,0.0,//16
    +1.0,0.0,0.0,//17
    0.0,+1.0,0.0,//18//4
    0.0,+1.0,0.0,//19
    0.0,0.0,-1.0,//20
    -1.0,0.0,0.0,//21
    -1.0,0.0,0.0,//22
    0.0,+1.0,0.0,//23//5
    0.0,0.0,-1.0,//24
    0.0,0.0,-1.0,//25
    +1.0,0.0,0.0,//26
    0.0,0.0,-1.0,//27//6
    0.0,0.0,-1.0,//28
    0.0,-1.0,0.0,//29
    -1.0,0.0,0.0,//30
    0.0,0.0,-1.0,//31//7
    0.0,-1.0,0.0,//32
    0.0,-1.0,0.0,//33
    +1.0,0.0,0.0,//34
    +1.0,0.0,0.0,//35
];
Cube.indices = [
    0, 5, 9,//normais 0.0,0.0,+1.0,
    10, 6, 13,//normais[0,0,+1.0]
    11, 14, 18,//normais 0.0,+1.0,0.0,
    19, 15, 23,//normais 0.0,+1.0,0.0,
    20, 24, 27,//normais 0.0,0.0,-1.0,
    28, 25, 31,//normais 0.0,0.0,-1.0,
    29, 32, 1,//normais 0.0,-1.0,0.0,
    2, 33, 7,//normais 0.0,-1.0,0.0,
    8, 34, 16,//normais +1.0,0.0,0.0,
    17, 35, 26,//normais +1.0,0.0,0.0,
    30, 3, 21,//normais -1.0,0.0,0.0,
    22, 4, 12//normais -1.0,0.0,0.0,
    ];
Cube.create = function(gl){
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    //Criar VBO dos vertices, linkar e copiar os dados
    this.vertexVBO = undefined;
    auxCreateArrayBuffer(gl,this.vertexVBO,this.vertices,program.vertexPosAttr);

    /* 
    //Criar VBO dos vertices, linkar e copiar os dados
    this.vertexVBO = gl.createBuffer();
    //Define buffer como corrente.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexVBO);
    //Aloca buffer e copia dados.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    //Habilita atributo desejado do vertice.
    gl.enableVertexAttribArray(program.vertexPosAttr);
    //Diz que os atributos estao no buffer corrente.
    gl.vertexAttribPointer(program.vertexPosAttr,this.vertices.size,gl.FLOAT,false,0,0);
 */
    //Criar VBO para cores, linkar e copiar os dados
    this.vboColor = undefined;
    auxCreateArrayBuffer(gl,this.vboColor,this.color,program.vertexColorAttr);
        
    /* 
    //Criar VBO para cores, linkar e copiar os dados
    this.vboColor = gl.createBuffer();
    //Define buffer como corrente.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
    //Aloca buffer e copia dados.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
    //Habilita atributo desejado do vertice.
    gl.enableVertexAttribArray(program.vertexColorAttr);
    //Diz que os atributos estao no buffer corrente.
    gl.vertexAttribPointer(program.vertexColorAttr,this.color.size,gl.FLOAT,false,0,0);
 */

    //Criar VBO para normais, linkar e copiar os dados
    this.vboNormal = undefined;
    auxCreateArrayBuffer(gl,this.vboNormal,this.normals,program.vertexNormalAttr);
        
    //Criar EBO, linkar e copiar os dados
    this.EBO = gl.createBuffer();
    //Define o buffer como corrente e o define como buffer de elementos.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
    //Aloca buffer e copia dados.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

};

const prot_Light = {
    name:"prot_Light",
    scene:undefined,
    origin:STD.origin,
    RGB_intensity:STD.light,
};
function class_Light(){
    
}
class_Light.prototype = prot_Light;
