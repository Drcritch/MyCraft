//////////////////
//Helicopter

//Lab 3
//////////////////

function Helicopter() {
    this.name = "helicopter";
    
    //dimensions of the helicopter object
    this.bodyLength = 3.0;
    this.bodyRadius = 0.5;
    this.bodyAboveGround = 0.5;
    
    this.bladeWidth = 0.2;
    this.bladeThickness = 0.1;
    this.bladeLength = 2.5;
    
    this.pivotColumnLength = 0.8;
    this.pivotColumnRadius = 0.2;

    this.pivotColumnTheta = 0;
    this.incAngle = 4.0;
    
    this.locationX = 0;
    this.locationY = 0;
    this.locationZ = 0;
    this.translateBy = 0.3;
}

Helicopter.prototype.draw = function() {
    //translate the whole helicopter with locationX and locationY
    stack.push();
    stack.multiply(translate(this.locationX, this.locationY, this.locationZ));
    this.drawHelicopter();
    stack.pop();
    
}

Helicopter.prototype.drawHelicopter = function() {
    //spin just the blades and pivot column using theta
    stack.push();
    stack.multiply(rotateY(this.pivotColumnTheta));
    this.drawPivotColumn();
    this.drawBlades();
    stack.pop();
    
    //draw the body separately so it doesnt spin too
    stack.push();
    this.drawBody();
    stack.pop();
}

Helicopter.prototype.drawBody = function() {
    stack.push();
    stack.multiply(translate(0, (this.bodyAboveGround+this.bodyRadius), -(this.bodyLength/2)));
    stack.multiply(scalem((this.bodyRadius*2), (this.bodyRadius*2), this.bodyLength));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top())); // set modelview transform
    gl.uniform4fv(uColor, vec4(0.0, 1.0, 0.0, 1.0));  // set color
    Shapes.drawPrimitive(Shapes.cylinder);    // draw
    stack.pop();
}

Helicopter.prototype.drawBlades = function() {
    stack.push();
    stack.multiply(rotateY(0));
    this.drawBlade();
    stack.pop();
    
    stack.push();
    stack.multiply(rotateY(90));
    this.drawBlade();
    stack.pop();
    
    stack.push();
    stack.multiply(rotateY(180));
    this.drawBlade();
    stack.pop();
    
    stack.push();
    stack.multiply(rotateY(270));
    this.drawBlade();
    stack.pop();
}

//draw a blade with all
Helicopter.prototype.drawBlade = function() {
    stack.multiply(translate(0, (this.bodyAboveGround+(this.bodyRadius*2)+this.pivotColumnLength+(this.pivotColumnLength/2)), 0)); //3.2
    stack.multiply(scalem(this.bladeWidth, this.bladeThickness, this.bladeLength));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top())); // set modelview transform
    gl.uniform4fv(uColor, vec4(1.0, 0.0, 0.0, 1.0));  // set color to red
    Shapes.drawPrimitive(Shapes.cube);    // draw cube
}

//
Helicopter.prototype.drawPivotColumn = function() {
    stack.push();
    stack.multiply(rotateX(90));
    stack.multiply(translate(0, 0, (this.bodyAboveGround+(this.bodyRadius*2)+(this.pivotColumnLength/2)))); //2.4
    stack.multiply(scalem(this.pivotColumnRadius, this.pivotColumnRadius, this.pivotColumnLength));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top())); // set modelview transform
    gl.uniform4fv(uColor, vec4(0.4, 0.2, 0.1, 1.0));  // set color
    Shapes.drawPrimitive(Shapes.cylinder);    // draw
    stack.pop();
    
}
