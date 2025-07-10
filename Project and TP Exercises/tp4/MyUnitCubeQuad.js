import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 * @param texture_top - Texture for top face (+Y)
 * @param texture_bottom - Texture for bottom face (-Y)
 * @param texture_front - Texture for front face (+Z)
 * @param texture_right - Texture for right face (+X)
 * @param texture_back - Texture for back face (-Z)
 * @param texture_left - Texture for left face (-X)
 */

export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, texture_top, texture_bottom, texture_front, texture_right, texture_back, texture_left) {
        super(scene);
        this.quad = new MyQuad(scene);
        
        // Store textures
        this.texture_top = texture_top;
        this.texture_bottom = texture_bottom;
        this.texture_front = texture_front;
        this.texture_right = texture_right;
        this.texture_back = texture_back;
        this.texture_left = texture_left;
        
        this.initBuffers();
    }
    
    display() {
        // Front (+Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.texture_front.bind();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.quad.display();
        this.scene.popMatrix();

        // Back (-Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0); 
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.texture_back.bind();
        this.quad.display();
        this.scene.popMatrix();

        // Left (-X)
        this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        this.texture_left.bind();
        this.quad.display();    
        this.scene.popMatrix();

        // Right (+X)
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);  
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.texture_right.bind();
        this.quad.display();
        this.scene.popMatrix();

        // Top (+Y)
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.texture_top.bind();
        this.quad.display();
        this.scene.popMatrix();

        // Bottom (-Y)
        this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.texture_bottom.bind();
        this.quad.display();
        this.scene.popMatrix();
    }
}

