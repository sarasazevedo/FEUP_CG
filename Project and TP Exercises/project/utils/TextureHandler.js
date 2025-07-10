import {CGFtexture} from '../../lib/CGF.js';

export class TextureHandler {
    constructor(scene) {
        this.scene = scene;
        this.textures = {};
        this.loadingPromises = [];
        this.isLoaded = false;
    }

    preloadTexture(id, path) {
        const loadingPromise = new Promise((resolve, reject) => {
            try {
                const texture = new CGFtexture(this.scene, path);
                
                const checkLoading = () => {
                    if (texture.image && texture.image.complete) {
                        this.textures[id] = texture;
                        resolve(texture);
                    } else {
                        setTimeout(checkLoading, 100); 
                    }
                };
                
                checkLoading();
            } catch (error) {
                console.error(`Erro ao carregar textura ${id}:`, error);
                reject(error);
            }
        });
        
        this.loadingPromises.push(loadingPromise);
        return loadingPromise;
    }
    
    getTexture(id) {
        if (this.textures[id]) {
            return this.textures[id];
        }
        
        console.warn(`Textura "${id}" não encontrada no cache`);
        return null;
    }
    
    async waitForAllTextures() {
        try {
            await Promise.all(this.loadingPromises);
            this.isLoaded = true;
            return this.textures;
        } catch (error) {
            console.error("Erro ao carregar texturas:", error);
            throw error;
        }
    }
    
    areAllTexturesLoaded() {
        return this.isLoaded;
    }
    
}