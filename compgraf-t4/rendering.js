//Obtem o canvas, definido no .html
var canvas = document.getElementById("canvas");

//Usada para acessar as funcoes da OpenGL.
var gl;

//Um programa (conjunto de shaders) para ser executado na placa
var program;

//Encapsula um conjunto de definicoes sobre um objeto.

//Matrizes de transformacao.
var view, proj;

//solidos em cena
var solids = [];

//lights emcena
var lights = [];

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
    var vertexShaderSrc = document.getElementById("vertexLightingShaderSrc").text;
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
    program.vertexColorAttr = gl.getAttribLocation(program, "color");
    program.vertexNormalAttr = gl.getAttribLocation(program, "vertexNormal");
    console.log("vertexnormal index = "+program.vertexNormalAttr);
    program.mvpUniform = gl.getUniformLocation(program, "mvp");
    program.lightPosUniform = gl.getUniformLocation(program, "lightpos");
    program.flightPosUniform = gl.getUniformLocation(program, "flightpos");
    program.lightValUniform = gl.getUniformLocation(program, "lightval");
    program.flightValUniform = gl.getUniformLocation(program, "flightval");
    program.vpUniform = gl.getUniformLocation(program,"vp");
    program.modelUniform = gl.getUniformLocation(program,"model");
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


    var light1 = new class_Light()
    light1.name = "light1";
    light1.origin = [60.0,120.0,50.0];
    light1.RGB_intensity = [0.8,0.8,0.8];
    lights.push(light1);
    //[[TODO]] - Implementar a Luz

    solids = [];

    //Criar a classe cubo e cria instâncias desse
    Cube.create(gl);
    for( let x = -5; x <= 5; x+=5 )
    {
        for( let z = -5; z <= 5; z+=5)
        {
            let temp_cube = new Cube([x,0,z]);
            solids.push(temp_cube);
        }
    }

    
}






function redraw(){
    //Definir tamanho e limpar a janela
    gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.uniform3fv(program.lightPosUniform,lights[0].origin);
    gl.uniform3fv(program.flightPosUniform,lights[0].origin);
    gl.uniform3fv(program.lightValUniform,lights[0].RGB_intensity);
    gl.uniform3fv(program.flightValUniform,lights[0].RGB_intensity);
    
    let vp = mat4.create();
    mat4.multiply(vp,proj,view);
    gl.uniformMatrix4fv(program.vpUniform,false,vp);
    /* 
    let testvector = auxVec3_create(1,1,1);
    vec3.normalize(testvector,testvector);
    console.log("testvector: "+testvector);
    console.log("testvector[x] * 3**1/2= "+testvector[0]*(3**(1/2)));
    console.log("testvector.length"+vec3.length(testvector)); */
    //Desenhar os cubos em diferentes posições
    Cube.bindVertexArray(gl);

    for( let x = -5; x <= 5; x+=5 )
    {
        for( let z = -5; z <= 5; z+=5)
        {
            let temp_cube = new Cube([x,0,z]);
            temp_cube.draw(gl,view,proj);
        }
    }
/*     for(let i=0;i<solids.length;i++){
        solids[i].draw(gl,view,proj);
    }
 */
    /* solids.forEach(
        function (elem){
            elem.draw(gl,view,proj);
            return true;
        }
    ); */

    //Desabilitar buffers habilitados
    gl.bindVertexArray(null);
}
