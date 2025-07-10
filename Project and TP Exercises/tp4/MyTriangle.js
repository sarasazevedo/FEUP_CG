import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangle extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    changeTexCoords(i){
        if(i){
            this.texCoords = [
                0.5, 0.5,
                0.25, 0.75,
                0.75, 0.75,
            ];
        }else{
            this.texCoords = [
                0, 0.5,
                0, 1,
                0.5, 1,
            ];
        }
        this.updateTexCoordsGLBuffers();
    }

    initBuffers() {
        this.vertices = [
            -1, 1, 0,	//0
            -1, -1, 0,	//1
            1, -1, 0,	//2

        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
        ];

        this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
/*
        this.texCoords = [
			0.5, 0.5,
			0.25, 0.75,
			0.75, 0.75,
		];

    this.texCoords = [
        0, 0.5,
        0, 1,
        0.5, 1,
    ];
    */
        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

