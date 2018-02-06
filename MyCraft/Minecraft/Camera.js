//LAB 5
//Trent and DJ and Dylan


function Camera() {

    this.fov = 60;           // Field-of-view in Y direction angle (in degrees)
    this.zNear = 0.1;        // camera's far plane
    this.zFar = 500;         // camera's near plane

// Camera *initial* location and orientation parameters
    this.eye_start = vec4([4, 5, 16, 1]); // initial camera location (needed for reseting)   
    this.VPN = vec4([0, 0, 1, 0]);  // used to initialize uvn
    this.VUP = vec4([0, 1, 0, 0]);  // used to initialize uvn  

// Current camera location and orientation parameters
    this.eye = vec4(this.eye_start);     // camera location
    this.viewRotation;  // rotational part of matrix that transforms between World and Camera coord   

    this.calcUVN();  // initializes viewRotation
}

/**
 * Reset the camera location and orientation
 * @return none
 */
Camera.prototype.reset = function () {
    this.eye = vec4(this.eye_start);
    this.calcUVN();
};

/**
 * Calculate the *initial* viewRotation matrix of camera
 * based on VPN and VUP
 * @return none
 */
Camera.prototype.calcUVN = function () {
    //this.viewRotation = mat4(1);  // identity - placeholder only

// TO DO:  COMPLETE THIS CODE
    var n = vec4(normalize(this.VPN, true)); //z
    var u = vec4(cross(this.VUP, n), 0); //x
    u = normalize(u, true);
    var v = vec4(cross(n, u), 0); //y
    var t = vec4(0, 0, 0, 1);
    this.viewRotation = mat4(u, v, n, t);
    this.viewRotation.matrix = true;
    //printm(this.viewRotation);
};

/**
 * Calculate the camera's view matrix given the 
 * current eye and viewRotation
 * @return view matrix (mat4)
 */
Camera.prototype.calcViewMat = function () {
    //var mv = mat4(1);  // identity - placeholder only

// TO DO:  COMPLETE THIS CODE
//get just the eye
    var eyeTranslate = mat4(vec4(1, 0, 0, this.eye[0]), vec4(0, 1, 0, this.eye[1]),
    vec4(0, 0, 1, this.eye[2]), vec4(0, 0, 0, 1));
    //printm(eyeTranslate);
    
    var mv = mult((this.viewRotation), (inverse4(eyeTranslate)));
    
    return mv;
};

/** 
 * Calculate the camera's projection matrix. Here we 
 * use a perspective projection.
 * @return the projection matrix
 */
Camera.prototype.calcProjectionMat = function () {
    aspect = canvas.width / canvas.height;
    return perspective(this.fov, aspect, this.zNear, this.zFar);
};

/**
 * Update the camera's eye and viewRotation matrices 
 * based on the user's mouse actions
 * @return none
 */


Camera.prototype.motion = function () {

 // left mouse button
            // amount of rotation around axes 
            var dy = -0.05 * mouseState.delx;  // angle around y due to mouse drag along x
            var dx = -0.05 * mouseState.dely;  // angle around x due to mouse drag along y

            var ry = rotateY(10 * dy);  // rotation matrix around y
            var rx = rotateX(10 * dx);  // rotation matrix around x

//          TO DO: NEED TO IMPLEMENT TUMBLE FUNCTION
            this.tumble(rx, ry);   //  <----  NEED TO IMPLEMENT THIS FUNCTION BELOW!!!
            mouseState.startx = mouseState.x;
            mouseState.starty = mouseState.y;
        
    render();
};

Camera.prototype.motion2 = function () {

 // left mouse button
            // amount of rotation around axes 
            var dy = -0.03 * mouseState.delx;  // angle around y due to mouse drag along x
            var dx = -0.03 * mouseState.dely;  // angle around x due to mouse drag along y

            var ry = rotateY(5 * dy);  // rotation matrix around y
            var rx = rotateX(5 * dx);  // rotation matrix around x

//          TO DO: NEED TO IMPLEMENT TUMBLE FUNCTION
            this.tumble(rx, ry);   //  <----  NEED TO IMPLEMENT THIS FUNCTION BELOW!!!
        
    render();
};

/**
 * Rotate about the world coordinate system about y (left/right mouse drag) and/or 
 * about a line parallel to the camera's x-axis and going through the WCS origin 
 * (up/down mouse drag).
 * @param {mat4} rx  rotation matrix around x
 * @param {mat4} ry  rotation matrix around y
 * @return none
 */
Camera.prototype.tumble = function (rx, ry) {
    // TO DO:  IMPLEMENT THIS FUNCTION
    // We want to rotate about the world coordinate system along a direction parallel to the
    // camera's x axis. We first determine the coordinates of the WCS origin expressed in the eye coordinates.
    // We then translate this point to the camera (origin in camera coordinates) and do a rotation about x.
    // We then translate back. The result is then composed with the view matrix to give a new view matrix.
    //  When done, should have new value for eye and viewRotation

    // DO THIS CONTROL LAST - IT IS THE MOST DIFFICULT PART
    var view = this.calcViewMat();  // current view matrix
    
    //calculate tumble point and create matrix
    tumblePoint = this.eye; 
    var TP = translate(tumblePoint[0], tumblePoint[1], tumblePoint[2]);
    
    //calculate tumble point prime and create matrix
    tumblePointPrime = mult(view, tumblePoint);
    var TPP = translate(tumblePointPrime[0], tumblePointPrime[1], tumblePointPrime[2]);

    //calculate the negation of tumble point and tumble point prime and create matrix
    var NTP = translate(negate(tumblePoint)[0], negate(tumblePoint)[1], negate(tumblePoint)[2]);
    var NTPP = translate(negate(tumblePointPrime)[0], negate(tumblePointPrime)[1], negate(tumblePointPrime)[2]);
    // X Rotate about tumble point in Camera Coord Sys    

    //V new = B * V old * A
    var B = mult(mult(TPP, rx), NTPP);
    var A = mult(mult(TP, ry), NTP);

    
    // Y Rotate about tumble point in WCS
    // 
    //V new = V old * Ry
    //V new = rot trans
    //R-1 rot V new = (R-1 rot R rot)=I  T eye
    
    view = mult(mult(B, view), A);

    var tempView = mat4Copy(view); //view rotational part
    tempView[0][3] = 0;
    tempView[1][3] = 0;
    tempView[2][3] = 0;  //gets tempView as pure rotational part
    
    var Teye = mult(transpose(tempView), view);
    var Eye = vec4(mult(Teye, vec4(0, 0, 0, 1)));
    Eye[0] = -Eye[0];
    Eye[1] = -Eye[1];
    Eye[2] = -Eye[2];
    
    this.viewRotation = tempView;
    this.eye = Eye;
    
    // need to get eye position back
    //  Here, rotInverse is the inverse of the rotational part of the view matrix.
    //Eye = -rotInverse*view*origin  // this gives the location of the WCS origin in the eye coordinates
   
   
};

/*******************************************************************************
 Start of My Craft code - Trent and Dylan - Dec 14th, 2017
********************************************************************************/


Camera.prototype.keyAction = function () {
    var alpha = 2.0;  // used to control the amount of a turn during the flythrough 
    if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    
    if(key.left) {
        var move = add(this.eye, scale(-alpha, this.viewRotation[0]));
        if(this.isNextBlockEmpty(move)) {
            this.eye = move;
        }
    }
    if(key.right) {
        var move = add(this.eye, scale(alpha, this.viewRotation[0]));
        if(this.isNextBlockEmpty(move)) {
            this.eye = move;
        }
    }
    if(key.forward) {
        var walkStraight = vec4(this.viewRotation[2][0], 0, this.viewRotation[2][2], 0);
        move = add(this.eye, scale((-alpha), walkStraight));
        if(this.isNextBlockEmpty(move)) {
            this.eye = move;
        }
    }
    if(key.backward) {
        var walkStraight = vec4(this.viewRotation[2][0], 0, this.viewRotation[2][2], 0);
        move = add(this.eye, scale((alpha), walkStraight));
        if(this.isNextBlockEmpty(move)) {
            this.eye = move;
        }
    }
    if(key.jump) {
        var jump = vec4(0, 2, 0, 0);
        this.eye = add(this.eye, jump);

    }
    if(key.swing) {
       this.animateSwing();
    }
      }
    };

var time;
var count = 0;

Camera.prototype.isNextBlockEmpty = function(point) {
    
    //console.log(this.isPointInsideAABB(point));
    
    var minX = point[0] - 0.5;
    var maxX = point[0] + 0.5;
    
    var minY = point[1] - 3;
    var maxY = point[1] + 3;
    
    var minZ = point[2] - 0.5;
    var maxZ = point[2] + 0.5;
    
    var points = [];
    points.push(vec3(point[0],point[1],point[2]));
    points.push(vec3(minX,minY,minZ));
    points.push(vec3(minX,minY,maxZ));
    points.push(vec3(minX,maxY,maxZ));
    points.push(vec3(maxX,maxY,maxZ));
    points.push(vec3(maxX,minY,minZ));
    points.push(vec3(maxX,maxY,minZ));
    points.push(vec3(minX,maxY,minZ));
    points.push(vec3(maxX,minY,maxZ));
    
    var check = true;
    
    for(i = 0; i < points.length; i++) {
        var tempPoint = points[i];
        var x = Math.floor(tempPoint[0]);
        var y = Math.floor(tempPoint[1]);
        var z = Math.floor(tempPoint[2]);
        if(x%2 === 1) {x+=1;}
        if(y%2 === 1) {y+=1;}
        if(z%2 === 1) {z+=1;}
        x = x/2;
        y = y/2;
        z = z/2;
        
        if(x < 0 || y < 0 || z < 0 || voxel[x][y][z] === "block" ) {
            //console.log(voxel[x][y][z]);
            check = false;
            break;
        } else {
            //console.log(voxel[x][y][z]);
            check = true;
        }
        
    }
    
    return check;
    
};

Camera.prototype.placeBlock =  function () {
  
    //6 - 1 is the distance to check for blocks to add
    for(j=12; j>=1; j--) {
        //check if blocks around are empty - if they are dont build
        //scale number is how much in front of eye point is
        var i = j/2; //6, 5.5, 5, 4.5, etc.
        var viewRot = scale(i, this.viewRotation[2]);
        var point = add(this.eye, vec4(-viewRot[0],-viewRot[1],-viewRot[2],1));
        var p1 = Math.floor(point[0]);
        var p2 = Math.floor(point[1]);
        var p3 = Math.floor(point[2]);
        if(p1%2 === 1) {p1+=1;}
        if(p2%2 === 1) {p2+=1;}
        if(p3%2 === 1) {p3+=1;}
        var x = p1/2;
        var y = p2/2;
        var z = p3/2;
        
        if(voxel[x-1][y][z] === "block" || voxel[x+1][y][z] === "block"
                || voxel[x][y-1][z] === "block" || voxel[x][y+1][z] === "block"
                || voxel[x][y][z-1] === "block" || voxel[x][y][z+1] === "block" 
                && voxel[x][y][z] != "block") {
            minecraftCubes.push(new MinecraftCube(p1, p2, p3, new ImageTexture("textures/" + tex +".png")));
            return;
        }
    }
        
    
};

var spliceNum = 1000;

Camera.prototype.findBlockToRemove =  function () {
  
    //1 to 6 is the distance to check for blocks to remove
    for(j=1; j<6; j++) {
        var viewRot = scale(j, this.viewRotation[2]);
        var point = add(this.eye, vec4(-viewRot[0],-viewRot[1],-viewRot[2],1));
        
        for (i = 0; i < minecraftCubes.length; i++) {
            if (point[0] <= (minecraftCubes[i].x + 1) && point[0] >= (minecraftCubes[i].x - 1) &&
                point[1] <= (minecraftCubes[i].y + 1) && point[1] >= (minecraftCubes[i].y - 1) &&
                point[2] <= (minecraftCubes[i].z + 1) && point[2] >= (minecraftCubes[i].z - 1)) {
                if(minecraftCubes[i].optionalTreasure === true) {
                    treasure = true;
                } 
                    spliceNum = i;
                    return; 

            }
        }
        
    }

};

Camera.prototype.takeAwayCube = function () {
    if(spliceNum !== 1000) {
        var temp = minecraftCubes[spliceNum];
        var x = temp.x / 2;
        var y = temp.y / 2;
        var z = temp.z / 2;
        voxel[x][y][z] = "air";

        minecraftCubes.splice(spliceNum, 1);
        spliceNum = 1000; 
            
        }
}
      
var count1 = 0;
var time1;
var thrown = false;
var switch3 = false;

Camera.prototype.throwTool =  function () {
    
    if(!switch3) {
        console.log(this.viewRotation[2]);
        tempVectorN = vec4(this.viewRotation[2][0], this.viewRotation[2][1], this.viewRotation[2][2], 0);
    }
    switch3 = true;
    count1 += 1;

if(count1 <= 100) {
    var now = new Date().getTime(),
    dt = now - (time1 || now);
    time1 = now;
    
    // Drawing code goes here... for example updating an 'x' position:
    axeAngle += (3*dt);
    
    if(count1 < 50) {
        throwDist = add(throwDist, scale((-0.03*dt), tempVectorN));
    } else if(count1 >= 50 && count1 <= 100) {
        throwDist = add(throwDist, scale((0.03*dt), tempVectorN));
    }
    
    this.checkForBlock(throwDist);

       render();
       window.requestAnimationFrame(this.throwTool.bind(this)); 

    } else {
        switch3 = false;
        count1 = 0;
        time1 = 0;
        axeAngle = 0;
        throwDist = add(throwDist, vec4(-throwDist[0], -throwDist[1], -throwDist[2], 0));
        render();
    }
    
};

Camera.prototype.checkForBlock =  function (axe) {
    axe = add(this.eye, axe);
    var axePoints = [];
    axePoints.push(axe);
    axePoints.push(vec4(axe[0],(axe[1]+1),axe[2],0));
    axePoints.push(vec4(axe[0],(axe[1]-1),axe[2],0));
    
    for (j = 0; j < axePoints.length; j++) {
        var axePoint = axePoints[j];
        for (i = 0; i < minecraftCubes.length; i++) {
            if (axePoint[0] <= (minecraftCubes[i].x + 1) && axePoint[0] >= (minecraftCubes[i].x - 1) &&
                axePoint[1] <= (minecraftCubes[i].y + 1) && axePoint[1] >= (minecraftCubes[i].y - 1) &&
                axePoint[2] <= (minecraftCubes[i].z + 1) && axePoint[2] >= (minecraftCubes[i].z - 1)) {
                if(minecraftCubes[i].optionalTreasure === true) {
                    //do not do anything if you throw the axe at the block
                } else {
                    spliceNum = i;
                    this.takeAwayCube();
                    return;
                }
            }
        }
    }
};  

var switch1 = false;

Camera.prototype.animateSwing =  function () {

    if (axeAngle < 60 && switch1 === false){
    axeAngle += 10;
    if(axeAngle >= 60.0) {
        switch1 = true;
    }
    } else if(switch1 === true) {
        axeAngle -= 10;
        if(axeAngle <= 0.0) {
            switch1 = false;
        }
    }
       
};

var count2 = 0;
var time2;
var b = false;
var targetHieght;

//animate the chest and golden pickaxe position
Camera.prototype.animove =  function () {
    if(!b) {
        targetHeight = gAxeH + 4;
    }
    b = true;
    count2 += 1;
    var now = new Date().getTime(),
    dt = now - (time2 || now);
    time2 = now;

    // Drawing code goes here... for example updating an 'x' position:
    if (gAxeH < targetHeight){
        gAxeH += (0.01*dt); // Increase 'x' by 10 units per millisecond
    } 
    if (chestH > -8){
        chestH -= -10;
    }
    if(count2 <= 50){
       render();
       window.requestAnimationFrame(this.animove.bind(this));
    } else {
        setTimeout(function () {
            pickedUpGoldPickaxe = true;
            document.getElementById("afterTreasure").innerHTML = "Press 6 for you fast block breaking golden pickaxe!"
        }, 3000);
    }

};

/*Camera.prototype.dropUntilGround =  function () {
    var feet = this.eye[1] - 4;
    if(feet < 0) {
        feet = 0;
    }

    var x = Math.floor(this.eye[0]);
    var y = Math.floor(feet);
    var z = Math.floor(this.eye[2]);
    if(x%2 === 1) {x+=1;}
    if(y%2 === 1) {y+=1;}
    if(z%2 === 1) {z+=1;}
    var voxelX = x/2;
    var voxelY = y/2;
    var voxelZ = z/2;
    console.log(voxelX + " " + voxelY + " " + voxelZ);
    
    if(voxel[voxelX][voxelY][voxelZ] === "block") {
        isFalling = false;
    } else {
        this.eye = add(this.eye, scale(-1, this.viewRotation[1]));
        render();
    }
    
};*/