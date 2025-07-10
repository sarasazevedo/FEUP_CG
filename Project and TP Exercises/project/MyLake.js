import {CGFobject, CGFappearance} from '../lib/CGF.js';
import {MyRock} from './MyRock.js';

export class MyLake extends CGFobject {
	constructor(scene, size = 50, slices = 30) {
		super(scene);
        this.scene = scene;
        this.size = size;
        this.slices = slices;
        this.position = { x: 0, y: 0.8, z: 60 }; 
		
        this.rocks = [];
        this.createRocks();
		
		this.initBuffers();
		this.initMaterials();
	}
	
	initMaterials() {
		this.material = new CGFappearance(this.scene);
		this.material.setShininess(80);

		this.material.setAmbient(0.7, 0.7, 0.7, 1.0);
		this.material.setDiffuse(0.9, 0.9, 0.9, 1.0);
		this.material.setSpecular(0.1, 0.1, 0.1, 1.0); 

		const waterTexture = this.scene.textureHandler?.getTexture('water');
		if (waterTexture) {
			this.material.setTexture(waterTexture);
		}
		this.material.setTextureWrap('REPEAT', 'REPEAT');
	}

	createRocks() {
        // Number of rocks to place around the lake
        const numRocks = 18;
        
        // Create rocks in a circle around the lake
        for (let i = 0; i < numRocks; i++) {
            // Calculate position on the circle
            const angle = (i * 2 * Math.PI) / numRocks;
            
            // Add some randomness to the placement
            const angleVariation = Math.random() * 0.2 - 0.1;
            
            const finalAngle = angle + angleVariation;
            const radius = this.size * 0.5; // Place at the edge of lake
            
            // Position on XZ plane with y=0
            const x = this.position.x + Math.cos(finalAngle) * radius;
            const z = this.position.z + Math.sin(finalAngle) * radius;
            
            // Create a rock with random size
            const rock = new MyRock(this.scene);
            
            // Scale randomly to vary rock sizes
            const scaleBase = 5;
            const scaleX = scaleBase * 1.5;
            const scaleY = scaleBase;
            const scaleZ = scaleBase * 1.5;
            
            // Random rotation around Y axis
            const rotationY = Math.random() * Math.PI * 2;
            
            // Store rock parameters
            this.rocks.push({
                rock: rock,
                position: { x, y: 0, z }, 
                scale: { x: scaleX, y: scaleY, z: scaleZ },
                rotation: rotationY
            });
        }
    }
	
	display() {
		this.scene.pushMatrix();
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.scale(this.size, 1, this.size);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
		
		if (this.material.texture) {
			this.material.apply();
		}
		
		super.display();
		
		this.scene.popMatrix();

		for (const rockData of this.rocks) {
            this.scene.pushMatrix();
            this.scene.translate(rockData.position.x, rockData.position.y, rockData.position.z);
            this.scene.rotate(rockData.rotation, 0, 1, 0);
            this.scene.scale(rockData.scale.x,rockData.scale.y, rockData.scale.z);
            rockData.rock.display();
            this.scene.popMatrix();
        }
    
	}
	
	initBuffers() {
		this.vertices = [];
		this.normals = [];
		this.texCoords = [];
		this.indices = [];
		
		// Center vertex
		this.vertices.push(0, 0, 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5, 0.5);
		
		// Create vertices in a circle
		for (let i = 0; i <= this.slices; i++) {
			const angle = (i * 2 * Math.PI) / this.slices;
			const x = Math.cos(angle) * 0.5; 
			const y = Math.sin(angle) * 0.5;
			
			this.vertices.push(x, y, 0);
			this.normals.push(0, 0, 1);
			
			const s = 0.5 + x; 
			const t = 0.5 + y;
			this.texCoords.push(s, t);
		}
		
		// Create triangle fan indices
		for (let i = 1; i <= this.slices; i++) {
			this.indices.push(0, i, (i % this.slices) + 1);
		}
		
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}


}


