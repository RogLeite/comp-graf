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

var prot_Cube = {
    model:mat4.create(),
    makeModel:function(translation){
        mat4.identity(this.model);
        mat4.translate(this.model,this.model,translation);
    },
    draw:function(gl,view,proj){
        let mvp = mat4.create();
        mat4.multiply(mvp,view,this.model);
        mat4.multiply(mvp,proj,mvp);
        gl.uniformMatrix4fv(program.mvpUniform, false, mvp);
        //Desenhar
        gl.drawElements(gl.TRIANGLES, Cube.indices.length, gl.UNSIGNED_SHORT, 0);
    },
};
function Cube(translation){
    this.makeModel(translation);
    
}
Cube.prototype = prot_Cube;

Cube.bindVertexArray=function(gl){

    gl.bindVertexArray(this.vao);

};
Cube.vertices = [
    -1.0, -1.0, +1.0,
    +1.0, -1.0, +1.0,
    -1.0, +1.0, +1.0,
    +1.0, +1.0, +1.0,
    -1.0, +1.0, -1.0,
    +1.0, +1.0, -1.0,
    -1.0, -1.0, -1.0,
    +1.0, -1.0, -1.0
    ];
Cube.vertices.size = 3;
Cube.indices = [
    0, 1, 2,
    2, 1, 3,
    2, 3, 4,
    4, 3, 5,
    4, 5, 6,
    6, 5, 7,
    6, 7, 0,
    0, 7, 1,
    1, 7, 3,
    3, 7, 5,
    6, 0, 4,
    4, 0, 2
    ];
Cube.color = [
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0
    ];
Cube.color.size = 3;
Cube.create = function(gl){
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

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
