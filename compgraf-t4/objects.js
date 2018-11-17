
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
    gl.vertexAttribPointer(program.vertexPosAttr,3,gl.FLOAT,false,0,0);

    //Criar VBO para cores, linkar e copiar os dados
    this.vboColor = gl.createBuffer();
    //Define buffer como corrente.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
    //Aloca buffer e copia dados.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
    //Habilita atributo desejado do vertice.
    gl.enableVertexAttribArray(program.vertexColorAttr);
    //Diz que os atributos estao no buffer corrente.
    gl.vertexAttribPointer(program.vertexColorAttr,3,gl.FLOAT,false,0,0);

    //Criar EBO, linkar e copiar os dados
    this.EBO = gl.createBuffer();
    //Define o buffer como corrente e o define como buffer de elementos.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
    //Aloca buffer e copia dados.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

};