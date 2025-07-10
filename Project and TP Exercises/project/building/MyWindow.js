import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import { MyQuad } from '../MyQuad.js';

export class MyWindow extends CGFobject {
    constructor(scene, windowType = null) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.selectedWindowType = windowType;
        this.updateWindowTexture();
    }
    
    updateWindowTexture() {
        // Determine which window type to use
        let windowTypeToUse;
        
        if (this.selectedWindowType === null && this.scene.windowType !== undefined) {
            windowTypeToUse = this.scene.windowType;
        } else if (this.selectedWindowType === null) {
            windowTypeToUse = 2; // default value if the scene doesn't have windowType
        } else {
            windowTypeToUse = this.selectedWindowType;
        }
        
        // Get the appropriate texture
        this.windowType = this.scene.textureHandler.getTexture(`window${windowTypeToUse}`);
        
        // (Re)initialize the material
        this.initMaterials();
    }
    
    initMaterials() {
        this.windowMaterial = new CGFappearance(this.scene);
        if (this.windowType) {
            this.windowMaterial.setTexture(this.windowType);
        }
        this.windowMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    display(width = 0.5, height = 0.5) {
        // Check if the window type has been changed
        if (this.selectedWindowType === null && 
            this.scene.windowType !== undefined) {
            this.updateWindowTexture();
        }
        
        this.windowMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.02);
        this.scene.scale(width, height, 1);
        this.quad.display();
        this.scene.popMatrix();
    }
}