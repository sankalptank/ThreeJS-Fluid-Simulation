#include "Functions.glsl"
varying vec3 v_Normal;
varying vec3 pos;
uniform vec2 mouseVel;
uniform vec2 canvasRes;
uniform vec2 mousePos;

//calculate velocity of mouse:

void main() {
    //calculates general variables
    vec2 mouseVel = mouseVel;
    vec2 mousePos = mousePos;
    vec2 uv = vec2(pos.x, pos.y);
    vec2 pixelSize = vec2(uv.x / canvasRes.x, uv.y / canvasRes.y);


    //calculates densities
    float dist2Mouse = distance(mousePos, uv);
    float dyeDensity = invertFloat(step(0.05, dist2Mouse));

    //calculates velocities
    mouseVel *= invertFloat(step(0.03, dist2Mouse)); 

    //transform mousevel to 0-1 range and set it to output color
    gl_FragColor = scaleVec2(mouseVel, -10.0, 10.0);
    
}