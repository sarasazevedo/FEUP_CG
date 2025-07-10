import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MySphere } from '../MySphere.js';

export class heliport_lights extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        this.pulsating = true; 
        this.emissionFactor = 0; 
        this.timeAccumulator = 0; 
        this.mode = 'idle'; // 'idle', 'landing', 'taking_off'
        this.showColoredLights = false; 

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

        // Red material for landing lights
        this.redLightMaterial = new CGFappearance(this.scene);
        this.redLightMaterial.setAmbient(1.0, 0.0, 0.0, 1.0); 
        this.redLightMaterial.setDiffuse(0.5, 0.0, 0.0, 1.0); 
        this.redLightMaterial.setSpecular(1.0, 0.3, 0.3, 1.0); 
        this.redLightMaterial.setShininess(30); 
        this.redLightMaterial.setEmission(0, 0, 0, 1.0);

        // Green material for takeoff lights
        this.greenLightMaterial = new CGFappearance(this.scene);
        this.greenLightMaterial.setAmbient(0.0, 1.0, 0.0, 1.0); 
        this.greenLightMaterial.setDiffuse(0.0, 0.5, 0.0, 1.0); 
        this.greenLightMaterial.setSpecular(0.3, 1.0, 0.3, 1.0); 
        this.greenLightMaterial.setShininess(30); 
        this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
    }


    // Green lights (for takeoff)
    setGreenLights(active) {
        this.mode = 'taking_off';
        this.showColoredLights = active;
        
        if (active) {
            this.greenLightMaterial.setEmission(0, this.emissionFactor * 1.0, 0, 1.0);
            this.redLightMaterial.setEmission(0, 0, 0, 1.0);
        } else {
            this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
        }
    }
    
    // Red lights (for landing)
    setRedLights(active) {
        this.mode = 'landing';
        this.showColoredLights = active;
        
        if (active) {
            this.redLightMaterial.setEmission(this.emissionFactor * 1.0, 0, 0, 1.0);
            this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
        } else {
            this.redLightMaterial.setEmission(0, 0, 0, 1.0);
        }
    }
    
    // Turn off all lights
    resetLights() {
        this.mode = 'idle';
        this.showColoredLights = false;
        this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
        this.redLightMaterial.setEmission(0, 0, 0, 1.0);
    }

    setMode(mode) {
        this.mode = mode;
    }

    update(elapsedTime) {
        if (this.pulsating) {
            this.timeAccumulator += elapsedTime;
            this.emissionFactor = 0.5 + 0.5 * Math.sin(this.timeAccumulator / 300);
            
            // Update the emission factor for the lights
            if (this.showColoredLights) {
                if (this.mode === 'taking_off') {
                    this.greenLightMaterial.setEmission(
                        0, 
                        this.emissionFactor * 1.0, 
                        0, 
                        1.0
                    );
                } 
                else if (this.mode === 'landing') {
                    this.redLightMaterial.setEmission(
                        this.emissionFactor * 1.0,
                        0,
                        0,
                        1.0
                    );
                }
            }
        } else {
            if (this.emissionFactor !== 0) {
                this.emissionFactor = 0;
                this.greenLightMaterial.setEmission(0, 0, 0, 1.0);
                this.redLightMaterial.setEmission(0, 0, 0, 1.0);
                this.timeAccumulator = 0; 
            }
        }
    }

    display() {
                    
        // Front Lights
        this.scene.pushMatrix();
            this.scene.translate(1, -13, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0); 

            // Front Right Light
            this.scene.pushMatrix();
                this.scene.translate(1, 2, 0.2);

                if (this.showColoredLights) {
                    if (this.mode === 'taking_off') {
                        this.greenLightMaterial.apply();
                    } else if (this.mode === 'landing') {
                        this.redLightMaterial.apply();
                    } else {
                        this.lightOffMaterial.apply();
                    }
                } else {
                    this.lightOffMaterial.apply();
                }

                this.front_right.display();
            this.scene.popMatrix();
            
            // Front Left Light
            this.scene.pushMatrix();
                this.scene.translate(-1, 2, 0.2);

                if (this.showColoredLights) {
                    if (this.mode === 'taking_off') {
                        this.greenLightMaterial.apply();
                    } else if (this.mode === 'landing') {
                        this.redLightMaterial.apply();
                    } else {
                        this.lightOffMaterial.apply();
                    }
                } else {
                    this.lightOffMaterial.apply();
                }
            
                this.front_left.display();
            this.scene.popMatrix();
            
        this.scene.popMatrix(); 

        // ----------------------------------------------
        // Back Lights
        this.scene.pushMatrix();
            this.scene.translate(3, -13, 0);
            this.scene.rotate(Math.PI / 2, 0, 1, 0); 
            
            // Back Right Light
            this.scene.pushMatrix();
                this.scene.translate(-1, 2, -4.2);               
                if (this.showColoredLights) {
                    if (this.mode === 'taking_off') {
                        this.greenLightMaterial.apply();
                    } else if (this.mode === 'landing') {
                        this.redLightMaterial.apply();
                    } else {
                        this.lightOffMaterial.apply();
                    }
                } else {
                    this.lightOffMaterial.apply();
                }
            
                this.back_right.display();
            this.scene.popMatrix();
            
            // Back Left Light
            this.scene.pushMatrix();
                this.scene.translate(1, 2, -4.2);               
                if (this.showColoredLights) {
                    if (this.mode === 'taking_off') {
                        this.greenLightMaterial.apply();
                    } else if (this.mode === 'landing') {
                        this.redLightMaterial.apply();
                    } else {
                        this.lightOffMaterial.apply();
                    }
                } else {
                    this.lightOffMaterial.apply();
                }               
                this.back_left.display();
            this.scene.popMatrix(); 

        this.scene.popMatrix(); // All lights
    }
}
