import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import { MyQuad } from '../MyQuad.js';
import { heliport_lights } from './heliport_lights.js';

export class MyHeliport extends CGFobject {
    constructor(scene, textureHandler) { 
        super(scene);
        this.quad = new MyQuad(scene);
        this.moduleWidth = 3.0; 
        this.textureHandler = textureHandler; 
        this.blinkInterval = 300; 
        this.heliport_lights = new heliport_lights(scene, textureHandler);

        this.initMaterials();
    }

    initMaterials() {
        // 'H' Texture Material
        this.texturedHeliportMaterial = new CGFappearance(this.scene);
        this.texturedHeliportMaterial.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.texturedHeliportMaterial.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.texturedHeliportMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.texturedHeliportMaterial.setShininess(10.0);
        this.texturedHeliportMaterial.setTexture(this.textureHandler.getTexture('heliport'));
        
        // 'Up' Texture Material
        this.upMaterial = new CGFappearance(this.scene);
        this.upMaterial.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.upMaterial.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.upMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.upMaterial.setShininess(10.0);
        this.upMaterial.setTexture(this.textureHandler.getTexture('up')); 

        // 'Down' Texture Material
        this.downMaterial = new CGFappearance(this.scene);
        this.downMaterial.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.downMaterial.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.downMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.downMaterial.setShininess(10.0);
        this.downMaterial.setTexture(this.textureHandler.getTexture('down')); 
    }

    update(elapsedTime) {
        this.heliport_lights.update(elapsedTime);
    }

    display(posY, heliState = 'idle', t = 0) { 
        const showAlternate = Math.floor(t / this.blinkInterval) % 2 === 1;
        
        // Select material based on heliState and blinking logic
        switch (heliState) {
            case 'taking_off':
                if (showAlternate) {
                    this.upMaterial.apply();
                } else {
                    this.texturedHeliportMaterial.apply();
                }
                // Green lights for takeoff
                this.heliport_lights.setGreenLights(showAlternate);
                break;
            case 'landing':
                 if (showAlternate) {
                    this.downMaterial.apply();
                } else {
                    this.texturedHeliportMaterial.apply();
                }
                // Red lights for landing
                this.heliport_lights.setRedLights(showAlternate);
                break;
            default: 
                this.texturedHeliportMaterial.apply();
                // Turn off colored lights in neutral state
                this.heliport_lights.resetLights();
                break;
        }

        this.scene.pushMatrix();
        this.scene.translate(0, posY + 0.01, 0); 
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(2.5, 2, 1); 
        this.quad.display();
        this.scene.popMatrix();
        // Display the lights
        this.heliport_lights.display();
    }
}
