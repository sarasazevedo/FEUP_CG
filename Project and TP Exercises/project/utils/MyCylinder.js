import { CGFobject } from '../../lib/CGF.js';

/**
 * MyCylinder
 * @constructor
 */
export class MyCylinder extends CGFobject {
    constructor(scene, slices, height = 1, bottomRadius = 1, topRadius = 1, solid = false, half = false) {
        super(scene);
        this.slices = slices;
        this.height = height;
        this.bottomRadius = bottomRadius;
        this.topRadius = topRadius;
        this.solid = solid;
        this.half = half; // If true, creates a cup-like shape with no top cap
        
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const alphaInc = (2 * Math.PI) / this.slices;
        
        // Generate vertices, normals and texture coordinates for the sides
        for (let i = 0; i <= this.slices; i++) {
            // Calculate the angle for this slice
            const alpha = i * alphaInc;
            const cosAlpha = Math.cos(alpha);
            const sinAlpha = Math.sin(alpha);
            
            // Bottom vertices
            this.vertices.push(
                this.bottomRadius * cosAlpha,
                0,
                this.bottomRadius * sinAlpha
            );
            
            // Top vertices
            this.vertices.push(
                this.topRadius * cosAlpha,
                this.height,
                this.topRadius * sinAlpha
            );
            
            // Normal vector calculation
            const radiusDiff = this.topRadius - this.bottomRadius;
            const normalLength = Math.sqrt(radiusDiff * radiusDiff + this.height * this.height);
            const normalX = cosAlpha * this.height / normalLength;
            const normalY = radiusDiff / normalLength;
            const normalZ = sinAlpha * this.height / normalLength;
            
            // Add normals for both vertices
            this.normals.push(normalX, normalY, normalZ);
            this.normals.push(normalX, normalY, normalZ);
            
            // Texture coordinates (s, t)
            this.texCoords.push(i / this.slices, 1);
            this.texCoords.push(i / this.slices, 0);
        }
        
        // Generate indices for triangles for the sides
        for (let i = 0; i < this.slices; i++) {
            const bottomLeft = 2 * i;
            const bottomRight = 2 * (i + 1);
            const topLeft = bottomLeft + 1;
            const topRight = bottomRight + 1;
            
            // First triangle (bottom left to top right) - outside face
            this.indices.push(bottomLeft, topLeft, topRight);
            
            // Second triangle (bottom left to bottom right to top right) - outside face
            this.indices.push(bottomLeft, topRight, bottomRight);
            
            // Add reversed triangles for inside faces
            // First triangle - inside face
            this.indices.push(topRight, topLeft, bottomLeft);
            
            // Second triangle - inside face
            this.indices.push(bottomRight, topRight, bottomLeft);
        }
        
        // Add caps if cylinder should be solid
        if (this.solid) {
            const baseVertexCount = this.vertices.length / 3;
            
            // Add center points for bottom cap
            this.vertices.push(0, 0, 0);
            this.normals.push(0, -1, 0);
            this.texCoords.push(0.5, 0.5);
            
            const bottomCenterIndex = baseVertexCount;
            let topCenterIndex;
            
            // Add top cap center only if not creating a half cylinder (cup)
            if (!this.half) {
                // Top cap center
                this.vertices.push(0, this.height, 0);
                this.normals.push(0, 1, 0);
                this.texCoords.push(0.5, 0.5);
                topCenterIndex = baseVertexCount + 1;
            }
            
            // Add vertices for caps
            for (let i = 0; i <= this.slices; i++) {
                const alpha = i * alphaInc;
                const cosAlpha = Math.cos(alpha);
                const sinAlpha = Math.sin(alpha);
                
                // Bottom cap vertex
                this.vertices.push(
                    this.bottomRadius * cosAlpha,
                    0,
                    this.bottomRadius * sinAlpha
                );
                this.normals.push(0, -1, 0);
                this.texCoords.push(
                    0.5 + 0.5 * cosAlpha,
                    0.5 + 0.5 * sinAlpha
                );
                
                // Add top cap vertices only if not creating a half cylinder (cup)
                if (!this.half) {
                    // Top cap vertex
                    this.vertices.push(
                        this.topRadius * cosAlpha,
                        this.height,
                        this.topRadius * sinAlpha
                    );
                    this.normals.push(0, 1, 0);
                    this.texCoords.push(
                        0.5 + 0.5 * cosAlpha,
                        0.5 + 0.5 * sinAlpha
                    );
                }
            }
            
            // Generate indices for bottom cap
            for (let i = 0; i < this.slices; i++) {
                // If half cylinder, bottom vertices are offset differently
                const vOffset = this.half ? 1 : 2;
                const current = bottomCenterIndex + vOffset + vOffset * i;
                const next = bottomCenterIndex + vOffset + vOffset * (i + 1);
                
                // Outside face
                this.indices.push(bottomCenterIndex, next, current);
                
                // Inside face (reversed)
                this.indices.push(current, next, bottomCenterIndex);
            }
            
            // Add top cap indices only if not creating a half cylinder (cup)
            if (!this.half) {
                for (let i = 0; i < this.slices; i++) {
                    const current = bottomCenterIndex + 3 + 2 * i;
                    const next = bottomCenterIndex + 3 + 2 * (i + 1);
                    
                    // Outside face
                    this.indices.push(topCenterIndex, current, next);
                    
                    // Inside face (reversed)
                    this.indices.push(next, current, topCenterIndex);
                }
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateTexCoords(coords) {
        // Empty implementation - required by CGF
    }
}