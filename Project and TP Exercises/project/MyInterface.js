import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
        this.minCameraHeight = 1.0; // Altura mínima da câmera
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        const displayFolder = this.gui.addFolder('Display Options');
        displayFolder.add(this.scene, 'displayAxis').name('Display Axis');
        displayFolder.add(this.scene, 'displaySphere').name('Display Sphere');
        displayFolder.add(this.scene, 'displayPlane').name('Display Plane');
        displayFolder.add(this.scene, 'displayPanorama').name('Display Panorama');
        displayFolder.add(this.scene, 'displayBombeiros').name('Display Bombeiros');
        displayFolder.add(this.scene, 'displayTree').name('Display Tree');
        displayFolder.add(this.scene, 'displayFlorest').name('Display Florest');
        displayFolder.add(this.scene, 'displayHelicopter').name('Display Helicopter');
        displayFolder.open();

        const texturesFolder = this.gui.addFolder('Display Textures');
        texturesFolder.add(this.scene, 'displayTextures').name('Display Textures');
        texturesFolder.open();
        
        // Choose Window Type
        const windowFolder = this.gui.addFolder('Window Options');
        windowFolder.add(this.scene, 'windowType', { 'Type 1': 1, 'Type 2': 2 }).name('Window Type');
        windowFolder.open();
        // Helicopter Controls
        const helicopterFolder = this.gui.addFolder('Helicopter Controls');
        
        helicopterFolder.add(this.scene, 'helicopterSpeed', 1, 20).name('Speed');
        helicopterFolder.add(this.scene, 'helicopterRotSpeed', 0.01, 0.1).name('Rotation Speed');
    
        // Camera controls
        const cameraFolder = this.gui.addFolder('Camera Controls');
        cameraFolder.add(this.scene, 'cameraMode').name('Camera Movement Mode');
        cameraFolder.add(this.scene, 'useThirdPersonCamera').name('Helicopter Camera');
        cameraFolder.add(this.scene, 'cameraDistance', 10, 50).name('Camera Distance');
        cameraFolder.add(this.scene, 'cameraHeight', 5, 30).name('Camera Height');
        cameraFolder.open();
        
        this.initKeys();

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

    // Verifica e corrige a altura da câmera após qualquer movimento
    checkCameraHeight() {
        if (!this.activeCamera) return;
        if (this.activeCamera.position[1] < this.minCameraHeight) {
            this.activeCamera.position[1] = this.minCameraHeight;
        }
    }

    // Sobrescrever processMouse para verificar altura após os movimentos do mouse
    processMouse() {
        // Chama o método original da classe pai
        super.processMouse();
        
        // Verifica e corrige a altura da câmera
        this.checkCameraHeight();
    }

    // Sobrescrever processMouseMove para verificar altura após mover o mouse
    processMouseMove(event) {
        // Chama o método original
        super.processMouseMove(event);
        
        // Verifica e corrige a altura da câmera
        this.checkCameraHeight();
    }

    // Sobrescrever processWheel para verificar altura após usar a roda do mouse
    processWheel(event) {
        // Chama o método original
        super.processWheel(event);
        
        // Verifica e corrige a altura da câmera
        this.checkCameraHeight();
    }
}