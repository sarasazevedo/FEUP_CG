import {CGFobject, CGFtexture} from '../lib/CGF.js';
import { MyBuilding } from './building/MyBuilding.js';
import { MyHeliport } from './building/MyHeliport.js';
import { MyBuildingEntrance} from './building/MyBuildingEntrance.js';

export class MyBombeiros extends CGFobject {
    constructor(scene, numFloors = 3, singTexture, doortexture, windowType, textureHandler) {
        super(scene);
        this.numFloors = numFloors;
        this.floorHeight = 1.0;
        this.moduleWidth = 3.0;
        this.textureHandler = textureHandler;

        // Create building components
        this.module = new MyBuilding(scene, 9.0, 2,  windowType, [0.8, 0.8, 0.8]);
        this.heliport = new MyHeliport(scene, this.textureHandler);
        this.entrance = new MyBuildingEntrance(scene, singTexture, doortexture);
        
        this.initBuffers();
    }

    display(heliState = 'idle', t = 0) { // Accept heliState and time as parameters
        // Draw left module
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.8, 0.8);
        this.module.display(-this.moduleWidth, this.numFloors + 1 );
        this.scene.popMatrix();
        
        // Draw central module (slightly taller)
        this.module.display(0, this.numFloors + 1);
        
        // Draw right module
        this.scene.pushMatrix();
        this.scene.scale(0.8, 0.8, 0.8);
        this.module.display(this.moduleWidth, this.numFloors + 1 );
        this.scene.popMatrix();
        
        // Draw main door and sign
        this.entrance.display();
        
        // Draw heliport on top of the central module, passing the state and time
        const centralModuleHeight = (this.numFloors + 1) * this.floorHeight;
        this.heliport.display(centralModuleHeight, heliState, t); 
    }
}

