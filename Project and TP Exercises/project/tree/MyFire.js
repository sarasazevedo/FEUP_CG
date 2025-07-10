import { CGFappearance, CGFobject } from '../../lib/CGF.js';

export class MyFire extends CGFobject {
    constructor(scene, base_radius = 1, height = 1) { 
        super(scene);
        this.scene = scene;
        this.base_radius = base_radius;
        this.height = height;
        this.textureHandler = scene.textureHandler;
        
        // Fire Complexity
        this.slices = 18; 
        this.stacks = 15; 

        this.initBuffers();
        this.initMaterials();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        
        for (let stack = 0; stack <= this.stacks; stack++) {
            const stackHeight = stack / this.stacks;
            const height = this.height * stackHeight;
            
            // radius decrease with height to create a cone shape
            const stackRadius = this.base_radius * (1 - stackHeight * 0.9);
            
            for (let slice = 0; slice < this.slices; slice++) {
                const angle = (slice / this.slices) * Math.PI * 2;
                
                // Irregularity
                let xOffset = 0, zOffset = 0;
                if (stack > 0) {
                    
                    xOffset = Math.sin(angle * 3 + stack) * 0.1 * stackHeight;
                    zOffset = Math.cos(angle * 2 + stack * 2) * 0.1 * stackHeight;
                }
                
                
                const x = Math.cos(angle) * stackRadius + xOffset;
                const z = Math.sin(angle) * stackRadius + zOffset;
                
                this.vertices.push(x, height, z);
                
                
                this.normals.push(x, 0, z);
                
                const u = slice / this.slices;
                const v = 1 - stackHeight;
                this.texCoords.push(u, v);
            }
        }
        
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = stack * this.slices + slice;
                const second = stack * this.slices + ((slice + 1) % this.slices);
                const third = (stack + 1) * this.slices + slice;
                const fourth = (stack + 1) * this.slices + ((slice + 1) % this.slices);
                
                this.indices.push(first, second, third);
                this.indices.push(second, fourth, third);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    // Initialize the materials for the fire
    initMaterials() {
        this.fireMaterial = new CGFappearance(this.scene);
        this.fireMaterial.setAmbient(1.0, 0.5, 0.0, 1.0);
        this.fireMaterial.setDiffuse(1.0, 0.4, 0.0, 0.8);
        this.fireMaterial.setSpecular(1.0, 0.8, 0.4, 1.0);
        this.fireMaterial.setEmission(1.0, 0.3, 0.0, 0.9);
        this.fireMaterial.setShininess(100);
        if (this.textureHandler) {
            this.fireMaterial.setTexture(this.textureHandler.getTexture('fire'));
        }
    }

    display() {
        this.fireMaterial.apply();
        super.display();
    }
    displayGeometry() {
        super.display();
    }
}