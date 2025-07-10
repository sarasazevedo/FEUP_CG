#ifdef GL_ES
precision highp float;
#endif

varying vec4 vClipPos;

void main() {
    float ndcY = (vClipPos.y / vClipPos.w) * 0.5 + 0.5;
    if (ndcY > 0.5)
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); // amarelo
    else
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // azul
}