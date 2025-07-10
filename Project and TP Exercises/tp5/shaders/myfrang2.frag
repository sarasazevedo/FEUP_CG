#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler; 
varying vec4 vClipPos;

void main() {
    vec4 color = texture2D(uSampler, gl_FragCoord.xy);

    float L = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
    gl_FragColor = vec4(L, L, L, 1.0);
}