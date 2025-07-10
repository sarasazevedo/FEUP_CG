import {CGFobject} from '../lib/CGF.js';
/**
 * Myparallelogram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyParallelogram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 0, 0,   // 0
            1, 1, 0,    // 1
            3, 1, 0,    // 2
            2, 0, 0     // 3
        ];

        this.indices = [
            //Counter-clockwise reference of vertices
            0, 2, 1,
            0, 3, 2,
            //Clockwise reference of vertices
            1, 2, 0,
            2, 3, 0
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;
    
        this.initGLBuffers();
    }
}

