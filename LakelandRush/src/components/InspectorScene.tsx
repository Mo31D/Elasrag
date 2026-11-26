import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildGameplayRoad } from '../engine/worldBuilder';
import type { RegionManager } from '../geo/regionLoader';
import type { Point } from '../geo/worldCore';
import type { BuildingFeature, RoadFeature } from '../types/game';

export function InspectorScene({region,roads,buildings,mode,position,onInspect}: {
  region: RegionManager; roads: RoadFeature[]; buildings: BuildingFeature[]; mode: 'top'|'angled'; position?: Point;
  onInspect: (point: Point)=>void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onInspect);
  callback.current = onInspect;
  const selected = useRef(position);
  selected.current = position;
  const [error,setError] = useState('');
  useEffect(()=>{
    const element = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({antialias:true}); }
    catch { setError('3D inspection requires WebGL 2. Use the source map on this device.'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
    element.append(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#263c38');
    scene.add(new THREE.HemisphereLight('#d8e9f7','#667950',2.0));
    const sun = new THREE.DirectionalLight('#fff0d6',2.2);
    sun.position.set(-700,1000,500); scene.add(sun);
    const terrain = new THREE.PlaneGeometry(1520,2280,380,570);
    terrain.rotateX(-Math.PI/2);
    terrain.translate(80,0,-1060);
    const vertices = terrain.attributes.position;
    for (let i=0;i<vertices.count;i++) {
      const x=vertices.getX(i), z=vertices.getZ(i);
      vertices.setY(i,region.isInWater(x,z)?-.19:Math.max(.45,region.getTerrainHeight(x,z)));
    }
    terrain.computeVertexNormals();
    const land = new THREE.MeshStandardMaterial({color:'#8ba17c',roughness:1});
    scene.add(new THREE.Mesh(terrain,land));
    const water = new THREE.PlaneGeometry(1520,2280);
    water.rotateX(-Math.PI/2); water.translate(80,0,-1060);
    const lake = new THREE.MeshStandardMaterial({color:'#4b8094',roughness:.6});
    scene.add(new THREE.Mesh(water,lake));
    const ribbons = roads.flatMap(road => {
      const geo = buildGameplayRoad(road,region.terrain);
      return geo ? [geo] : [];
    });
    const combined = ribbons.length ? mergeGeometries(ribbons) : null;
    ribbons.forEach(geo=>geo.dispose());
    const asphalt = new THREE.MeshStandardMaterial({color:'#aca18c',roughness:1,side:THREE.DoubleSide});
    if (combined) scene.add(new THREE.Mesh(combined,asphalt));
    const masses = buildings.filter(b=>b.cx>=-680 && b.cx<=840 && b.cz>=-2200 && b.cz<=80 && b.pts.length>=3)
      .map(b=>{
        const outline = new THREE.Shape(b.pts.map(([x,z])=>new THREE.Vector2(x,-z)));
        const geometry = new THREE.ExtrudeGeometry(outline,{depth:Math.max(2,b.h),bevelEnabled:false});
        geometry.rotateX(-Math.PI/2);
        geometry.translate(b.cx,Math.max(.45,region.getTerrainHeight(b.cx,b.cz)),b.cz);
        return geometry;
      });
    const buildingGeometry = masses.length ? mergeGeometries(masses) : null;
    masses.forEach(geo=>geo.dispose());
    const stone = new THREE.MeshStandardMaterial({color:'#d2be9f',roughness:1});
    if (buildingGeometry) scene.add(new THREE.Mesh(buildingGeometry,stone));
    const camera = new THREE.OrthographicCamera();
    const target = new THREE.Vector3(80,0,-1060);
    if (mode==='top') {
      camera.up.set(0,0,-1);
      camera.position.set(80,3200,-1060);
    } else camera.position.set(1300,1700,700);
    camera.near=1; camera.far=7500; camera.lookAt(target); camera.updateMatrixWorld();
    const markerGeo = new THREE.SphereGeometry(11);
    const markerMat = new THREE.MeshBasicMaterial({color:'#fff2b0'});
    const marker = new THREE.Mesh(markerGeo,markerMat);
    scene.add(marker);
    const draw = () => {
      const {clientWidth:w,clientHeight:h} = element;
      const aspect = Math.max(1,w)/Math.max(1,h);
      const sy = Math.max(1170,795/aspect);
      camera.left=-sy*aspect; camera.right=sy*aspect; camera.top=sy; camera.bottom=-sy;
      camera.updateProjectionMatrix();
      renderer.setSize(w,h);
      const point = selected.current;
      marker.visible=!!point;
      if(point) marker.position.set(point[0],region.getTerrainHeight(...point)+13,point[1]);
      renderer.render(scene,camera);
    };
    const ray = new THREE.Raycaster();
    const choose = (event:MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2((event.clientX-rect.left)*2/rect.width-1,
        1-(event.clientY-rect.top)*2/rect.height),camera);
      const hit = ray.intersectObjects(scene.children,false).find(result=>result.object!==marker);
      if(hit) {
        const {x,z}=hit.point; selected.current=[x,z]; callback.current([x,z]); draw();
      }
    };
    renderer.domElement.addEventListener('click',choose);
    const observer = new ResizeObserver(draw);
    observer.observe(element); draw();
    return ()=>{
      observer.disconnect();
      renderer.domElement.removeEventListener('click',choose);
      renderer.domElement.remove();
      renderer.dispose();
      [terrain,water,combined,markerGeo,buildingGeometry].forEach(geo=>geo?.dispose());
      [land,lake,asphalt,markerMat,stone].forEach(mat=>mat.dispose());
    };
  },[region,roads,buildings,mode]);
  return <div className="relative">
    <div ref={host} role="img" aria-label={mode==='top'?'Orthographic road, terrain and building footprint mesh':'3D road, terrain and building footprint mesh'}
      className="h-[66dvh] min-h-[340px] w-full overflow-hidden rounded bg-[#223530]" />
    {error && <p role="alert" className="absolute inset-x-0 top-4 px-4">{error}</p>}
  </div>;
}
