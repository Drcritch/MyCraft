/**
 *  Event handler methods. Stores the state of the mouse.
 * @type {type}
 */

var mouseState = {
    startx: 0,  // position at the start of a mouse move
    starty: 0,
    down: false,
    x: 0,    // current position of mouse during a mouse move
    y: 0,
    delx: 0, // difference between x and startx
    dely: 0,
    moveX: 0,
    moveY: 0,
    
    // The mouse button being pressed
    actionChoice: {TUMBLE: 0 // left mouse button
    },
    
/**
 * Reset parameters when mouse is released
 * @return {undefined}
 */
    reset: function () {
        this.startx = 0;
        this.starty = 0;
        this.down = false;
        this.x = 0;
        this.y = 0;
        this.delx = 0;
        this.dely = 0;
        this.action = this.actionChoice.NONE;
    },

/** 
 * Helper funtion to display mouse state
 * @return {String|message}
 */
    displayMouseState: function () {
        message = "<b>Mouse state: </b><br>&nbsp;startx=" + mouseState.startx +
                "<br>&nbsp;starty=" + mouseState.starty +
                "<br>&nbsp;x = " + mouseState.x + 
                "<br>&nbsp;y = " + mouseState.y +
                "<br>&nbsp;delx = " + mouseState.delx + 
                "<br>&nbsp;dely = " + mouseState.dely +
                "<br>&nbsp;button = " + mouseState.action +
                "<br>&nbsp;down = " + mouseState.down;
        return message;
    }
};
mouseState.action =  mouseState.actionChoice.NONE; // current mouse button

/**
 * Mouse event handlers
 * @return {undefined}
 */
function setMouseEventHandler() {
    canvas = document.getElementById( "gl-canvas" );

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

}

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", update(), false);
    //document.removeEventListener("mousemove", updateNormal(), false);
  } else {
    //console.log('The pointer lock status is now unlocked');  
    //document.removeEventListener("mousemove", update(), false);
    //document.addEventListener("mousemove", updateNormal(), false);
  }
}

function update() {
    canvas = document.getElementById( "gl-canvas" );
    canvas.addEventListener("mousemove", function (e) {

            mouseState.x = 0;
            mouseState.y = 0;
            mouseState.delx = e.movementX;
            mouseState.dely = e.movementY;
            camera.motion2();
    });
}


/**
 * Key press event handlers. Actions are defined in the Camera class
 * @return {undefined}
 */

let key = {forward:false, left:false, right:false, backward:false, jump:false, swing:false};
var pointer = false;
var tex = "grass_top";
var toolNum = 0;
var lastKeyUpAt = 0;
var hasBlockbeenRemoved = false;
var timedBreak;
var removed = false;
var timeToBreakBlock = 2000;
var pickedUpGoldPickaxe = false;
var treasure = false;

function setKeyEventHandler() {
    
    window.onkeydown = function (e) { 
        //hotbar - 1,2,3 items
        if (e.keyCode === 49) {tex = "grass_top";}
        if (e.keyCode === 50) {tex = "cobblestone_mossy";}
        if (e.keyCode === 51) {tex = "leaves_oak";}
        if (e.keyCode === 52) {tex = "log_oak";}
        document.getElementById("blockType").innerHTML = "Block Selected: " + tex 
                + '<img src=\'textures/'+ tex +'.png\'>';
        //tool 1
        if (e.keyCode === 53) {
            toolNum = 0; 
            for(i = 0; i < tools.length; i++) {
                tools[i] = false;
            }
            tools[toolNum] = true;
        }
        //tool 2
        if (e.keyCode === 54 && pickedUpGoldPickaxe === true) {
            toolNum = 1; 
            for(i = 0; i < tools.length; i++) {
                tools[i] = false;
            }
            tools[toolNum] = true;
        }
        //movements
        if (e.keyCode === 65) {key.left=true;} //LEFT
        if (e.keyCode === 87) {key.forward=true;} //UP
        if (e.keyCode === 68) {key.right=true;} //RIGHT
        if (e.keyCode === 83) {key.backward=true;} //DOWN
        if (e.keyCode === 32) {key.jump=true;} //JUMP
        if (e.keyCode === 84 && !thrown) {camera.throwTool();} //throw tool

        //remove block
        if (e.keyCode === 89 && !removed) {
            removed = true;
            //get point right in front of camera
            key.swing = true;
            var keyDownAt = new Date();
            camera.findBlockToRemove();
            //console.log("in if");

            if(toolNum === 0) {
                timeToBreakBlock = 1750;
            } else if(toolNum === 1) {
                timeToBreakBlock = 1000;
            }
            
            //after timeToBreakBlock in milliseconds the function will be called
            setTimeout(function () {
                // Compare key down time with key up time
                if (keyDownAt > lastKeyUpAt) {
                    //console.log("in timeout");
                    camera.takeAwayCube();
                    removed = false;
                    if(treasure === true) {
                        camera.animove();
                        playAudio1();
                        treasure = false;
                    }
                }
            }, timeToBreakBlock);
        }
        
        //place block
        if (e.keyCode === 85) {
            camera.placeBlock();
        }
        
        camera.keyAction();
        render();
    };
    
    window.onkeyup = function(e) {
        if (e.keyCode === 65) {key.left=false;} //LEFT
        if (e.keyCode === 87) {key.forward=false;} //UP
        if (e.keyCode === 68) {key.right=false;} //RIGHT
        if (e.keyCode === 83) {key.backward=false;} //DOWN
        if (e.keyCode === 32) {key.jump=false;} //JUMP
        //if (e.keyCode === 72) {key.swing = false;} //pickaxe swing
        if (e.keyCode === 89) {key.swing = false; removed = false; axeAngle = 0;} //pickaxe swing
        
        // Set lastKeyUpAt to hold the time the last key up event was fired
        lastKeyUpAt = new Date();
  };
  
  function playAudio1() { 
    var x = document.getElementById("levelUpSound"); 
    x.play(); 
  } 
    
}