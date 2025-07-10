import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import { MyQuad } from '../MyQuad.js';
import { MyWindow } from './MyWindow.js';

export class MyBuilding extends CGFobject {
    constructor(scene, buildingWidth,  windowsPerFloor, windowType, buildingColor ) {
        super(scene);
        this.quad = new MyQuad(scene);
        this.window = new MyWindow(scene, windowType);
        this.floorHeight = 1.0;
        this.moduleWidth = buildingWidth / 3; // Divide building width by 3 modules
        this.windowsPerFloor = windowsPerFloor;
        this.buildingColor = buildingColor;
        
        
        this.initMaterials();
    }
    
    initMaterials() {
        // Building material
        this.buildingMaterial = new CGFappearance(this.scene);
        this.buildingMaterial.setAmbient(this.buildingColor[0], this.buildingColor[1], this.buildingColor[2], 1.0);
        this.buildingMaterial.setDiffuse(this.buildingColor[0] + 0.1, this.buildingColor[1] + 0.1, this.buildingColor[2] + 0.1, 1.0);
        this.buildingMaterial.setSpecular(0.2, 0.2, 0.2, 1.0);
        this.buildingMaterial.setShininess(10.0);
    }
    
    
    //Draws a quad with the specified dimensions at the given position 
    drawQuad(width, height, x, y, z, rotationAxis, rotationAngle) {
        this.scene.pushMatrix();
        this.scene.translate(x, y, z);
        if (rotationAxis && rotationAngle) {
            this.scene.rotate(rotationAngle, ...rotationAxis);
        }
        this.scene.scale(width, height, 1);
        this.quad.display();
        this.scene.popMatrix();
    }
    
    
    //Draws a module of the building
    display(x, numFloors) {
        // Height of the module
        const moduleHeight = numFloors * this.floorHeight;
        const halfWidth = this.moduleWidth / 2;
        
        // Module walls - front
        this.buildingMaterial.apply();
        this.drawQuad(
            this.moduleWidth, moduleHeight, 
            x, moduleHeight/2, this.moduleWidth/2,
            [0, 0, 0], 0
        );
        
        // Add windows to the front face
        this.addWindows(x, numFloors);
        
        // Module walls - back
        this.buildingMaterial.apply();
        this.drawQuad(
            this.moduleWidth, moduleHeight, 
            x, moduleHeight/2, -this.moduleWidth/2,
            [0, 1, 0], Math.PI
        );
        
        // Module walls - left
        this.drawQuad(
            this.moduleWidth, moduleHeight, 
            x - halfWidth, moduleHeight/2, 0,
            [0, 1, 0], -Math.PI / 2
        );
        
        // Module walls - right
        this.drawQuad(
            this.moduleWidth, moduleHeight, 
            x + halfWidth, moduleHeight/2, 0,
            [0, 1, 0], Math.PI / 2
        );
        
        // Module roof
        this.drawQuad(
            this.moduleWidth, this.moduleWidth, 
            x, moduleHeight, 0,
            [1, 0, 0], -Math.PI / 2
        );
        
        // Module floor
        this.drawQuad(
            this.moduleWidth, this.moduleWidth, 
            x, 0, 0,
            [1, 0, 0], Math.PI / 2
        );
    }
    
    
    //Adds windows to the building module
    addWindows(x, numFloors) {
        const windowWidth = 0.5;
        const windowHeight = 0.3;
        const windowSpacing = 0.5;
        const zOffset = this.moduleWidth / 2 + 0.001; 
        
        for (let floor = 0; floor < numFloors; floor++) {
            const floorY = floor * this.floorHeight + 0.5; 
            const totalWindowsWidth = this.windowsPerFloor * windowWidth;
            const totalSpacingWidth = (this.windowsPerFloor - 1) * windowSpacing;
            const startX = x - (totalWindowsWidth + totalSpacingWidth) / 2 + windowWidth / 2;
            
            for (let i = 0; i < this.windowsPerFloor; i++) {
                const windowX = startX + i * (windowWidth + windowSpacing);
                
                this.scene.pushMatrix();
                this.scene.translate(windowX, floorY, zOffset);
                this.window.display(windowWidth, windowHeight);
                this.scene.popMatrix();
            }
        }
    }
}
