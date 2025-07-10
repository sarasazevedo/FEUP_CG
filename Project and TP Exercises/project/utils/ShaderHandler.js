import { CGFshader } from '../../lib/CGF.js';

export class ShaderHandler {
    constructor(scene) {
        this.scene = scene;
        this.shaders = {};
        this.activeShaders = {};
        this.lastUpdateTime = 0;
    }

    async loadShader(name, vertexPath, fragmentPath) {
        return new Promise((resolve, reject) => {
            try {
                const shader = new CGFshader(this.scene.gl, vertexPath, fragmentPath);
                shader.setUniformsValues({ timeFactor: 0 });
                this.shaders[name] = shader;
                console.log(`Shader ${name} loaded successfully`);
                resolve(shader);
            } catch (error) {
                console.error(`Error loading shader ${name}:`, error);
                reject(error);
            }
        });
    }

    async loadFireShader() {
        await this.loadShader('fire', 'shaders/fire.vert', 'shaders/fire.frag');
        const fireShader = this.getShader('fire');
        if (fireShader) {
            fireShader.setUniformsValues({
                timeFactor: (Date.now() / 1000) % 1000,
                normScale: 4,
                uSampler: 0,
                uSampler2: 1   
            });           
        }
        return fireShader;
    }
    
    async loadSkyShader() {
        await this.loadShader('sky', 'shaders/sky.vert', 'shaders/sky.frag');
        const skyShader = this.getShader('sky');
        if (skyShader) {
            skyShader.setUniformsValues({
                uSampler: 0,
                uSampler2: 1,
                uBlendFactor: 3.5,
                uCloudBrightness: 1.2,
                cloudBottom: 0.02,
                cloudHeight: 0.7,
                cloudVariation: 0.3,
                cloudSharpness: 2.6
            });           
        }
        return skyShader;
    }    getShader(name) {
        return this.shaders[name] || null;
    }
}