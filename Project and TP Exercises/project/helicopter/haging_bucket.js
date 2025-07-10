import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from '../utils/MyCylinder.js';


export class HeliHangingBucket extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        this.haswater = false; 
        
        // Animation properties
        this.isDropping = false;
        this.dropProgress = 0; 
        this.dropDuration = 4.0; 
        this.dropParticles = [];
        this.maxParticles = 150;
    
        
        // Deployment animation properties
        this.isDeploying = false;
        this.isRetracting = false;
        this.deployProgress = 0;
        this.deployDuration = 2.0; // 2 seconds to deploy/retract
        this.maxDeployDistance = 6.0; // Maximum distance the bucket extends
        
        // Create bucket components
        this.bucket = new MyCylinder(this.scene, 16,1,1,1, true, true);
        this.rope = new MyCylinder(this.scene, 8,1,1,1, true);

        // Create water components
        this.waterCylinder = new MyCylinder(this.scene, 16,1,1,1, true, false);
        this.waterDrop = new MyCylinder(this.scene, 16, 1, 1, 1, true, false);
        this.initMaterials();
    }
    
    initMaterials() {
        // Bucket material
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setTexture(this.textureHandler.getTexture('landing_gear'));
        
        // Rope material
        this.ropeMaterial = new CGFappearance(this.scene);
        this.ropeMaterial.setTexture(this.textureHandler.getTexture('rope'));
        
        // Water material
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setShininess(80);
        this.waterMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
        this.waterMaterial.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.waterMaterial.setSpecular(0.1, 0.1, 0.1, 1.0); 
        const waterTexture = this.scene.textureHandler?.getTexture('water');
        if (waterTexture) {
            this.waterMaterial.setTexture(waterTexture);
        }
        this.waterMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    // Start deployment animation
    startDeployment() {
        if (!this.isDeploying && !this.isRetracting && this.deployProgress < 1) {
            this.isDeploying = true;
            this.isRetracting = false;
        }
    }
    
    // Start retraction animation
    startRetraction() {
        if (!this.isRetracting && !this.isDeploying && this.deployProgress > 0) {
            this.isRetracting = true;
            this.isDeploying = false;
        }
    }

    fill_bucket() {
        this.haswater = !this.haswater; 
        this.isDropping = false;
        this.dropProgress = 0;
        this.dropParticles = [];
    }
    
    startDropAnimation() {
        if (this.haswater && !this.isDropping) {
            this.isDropping = true;
            this.dropProgress = 0;
            
            // Initialize particles
            this.dropParticles = [];
            for (let i = 0; i < this.maxParticles; i++) {
                this.dropParticles.push({
                    x: (Math.random() - 0.5) * 0.6,
                    y: 0,
                    z: (Math.random() - 0.5) * 0.6,
                    speed: 9 + Math.random() * 5,
                    size: 0.1 + Math.random() * 0.2,
                    delay: Math.random() * 0.8
                });
            }
            return true;
        }
        return false;
    }
    
    update(deltaTime) {
        // Update deployment animation
        if (this.isDeploying) {
            this.deployProgress += deltaTime / this.deployDuration;
            if (this.deployProgress >= 1) {
                this.deployProgress = 1;
                this.isDeploying = false;
            }
        }
        
        // Update retraction animation
        if (this.isRetracting) {
            this.deployProgress -= deltaTime / this.deployDuration;
            if (this.deployProgress <= 0) {
                this.deployProgress = 0;
                this.isRetracting = false;
            }
        }
        
        // Update water drop animation
        if (this.isDropping) {
            // Progress the animation
            this.dropProgress += deltaTime / this.dropDuration;
            
            // Update particles
            for (let particle of this.dropParticles) {
                if (this.dropProgress > particle.delay) {
                    particle.y -= particle.speed * deltaTime;
                }
            }
            
            // Check if the drop animation is complete
            if (this.dropProgress >= 1) {
                this.haswater = false;
                // Reset drop progress for next drop
                if (this.dropProgress >= 2) {
                    this.isDropping = false;
                    this.dropProgress = 0;
                    this.dropParticles = [];
                }
            }
        }
    }
    
    display() {
        // Calculate current deployment position using easing function
        const easeInOut = (t) => {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        };
        
        const currentDeployment = easeInOut(this.deployProgress) * this.maxDeployDistance;
        
        // Draw the rope with dynamic length
        this.scene.pushMatrix();
        this.scene.translate(0, -currentDeployment, 0); 
        this.scene.scale(0.04, currentDeployment, 0.04); 
        this.ropeMaterial.apply();
        this.rope.display();
        this.scene.popMatrix();
        
        // Draw the bucket at the end of the rope
        this.scene.pushMatrix();
        this.scene.translate(0, -currentDeployment - 0.7, 0); 
        
        // Bucket body
        this.scene.pushMatrix();
        this.scene.translate(0, 0.3, 0); 
        this.scene.scale(0.8, 0.8, 0.8);
        this.bucketMaterial.apply();
        this.bucket.display();
        this.scene.popMatrix();
        
        // Display water in bucket if it has water and not fully dropping
        // Lower the water level if dropping
        if (this.haswater && (!this.isDropping || this.dropProgress < 0.7)) {
            this.scene.pushMatrix();
            this.scene.translate(0, 0.4, 0); 
            let waterHeight = 0.2;
            if (this.isDropping) {
                waterHeight *= (1 - (this.dropProgress / 0.7));
            }
            this.scene.scale(0.75, waterHeight, 0.75);
            this.waterMaterial.apply();
            this.waterCylinder.display();
            this.scene.popMatrix();
        }
        
        // Display water particles when dropping
        if (this.isDropping) {
            this.waterMaterial.apply();
            for (let particle of this.dropParticles) {
                if (this.dropProgress > particle.delay) {
                    this.scene.pushMatrix();
                    this.scene.translate(particle.x, particle.y, particle.z);
                    this.scene.scale(particle.size, particle.size, particle.size);
                    this.waterDrop.display();
                    this.scene.popMatrix();
                }
            }
        }
        
        this.scene.popMatrix();
    }
}