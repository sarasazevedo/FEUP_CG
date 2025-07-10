import { CGFobject } from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
 */
export class Myprism extends CGFobject {
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

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var incrementZ = 1 / this.stacks;

         // Vertices and indices for the side faces
         for (var i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang);
            var ca = Math.cos(ang);
            var saa = Math.sin(ang + alphaAng);
            var caa = Math.cos(ang + alphaAng);

            for (var j = 0; j < this.stacks; j++) {
                var z1 = incrementZ * j;
                var z2 = incrementZ * (j + 1);

                // Vertices for the current stack
                this.vertices.push(ca, -sa, z1);
                this.vertices.push(caa, -saa, z1);
                this.vertices.push(ca, -sa, z2);
                this.vertices.push(caa, -saa, z2);

                // Indices for the current stack
                var baseIndex = (i * this.stacks + j) * 4;
                this.indices.push(baseIndex, baseIndex + 2, baseIndex + 1);
                this.indices.push(baseIndex + 1, baseIndex + 2, baseIndex + 3);

                let midAng = ang + alphaAng / 2;
                let Nx = Math.cos(midAng);
                let Ny = -Math.sin(midAng);

                let length = Math.sqrt(Nx*Nx + Ny*Ny);
                Nx /= length;
                Ny /= length;

    
                this.normals.push(Nx, Ny, 0);
                this.normals.push(Nx, Ny, 0);
                this.normals.push(Nx, Ny, 0);
                this.normals.push(Nx, Ny, 0);

            }

            ang += alphaAng;
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