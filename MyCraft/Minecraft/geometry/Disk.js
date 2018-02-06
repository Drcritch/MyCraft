//LAB 7
//Trent
//Disk of radius 1
//change the variable Triangle to change the triangles in the disk
//number of triangles has to be divisible by 2 and equal an even number to look the best

//            ^ y
//            |
//             -->x
//            /
//           z

function Disk(Triangles) {

    //input number of triangles you want
    //var Triangles = 32;

    var num = (360 / Triangles);

    this.name = "disk";

    this.numVertices = (Triangles * 3);
    this.numTriangles = this.numVertices / 3;

    this.normals = [this.numVertices];
    this.vertices = [this.numVertices];
    this.colors = [this.numVertices];
    this.texCoords = [this.numVertices];

    // Local variables: unique vertices and colors.
    ////////////////////////////////////////////////////////////

    var unique_vertices = [];
    var vert_colors = [];
    var face_tex_coords = [];

    for (var i = 0; i < Triangles; i++) {
        var mod = (i % 2); //make every other triangle a different color
        //putting a color for each vertice in the triangle
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));

        //the origin is always the center for each triangle made
        unique_vertices.push(vec4(0.0, 0.0, 0.0, 1.0));
        //math to find the x and y of a circle
        unique_vertices.push(vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 0.0, 1.0));
        unique_vertices.push(vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 0.0, 1.0));
        
        face_tex_coords.push(vec2(0.5, 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * i) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * i) * (Math.PI / 180)) * 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * (i + 1)) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * (i + 1)) * (Math.PI / 180)) * 0.5));
    }
    
    var face_normals = [
        vec4(0.0, 0.0, 1.0, 0.0),  // top
        //vec4(0.0, 0.0, -1.0, 0.0), // bottom
    ];

    //loop to put vertices and colors in arrays
    for (var i = 0; i < 1; i++) {  // 2 faces
        norm = face_normals[i];
        
        for (var j = 0; j < (this.numVertices); j++) {   //number of vertices per face

            var k = i * (this.numVertices) + j;
            this.normals[k] = norm;
            this.vertices[j] = unique_vertices[j];
            this.colors[j] = vert_colors[j];
            this.texCoords[j] = face_tex_coords[j];
        }
    }

}
