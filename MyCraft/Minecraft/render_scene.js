//LAB 7


var canvas;       // HTML 5 canvas
var gl;           // webgl graphics context
var vPosition;    // shader variable attrib location for vertices 
var vColor;       // shader variable attrib location for color
var vNormal;
var vTexCoords;
var uColor;       // shader uniform variable location for color
var uProjection;  //  shader uniform variable for projection matrix
var uModel_view;  //  shader uniform variable for model-view matrix
var uLight_position;
var uTexture;
var uColorMode;

var program;
var camera = new Camera(); 
var stack = new MatrixStack();
var lighting = new Lighting();
var lighting2 = new Lighting();
var lightAngle = 0;

var gAxeH = 1;
var chestH = 2;
var sky;
var rock;
var fire;
var chest;

var wood;
var leaves_oak;
var cobblestone;
var grass_top;
var background;   
var diamond_pickaxe;
var dirt;
var minecraftCubes = [];
var axeAngle = 0;
var voxel = [];
var tools = [];

var throwDist = vec4(0,0,0,0);

window.onload = function init()
{   
    //set Event Handlers
    setKeyEventHandler();
    setMouseEventHandler();
    setUpVoxel();
    tools[toolNum] = true;
    
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.309, 0.505, 0.74, 1.0);
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    shaderSetup();
    
    Shapes.initShapes();  // create the primitive and other shapes    
    
    lighting.setUp();

    wood = new ImageTexture("textures/wood.png");
    leaves_oak = new ImageTexture("textures/leaves_oak.png");
    cobblestone = new ImageTexture("textures/cobblestone_mossy.png");
    grass_top = new ImageTexture("textures/grass_top.png");
    background = new ImageTexture("textures/background.png");
    diamond_pickaxe = new ImageTexture("textures/diamond_pickaxe.png");
    dirt = new ImageTexture("textures/dirt.png");
    
    sky = new ImageTexture("textures/sky.png");
    rock = new ImageTexture("textures/bedrock.png");
    fire = new ImageTexture("textures/Fire.png");
    chest = new ImageTexture("textures/Chest.png");

    drawTree(24,2,24);
    drawTree(16,2,16);
    drawTree(24,2,16);
    drawTree(16,2,24);
    drawTreasure(20,2,20);
    drawGround();

    render();
};

/**
 *  Load shaders, attach shaders to program, obtain handles for 
 *  the attribute and uniform variables.
 * @return {undefined}
 */
function shaderSetup() {
    //  Load shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // get handles for shader attribute variables. 
    // We will need these in setting up buffers.
    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation(program, "vNormal");
    vColor = gl.getAttribLocation(program, "vColor");
    vTexCoords = gl.getAttribLocation(program, "vTexCoords"); // we won't use vertex here
                            // colors but we keep it in for possible use later.
   
    // get handles for shader uniform variables: 
    uColor = gl.getUniformLocation(program, "uColor");  // uniform color
    uColorMode = gl.getUniformLocation(program, "uColorMode");  // uniform color mode
    uProjection = gl.getUniformLocation(program, "uProjection"); // projection matrix
    uModel_view = gl.getUniformLocation(program, "uModel_view"); // model-view matrix
    uTexture = gl.getUniformLocation(program, "uTexture");
    
}    

function setUpVoxel() {
    //render chunks
    //max X
    for(i = 0; i < 50; i++) {
        voxel[i] = [];
        //max Y
        for(j = 0; j < 10; j++) {
            voxel[i][j] = [];
            //max Z
            for(k = 0; k < 50; k++) {
                voxel[i][j][k] = "air";
            }
        }
    }
    
}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var projMat = camera.calcProjectionMat();   // Projection matrix  
    gl.uniformMatrix4fv(uProjection, false, flatten(projMat));
    
    var viewMat = camera.calcViewMat();   // View matrix

    stack.clear();
    
    //lighting
    gl.uniform4fv(uLight_position, vec4(0,-0.5,-1,1));
    
    //draw pointer
    stack.push();
    stack.multiply(translate(0,-0.5,-5));
    stack.multiply(scalem(0.05,0.05,0.05));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1f(uColorMode, 1.0);
    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to red
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
    
    //draw tool
    stack.push();
    stack.multiply(translate(throwDist[0],throwDist[1],throwDist[2]));
    stack.multiply(translate(2,-2,-3));
    stack.multiply(rotateY(-110));
    stack.multiply(rotateZ(axeAngle));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    drawTool();
    stack.pop();
    
    stack.multiply(viewMat);
    
    if(!pickedUpGoldPickaxe) {
        //draw treasure pickaxe
        stack.push();
        stack.multiply(translate(20, gAxeH, 20));
        stack.multiply(scalem(.5, .5, .5));
        gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
        drawPickaxe(vec4(1, 0.65, 0, 1.0), vec4(1, 0.7, 0, 1.0));
        stack.pop();
    }
    
    //draw Sky Box
    stack.push();
    stack.multiply(translate(0, -10, 0));
    stack.multiply(scalem(270, 270, 270));
    stack.multiply(rotateX(90)); 
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1f(uColorMode, 2.0);
    sky.activate();
    Shapes.drawPrimitive(Shapes.cone);
    stack.pop();
    
    //draw array loop for all cubes
    for (i = 0; i < minecraftCubes.length; i++) { 
        var temp = minecraftCubes[i];
        drawCube(temp.x, temp.y, temp.z, temp.texture);
    }
    
    //light
    var lpos2 = mult(viewMat, lighting2.light_position);
    gl.uniform4fv(uLight_position, lpos2);
    
}

function drawTreasure(x,y,z) {
    var temp = true;
    var g = new MinecraftCube(x,y,z,chest,temp);
    minecraftCubes.push(g);
}

function drawTool() {
    if(tools[0] === true) {
        drawPickaxe(vec4(0.4, 0.4, 0.4, 1.0), vec4(0.2, 0.2, 0.2, 1.0));
    } else if(tools[1] === true) {
        drawPickaxe(vec4(1, 0.65, 0, 1.0), vec4(1, 0.7, 0, 1.0));
    }
}

function drawTree(x,y,z){
    
    pushCube(x,y,z,dirt);
    pushCube(x,(y+2),z,dirt);

    pushCube((x-2),(y+4),(z-2),leaves_oak);
    pushCube((x-2),(y+4),z,leaves_oak);
    pushCube((x-2),(y+4),(z+2),leaves_oak);

    pushCube(x,(y+4),(z-2),leaves_oak);
    pushCube(x,(y+4),z,leaves_oak);
    pushCube(x,(y+4),(z+2),leaves_oak);

    pushCube((x+2),(y+4),(z-2),leaves_oak);
    pushCube((x+2),(y+4),z,leaves_oak);
    pushCube((x+2),(y+4),(z+2),leaves_oak);

    pushCube((x-2),(y+6),(z-2),leaves_oak);
    pushCube((x-2),(y+6),z,leaves_oak);
    pushCube((x-2),(y+6),(z+2),leaves_oak);

    pushCube(x,(y+6),(z-2),leaves_oak);
    pushCube(x,(y+6),z,leaves_oak);
    pushCube(x,(y+6),(z+2),leaves_oak);

    pushCube((x+2),(y+6),(z-2),leaves_oak);
    pushCube((x+2),(y+6),z,leaves_oak);
    pushCube((x+2),(y+6),(z+2),leaves_oak);
    
    pushCube((x-2),(y+8),z,leaves_oak);
    pushCube(x,(y+8),(z-2),leaves_oak);
    pushCube(x,(y+8),z,leaves_oak);
    pushCube(x,(y+8),(z+2),leaves_oak);
    pushCube((x+2),(y+8),z,leaves_oak);
    pushCube(x,(y+10),z,leaves_oak);
    
}

function drawGround() {
    for (i = 0; i < 20; i++) { 
        for (j = 0; j < 20; j++) { 
                pushCube(i*2,0,j*2, grass_top);
        }
    }
}

function drawCube(x,y,z,texture) {  
    
    stack.push();
    stack.multiply(translate(x,y,z));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1f(uColorMode, 2.0);
    texture.activate();
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
}

function pushCube(x,y,z,texture) {
    var temp = false;
    var g = new MinecraftCube(x,y,z,texture,temp);
    minecraftCubes.push(g);
}

function drawPickaxe(colorLeft, colorRight){

    //handle
    stack.push();
    stack.multiply(scalem(.2, 2, .3));
    stack.multiply(translate(0, 0, 0));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1f(uColorMode, 1.0);
    gl.uniform4fv(uColor, vec4(0.6, 0.4, 0.3, 1.0));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
    
    //left axe
    stack.push();
    stack.multiply(scalem(.7, .2, .5));
    stack.multiply(translate(-1, 10, 0));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1f(uColorMode, 1.0);
    gl.uniform4fv(uColor, colorLeft);
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
    
    //right pick
    stack.push();
    stack.multiply(scalem(2.3, .5, .5));
    stack.multiply(translate(0, 3.6, 0));
    stack.multiply(rotateY(-90));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    gl.uniform1f(uColorMode, 1.0);
    gl.uniform4fv(uColor, colorRight);
    Shapes.drawPrimitive(Shapes.cone);
    stack.pop();
    
    
}



