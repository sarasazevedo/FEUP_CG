import { CGFscene, CGFcamera, CGFaxis, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBombeiros } from "./MyBombeiros.js";
import { MyTree } from "./MyTree.js";
import { MyFlorest } from "./MyFlorest.js";
import { TextureHandler } from './utils/TextureHandler.js';
import { MyHeli } from "./MyHeli.js";
import { MyLake } from "./MyLake.js";
import { ShaderHandler } from './utils/ShaderHandler.js';

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.loadingComplete = false;
    this.lastUpdate = 0;

    // 3 different cameras (default, helicopter, wasd mode)
    this.useThirdPersonCamera = false;
    this.cameraMode = false; 
    this.cameraDistance = 25;
    this.cameraHeight = 15;
    this.defaultCamera = null;

    // Helicopter properties
    this.helicopterSpeed = 10.0;
    this.helicopterRotSpeed = 0.05;

    // Camera control properties  
    this.cameraSpeed = 1.5; 
    this.cameraVerticalSpeed = 1.0; 
    this.windowType = 2; // Default window type
    this.lastWindowType = 2; // Last window type used
  }
  
  async init(application) {

    // Initialize display control variables
    this.displayAxis = false;
    this.displayTextures = true;
    this.displaySphere = false;
    this.displayPlane = true;
    this.displayPanorama = true;
    this.displayBombeiros = true;
    this.displayTree = true;
    this.displayFlorest = true;
    this.displayHelicopter = true;
    this.displayLake = true;

    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    // Enable alpha blending for transparency effects
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);
    
    //Texture handler initialization
    this.textureHandler = new TextureHandler(this);
    this.shaderHandler = new ShaderHandler(this);
    // Preload textures
    this.textureHandler.preloadTexture('treeTrunk', 'textures/tree_trunk.jpg');
    this.textureHandler.preloadTexture('treeLeaves', 'textures/tree_leaves.jpg');
    this.textureHandler.preloadTexture('earth', 'textures/earth.jpg');
    this.textureHandler.preloadTexture('panorama', 'textures/panorama.jpg');
    this.textureHandler.preloadTexture('building', 'textures/firefighter.png');
    this.textureHandler.preloadTexture('door', 'textures/door.jpg');
    this.textureHandler.preloadTexture('plane', 'textures/relvinha.jpg');
    this.textureHandler.preloadTexture('window1', 'textures/window.jpg');
    this.textureHandler.preloadTexture('window2', 'textures/window2.jpg');
    this.textureHandler.preloadTexture('metal', 'textures/metal.jpg');
    this.textureHandler.preloadTexture('propeller_texture', 'textures/propeller_texture.png');
    this.textureHandler.preloadTexture('landing_gear', 'textures/landing_gear.png');
    this.textureHandler.preloadTexture('glass', 'textures/glass.png');
    this.textureHandler.preloadTexture('water', 'textures/water.jpg');
    this.textureHandler.preloadTexture('fire', 'textures/fire.png');
    this.textureHandler.preloadTexture('fireNoise', 'textures/firenoise.png'); 
    this.textureHandler.preloadTexture('heliport', 'textures/heliport.png');
    this.textureHandler.preloadTexture('up', 'textures/up.png');
    this.textureHandler.preloadTexture('down', 'textures/down.png');
    this.textureHandler.preloadTexture('rope', 'textures/rope.png');
    this.textureHandler.preloadTexture('clouds', 'textures/firenoise.png');
    this.textureHandler.preloadTexture('rock', 'textures/rock.jpg');
    try {
      await this.textureHandler.waitForAllTextures();
      console.log("All textures loaded successfully.");
      this.initializeSceneObjects();
    } catch (error) {
      console.error("Erro loading textures:", error);
    }
  }

  initializeSceneObjects() {
    const earthTexture = this.textureHandler.getTexture('earth');
    const panoramaTexture = this.textureHandler.getTexture('panorama');
    const buidingTexture = this.textureHandler.getTexture('building');
    const doorTexture = this.textureHandler.getTexture('door');
    // Initialize the sphere 
    this.sphere = new MySphere(this, 64, 32, 10, earthTexture);
    // Initialize the panorama
    this.shaderHandler.loadSkyShader();
    this.panorama = new MyPanorama(this, panoramaTexture);
    // Initialize the building 
    this.building = new MyBombeiros(this, 3, buidingTexture, doorTexture, this.windowType, this.textureHandler); 
    // Initialize the tree
    this.tree = new MyTree(this);
    // Initialize the forest
    this.forest = new MyFlorest(this, 5, 4); // 20 trees
    // Initialize the lake
    this.lake = new MyLake(this);
    // Initialize the helicopter
    this.helicopter = new MyHeli(this, this.textureHandler, this.lake, this.building, this.forest);
    this.loadingComplete = true;
    // Initialize the plane
    this.plane = new MyPlane(this, 64);
  }
  
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  
  initCameras() {
    this.camera = new CGFcamera(
      0.8, 
      0.1,
      10000,
      vec3.fromValues(60, 80, 50), 
      vec3.fromValues(0,0,0) 
    );
    this.defaultCamera = this.camera;
  }

  updateCamera() {
      if (!this.useThirdPersonCamera) {
          if (this.defaultCamera) {
              this.camera = this.defaultCamera;
          }
          return;
      }
      
      if (!this.helicopter || !this.loadingComplete) return;
      
      const heli = this.helicopter;
      // Helicopter position and rotation
      const offsetX = -Math.sin(heli.rotationY) * this.cameraDistance;
      const offsetZ = -Math.cos(heli.rotationY) * this.cameraDistance;
      
      // Define minimum camera height (ground level)
      const minCameraHeight = 1.0; // Set a small buffer above ground level
      
      // Calculate camera position with height constraint
      let cameraY = heli.position.y + this.cameraHeight;
      
      // Apply minimum height constraint if needed
      if (cameraY < minCameraHeight) {
          cameraY = minCameraHeight;
      }
      
      const cameraPosition = vec3.fromValues(
          heli.position.x + offsetX,
          cameraY,
          heli.position.z + offsetZ
      );
      
      const targetPosition = vec3.fromValues(
          heli.position.x,
          heli.position.y,
          heli.position.z
      );
      // Set the camera position and target
      this.camera = new CGFcamera(
          0.8, 
          0.1, 
          1000,
          cameraPosition,
          targetPosition
      );
  }
  
  // Check for key presses and update helicopter or camera movement
  checkKeys() {
  if (!this.loadingComplete) return;
  if (this.cameraMode) {
    this.moveCameraWithKeys();
  } else if (this.helicopter) {
    const speed = this.helicopterSpeed;
    const rotSpeed = this.helicopterRotSpeed;
    if (this.gui.isKeyPressed("KeyW")) {
      this.helicopter.accelerate(speed);
    }
    else if (this.gui.isKeyPressed("KeyS")) {
      this.helicopter.accelerate(-speed);
    }
    else if (this.gui.isKeyPressed("KeyA")) {
      this.helicopter.turn(rotSpeed);
    }
    else if (this.gui.isKeyPressed("KeyD")) {
      this.helicopter.turn(-rotSpeed);
    }
    else if (this.gui.isKeyPressed("KeyR")) {
      this.helicopter.reset();
    } 
    else if (this.gui.isKeyPressed("KeyP")) {
      this.helicopter.fly();
    }
    else if (this.gui.isKeyPressed("KeyL")) {
      this.helicopter.landing();
    }
    else if (this.gui.isKeyPressed("KeyO")) {
      this.helicopter.dropWater();
    }
    else {
      this.helicopter.stopMovement(); 
    }
  }
  }

  moveCameraWithKeys() {
    const speed = this.cameraSpeed;
    const vertSpeed = this.cameraVerticalSpeed;
    
    const forward = vec3.create();
    const right = vec3.create();
    const up = vec3.fromValues(0, 1, 0);
    
    vec3.subtract(forward, this.camera.target, this.camera.position);
    forward[1] = 0; 
    vec3.normalize(forward, forward);
    
    // Calculate right vector (cross product of forward and up)
    vec3.cross(right, forward, up);
    vec3.normalize(right, right);
    
    // Move forward/backward
    if (this.gui.isKeyPressed("KeyW")) {
      this.camera.position[0] += forward[0] * speed;
      this.camera.position[2] += forward[2] * speed;
      this.camera.target[0] += forward[0] * speed;
      this.camera.target[2] += forward[2] * speed;
    }
    else if (this.gui.isKeyPressed("KeyS")) {
      this.camera.position[0] -= forward[0] * speed;
      this.camera.position[2] -= forward[2] * speed;
      this.camera.target[0] -= forward[0] * speed;
      this.camera.target[2] -= forward[2] * speed;
    }
    
    // Move left/right
    if (this.gui.isKeyPressed("KeyA")) {
      this.camera.position[0] -= right[0] * speed;
      this.camera.position[2] -= right[2] * speed;
      this.camera.target[0] -= right[0] * speed;
      this.camera.target[2] -= right[2] * speed;
    }
    else if (this.gui.isKeyPressed("KeyD")) {
      this.camera.position[0] += right[0] * speed;
      this.camera.position[2] += right[2] * speed;
      this.camera.target[0] += right[0] * speed;
      this.camera.target[2] += right[2] * speed;
    }
    
    // Define minimum camera height (ground level)
    const minCameraHeight = 1.0; // Set a small buffer above ground level
    
    // Move up/down
    if (this.gui.isKeyPressed("Space")) {
      this.camera.position[1] += vertSpeed;
      this.camera.target[1] += vertSpeed;
    }
    else if (this.gui.isKeyPressed("ShiftLeft") || this.gui.isKeyPressed("ShiftRight")) {
      // Check if the camera would go below the minimum height
      if (this.camera.position[1] - vertSpeed > minCameraHeight) {
        this.camera.position[1] -= vertSpeed;
        this.camera.target[1] -= vertSpeed;
      } else {
        // Set camera exactly at minimum height if it would go below
        const difference = this.camera.position[1] - minCameraHeight;
        this.camera.position[1] = minCameraHeight;
        this.camera.target[1] -= difference;
      }
    }
  }
  update(t) {
    if (!this.loadingComplete) return;
    
    if (this.lastUpdate === 0) {
      this.lastUpdate = t;
    }
    const elapsedTime = t - this.lastUpdate;
    this.lastUpdate = t;
    
    this.checkKeys();
    
    if (this.building && this.lastWindowType !== this.windowType) {
      this.lastWindowType = this.windowType;
      const buildingTexture = this.textureHandler.getTexture('building');
      const doorTexture = this.textureHandler.getTexture('door');
      this.building = new MyBombeiros(this, 3, buildingTexture, doorTexture, this.windowType, this.textureHandler);
    }

    if (this.helicopter) {
      this.helicopter.update(elapsedTime);
    }
    if (this.panorama) {
      this.panorama.update(t);
    }
    this.updateCamera();  
}

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Enable/disable textures globally 
    this.enableTextures(this.displayTextures);

    // Draw axis if enabled
    if (this.displayAxis && this.axis) {
      this.axis.display();
    }
    
    this.setDefaultAppearance();

    // Display panorama PRIMEIRO para que seja o fundo da cena
    if (this.displayPanorama && this.panorama) {
      this.panorama.updatePosition(this.camera.position);
    }

    // Display the plane 
    if (this.displayPlane && this.plane) {
      this.pushMatrix();
      this.scale(4000, 1, 4000);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.plane.display();
      this.popMatrix();
    }

    // Display sphere 
    if (this.displaySphere && this.sphere) {
      this.pushMatrix();
      this.sphere.display();
      this.popMatrix();
    }
    
    // Display building
    if (this.displayBombeiros && this.building) {
      this.pushMatrix();
      this.translate(20, 0, -20); 
      this.scale(5, 10, 5);      
      const heliState = this.helicopter ? this.helicopter.heliportState : 'idle'; 
      const currentTime = this.lastUpdate; 
      this.building.display(heliState, currentTime); // Pass the state and time
      this.popMatrix();
    }
  
    // Display tree 
    if (this.displayTree && this.tree) {
      this.pushMatrix();
      this.translate(20, 0, 20); 
      this.scale(5, 5, 5);       
      this.tree.display();
      this.popMatrix();
    }

    // Display forest 
    if (this.displayFlorest && this.forest) {
      this.pushMatrix();
      this.translate(-35, 0, -55);    
      this.scale(4, 4, 4);       
      this.forest.display();
      this.popMatrix();    
    }
    
    // Display lake
    if (this.displayLake && this.lake) {
      this.pushMatrix();
      this.lake.display();
      this.popMatrix();
    }
    
    // Display helicopter
    if (this.displayHelicopter && this.helicopter) {
      this.pushMatrix();
      this.helicopter.display();
      this.popMatrix();
    }
  }
}