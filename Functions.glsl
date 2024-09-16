// functions for fragment shaders

float invertFloat(float value) {
    value = 1.0 - value;
    return value;
}

vec4 scaleVec2(vec2 value, float min, float max){
    value = clamp(value, vec2(min, min), vec2(max, max));
    value = (value/abs(min-max))+0.5;
    return vec4(value,0.0,1.0);
}

vec4 scaleFloat(float value, float min, float max){
    value = clamp(value, min, max);
    value = (value/abs(min-max))+0.5;
    return vec4(value,0.0,0.0,1.0);
}

vec2 unScaleVec2(vec4 value, float min, float max){
    value = (value-0.5)*abs(min-max);
    return value.xy;
}

float unScaleFloat(vec4 value, float min, float max){
    value = (value-0.5)*abs(min-max);
    return value.x;
}