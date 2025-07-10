precision mediump float;

varying vec2 vTexCoords;

uniform sampler2D uSampler;   
uniform sampler2D uSampler2;  
uniform float timeFactor;     

void main() {
    // Ripple effect to the texture coordinates
    vec2 rippleCoords = vTexCoords;
    float rippleStrength = 0.01;
    rippleCoords.x += sin(vTexCoords.y * 20.0 + timeFactor * 0.1) * rippleStrength;
    rippleCoords.y += cos(vTexCoords.x * 20.0 + timeFactor * 0.1) * rippleStrength;

    vec4 color = texture2D(uSampler, rippleCoords);

    // Distortion effect using a second texture
    vec2 distortionCoords = vTexCoords;
    distortionCoords.y -= timeFactor * 0.2; 
    vec4 distortion = texture2D(uSampler2, distortionCoords);
    float distortionAmount = (distortion.r + distortion.g + distortion.b) / 3.0; 

    vec2 distortedTexCoords = vTexCoords;
    distortedTexCoords.y += (distortionAmount - 0.5) * 0.1; 

    color = texture2D(uSampler, distortedTexCoords);

    float fade = smoothstep(0.0, 1.0, 1.0 - vTexCoords.y);
    color.a *= fade; 

    gl_FragColor = color;
}