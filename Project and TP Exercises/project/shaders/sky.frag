#ifdef GL_ES
precision highp float; // High precision for better cloud detail
#endif

// Input values from vertex shader
varying vec2 vTextureCoord;
varying vec2 vCloudTextureCoord;
varying vec2 vCloudTextureCoord2;
varying float vHeight;
varying float vLongitude;

uniform sampler2D uSampler;     // Panorama texture
uniform sampler2D uSampler2;    // Cloud texture with alpha

// Cloud appearance parameters
uniform float uBlendFactor;     
uniform float cloudBottom;      
uniform float cloudHeight;      
uniform float uCloudBrightness; 
uniform float timeFactor;       
uniform float cloudVariation;   
uniform float cloudSharpness;   

// function for better cloud edge falloff
float smootherstep(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// noise function for cloud variation
float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec4 skyColor = texture2D(uSampler, vTextureCoord);
        
    // Calculate cloud height distribution curve
    float heightCurve = smootherstep(cloudBottom, cloudBottom + cloudHeight, vHeight) * 
                       (1.0 - smootherstep(cloudBottom + cloudHeight * 0.6, 
                                          cloudBottom + cloudHeight * 1.2, vHeight));
                                          
    
    vec4 cloudTex = texture2D(uSampler2, vCloudTextureCoord);
    vec4 cloudTex2 = texture2D(uSampler2, vCloudTextureCoord2);
    vec4 cloudTex3 = texture2D(uSampler2, vec2(
        vCloudTextureCoord.x * 2.5 - 0.7,
        vCloudTextureCoord.y * 0.9 + 0.3
    ));
    
    // Calculate intensity values from cloud textures
    float cloud1Intensity = (cloudTex.r + cloudTex.g + cloudTex.b) / 3.0;
    float cloud2Intensity = (cloudTex2.r + cloudTex2.g + cloudTex2.b) / 3.0;
    float cloud3Intensity = (cloudTex3.r + cloudTex3.g + cloudTex3.b) / 3.0;
    
    float variationFactor = mix(1.0 - cloudVariation, 1.0 + cloudVariation, 
                               noise(vec2(vLongitude * 0.5 + timeFactor * 0.1, vHeight * 2.0)));
    
     // Create areas of more or less dense clouds
    float patchiness = mix(0.7, 1.3, noise(vec2(vLongitude + vHeight * 3.0, timeFactor * 0.05)));
    
    float cloudIntensity = mix(
        cloud1Intensity * patchiness,
        mix(cloud2Intensity, cloud3Intensity * 0.8, 0.4) * variationFactor,
        0.3 + 0.2 * sin(vLongitude * 3.0 + timeFactor * 0.03)
    );
    
    cloudIntensity = pow(cloudIntensity, cloudSharpness);
    
    float cloudAlpha = cloudIntensity * heightCurve  * uBlendFactor * 2.0;

    float brightnessFactor = mix(0.9, 1.1, noise(vec2(vLongitude * 2.0 + vHeight, timeFactor * 0.02)));
    vec3 cloudColor = vec3(uCloudBrightness * brightnessFactor);
    
    float atmosphericDepth = (1.0 - vHeight) * 0.2;
    vec3 tintedCloudColor = mix(
        cloudColor,
        cloudColor * vec3(0.95, 0.97, 1.05),
        atmosphericDepth
    );
    
    vec3 shadedCloudColor = mix(
        tintedCloudColor * 0.9,
        tintedCloudColor * 1.1,
        smootherstep(0.0, 0.6, cloud1Intensity)
    );
    
    // Blend sky background with cloud color based on calculated opacity
    vec3 finalColor = mix(skyColor.rgb, shadedCloudColor, cloudAlpha);
    
    gl_FragColor = vec4(finalColor, 1.0);
}