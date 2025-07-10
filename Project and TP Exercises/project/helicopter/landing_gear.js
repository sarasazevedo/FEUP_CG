import { CGFappearance, CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from '../utils/MyCylinder.js';

export class HeliLandingGear extends CGFobject {
    constructor(scene, textureHandler) {
        super(scene);
        this.scene = scene;
        this.textureHandler = textureHandler;
        
        // Create landing gear components
        this.leg = new MyCylinder(this.scene, 8,1,1,1, true);
        this.foot = new MyCylinder(this.scene, 16,1,1,1, true);
        
        // Initialize materials
        this.initMaterials();
    }
    
    initMaterials() {
        // Landing gear material
        this.gearMaterial = new CGFappearance(this.scene);
        this.gearMaterial.setTexture(this.textureHandler.getTexture('landing_gear'));
    }
    
    display() {
        this.gearMaterial.apply();
        
        // ------- LEFT SKID -------
        this.scene.pushMatrix();
        this.scene.translate(-0.9, -1.4, 0);
        
        // Left front leg
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1.6);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.08, 0.08, 0.7);
        this.leg.display();
        this.scene.popMatrix();
        
        // Left rear leg
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -1.6);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.08, 0.08, 0.7);
        this.leg.display();
        this.scene.popMatrix();
        
        
        this.scene.popMatrix();
        
        // ------- RIGHT SKID -------
        this.scene.pushMatrix();
        this.scene.translate(0.9, -1.4, 0);
        
        // Right front leg
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1.6);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.08, 0.08, 0.7);
        this.leg.display();
        this.scene.popMatrix();
        
        // Right rear leg
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -1.6);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(0.08, 0.08, 0.7);
        this.leg.display();
        this.scene.popMatrix();
        
        this.scene.popMatrix();

        // Right skid bar (foot)
        this.scene.pushMatrix();
        this.scene.translate(0, -2.2, -1.55);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(0.08, 0.12, 3.2);
        this.foot.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -2.2, 1.65);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(0.08, 0.12, 3.2);
        this.foot.display();
        this.scene.popMatrix();
    }
}
