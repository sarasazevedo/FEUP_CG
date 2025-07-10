import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from '../utils/MyCylinder.js';

export class HeliTail extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        
        // Create tail components
        this.tailBoom = new MyCylinder(this.scene, 16,1,1,1, true);
        this.tailFin = new MyCylinder(this.scene, 8,0.3,1,1, true);
        
        // Initialize materials
        this.initMaterials();
    }
    
    initMaterials() {
        // Tail boom material
        this.tailMaterial = new CGFappearance(this.scene);
        this.tailMaterial.setTexture(this.textureHandler.getTexture('metal'));
        
        // Tail fin material
        this.finMaterial = new CGFappearance(this.scene);
        this.finMaterial.setTexture(this.textureHandler.getTexture('metal'));
    }
    
    display() {
        // Draw the tail boom 
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0); 
        this.scene.translate(0, 0, -4); 
        this.scene.scale(0.35, 0.35, 5.0); 
        this.tailMaterial.apply();
        this.tailBoom.display();
        this.scene.popMatrix();
                
        // Draw the vertical tail fin 
        this.scene.pushMatrix();
        this.scene.translate(-9.5, 1, -0.04); 
        this.scene.rotate(Math.PI/2, 1, 0, 0); 
        this.scene.rotate(1, 0, 1, 0); 
        this.scene.scale(0.2, 0.2, 1.6);
        this.finMaterial.apply();
        this.tailFin.display();
        this.scene.popMatrix();
    }
}
