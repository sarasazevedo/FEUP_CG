import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MySphere } from '../MySphere.js';

export class HeliHead extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        
        // Create the body/cabin components
        this.cabin = new MySphere(this.scene, 32, 16, 1);
        this.windshield = new MySphere(this.scene, 32, 16, 0.8);
        
        // Initialize materials and textures
        this.initMaterials();
    }
    initMaterials() {
        // Main cabin material
        this.cabinMaterial = new CGFappearance(this.scene);
        this.cabinMaterial.setAmbient(0.3, 0.3, 0.3, 0.8);
        this.cabinMaterial.setDiffuse(0.7, 0.7, 0.7, 0.8); 
        this.cabinMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.cabinMaterial.setShininess(120);
        this.cabinMaterial.setTexture(this.textureHandler.getTexture('glass'));
        
        // Windshield material
        this.windshieldMaterial = new CGFappearance(this.scene);
        this.windshieldMaterial.setTexture(this.textureHandler.getTexture('metal'));

    }
    display() {
        // Draw the main cabin body 
        this.scene.pushMatrix();
        this.scene.scale(1.4, 1, 1.4); 
        this.scene.translate(2, -14.85, 0); 
        this.cabinMaterial.apply();
        this.cabin.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.scale(5, 2, 2.6); 
        this.scene.translate(0, -15, 0); 
        this.windshieldMaterial.apply();
        this.windshield.display();
        this.scene.popMatrix();
    }
}
