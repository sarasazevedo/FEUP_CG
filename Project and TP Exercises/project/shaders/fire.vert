precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;
uniform float waveSpeed;
uniform float waveAmplitude;
uniform float wavePeriod;

varying vec2 vTexCoords;

void main() {
    vec3 position = aVertexPosition;
    vTexCoords = aTextureCoord;
    
    // Not the base
    if (position.y > 0.01) {
        // Get the noise value from the texture
        float time = timeFactor * 20.5 * waveSpeed;
        
        // Lateral movement based on the vertex position
        float yFactor = position.y * 2.0;
        float waveFactor = sin(time * wavePeriod + position.y * 10.0) * 0.1 * waveAmplitude;
        
        // X moviment
        position.x += waveFactor * yFactor * 0.1;

        // Y moviment
        position.y += sin(time * 0.8 * wavePeriod + position.x * 5.0) * 0.03 * waveAmplitude;
        
        // Z moviment
        position.z += cos(time * 1.2 * wavePeriod + position.y * 8.0) * 0.08 * yFactor * waveAmplitude;
        
    }
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}