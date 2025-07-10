import { CGFappearance, CGFshader } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama {
  constructor(scene, texture) {
    this.scene = scene;
    this.texture = texture;
    
    this.cloudTexture = scene.textureHandler.getTexture('clouds');

    this.skyShader = null;
    if (scene.shaderHandler) {
      this.skyShader = scene.shaderHandler.getShader('sky');
    }

    this.sphere = new MySphere(scene, 64, 32, 200, texture, true);

    this.material = new CGFappearance(scene);
    this.material.setEmission(1.0, 1.0, 1.0, 1.0);
    this.material.setAmbient(0.0, 0.0, 0.0, 1.0);
    this.material.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.material.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.material.setTexture(this.texture);
    
    this.lastTime = 0;
  }
  update(t) {
    if (!this.skyShader) return;
    this.skyShader.setUniformsValues({ 
      timeFactor: t / 1000,
    });
  }

  display() {
    // Save previous active shader
    const previousShader = this.scene.activeShader;
    
    // Apply material and activate shader if it exists
    if (this.skyShader) {
      this.scene.setActiveShader(this.skyShader);
      
      this.texture.bind(0);
      if (this.cloudTexture) {
        this.cloudTexture.bind(1);
      }
    } else {
      this.material.apply();
    }
    
    // Display the sphere
    this.sphere.display();
    if (this.skyShader) {
      this.scene.setActiveShader(previousShader);
    }
  }

  updatePosition(cameraPosition) {
    const gl = this.scene.gl;
    const depthTest = gl.isEnabled(gl.DEPTH_TEST);
    
    gl.disable(gl.DEPTH_TEST);
    
    this.scene.pushMatrix();
    this.scene.translate(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    this.display();
    this.scene.popMatrix();
 
    if (depthTest) {
      gl.enable(gl.DEPTH_TEST);
    }
  }
}