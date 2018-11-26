//Obtem o canvas, definido no .html
var canvas = document.getElementById("canvas");

//Usada para acessar as funcoes da OpenGL.
var gl;

//Um programa (conjunto de shaders) para ser executado na placa
var program;

var program_vertex_light;
var program_fragment_light;


//Encapsula um conjunto de definicoes sobre um objeto.

//Matrizes de transformacao.
var view, proj;

//solidos em cena
var solids = [];

//lights emcena
var lights = [];



//Posições da câmera
var eye = [-10,10,-10];
var center = [0,0,0];
var up = [0,1,0];

var ambient = vec3.fromValues(0.2,0.2,0.2);
var specular = vec3.fromValues(1,1,1);
var specularn = 40.0//float


//modo de iluminação
const vertex_lighting = "Troca para Fragment Lighting";
const fragment_lighting = "Troca para Vertex Lighting";
var mode = vertex_lighting;
function onClick(event){

	//alert("Mode Toggled");
	if(mode === vertex_lighting){
        mode = fragment_lighting;
        event.target.innerText = fragment_lighting;
        program = program_fragment_light;
	}else if(mode === fragment_lighting){
        mode = vertex_lighting;
        event.target.innerText = vertex_lighting;
        program = program_vertex_light;
	}
    gl.useProgram(program);
    initScene();
    redraw();
}

function onLoad(){

    //Inicializar o contexto WebGL
    initGL();

    //Criar um programa (conjunto de shaders) WebGL
    initProgram("vertexShaderSrc","fragmentLightingShaderSrc");
    program_fragment_light = program;
    
    initProgram("vertexLightingShaderSrc","fragmentShaderSrc");
    program_vertex_light = program;
    

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

	
function initProgram(vertexname,fragname){
    //Criar e compilar os shaders
    var vertexShaderSrc = document.getElementById(vertexname).text;
    var fragmentShaderSrc = document.getElementById(fragname).text;
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
    console.log("vertexPos index = "+program.vertexPosAttr);
    program.vertexColorAttr = gl.getAttribLocation(program, "color");
    //console.log("vertexColor index = "+program.vertexColorAttr);
    program.vertexNormalAttr = gl.getAttribLocation(program,"vertexNormal");
    console.log("vertexnormal index = "+program.vertexNormalAttr);
    program.modelUniform = gl.getUniformLocation(program,"model");
    program.vpUniform = gl.getUniformLocation(program,"vp");
    program.mvpUniform = gl.getUniformLocation(program, "mvp");
    program.lightPosUniform = gl.getUniformLocation(program, "lightpos");
    program.lightValUniform = gl.getUniformLocation(program, "lightval");
    program.ambientUniform = gl.getUniformLocation(program, "ambient");
    program.eyeUniform = gl.getUniformLocation(program, "eye");
    program.specularUniform = gl.getUniformLocation(program, "specular");
    program.specularnUniform = gl.getUniformLocation(program, "specularn");
}

function initScene(){
    //Definir as matrizes de view e projection
    view = mat4.create();
    proj = mat4.create();
    mat4.lookAt(view, eye, center, up);
    mat4.perspective(proj, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);


    var light1 = new class_Light()
    light1.name = "light1";
    light1.origin = [30.0,120.0,-25.0];
    light1.RGB_intensity = [0.9,0.9,0.9];
    lights.push(light1);

    solids = [];

    //Criar a classe cubo e cria instâncias desse
    Cube.create(gl);
    /* 
    for( let x = -5; x <= 5; x+=5 )
    {
        for( let z = -5; z <= 5; z+=5)
        {
            let temp_cube = new Cube([x,0,z]);
            solids.push(temp_cube);
        }
    }
 */
    
}






function redraw(){
    //Definir tamanho e limpar a janela
    gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.uniform3fv(program.lightPosUniform,lights[0].origin);
    gl.uniform3fv(program.flightPosUniform,lights[0].origin);
    gl.uniform3fv(program.lightValUniform,lights[0].RGB_intensity);
    gl.uniform3fv(program.flightValUniform,lights[0].RGB_intensity);
    gl.uniform3fv(program.ambientUniform,ambient);
    gl.uniform3fv(program.eyeUniform,eye);
    gl.uniform3fv(program.specularUniform,specular);
    gl.uniform1f(program.specularnUniform,specularn);
    
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
            let q = quat.create();
            let temp_cube = new Cube([x,0,z],quat.fromEuler(q,0,49,20),[1.2,1,1]);
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
