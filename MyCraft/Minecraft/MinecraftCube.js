/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function MinecraftCube(x,y,z,texture,optionalTreasure) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.texture = texture;
    this.optionalTreasure = optionalTreasure;
    
    var tempX = (this.x/2);
    var tempY = (this.y/2);
    var tempZ = (this.z/2);
    
    voxel[tempX][tempY][tempZ] = "block";

}