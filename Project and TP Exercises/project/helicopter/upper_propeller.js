import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from '../utils/MyCylinder.js';


export class HeliUpperPropeller extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        
        // Create propeller components
        this.hub = new MyCylinder(this.scene, 16,1,1,1, true);
        this.blade = new MyCylinder(this.scene, 8,1,1,1, true);
        this.conector = new MyCylinder(this.scene, 8, 1,0.5,0.5, true);
        
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
        // Draw the central hub 
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0); 
    
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.1); 
        this.scene.rotate(Math.PI/2, 1, 0, 0); 
        this.scene.scale(0.25, 0.25, 0.15);
        this.hubMaterial.apply();
        this.hub.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, -0.3, -0.1);
        this.scene.rotate(Math.PI/2, 1, 0, 0); 
        this.scene.scale(0.25, 0.25, 0.8);
        this.hubMaterial.apply();
        this.conector.display();
        this.scene.popMatrix();

        // Draw the blades with current rotation 
        this.scene.pushMatrix();
        this.scene.rotate(this.rotationAngle, 0, 1, 0);

        // First blade 
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(0.06, 7.6, 0.16);
        this.bladeMaterial.apply();
        this.blade.display();
        this.scene.popMatrix();
        
        // Second blade
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.06, 7.6, 0.16);
        this.bladeMaterial.apply();
        this.blade.display();
        this.scene.popMatrix();
        
        // Third blade
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.scale(0.06, 7.6, 0.16);
        this.bladeMaterial.apply();
        this.blade.display();
        this.scene.popMatrix();
        
        // Fourth blade
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(0.06, 7.6, 0.16);
        this.bladeMaterial.apply();
        this.blade.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}
