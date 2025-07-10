import {CGFobject, CGFappearance} from '../../lib/CGF.js';

export class MyLeaves extends CGFobject {
  constructor(scene, radius_base, tree_height, color_leaves, enableFire = false) {
    super(scene);
    this.radius_base = radius_base;   
    this.tree_height = tree_height;   
    this.crown_height = tree_height * 0.8;  
    this.num_pyramids = Math.max(2, Math.floor(this.crown_height / 2)); 
    this.slices = 8; 
    this.enableFire = enableFire; 
    this.firePositions = []; // Fire positions to pass to MyForest
    
    this.initBuffers();
    this.initMaterials(color_leaves);
    
    if (this.enableFire) {
      this.calculateFirePositions();
    }
  }

  calculateFirePositions() {
    this.firePositions = [];
    
    for (let p = 0; p < this.num_pyramids; p++) {
      const pyramid_height = this.crown_height / this.num_pyramids;
      const pyramid_radius = this.radius_base * (1 - p * 0.2);
      const y_offset = p * pyramid_height * 0.5;
      
      const randomAngle = Math.random() * Math.PI * 2;
      
      // Random distance from center (50% to 90% of radius)
      const randomDistance = pyramid_radius * (0.5 + Math.random() * 0.4);
      
      // Calculate position based on random angle and distance
      const posX = randomDistance * Math.cos(randomAngle);
      const posZ = randomDistance * Math.sin(randomAngle);

      // Fire configuration
      // Add random time offset for animation
      const timeOffset = Math.random() * 10.0; 
      const waveSpeed = 0.5 + Math.random() * 1.0;    
      const waveAmplitude =  0.5 + Math.random() * 1.0;    
      const wavePeriod =  0.5 + Math.random() * 1.0;    
      
      this.firePositions.push({
        posX: posX,
        posY: y_offset,
        posZ: posZ,
        angle: randomAngle,
        height: pyramid_height * 0.7,
        width: pyramid_radius * 0.5,
        timeOffset: timeOffset,
        waveSpeed: waveSpeed,
        waveAmplitude: waveAmplitude, 
        wavePeriod: wavePeriod
      });
    }
    return this.firePositions;
  }

  // Initialize materials for the leaves
  initMaterials(color_leaves) {
    this.material = new CGFappearance(this.scene);
    if (this.scene.textureHandler) {
      this.texture = this.scene.textureHandler.getTexture('treeLeaves');
      this.material.setTexture(this.texture);
    }
    // Differents shades of green
    if (color_leaves && color_leaves.length >= 3) {
      let a = color_leaves[3] !== undefined ? color_leaves[3] : 1.0;
      this.material.setAmbient(color_leaves[0], color_leaves[1], color_leaves[2], a);
      this.material.setDiffuse(color_leaves[0], color_leaves[1], color_leaves[2], a);
    } else {
      this.material.setAmbient(0, 0.5, 0, 1);
      this.material.setDiffuse(0, 0.5, 0, 1);
    }
  }

  display() {
    this.scene.pushMatrix();
    this.material.apply(); 
    super.display(); 
    this.scene.popMatrix();
  }

  getFirePositions() {
    return this.firePositions;
  }

  toggleFireEffects() {
    this.enableFire = !this.enableFire;
    if (this.enableFire && this.firePositions.length === 0) {
      this.calculateFirePositions();
    }
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    
    // Build multiple pyramids for the crown
    let vertex_index = 0;
    
    for (let p = 0; p < this.num_pyramids; p++) {
      // Calculate height and radius for this pyramid
      const pyramid_height = this.crown_height / this.num_pyramids;
      const pyramid_radius = this.radius_base * (1 - p * 0.2); 
      const y_offset = p * pyramid_height * 0.5; // Pyramid overlapping
    
      const top_y = y_offset + pyramid_height;

      const top_vertex_index = vertex_index;
      
      this.vertices.push(0, top_y, 0);
      this.normals.push(0, 1, 0);
      this.texCoords.push(0.5, 0);
      vertex_index++;
      
      const base_vertices = [];
      
      var alphaAng = 2*Math.PI/this.slices;
      
      for(var i = 0; i < this.slices; i++){
        var ang = i * alphaAng;
        var next_ang = ang + alphaAng;
        
        var sa = Math.sin(ang);
        var saa = Math.sin(next_ang);
        var ca = Math.cos(ang);
        var caa = Math.cos(next_ang);
        
        // Base vertices
        const base_vertex1_index = vertex_index;
        this.vertices.push(pyramid_radius * ca, y_offset, -pyramid_radius * sa);
        base_vertices.push(base_vertex1_index);
        
        const base_vertex2_index = vertex_index + 1;
        this.vertices.push(pyramid_radius * caa, y_offset, -pyramid_radius * saa);
        
        var normal = [
          saa-sa,
          pyramid_height * 2,
          caa-ca
        ];

        // Normalization
        var nsize = Math.sqrt(
          normal[0]*normal[0] +
          normal[1]*normal[1] +
          normal[2]*normal[2]
        );
        normal[0] /= nsize;
        normal[1] /= nsize;
        normal[2] /= nsize;

        this.normals.push(normal[0], normal[1], normal[2]);
        this.normals.push(normal[0], normal[1], normal[2]);
        
        // Texture coordinates
        this.texCoords.push(i / this.slices, 1);
        this.texCoords.push((i + 1) / this.slices, 1);

        this.indices.push(top_vertex_index, base_vertex1_index, base_vertex2_index);
        
        vertex_index += 2;
      }
      
      // Base of the pyramid
      const center_base_index = vertex_index;
      this.vertices.push(0, y_offset, 0); 
      this.normals.push(0, -1, 0); 
      this.texCoords.push(0.5, 0.5);
      vertex_index++;
      
      // Add the indices for the base
      for (let i = 0; i < base_vertices.length; i++) {
        const current = base_vertices[i];
        const next = base_vertices[(i + 1) % base_vertices.length];
    
        this.indices.push(center_base_index, next, current);
      }
    }
    
    // Add the base of the crown
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}