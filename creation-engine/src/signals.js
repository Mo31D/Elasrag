import * as THREE from 'three';

// Four deliberately different miniature explanations, constructed in real 3D.
// No downloaded imagery: interfaces, a graph, a sketch and an ordered route.
export function createSignals() {
  const root = new THREE.Group();
  root.name = 'Interactive_capability_diagrams';
  const diagrams = new Map();
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf0dfc3, transparent: true, opacity: 0, depthWrite: false });
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xf8ebd3, transparent: true, opacity: 0, depthWrite: false });
  const nodeGeometry = new THREE.SphereGeometry(.055, 10, 8);
  function line(group, points, closed = false) {
    const vertices = points.map(p => new THREE.Vector3(...p));
    if (closed) vertices.push(vertices[0].clone());
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const object = new THREE.Line(geometry, lineMaterial.clone());
    group.add(object);
    return object;
  }
  function dot(group, point, radius = 1) {
    const node = new THREE.Mesh(nodeGeometry, dotMaterial.clone());
    node.position.set(...point); node.scale.setScalar(radius);
    group.add(node);
    return node;
  }
  function diagram(id, build) {
    const group = new THREE.Group();
    group.name = `Capability_${id}`;
    group.position.z = .65;
    root.add(group);
    const update = build(group);
    diagrams.set(id, { group, update, amount: 0 });
  }
  diagram('technology', group => {
    const layers = [];
    for (let i = 0; i < 3; i++) {
      const layer = new THREE.Group();
      group.add(layer);
      line(layer, [[-.78,-.48,0],[.78,-.48,0],[.78,.48,0],[-.78,.48,0]], true);
      line(layer, [[-.78,.25,0],[.78,.25,0]]);
      for (let n = 0; n < 3; n++) dot(layer, [-.62+n*.13,.36,0], .45);
      layers.push(layer);
    }
    line(group, [[0,-.85,-.25],[0,.85,.25]]);
    return (amount, time) => layers.forEach((layer,i) => {
      layer.position.set((i-1)*.2*amount, (i-1)*.28*amount, (i-1)*.5*amount);
      layer.rotation.y = -.18 * amount;
    });
  });
  diagram('ai', group => {
    const points = [[0,0,.15],[-.85,.5,0],[.8,.55,0],[-.7,-.65,0],[.75,-.5,0],[0,.9,-.2],[.1,-.95,-.15]];
    const nodes = points.map(p => dot(group,p));
    for (const [a,b] of [[0,1],[0,2],[0,3],[0,4],[1,5],[2,5],[3,6],[4,6],[1,3],[2,4]]) line(group,[points[a],points[b]]);
    return (amount,time) => nodes.forEach((node,i) => node.scale.setScalar(1 + .18*Math.sin(time*1.8-i)*amount));
  });
  diagram('design', group => {
    for (let i=-2;i<=2;i++) {
      const p=i*.4;
      line(group,[[-1,p,-.1],[1,p,-.1]]);
      line(group,[[p,-1,-.1],[p,1,-.1]]);
    }
    const outline = line(group,[[-.75,-.7,0],[-.75,.7,0],[0,-.05,0],[.75,.7,0],[.75,-.7,0]]);
    for (const p of [[-.75,-.7,0],[-.75,.7,0],[0,-.05,0],[.75,.7,0],[.75,-.7,0]]) dot(group,p,.85);
    return amount => { outline.position.z = amount*.25; };
  });
  diagram('strategy', group => {
    const points = [[-.9,-.65,0],[-.45,-.2,.05],[.1,-.2,.1],[.1,.45,.15],[.85,.65,.2]];
    line(group,points);
    points.forEach(p=>dot(group,p));
    const traveler = dot(group,points[0],1.6);
    return (amount,time) => {
      const t = (time*.5)%4, segment = Math.floor(t), local = t-segment;
      traveler.position.fromArray(points[segment]).lerp(new THREE.Vector3(...points[segment+1]),local);
    };
  });
  return {
    root,
    update(id, amount, time, dt, reduced) {
      let settling = false;
      diagrams.forEach((diagram,key) => {
        const target = key===id ? amount : 0;
        diagram.amount += (target-diagram.amount)*(reduced ? 1 : 1-Math.exp(-dt*8));
        settling ||= Math.abs(target-diagram.amount)>.001;
        diagram.group.visible=diagram.amount>.003;
        // The diagram occupies the signature's central negative space.
        diagram.group.scale.setScalar(.5 + diagram.amount*.5);
        diagram.group.traverse(object=>{
          if (object.material) object.material.opacity=diagram.amount*.78;
        });
        diagram.update?.(diagram.amount,time);
      });
      return settling;
    },
    dispose() {
      root.traverse(object=>{object.geometry?.dispose();object.material?.dispose();});
      lineMaterial.dispose();dotMaterial.dispose();nodeGeometry.dispose();
    },
  };
}
