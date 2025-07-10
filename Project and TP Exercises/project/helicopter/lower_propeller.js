import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from '../utils/MyCylinder.js';

export class HeliLowerPropeller extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        
        // Create propeller components
        this.hub = new MyCylinder(this.scene, 8,1,1,1, true);
        this.blade = new MyCylinder(this.scene, 8,1,1,1, true);
        
        this.rotationAngle = 0;
        
        // Initialize materials
        this.initMaterials();
    }
    
    initMaterials() {
        // Hub material
        this.hubMaterial = new CGFappearance(this.scene);
        this.hubMaterial.setTexture(this.textureHandler.getTexture('metal'));
        // Blade material
        this.bladeMaterial = new CGFappearance(this.scene);
        this.bladeMaterial.setTexture(this.textureHandler.getTexture('propeller_texture'));
    }
    
    update(elapsedTime) {
        // Update rotation based on elapsed time
        this.rotationAngle += 0.5 * (elapsedTime / 50); 
        this.rotationAngle %= (2 * Math.PI);
    }
    
    display() {
        
        this.scene.pushMatrix();
        this.scene.translate(-4.2, 1.2, -0.5);

        // Draw the hub 
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.04);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(0.12, 0.12, 0.08);
        this.hubMaterial.apply();
        this.hub.display();
        this.scene.popMatrix();
        
        // blades 
        this.scene.pushMatrix();
        this.scene.translate(-0.05, -0.01, 0);
        this.scene.rotate(this.rotationAngle, 0, 0, 1);
        
        // First blade 
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(0.04, 0.04, 1.2);
        this.bladeMaterial.apply();
        this.blade.display();
        this.scene.popMatrix();
        
        // Second blade
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.scale(0.04, 0.04, 1.2);
        this.bladeMaterial.apply();
        this.blade.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}
