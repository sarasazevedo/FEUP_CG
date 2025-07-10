attribute vec3 aVertexPosition;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uScaleFactor;  
uniform float uTime;          

varying vec4 vClipPos;

void main() {
    float waveOffset = sin(uTime) * uScaleFactor;

    vec4 newPosition = vec4(aVertexPosition.x + waveOffset, aVertexPosition.y, aVertexPosition.z, 1.0);
    vClipPos = uPMatrix * uMVMatrix * newPosition;
    gl_Position = vClipPos;
}