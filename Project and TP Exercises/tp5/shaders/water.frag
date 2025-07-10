#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;


void main() {
    vec2 rippleCoords = vTextureCoord;
    float rippleStrength = 0.01;
    rippleCoords.x += sin(vTextureCoord.y * 20.0 + timeFactor * 0.1) * rippleStrength;
    rippleCoords.y += cos(vTextureCoord.x * 20.0 + timeFactor * 0.1) * rippleStrength;
    
    vec4 color = texture2D(uSampler, rippleCoords);
    
    vec2 mapCoords = vec2(0.0, 0.1) + vTextureCoord + vec2(timeFactor * 0.01, 0.0);
    vec4 filter = texture2D(uSampler2, mapCoords);


    gl_FragColor = color;
}