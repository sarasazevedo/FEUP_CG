import { CGFobject } from "../lib/CGF.js";
import { MyTree } from "./MyTree.js";
import { MyFire } from "./tree/MyFire.js";

// Only one instance of MyFire is created and reused for all trees
class MyFlorest extends CGFobject {
    constructor(scene, rows, cols) {
        super(scene);
        this.rows = rows;
        this.cols = cols;
        this.totalTrees = rows * cols;
        this.trees = [];
        this.fire = new MyFire(scene);
        
        this.forestWidth = 10;  
        this.forestDepth = 10;  
        
        this.initTrees();
        
        // Flag to control fire rendering
        this.showFire = true;

        // Initialize shader if we have shader handler
        if (this.scene.shaderHandler) {
            this.scene.shaderHandler.loadFireShader().then(shader => {
                console.log("Fire shader loaded successfully");
            }).catch(error => {
                console.error("Error loading fire shader:", error);
            });
        }
    }
    
    initTrees() {
        // Calculate spacing between trees
        const xSpacing = this.forestWidth / this.cols;
        const zSpacing = this.forestDepth / this.rows;
        
        // Create trees with random parameters and positions
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                
                // Base position in the grid
                const baseX = -this.forestWidth/2 + col * xSpacing + xSpacing/2;
                const baseZ = -this.forestDepth/2 + row * zSpacing + zSpacing/2;
                
                // Random position offset 
                const offsetX = (Math.random() - 0.5) * 0.2 * xSpacing;
                const offsetZ = (Math.random() - 0.5) * 0.2 * zSpacing;
                
                const inclination = Math.random() * 20 - 10;
                const radius_base = 0.1 + Math.random() * 0.2;  
                const height = 5 + Math.random() * 5;  
                
                // Generate random green color variations 
                const r = 0.1 + Math.random() * 0.3; 
                const g = 0.4 + Math.random() * 0.3; 
                const b = 0.05 + Math.random() * 0.15; 
                const color_leaves = [r, g, b];
                
                // Random percentage for the leaves
                const percentage = 0.5 + Math.random() * 0.3; 


                const tree = new MyTree(
                    this.scene,
                    inclination,
                    radius_base,
                    height,
                    color_leaves,
                    percentage,
                    true
                );
                
                // Set tree position 
                tree.setPosition(baseX + offsetX, 0, baseZ + offsetZ);
                
                this.trees.push({
                    tree: tree,
                    position: [baseX + offsetX, 0, baseZ + offsetZ]
                });
            }
        }
    }
    

    extinguishAllFires() {
        for (const treeObj of this.trees) {
            const tree = treeObj.tree;
            if (tree && tree.enableFire) {
                tree.enableFire = false;
            }
        }
        return true;
    }

    // Toggle fire visibility
    toggleFire() {
        this.showFire = !this.showFire;
    }
    
    // Collect all fire positions from all trees
    getAllFirePositions() {
        const allFirePositions = [];
        for (const treeObj of this.trees) {
            const worldFirePositions = treeObj.tree.getWorldFirePositions();
            allFirePositions.push(...worldFirePositions);
        }
        return allFirePositions;
    }
    
    // Display all fire effects 
    displayFires() {
        if (!this.showFire) return;
        
        const allFirePositions = this.getAllFirePositions();
        if (allFirePositions.length === 0) return;
        
        // Use fire shader if available
        const fireShader = this.scene.shaderHandler && this.scene.shaderHandler.getShader('fire');
        let previousShader = null;
        
        if (fireShader) {
            previousShader = this.scene.activeShader;
            this.scene.setActiveShader(fireShader);
            
            // Bind the fire texture and noise texture
            if (this.scene.textureHandler) {
                const fireTexture = this.scene.textureHandler.getTexture('fire');
                const noiseTexture = this.scene.textureHandler.getTexture('fireNoise');
                
                if (fireTexture) {
                    fireTexture.bind(0);
                    fireShader.setUniformsValues({ uSampler: 0 });
                }
                
                if (noiseTexture) {
                    noiseTexture.bind(1);
                    fireShader.setUniformsValues({ uSampler2: 1 });
                }
            }
        }
        
        // Apply the fire material once before rendering all fires
        this.fire.fireMaterial.apply();
        
        // Base time value
        const baseTime = (Date.now() / 1000) % 1000;
        
        // Display each fire at its calculated position with unique time
        for (const firePos of allFirePositions) {
            const uniqueTime = baseTime + (firePos.timeOffset || 0);
            
            if (fireShader) {
                fireShader.setUniformsValues({
                    timeFactor: uniqueTime,
                    normScale: 0.3,
                    waveSpeed: firePos.waveSpeed || 1.0,
                    waveAmplitude: firePos.waveAmplitude || 1.0,
                    wavePeriod: firePos.wavePeriod || 1.0
                });
            }
            
            this.scene.pushMatrix();
            this.scene.translate(firePos.posX, firePos.posY, firePos.posZ);
            this.scene.rotate(firePos.angle, 0, 1, 0);
            this.scene.scale(firePos.width, firePos.height, firePos.width * 0.5);
            this.fire.displayGeometry();
            this.scene.popMatrix();
        }
        
        if (fireShader) {
            this.scene.setActiveShader(previousShader);
        }
    }
    
    display() {
        // Render all trees
        for (const treeObj of this.trees) {
            this.scene.pushMatrix();
            this.scene.translate(...treeObj.position);
            treeObj.tree.display();
            this.scene.popMatrix();
        }
        
        // Render all fires 
        this.displayFires();
    }
    
}

export { MyFlorest };