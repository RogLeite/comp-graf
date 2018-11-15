//Obtem o canvas, definido no .html
var canvas = document.getElementById("canvas");

//Usada para acessar as funcoes da OpenGL.
var gl;

//Um programa (conjunto de shaders) para ser executado na placa
var program;

//Encapsula um conjunto de definicoes sobre um objeto.
var vao;

//Matrizes de transformacao.
var view, proj;

function onLoad(){

    //Inicializar o contexto WebGL
    initGL();

    //Criar um programa (conjunto de shaders) WebGL
    initProgram();

    //Inicializar a cena
    initScene();

    //Desenhar a cena
    redraw();
}

function initGL(){
    //Obter contexto para o WebGL
    try 
	{
		//Obtem o contexto do canvas para webgl2.
        gl = canvas.getContext("webgl2");
		
		//Habilita o zuffer.
        gl.enable(gl.DEPTH_TEST);
		
		//Define cor de fundo.
		gl.clearColor( 0, 0, 0, 1);
		
		//Salva as dimensões do canvas.
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) 
	{
    }

    if (!gl) 
	{
        alert("could not initialise WebGL");
    }
}


function createShader(shaderSource, shaderType){
    //Criar o objeto shader
    var shader = gl.createShader(shaderType);

    //Setar o código fonte
    gl.shaderSource(shader, shaderSource);

    //Compilar o shader
    gl.compileShader(shader);

    //Verificar se foi compilado com sucesso
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
		var info = gl.getShaderInfoLog( shader );
		throw 'Could not compile WebGL program. \n\n' + info;
    }

    //Retornar o shader
    return shader;
}

	
function initProgram(){
    //Criar e compilar os shaders
    var vertexShaderSrc = document.getElementById("vertexShaderSrc").text;
    var fragmentShaderSrc = document.getElementById("fragmentShaderSrc").text;
    var vertexShader = createShader(vertexShaderSrc,gl.VERTEX_SHADER);
    var fragmentShader = createShader(fragmentShaderSrc,gl.FRAGMENT_SHADER);

    //Criar o programa e linkar
    program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
       var info = gl.getProgramInfoLog(program);
	   throw 'Could not compile WebGL program. \n\n' + info;
    }

    //Usar o programa
    gl.useProgram(program);

    //Criar propriedades no programa guardando uniformes e atributos para uso posterior
    program.vertexPosAttr = gl.getAttribLocation(program,"vertexPos");
    program.mvpUniform = gl.getUniformLocation(program, "mvp");
    program.vertexColorAttr = gl.getAttribLocation(program, "color");
}

function initScene(){
    //Posições da câmera
    var eye = [-10,10,-10];
    var center = [0,0,0];
    var up = [0,1,0];

    //Definir as matrizes de view e projection
    view = mat4.create();
    proj = mat4.create();
    mat4.lookAt(view, eye, center, up);
    mat4.perspective(proj, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

    //Criar o objeto
    createCube();
}


function createCube(){
    //Definir vértices e índices
    var vertices = [
      -1.0, -1.0, +1.0,
      +1.0, -1.0, +1.0,
      -1.0, +1.0, +1.0,
      +1.0, +1.0, +1.0,
      -1.0, +1.0, -1.0,
      +1.0, +1.0, -1.0,
      -1.0, -1.0, -1.0,
      +1.0, -1.0, -1.0
    ];

    var indices = [
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

    var color = [
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,
      1.0, 0.0, 0.0
    ];

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    //Criar VBO dos vertices, linkar e copiar os dados
    var vertexVBO = gl.createBuffer();
	//Define buffer como corrente.
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexVBO);
	//Aloca buffer e copia dados.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	//Habilita atributo desejado do vertice.
    gl.enableVertexAttribArray(program.vertexPosAttr);
	//Diz que os atributos estao no buffer corrente.
    gl.vertexAttribPointer(program.vertexPosAttr,3,gl.FLOAT,false,0,0);

    //Criar VBO para cores, linkar e copiar os dados
    var vboColor = gl.createBuffer();
	//Define buffer como corrente.
    gl.bindBuffer(gl.ARRAY_BUFFER, vboColor);
	//Aloca buffer e copia dados.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
	//Habilita atributo desejado do vertice.
    gl.enableVertexAttribArray(program.vertexColorAttr);
	//Diz que os atributos estao no buffer corrente.
    gl.vertexAttribPointer(program.vertexColorAttr,3,gl.FLOAT,false,0,0);

    //Criar EBO, linkar e copiar os dados
    var EBO = gl.createBuffer();
	//Define o buffer como corrente e o define como buffer de elementos.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
	//Aloca buffer e copia dados.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
}



function redraw(){
    //Definir tamanho e limpar a janela
    gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindVertexArray(vao);

    //Desenhar os objetos em diferentes posições
    var model = mat4.create();
    var modelView = mat4.create();
    var mvp = mat4.create();
    for( let x = -5; x <= 5; x+=5 )
    {
        for( let z = -5; z <= 5; z+=5)
        {
            mat4.identity(model);
            mat4.translate(model,model,[x,0,z]);

            mat4.multiply(modelView,view,model);
            mat4.multiply(mvp,proj,modelView);

            gl.uniformMatrix4fv(program.mvpUniform, false, mvp);

            //Desenhar
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        }
    }

    //Desabilitar buffers habilitados
      gl.bindVertexArray(null);
}
