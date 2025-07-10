import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices; 
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var alphaAng = 2 * Math.PI / this.slices;
        var incrementZ = 1 / this.stacks;

        // Generate vertices and normals
        for (var i = 0; i <= this.slices; i++) { 
            const ang = alphaAng * i;
            var x = Math.cos(ang);
            var y = Math.sin(ang);
            
            for (var j = 0; j <= this.stacks; j++) { 
                var z = incrementZ * j;
                this.vertices.push(x, y, z);   
                
  
                var normalLength = Math.sqrt(x * x + y * y);
                this.normals.push(x / normalLength, y / normalLength, 0);
                
                this.texCoords.push(i / this.slices, j / this.stacks);
            }
        }

        for (var i = 0; i < this.slices; i++) {
            for (var j = 0; j < this.stacks; j++) {
                var first = (i * (this.stacks + 1)) + j;
                var second = first + this.stacks + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); 

        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
