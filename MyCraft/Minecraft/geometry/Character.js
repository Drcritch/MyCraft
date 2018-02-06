/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Character() {
    this.name = "character";
    
    //dimensions of the character
    this.bodyLength = 1.8;
    
    //variables that are to be updated
    this.locationX = 0;
    this.locationY = 0;
    this.locationZ = 0;
}

Character.prototype.draw = function() {
    stack.push();
    //stack.multiply(translate(this.locationX, this.locationY, this.locationZ));
    this.drawBody();
    stack.pop();
}

Character.prototype.drawBody = function() {
    stack.push();
    stack.multiply(translate(0, 0.9, 0));
    stack.multiply(scalem(0.3, 1.8, 0.8));
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top())); // set modelview transform
    gl.uniform4fv(uColor, vec4(1.0, 0.0, 0.0, 1.0));  // set color
    Shapes.drawPrimitive(Shapes.cube);    // draw
    stack.pop();
}