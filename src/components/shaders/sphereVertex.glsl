precision highp float;
uniform float u_time;
uniform vec2 u_mouse;
varying vec3 vPosition;
varying vec2 vUv;
attribute float aRandom;

void main()
{
     vPosition = position;
     vUv = uv;
 
    vec3 newPos = position;
 

    //  newPos.x += cos(u_time * aRandom ) * 50.0 ;
    //  newPos.y += sin(u_time * aRandom )*  50.0 ;
    //  newPos.z += cos(u_time * aRandom ) * 10.0 ;
           


    // 1)postion our geometry - coordinates your object begins in.
    vec4 localPosition = vec4(newPos.xy,newPos.z, 1.0);

    // 2)transform the local coordinates to world-space coordinates
    vec4 worldPosition = modelMatrix * localPosition;
    
    // 3)transform the world coordinates to view-space coordinates - seen from the camera/viewer point of view
    vec4 viewPosition = viewMatrix * worldPosition;

    // 4)project view coordinates to clip coordinates and transform to screen coordinates
    vec4 clipPosition = projectionMatrix * viewPosition;

    gl_Position = clipPosition;

}