import {CGFobject, CGFappearance, CGFtexture} from '../../lib/CGF.js';

export class MyTrunk extends CGFobject {
  constructor(scene, radius_base, height) {
    super(scene);
    this.radius = radius_base * 2.5;
    this.height = height;
    this.slices = 16; 
    this.stacks = 8;  
    this.initBuffers();
    this.initMaterials();
  }
  initMaterials() {
    this.material = new CGFappearance(this.scene);
    if (this.scene.textureHandler) {
      this.texture = this.scene.textureHandler.getTexture('treeTrunk');
    } 
    this.material.setTexture(this.texture);
    this.material.setTextureWrap('REPEAT', 'REPEAT');
  }

  display() {
    this.scene.pushMatrix();
    this.material.apply(); 
    super.display();
    this.scene.popMatrix();
  }

  initBuffers() {
      this.vertices = [];
      this.indices = [];
      this.normals = [];
      this.texCoords = [];
  
      const alphaAng = 2 * Math.PI / this.slices;
      const incrementY = this.height / this.stacks;
      const stacksPlus1 = this.stacks + 1;
  
      // Generate cone vertices, normals, and texture coordinates
      for (let i = 0; i <= this.slices; i++) { 
          const ang = alphaAng * i;
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          
          for (let j = 0; j <= this.stacks; j++) {
              // Calculate radius for current stack (decreasing from base to top)
              const currentRadius = this.radius * (1 - j / this.stacks);
              const x = cos * currentRadius;
              const z = sin * currentRadius;
              const y = j * incrementY;
              
              this.vertices.push(x, y, z);
              
              const nx = cos;
              const nz = sin;
              const ny = this.radius / this.height;
              
              // Normalize the normal vector
              const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
              this.normals.push(nx/len, ny/len, nz/len);
              
              this.texCoords.push(i / this.slices, j / this.stacks);
          }
      }
  
      // Generate indices
      for (let i = 0; i < this.slices; i++) {
          const row1 = i * stacksPlus1;
          const row2 = (i + 1) * stacksPlus1;
          
          for (let j = 0; j < this.stacks; j++) {
              this.indices.push(row1 + j + 1, row2 + j, row1 + j);
              this.indices.push(row1 + j + 1, row2 + j + 1, row2 + j);
          }
      }
  
      this.primitiveType = this.scene.gl.TRIANGLES;
      this.initGLBuffers();
  }
}