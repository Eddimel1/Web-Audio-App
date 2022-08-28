precision highp float;
uniform float u_time;
uniform sampler2D u_t1;
uniform sampler2D u_t2;
varying vec2 vUv;
uniform vec2 u_mouse;
void main()
{    vec2 newUv = vUv;
    
    newUv.y += cos(u_time/5.0) * sin(u_time ) * 0.5 ;
    newUv.x += sin(u_time/10.0) * cos(u_time ) * 0.5 ;
    
    vec3 texture = texture2D(u_t2,newUv).rgb;
    texture.r += cos(u_time);
     texture.g += sin(u_time);
      texture.b += sin(u_time);
  gl_FragColor = vec4(texture,1.0);
}