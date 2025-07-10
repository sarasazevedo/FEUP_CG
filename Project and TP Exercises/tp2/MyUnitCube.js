import {CGFobject} from '../lib/CGF.js';
/**
 * MyUnitCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            // Front 
            -0.5, -0.5,  0.5, // 0
             0.5, -0.5,  0.5, // 1
             0.5,  0.5,  0.5, // 2
            -0.5,  0.5,  0.5, // 3

            // Back 
            -0.5, -0.5, -0.5, // 4
             0.5, -0.5, -0.5, // 5
             0.5,  0.5, -0.5, // 6
            -0.5,  0.5, -0.5  // 7
        ];

        this.indices = [
            // Front 
            0, 1, 2,
            2, 3, 0,

            // Back 
            4, 6, 5,
            6, 4, 7,

            // Top 
            3, 2, 6,
            6, 7, 3,

            // Bottom 
            0, 5, 1,
            5, 0, 4,

            // Right 
            1, 5, 6,
            6, 2, 1,

            // Left 
            4, 0, 3,
            3, 7, 4
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

