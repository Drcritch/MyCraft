//LAB 7
//Trent
//my procedural texture
function NewTexture()
{
    this.width = 64;    // width (# of pixels) of the texture
    this.height = 64;   // height (# of pixels) of the texture
    this.numRows = 8;   // number of checkerboard squares in a row
    this.numCols = 8;   // number of checkerboard squares in a column
    this.makeTexture();
    this.init();
}

/**
 * Create an array of uInts. Load the array with the texture pattern. 
 * Note, the 2D texture is stored in a 1D array.
 * @return {undefined}
 */
NewTexture.prototype.makeTexture = function () {
    this.texels = new Uint8Array(4 * this.width * this.height);

    for (var i = 0; i < this.width; i++)
    {
        for (var j = 0; j < this.height; j++)
        {

            var k = 4 * (i * this.width + j);
            var patchx = Math.floor(i / (this.width / this.numRows));
            var patchy = Math.floor(j / (this.height / this.numCols));
            /*var rand1 = Math.floor(Math.random()*255);
            var rand2 = Math.floor(Math.random()*255);
            var c1 = (patchx ? rand1 : rand2);
            var c2 = (patchy ? rand1 : rand2);
            var c3 = (patchx !== patchy ? rand1 : rand2);*/
            var intensity = Math.cos(patchx);

            if(patchx%2 === 0) {
                
                this.texels[k] = intensity;
                this.texels[k + 1] = 0;
                this.texels[k + 2] = 0;
                this.texels[k + 3] = 255;
            } 
            if(patchx%2 === 1) {
                
                this.texels[k] = 255-intensity;
                this.texels[k + 1] = 0;
                this.texels[k + 2] = 0;
                this.texels[k + 3] = 255;
            } 

                
            /*if(mod === 1) {
                
                this.texels[k] = (index*j)/2;
                this.texels[k + 1] = index*j;
                this.texels[k + 2] = (index*j)/4;
                this.texels[k + 3] = 255;
            } else if(mod === 2) {
                
                this.texels[k] = (index*j)/2;
                this.texels[k + 1] = (index*j)/4;
                this.texels[k + 2] = index*j;
                this.texels[k + 3] = 255;
            }*/

            
            /*var patchx = Math.floor(i / (this.width / this.numRows));
            var patchy = Math.floor(j / (this.height / this.numCols));
            var c = (Math.cos(patchx) !== Math.sin(patchy) ? 100 : 200);
            var k = 4 * (i * this.width + j);
            this.texels[k] = c;
            this.texels[k + 1] = c;
            this.texels[k + 2] = c;
            this.texels[k + 3] = 255;*/
        }
    }
};

/**
 *  Call this to create the texture buffer and set texture parameters.
 * @return {undefined}
 */
NewTexture.prototype.init = function () {
    // Generate texture ID and bind to this ID
    this.texID = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texID);

    // loads the texture onto the GPU
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, this.texels);

    // Set parameters
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
};

/**
 * Call this when you are ready to use the texture
 * @return {undefined}
 */
NewTexture.prototype.activate = function () {
    // GL provides 32 texture registers; the first of these is gl.TEXTURE0.
    gl.activeTexture(gl.TEXTURE0); // activate texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.texID);
    gl.uniform1i(uTexture, 0);     // associate uTexture in shader with texture unit 0
};

