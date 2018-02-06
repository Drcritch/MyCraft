/** Build and Draw Primitive Shapes
 * 
 * Global Variables:
 *   gl: the webgl graphics context.
 *   vPosition: shader variable location for vertex position attribute
 *   vColor: shader variable location for color attribute
 */

var Shapes = {};   // set up Shapes namespace

Shapes.cube = new Cube();  
Shapes.axis = new Axis();
Shapes.disk = new Disk(32);
Shapes.cone = new Cone(36); 
Shapes.cylinder = new Cylinder(96);
Shapes.character = new Character();
//Shapes.helicopter = new Helicopter();

// TO DO: ADD OTHER SHAPES

Shapes.initShapes = function () {
    
    Shapes.initBuffers(Shapes.cube);
    Shapes.initBuffers(Shapes.disk);
    Shapes.initBuffers(Shapes.cone);
    Shapes.initBuffers(Shapes.cylinder);
    
    // TO DO: ADD OTHER SHAPES
    Shapes.axis.initBuffer();
};


Shapes.initBuffers = function (primitive) {

    // SET UP ARRAY BUFFER FOR VERTICES 
    ////////////////////////////////////////////////////////////
    primitive.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(primitive.vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // done with this buffer


    // SET UP ARRAY BUFFER FOR VERTEX COLORS 
    ////////////////////////////////////////////////////////////
    primitive.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(primitive.colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // done with this buffer
    
    // SET UP ARRAY BUFFER FOR NORMALS 
    ////////////////////////////////////////////////////////////
    primitive.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(primitive.normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // done with this buffer
    
    // SET UP ARRAY BUFFER FOR TEXTURES 
    ////////////////////////////////////////////////////////////
    primitive.texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(primitive.texCoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // done with this buffer

    // CALCULATE EDGES FROM THE VERTICES FOR SHAPE OUTLINES 
    // Don't need to do this unless you want an outline 
    /*var edges = [];
    for (var i = 0; i < primitive.numTriangles; i++) {
        edges.push(primitive.vertices[i * 3 + 0]);
        edges.push(primitive.vertices[i * 3 + 1]);
        edges.push(primitive.vertices[i * 3 + 1]);
        edges.push(primitive.vertices[i * 3 + 2]);
        edges.push(primitive.vertices[i * 3 + 2]);
        edges.push(primitive.vertices[i * 3 + 0]);
    }

    primitive.numEdgeVertices = edges.length;


    primitive.edgeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.edgeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(edges), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  // done with this buffer

    // SET UP ARRAY BUFFER FOR EDGE COLORS 
    ////////////////////////////////////////////////////////////
    var edgeColors = [];
    for (var i = 0; i < edges.length; i++) {
        edgeColors.push([0.0, 0.0, 0.0, 1.0]);
    }


    primitive.edgeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.edgeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(edgeColors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // done with this buffer
    */
}

Shapes.drawPrimitive = function (primitive) {

    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.vertexBuffer);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.colorBuffer);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.normalBuffer);
    gl.enableVertexAttribArray(vNormal);
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.texBuffer);
    gl.enableVertexAttribArray(vTexCoords);
    gl.vertexAttribPointer(vTexCoords, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, primitive.numVertices);

    gl.disableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);
    gl.disableVertexAttribArray(vNormal);
    gl.disableVertexAttribArray(vTexCoords);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    //Shapes.drawWiredPrimitive(primitive);
};

/*Shapes.drawWiredPrimitive = function (primitive) {

    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0)); 
    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.edgeBuffer);
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, primitive.edgeColorBuffer);
    gl.enableVertexAttribArray(vColor);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.LINES, 0, primitive.numEdgeVertices);

    gl.disableVertexAttribArray(vPosition);
    gl.disableVertexAttribArray(vColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}*/



