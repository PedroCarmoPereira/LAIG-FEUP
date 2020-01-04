#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec4 coords;

uniform sampler2D uSamplerTex;
uniform float time;


void main() {
    float dist = distance(vec2(0.5,0.5), vTextureCoord);
	vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
	vec4 tex = texture2D(uSamplerTex, vTextureCoord);
    vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
    float step1 = 0.1;
    float step2 = 0.5;	

    if(mod(vTextureCoord.y * 10.0 - sin(time), 2.0) > 1.0){ 
        vec4 color = vec4(tex.rgb + 0.8, 0.0);
        vec4 color2 = mix(color, black, smoothstep(step1, step2, dist));
        gl_FragColor = vec4(color2.rgb * dist, 1.0);
    }
	else{
        vec4 color = mix(tex, black, smoothstep(step1, step2, dist));
        gl_FragColor = color;
    }
}