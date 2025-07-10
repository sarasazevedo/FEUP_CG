import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';
import { MyQuad } from '../MyQuad.js';

// Door and sign for the building entrance
export class MyBuildingEntrance extends CGFobject {
    constructor(scene, signTexture, doortexture) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.moduleWidth = 3.0;
        this.signTexture = signTexture;
        this.doorTexture = doortexture;
        
        this.initMaterials(signTexture);
    }
    
    initMaterials() {
        // Door material
        this.doorMaterial = new CGFappearance(this.scene);
        this.doorMaterial.setAmbient(0.6, 0.3, 0.3, 1.0);
        this.doorMaterial.setDiffuse(0.8, 0.4, 0.4, 1.0);
        this.doorMaterial.setSpecular(0.2, 0.1, 0.1, 1.0);
        this.doorMaterial.setShininess(5.0);
        
        // Sign material
        this.signMaterial = new CGFappearance(this.scene);
        this.signMaterial.setTexture(this.signTexture);

        this.doorMaterial = new CGFappearance(this.scene);
        this.doorMaterial.setTexture(this.doorTexture);
    }
        

    //Draws the main door and sign in the central module
    display() {
        // Door size and position
        const doorWidth = 1.5;
        const doorHeight = 0.6;
        const doorX = 0;
        const doorY = doorHeight / 2;
        const doorZ = this.moduleWidth / 2 + 0.03; 
        
        // Draw door
        this.doorMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(doorX, doorY, doorZ);
        this.scene.scale(doorWidth, doorHeight, 1);
        this.doorMaterial.setTexture(this.doorTexture);
        this.doorMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();
        
        // Draw sign above the door
        const signWidth = doorWidth;
        const signHeight = 0.4;
        const signX = doorX;
        const signY = doorHeight + signHeight / 2;
        const signZ = doorZ;
        
        this.signMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(signX, signY, signZ);
        this.scene.scale(signWidth, signHeight, 1);
        
 
        if (this.signTexture) {
            this.signMaterial.setTexture(this.signTexture);
            this.signMaterial.apply();
        }
        
        this.quad.display();
        this.scene.popMatrix();
    }
}
