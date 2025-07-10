import { CGFobject } from "../lib/CGF.js";

export class MySphere extends CGFobject {
  constructor(scene, slices, stacks, radius = 1, texture, inverted = false) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;
    this.texture = texture; 
    this.inverted = inverted;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    // Calculate delta angles
    const deltaTheta = (2 * Math.PI) / this.slices;
    const deltaPhi = Math.PI / this.stacks;

    // Generate vertices and normals
    // phi is the angle from the top (0) to bottom (PI)
    for (let stack = 0; stack <= this.stacks; stack++) {
      const phi = stack * deltaPhi;
      
      for (let slice = 0; slice <= this.slices; slice++) {
        const theta = slice * deltaTheta;
        
        // Parametric equation of sphere
        const x = this.radius * Math.sin(phi) * Math.cos(theta);
        const y = this.radius * Math.cos(phi);
        const z = this.radius * Math.sin(phi) * Math.sin(theta);
        
        // Add vertex
        this.vertices.push(x, y, z);
        
        // Invert normals if the sphere is inverted
        const nx = x / this.radius;
        const ny = y / this.radius;
        const nz = z / this.radius;
        this.normals.push(this.inverted ? -nx : nx, this.inverted ? -ny : ny, this.inverted ? -nz : nz);
        
        // Texture coordinates
        const s = slice / this.slices;
        const t = stack / this.stacks;
        this.texCoords.push(s, t);
      }
    }
    

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let slice = 0; slice < this.slices; slice++) {
        const first = stack * (this.slices + 1) + slice;
        const second = first + (this.slices + 1);

        // Reverse the order of indices if the sphere is inverted
        if (this.inverted) {
          this.indices.push(first, second + 1, first + 1);
          this.indices.push(first, second, second + 1);
        } else {
          this.indices.push(first, first + 1, second + 1);
          this.indices.push(first, second + 1, second);
        }
      }
    }
  
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  display() {
    this.scene.pushMatrix();
    if (!this.inverted) {
      this.scene.translate(0, 15, 0);
    }
    if (this.texture) {
      this.texture.bind();
    }
    super.display();
    this.scene.popMatrix();
  }
}