var _TOINDICES = "GOTO INDICES";
var _TOVERTICES = "GOTO VERTICES";
var btn_switch = document.getElementById("btn_switch");
var canvas = document.getElementById('my_Canvas');
var gl = canvas.getContext('experimental-webgl');

function onLoad(evt){
    if(btn_switch.textContent === _TOINDICES){
        drawByVectices();
    }else if(btn_switch.textContent === _TOVERTICES){
        drawByIndices();
    }
}

function onClick(event){
    let txt = btn_switch.textContent;
    if(txt===_TOINDICES){
        btn_switch.textContent = _TOVERTICES;
    }else if(txt === _TOVERTICES){
        btn_switch.textContent = _TOINDICES;
    }
    console.log(btn_switch.textContent);
    onLoad(event);
}



function drawByVectices(){

    /* Step2: Define the geometry and store it in buffer objects */

    var vertices = [
        -0.5, 0.5,
        -0.5, -0.5,
        0.0, -0.5,
        0.0, 0.5,
        ];

    // Create a new buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
    // Pass the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    var indices = [
        1,2,3,
        1,3,4,
    ];
    // Create a new buffer object
    var indices_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buffer);
    
    // Pass the indices data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    


    /* Step3: Create and compile Shader programs */

    // Vertex shader source code
    var vertCode =
    'attribute vec2 coordinates;' + 
    'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 1.0);' + '}';

    //Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    //Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    //Compile the vertex shader
    gl.compileShader(vertShader);

    //Fragment shader source code
    var fragCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragment shader
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader); 
    
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    /* Step 4: Associate the shader programs to buffer objects */

    //Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    //Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    //Enable the attribute
    gl.enableVertexAttribArray(coord);

    /* Step5: Drawing the required object (triangle) */

    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST); 
    
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawByIndices(){


    /* Step2: Define the geometry and store it in buffer objects */

    var vertices = [
        -0.5, 0.5,
        -0.5, -0.5,
        0.0, -0.5,
        0.0, 0.5,
        0.75,0.75,
        ];

    // Create a new buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
    // Pass the vertices data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    var indices = [
        0,1,2,
        0,2,4,
    ];
    // Create a new buffer object
    var indices_buffer = gl.createBuffer();

    // Bind an empty array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buffer);
    
    // Pass the indices data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    


    /* Step3: Create and compile Shader programs */

    // Vertex shader source code
    var vertCode =
    'attribute vec2 coordinates;' + 
    'void main(void) {' + ' gl_Position = vec4(coordinates,0.0, 1.0);' + '}';

    //Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    //Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);

    //Compile the vertex shader
    gl.compileShader(vertShader);

    //Fragment shader source code
    var fragCode = 'void main(void) {' + 'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' + '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragment shader
    gl.compileShader(fragShader);

    // Create a shader program object to store combined shader program
    var shaderProgram = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader); 
    
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);

    // Link both programs
    gl.linkProgram(shaderProgram);

    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    /* Step 4: Associate the shader programs to buffer objects */
    
    /**Bind Vertex buffer */

    //Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    
    //Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    
    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    
    //Enable the attribute
    gl.enableVertexAttribArray(coord);
    
    /*Bind Indices buffer */
    
    //Bind vertex buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices_buffer);


    /* Step5: Drawing the required object (triangle) */

    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST); 
    
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawElements(gl.TRIANGLE_FAN, 6, gl.UNSIGNED_SHORT, 0);
}