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
        // Front face
        -0.5, -0.5,  0.5,  //0
         0.5, -0.5,  0.5,  //1
         0.5,  0.5,  0.5,  //2
        -0.5,  0.5,  0.5,  //3
        
        // Back face
        -0.5, -0.5, -0.5,  //4
         0.5, -0.5, -0.5,  //5
         0.5,  0.5, -0.5,  //6
        -0.5,  0.5, -0.5,  //7
        
        // Top face
        -0.5,  0.5,  0.5,  //8
         0.5,  0.5,  0.5,  //9
         0.5,  0.5, -0.5,  //10
        -0.5,  0.5, -0.5,  //11
        
        // Bottom face
        -0.5, -0.5,  0.5,  //12
         0.5, -0.5,  0.5,  //13
         0.5, -0.5, -0.5,  //14
        -0.5, -0.5, -0.5,  //15
        
        // Right face
         0.5, -0.5,  0.5,  //16
         0.5, -0.5, -0.5,  //17
         0.5,  0.5, -0.5,  //18
         0.5,  0.5,  0.5,  //19
        
        // Left face
        -0.5, -0.5,  0.5,  //20
        -0.5, -0.5, -0.5,  //21
        -0.5,  0.5, -0.5,  //22
        -0.5,  0.5,  0.5   //23
        ];

        this.indices = [
            // Front face
            0, 1, 2,
            2, 3, 0,
            
            // Back face
            4, 6, 5,
            6, 4, 7,
            
            // Top face
            8, 9, 10,
            10, 11, 8,
            
            // Bottom face
            12, 14, 13,
            14, 12, 15,
            
            // Right face
            16, 17, 18,
            18, 19, 16,
            
            // Left face
            20, 22, 21,
            22, 20, 23
        ];

        this.normals = [
            // Front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            
            // Back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            
            // Top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            
            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            
            // Right face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            
            // Left face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

