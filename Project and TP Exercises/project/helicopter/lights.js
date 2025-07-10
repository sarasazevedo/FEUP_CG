import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MySphere } from '../MySphere.js';

export class lights extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        this.pulsating = true; 
        this.emissionFactor = 0; 
        this.timeAccumulator = 0; 
        this.mode = 'idle'; // 'idle', 'forward', 'backward'

        // Create the four light spheres
        const radius = 0.1; 
        this.front_right = new MySphere(this.scene, 16, 8, radius);
        this.front_left = new MySphere(this.scene, 16, 8, radius);
        this.back_right = new MySphere(this.scene, 16, 8, radius);
        this.back_left = new MySphere(this.scene, 16, 8, radius);

        // Initialize materials
        this.initMaterials();
    }

    initMaterials() {
        // Material when lights are off 
        this.lightOffMaterial = new CGFappearance(this.scene);
        this.lightOffMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.lightOffMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0);
        this.lightOffMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.lightOffMaterial.setShininess(10);

        // Red material for rear lights
        this.redLightMaterial = new CGFappearance(this.scene);
        this.redLightMaterial.setAmbient(0.8, 0.0, 0.0, 1.0); 
        this.redLightMaterial.setDiffuse(0.3, 0.0, 0.0, 1.0);
        this.redLightMaterial.setSpecular(1.0, 0.2, 0.2, 1.0); 
        this.redLightMaterial.setShininess(20); 
        this.redLightMaterial.setEmission(0, 0, 0, 1.0);

        // Green material for front lights
        this.greenLightMaterial = new CGFappearance(this.scene);
        this.greenLightMaterial.setAmbient(0.0, 0.8, 0.0, 1.0);
        this.greenLightMaterial.setDiffuse(0.0, 0.3, 0.0, 1.0);
        this.greenLightMaterial.setSpecular(0.2, 1.0, 0.2, 1.0); 
        this.greenLightMaterial.setShininess(20);
        this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
    }

    update(elapsedTime) {
        if (this.pulsating) {
            this.timeAccumulator += elapsedTime;
            this.emissionFactor = 0.5 + 0.5 * Math.sin(this.timeAccumulator / 300);
            
            if (this.mode === 'forward') {
                // Front Lights
                this.greenLightMaterial.setEmission(
                    0, 
                    this.emissionFactor * 1.0, 
                    0, 
                    1.0
                );
                // Back Lights
                this.redLightMaterial.setEmission(0, 0, 0, 1.0);
            } 
            else if (this.mode === 'backward') {
                // Back Lights
                this.redLightMaterial.setEmission(
                    this.emissionFactor * 1.0,
                    0,
                    0,
                    1.0
                );
                // Front Lights
                this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
            }
            else {
                // All lights off
                this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
                this.redLightMaterial.setEmission(0, 0, 0, 1.0);
            }
        } else {
            // Reset emission when not pulsating
            if (this.emissionFactor !== 0) {
                this.emissionFactor = 0;
                this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
                this.redLightMaterial.setEmission(0, 0, 0, 1.0);
                this.timeAccumulator = 0; 
            }
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(1, -13, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0); 

        const forwardDist = 1.5;
        const sideDist = 1.0;
        const rearDist = -5.5; 
        const height = -1.0; 
        // Front Lights
        // Front Right Light
        this.scene.pushMatrix();
        this.scene.translate(sideDist, height, forwardDist);
        
        if (this.pulsating && this.mode === 'forward') {
            this.greenLightMaterial.apply();
        } else {
            this.lightOffMaterial.apply();
        }
        
        this.front_right.display();
        this.scene.popMatrix();

        // Front Left Light
        this.scene.pushMatrix();
        this.scene.translate(-sideDist, height, forwardDist);
        
        if (this.pulsating && this.mode === 'forward') {
            this.greenLightMaterial.apply();
        } else {
            this.lightOffMaterial.apply();
        }
        
        this.front_left.display();
        this.scene.popMatrix();

        this.scene.popMatrix(); 
        this.scene.pushMatrix();
        this.scene.translate(3, -13, 0);
        this.scene.rotate(Math.PI / 2, 0, 1, 0); 

        // Back Lights
        this.scene.pushMatrix();
        this.scene.translate(0,-1,-6);
        // Back Right Light
        this.scene.pushMatrix();
        this.scene.translate(sideDist * 0.2, height + 0.2, rearDist);
        
        if (this.pulsating && this.mode === 'backward') {
            this.redLightMaterial.apply();
        } else {
            this.lightOffMaterial.apply();
        }
        
        this.back_right.display();
        this.scene.popMatrix();

        // Back Left Light
        this.scene.pushMatrix();
        this.scene.translate(-sideDist * 0.2, height + 0.2, rearDist);
        
        if (this.pulsating && this.mode === 'backward') {
            this.redLightMaterial.apply();
        } else {
            this.lightOffMaterial.apply();
        }
        
        this.back_left.display();
        this.scene.popMatrix(); // Back Left Light

        this.scene.popMatrix(); // Back Lights

        this.scene.popMatrix(); // All lights


    }
}
