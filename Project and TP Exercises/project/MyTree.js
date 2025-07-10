import { CGFobject } from "../lib/CGF.js";
import { MyTrunk } from "./tree/MyTrunk.js";
import { MyLeaves } from "./tree/MyLeaves.js";

export class MyTree extends CGFobject {
  constructor(scene, inclination = 0, radius_base = 0.2, height = 8, color_leaves = [0.2, 0.5, 0.1], percentage = 0.5, enableFire = false) {
    super(scene);
    
    this.position = [0, 0, 0]; // Default position
    this.inclination = inclination;
    this.radius_base = radius_base;
    this.height = height;
    this.color_leaves = color_leaves;
    this.crown_height = this.height * percentage; 
    this.trunk_height = this.height - this.crown_height; 
    this.enableFire = enableFire;

    this.trunk = new MyTrunk(scene, radius_base, this.trunk_height);
    this.leaves = new MyLeaves(scene, radius_base * 5, this.height, color_leaves, enableFire);
  }
  
  // Set the global position of the tree
  setPosition(x, y, z) {
    this.position = [x, y, z];
  }
  
  // Get fire positions in world coordinates
  getWorldFirePositions() {
    if (!this.enableFire) return [];
    
    const localPositions = this.leaves.getFirePositions();
    const worldPositions = [];
    
    for (const pos of localPositions) {
      // Apply tree transformations to get world coordinates
      const worldPos = {
        ...pos,
        posX: this.position[0] + pos.posX,
        posY: this.position[1] + this.trunk_height * 0.2 + pos.posY,
        posZ: this.position[2] + pos.posZ,
        treeInclination: this.inclination
      };
      worldPositions.push(worldPos);
    }
    return worldPositions;
  }

  display() {
    this.scene.pushMatrix();
    
    if (this.inclination !== 0) {
      // Apply inclination along X axis
      this.scene.rotate(this.inclination * Math.PI / 180, 1, 0, 0);
    }
    
    // Display trunk at the proper position
    this.scene.pushMatrix();
    this.trunk.display();
    this.scene.popMatrix();

    // Position and display leaves starting from the top of the trunk
    this.scene.pushMatrix();
    this.scene.translate(0, this.trunk_height * 0.2, 0); 
    this.leaves.display();
    this.scene.popMatrix();
    
    this.scene.popMatrix();
  }
}