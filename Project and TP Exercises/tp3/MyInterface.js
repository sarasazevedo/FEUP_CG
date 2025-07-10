import {CGFinterface, dat} from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);
       
        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();
        
        // Main display controls
        const displayFolder = this.gui.addFolder('Display Controls');
        displayFolder.add(this.scene, 'displayAxis').name("Show Axis");
        displayFolder.add(this.scene, 'displayNormals').name("Show Normals");
        displayFolder.add(this.scene, 'scaleFactor', 0.1, 10.0).name('Scale Factor');
        displayFolder.open();
        
        // Object selection and complexity
        const objectFolder = this.gui.addFolder('Object Selection');
        objectFolder.add(this.scene, 'selectedObject', this.scene.objectIDs).name('Select Object')
            .onChange(this.scene.updateObjectComplexity.bind(this.scene));
        objectFolder.add(this.scene, 'objectComplexity', 0.01, 1.0).name('Object Detail')
            .onChange(this.scene.updateObjectComplexity.bind(this.scene));
        objectFolder.open();
        
        // Material controls
        const materialFolder = this.gui.addFolder('Material Controls');
        materialFolder.add(this.scene, 'selectedMaterial', this.scene.materialIDs).name('Select Material');
        
        // Custom Material subfolder
        const customMatFolder = materialFolder.addFolder('Custom Material Editor');
        customMatFolder.addColor(this.scene.customMaterialValues,'Ambient')
            .name('Ambient Color')
            .onChange(this.scene.updateCustomMaterial.bind(this.scene));
        customMatFolder.addColor(this.scene.customMaterialValues,'Diffuse')
            .name('Diffuse Color')
            .onChange(this.scene.updateCustomMaterial.bind(this.scene));
        customMatFolder.addColor(this.scene.customMaterialValues,'Specular')
            .name('Specular Color')
            .onChange(this.scene.updateCustomMaterial.bind(this.scene));
        customMatFolder.add(this.scene.customMaterialValues,'Shininess', 0, 100)
            .name('Shininess')
            .onChange(this.scene.updateCustomMaterial.bind(this.scene));
        
        // Lighting controls
        const lightingFolder = this.gui.addFolder('Lighting');
        
        // Light 0
        const light0Folder = lightingFolder.addFolder('Light 1');
        light0Folder.add(this.scene.lights[0], 'enabled').name("Enable");
        
        const light0PosFolder = light0Folder.addFolder('Position');
        light0PosFolder.add(this.scene.lights[0].position, '0', -5.0, 5.0).name("X");
        light0PosFolder.add(this.scene.lights[0].position, '1', -5.0, 5.0).name("Y");
        light0PosFolder.add(this.scene.lights[0].position, '2', -5.0, 5.0).name("Z");
        
        // Light 1
        const light1Folder = lightingFolder.addFolder('Light 2');
        light1Folder.add(this.scene.lights[1], 'enabled').name("Enable");
        
        const light1PosFolder = light1Folder.addFolder('Position');
        light1PosFolder.add(this.scene.lights[1].position, '0', -5.0, 5.0).name("X");
        light1PosFolder.add(this.scene.lights[1].position, '1', -5.0, 5.0).name("Y");
        light1PosFolder.add(this.scene.lights[1].position, '2', -5.0, 5.0).name("Z");
        
        const light1AttFolder = light1Folder.addFolder('Attenuation');
        light1AttFolder.add(this.scene.lights[1], 'constant_attenuation', 0.00, 1.00).name("Constant");
        light1AttFolder.add(this.scene.lights[1], 'linear_attenuation', 0.0, 1.0).name("Linear");
        light1AttFolder.add(this.scene.lights[1], 'quadratic_attenuation', 0.0, 1.0).name("Quadratic");
        
        // Optional: Advanced settings (collapsed by default)
        /*
        const advancedFolder = this.gui.addFolder('Advanced Settings');
        advancedFolder.add(this.scene, 'ambientLightIntensity', 0.0, 1.0)
            .name('Global Ambient')
            .onChange(() => this.scene.updateAmbientLight());
        */
        
        return true;
    }
}