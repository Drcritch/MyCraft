//LAB 7
//Trent
//
//Cone with height 1 and base radius 1
//change the variable Triangle to change the triangles in the disk
//number of triangles has to be divisible by 2 and equal an even number to look the best\

//            ^ y
//            |
//             -->x
//            /
//           z

function Cone(Triangles) {

    this.name = "cone";

    //number of triangles in cone
    //var Triangles = 36;

    //360 degrees/(triangles/2) because I did the disk in one for loop and another for the other side
    var num = (360 / (Triangles / 2));

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
    var face_normals = [];
    var face_tex_coords = [];

    //loop through for just the disk on bottom (same as disk class)
    for (var i = 0; i < (Triangles / 2); i++) {
        var mod = (i % 2);
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));

        unique_vertices.push(vec4(0.0, 0.0, 0.0, 1.0));
        unique_vertices.push(vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 0.0, 1.0));
        unique_vertices.push(vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 0.0, 1.0));
        
        face_normals.push(vec4(0.0, 0.0, -1.0, 0.0));
        face_normals.push(vec4(0.0, 0.0, -1.0, 0.0));
        face_normals.push(vec4(0.0, 0.0, -1.0, 0.0));
        
        face_tex_coords.push(vec2(0.5, 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * i) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * i) * (Math.PI / 180)) * 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * (i + 1)) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * (i + 1)) * (Math.PI / 180)) * 0.5));
    }

    //loop through and change the z value of the origin to make the cone
    for (var i = 0; i < (Triangles / 2); i++) {
        var mod = (i % 2);
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(mod, 1.0, 1.0, 1.0));

        var v1 = vec4(0.0, 0.0, 1.0, 1.0);
        var v2 = vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 0.0, 1.0);
        var v3 = vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 0.0, 1.0);
        
        unique_vertices.push(v1);
        unique_vertices.push(v2);
        unique_vertices.push(v3);
        
        var s1 = subtract(v1, v2);
        var s2 = subtract(v3, v2);
        var crossed = cross(s2, s1);
        crossed.push(0);
        
        face_normals.push(crossed);
        face_normals.push(crossed);
        face_normals.push(crossed);
        
        face_tex_coords.push(vec2(0.5, 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * i) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * i) * (Math.PI / 180)) * 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * (i + 1)) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * (i + 1)) * (Math.PI / 180)) * 0.5));
    }

    //for (var i = 0; i < this.numTriangles; i++) {  // 2 faces
        //norm = face_normals[i];
        //loop through and add vertices and colors to their array
        for (var j = 0; j < this.numVertices; j++) {  
            
            //var k = i * 3 + j;
            this.normals[j] = face_normals[j];
            this.vertices[j] = unique_vertices[j];
            this.colors[j] = vert_colors[j];
            this.texCoords[j] = face_tex_coords[j];
        }
    //}
}
