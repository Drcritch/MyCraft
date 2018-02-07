//LAB 7

//Cylinder with height 1 and base radius 1
//change the variable Triangle to change the triangles in the disk
//number of triangles has to be divisible by 4 and equal an even number to look the best

//            ^ y
//            |
//             -->x
//            /
//           z

function Cylinder(Triangles) {

    //input number of triangles you want
    //has to be a number divisible by 4 to work
    //var Triangles = 72;

    //to use as theta
    var num = (360 / (Triangles / 4));

    this.name = "cylinder";

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

    //loop through for the bottom disk
    for (var i = 0; i < Triangles / 4; i++) {
        vert_colors.push(vec4(1.0, 0.0, 0.0, 1.0));
        vert_colors.push(vec4(1.0, 0.0, 0.0, 1.0));
        vert_colors.push(vec4(1.0, 0.0, 0.0, 1.0));

        unique_vertices.push(vec4(0.0, 0.0, 0.0, 1.0));
        unique_vertices.push(vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 0.0, 1.0));
        unique_vertices.push(vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 0.0, 1.0));
        
        face_normals.push(vec4(0.0, 0.0, -1.0, 0.0));
        
        face_tex_coords.push(vec2(0.5, 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * i) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * i) * (Math.PI / 180)) * 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * (i + 1)) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * (i + 1)) * (Math.PI / 180)) * 0.5));
    }
    
    //loop through for the top disk
    for (var i = 0; i < Triangles / 4; i++) {
        vert_colors.push(vec4(0.0, 1.0, 0.0, 1.0));
        vert_colors.push(vec4(0.0, 1.0, 0.0, 1.0));
        vert_colors.push(vec4(0.0, 1.0, 0.0, 1.0));

        unique_vertices.push(vec4(0.0, 0.0, 1.0, 1.0));
        unique_vertices.push(vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 1.0, 1.0));
        unique_vertices.push(vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 1.0, 1.0));
        
        face_normals.push(vec4(0.0, 0.0, 1.0, 0.0));
        
        face_tex_coords.push(vec2(0.5, 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * i) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * i) * (Math.PI / 180)) * 0.5));
        face_tex_coords.push(vec2(0.5 + Math.cos((num * (i + 1)) * (Math.PI / 180)) * 0.5, 0.5 + Math.sin((num * (i + 1)) * (Math.PI / 180)) * 0.5));
    }
    
    //loop through for part of the sides of cylinder
    for (var i = 0; i < Triangles / 4; i++) {
        vert_colors.push(vec4(1.0, 1.0, 0.0, 1.0));
        vert_colors.push(vec4(1.0, 1.0, 0.0, 1.0));
        vert_colors.push(vec4(1.0, 1.0, 0.0, 1.0));

        var v1 = vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 0.0, 1.0);
        var v2 = vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 1.0, 1.0);
        var v3 = vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 1.0, 1.0);
        
        unique_vertices.push(v1);
        unique_vertices.push(v2);
        unique_vertices.push(v3);
        
        var s1 = subtract(v1, v2);
        var s2 = subtract(v3, v2);
        var crossed = cross(s1, s2);
        crossed.push(0);
        
        face_normals.push(crossed);
        
        face_tex_coords.push(vec2(((num*4*i)/360), 0));
        face_tex_coords.push(vec2(((num*4*i)/360), 1));
        face_tex_coords.push(vec2(((num*4*(i+1))/360), 1));
    }
    
    //loop through for part of the other sides of the cylinder
    for (var i = 0; i < Triangles / 4; i++) {
        vert_colors.push(vec4(0.0, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(0.0, 1.0, 1.0, 1.0));
        vert_colors.push(vec4(0.0, 1.0, 1.0, 1.0));

        var v1 = vec4(Math.cos((num * i) * (Math.PI / 180)), Math.sin((num * i) * (Math.PI / 180)), 0.0, 1.0);
        var v2 = vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 0.0, 1.0);
        var v3 = vec4(Math.cos((num * (i + 1)) * (Math.PI / 180)), Math.sin((num * (i + 1)) * (Math.PI / 180)), 1.0, 1.0);
                
        unique_vertices.push(v1);
        unique_vertices.push(v2);
        unique_vertices.push(v3);
        
        var s1 = subtract(v1, v2);
        var s2 = subtract(v3, v2);
        var crossed = cross(s2, s1);
        crossed.push(0);
        
        face_normals.push(crossed);
        
        face_tex_coords.push(vec2(((num*4*i)/360), 0));
        face_tex_coords.push(vec2(((num*4*(i+1))/360), 0));
        face_tex_coords.push(vec2(((num*4*(i+1))/360), 1));
    }

    //loop through and add vertices and color to their array
    for (var i = 0; i < this.numTriangles; i++) {  
        norm = face_normals[i];
        
        for (var j = 0; j < 3; j++) {  
            
            var k = i * 3 + j;
            this.normals[k] = norm;
            this.vertices[k] = unique_vertices[k];
            this.colors[k] = vert_colors[k];
            this.texCoords[k] = face_tex_coords[k];
        }
    }

}
