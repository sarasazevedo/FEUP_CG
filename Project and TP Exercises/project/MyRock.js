import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';

export class MyRock extends CGFobject {
    constructor(scene, slices = 8, stacks = 6) {
        super(scene);
        this.scene = scene;
        this.slices = slices;
        this.stacks = stacks;
        
        // Generate random deformation factors for this rock instance
        this.deformationSeed = Math.random() * 1000;
        this.minDeformation = 0.7;  // How much the rock can shrink
        this.maxDeformation = 1.3;  // How much the rock can expand
        
        this.initBuffers();
        this.initMaterials();
        
        // Store random rotation for consistent display
        this.randomRotation = Math.random() * 2 * Math.PI;
    }
    
    initMaterials() {
        this.material = new CGFappearance(this.scene);
        this.material.setShininess(10);
        
        // Rock color with slightly more variation
        const colorVar = Math.random() * 0.1;
        const baseColor = 0.45 + colorVar;
        this.material.setAmbient(baseColor - 0.05, baseColor - 0.05, baseColor - 0.05, 1.0);
        this.material.setDiffuse(baseColor, baseColor, baseColor, 1.0);
        this.material.setSpecular(0.2, 0.2, 0.2, 1.0);
        
        // Load and apply rock texture
        try {
            // First try to get texture from the texture handler if available
            const rockTexture = this.scene.textureHandler?.getTexture('rock');
            if (rockTexture) {
                this.material.setTexture(rockTexture);
            } else {
                // Direct texture loading as fallback
                this.rockTexture = new CGFtexture(this.scene, 'project/textures/rock.jpg');
                this.material.setTexture(this.rockTexture);
            }
        } catch (error) {
            console.warn("Could not load rock texture:", error);
        }
    }
    
    // Deterministic random based on position and seed
    getVertexDeformation(phi, theta) {
        const val = Math.sin(phi * 4 + this.deformationSeed) * 
                   Math.cos(theta * 3 + this.deformationSeed) * 
                   Math.sin(phi * theta * 2 + this.deformationSeed);
                   
        // Map to our deformation range
        return this.minDeformation + (val + 1) * 0.5 * (this.maxDeformation - this.minDeformation);
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        // Create vertices array to store original positions before deformation
        // This helps with normal calculation
        const originalVertices = [];
        const deformedVertices = [];
        
        // Generate vertices for a complete sphere with deformations
        for (let latNumber = 0; latNumber <= this.stacks; latNumber++) {
            const phi = latNumber * Math.PI / this.stacks;
            
            for (let longNumber = 0; longNumber <= this.slices; longNumber++) {
                const theta = longNumber * 2 * Math.PI / this.slices;
                
                // Calculate coordinates for a perfect sphere
                const x = Math.sin(phi) * Math.cos(theta);
                const y = Math.sin(phi) * Math.sin(theta);
                const z = Math.cos(phi);
                
                originalVertices.push([x, y, z]);
                
                // Apply random deformation
                const deformation = this.getVertexDeformation(phi, theta);
                deformedVertices.push([x * deformation, y * deformation, z * deformation]);
                
                // Add texture coordinates
                this.texCoords.push(longNumber / this.slices, latNumber / this.stacks);
            }
        }
        
        // Add deformed vertices to buffer
        for (const vertex of deformedVertices) {
            this.vertices.push(...vertex);
        }
        
        // Generate indices for triangles
        for (let latNumber = 0; latNumber < this.stacks; latNumber++) {
            for (let longNumber = 0; longNumber < this.slices; longNumber++) {
                const first = (latNumber * (this.slices + 1)) + longNumber;
                const second = first + this.slices + 1;
                
                // Two triangles per quad
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }
        
        // Calculate normals - approximate by using the original sphere direction
        // This gives better lighting than trying to calculate deformed normals
        for (let i = 0; i < originalVertices.length; i++) {
            const [x, y, z] = originalVertices[i];
            const length = Math.sqrt(x*x + y*y + z*z);
            this.normals.push(x/length, y/length, z/length);
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    display() {
        this.material.apply();
        this.scene.pushMatrix();
        super.display();
        this.scene.popMatrix();
    }
}