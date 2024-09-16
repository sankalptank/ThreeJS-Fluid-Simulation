#include "Functions.glsl"
varying vec3 v_Normal;
varying vec3 pos;
uniform float height;
uniform float width;
uniform sampler2D renderTarget0;
uniform sampler2D renderTarget1;
uniform sampler2D testImage;

void main() {
    //calculates general varibles from uniforms 
    vec2 uv = vec2(pos.x, pos.y);
    vec2 resolution = vec2(width, height);
    vec2 pixelSize = vec2(uv.x / resolution.x, uv.y / resolution.y); 
    vec2 texelSize = 1.0/resolution;

    //declares & defines offset values
    vec2 adjacentOffsets[4];
    adjacentOffsets[0] = vec2(-1.0, 0.0);
    adjacentOffsets[1] = vec2(1.0, 0.0);
    adjacentOffsets[2] = vec2(0.0, -1.0);
    adjacentOffsets[3] = vec2(0.0, 1.0);


    vec2 velocity;
    float divergence;

    velocity = unScaleVec2(texture2D(renderTarget0, uv), -10.0, 10.0);

    for(int i = 0; i <= 3; i++){
        vec2 offset = texelSize * adjacentOffsets[i];
        
        divergence = unScaleFloat(texture2D(renderTarget1, offset + uv), -10.0, 10.0);
        divergence /= 4.0;
        velocity += (vec2(divergence,divergence) * adjacentOffsets[i]);
    }

    gl_FragColor = vec4(scaleVec2(velocity, -10.0, 10.0));
}