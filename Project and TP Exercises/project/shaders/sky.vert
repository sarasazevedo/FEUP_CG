attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec2 vCloudTextureCoord;
varying vec2 vCloudTextureCoord2;
varying float vHeight;
varying float vLongitude;
varying float vDistanceFromPole;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
    // Pass the original texture for the sky panorama
    vTextureCoord = aTextureCoord;
    vec3 normalizedPos = normalize(aVertexPosition);
    
    float longitude = atan(normalizedPos.z, normalizedPos.x);
    vLongitude = longitude;
    vDistanceFromPole = sqrt(normalizedPos.x * normalizedPos.x + normalizedPos.z * normalizedPos.z);
    
    // Rotation angle for cloude texture
    float rotationAngle = 0.0;
    float sinAngle = sin(rotationAngle);
    float cosAngle = cos(rotationAngle);
    
    // Apply rotation transformation to coordinates
    vec2 centeredCoord = aTextureCoord - vec2(0.5, 0.5);
    vec2 rotatedCoord = vec2(
        centeredCoord.x * cosAngle - centeredCoord.y * sinAngle,
        centeredCoord.x * sinAngle + centeredCoord.y * cosAngle
    );
    
    // Create two sets of cloud coordinates with different offsets
    vCloudTextureCoord = rotatedCoord + vec2(0.5, 0.5);
    vCloudTextureCoord2 = rotatedCoord + vec2(0.65, 0.65);

    // Pass normalized height (y) to fragment shader
    vHeight = normalizedPos.y;
}