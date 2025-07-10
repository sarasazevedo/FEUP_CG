attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform sampler2D uSampler2;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main() {
    vec2 animatedCoords = aTextureCoord + vec2(timeFactor * 0.02, timeFactor * 0.02);
    
    vec4 heightMapColor = texture2D(uSampler2, animatedCoords);
    
    float heightScale = 0.06;
    vec3 displacedPosition = aVertexPosition + aVertexNormal * heightMapColor.b * heightScale;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(displacedPosition, 1.0);
    
    vTextureCoord = animatedCoords;
}

