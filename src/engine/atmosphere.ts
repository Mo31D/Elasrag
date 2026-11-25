import * as THREE from 'three';

export function createAtmosphere() {
  const uniforms = {
    horizon: { value: new THREE.Color('#a4bdc6') },
    zenith: { value: new THREE.Color('#588eb9') },
    cloud: { value: new THREE.Color('#fcf3e1') },
    sunDirection: { value: new THREE.Vector3(0.5, .57, .6).normalize() },
    cloudCover: { value: .41 },
    daylight: { value: 1 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `
      varying vec3 vDirection;
      void main() {
        vDirection = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vDirection;
      uniform vec3 horizon, zenith, cloud, sunDirection;
      uniform float cloudCover, daylight;
      float hash(vec2 p) {
        vec3 q = fract(vec3(p.xyx) * 0.1031);
        q += dot(q, q.yzx + 33.33);
        return fract((q.x + q.y) * q.z);
      }
      float noise2(vec2 p) {
        vec2 cell = floor(p), f = fract(p);
        vec2 t = f*f*(3.0-2.0*f);
        return mix(mix(hash(cell),hash(cell+vec2(1,0)),t.x),
                   mix(hash(cell+vec2(0,1)),hash(cell+1.0),t.x),t.y);
      }
      void main() {
        vec3 direction = normalize(vDirection);
        float above = max(0.0,direction.y);
        vec3 base = mix(horizon, zenith, pow(above, .48));
        vec2 coord = direction.xz / (above + .25) * 3.2 + vec2(3.4,7.8);
        float density = noise2(coord)*.55 + noise2(coord*2.14)*.25
          + noise2(coord*4.41)*.13 + noise2(coord*9.1)*.07;
        float mask = smoothstep(1.0-cloudCover,1.18-cloudCover,density)
          * smoothstep(.013,.15,above);
        vec3 clouds = mix(horizon*.84,cloud,smoothstep(.13,.38,above));
        base = mix(base,clouds,mask*.82*daylight);
        float sun = max(0.0,dot(direction,sunDirection));
        base += cloud * (pow(sun,19.0)*.12 + pow(sun,520.0)*.57) * daylight;
        gl_FragColor = vec4(base,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1900, 24, 12), material);
  dome.frustumCulled = false;
  dome.renderOrder = -1000;
  return { dome, uniforms };
}
