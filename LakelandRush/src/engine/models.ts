import * as THREE from 'three';

export interface RunnerRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  headGroup: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  contactShadow: THREE.Mesh;
  scarfTail: THREE.Mesh;
  flightSuit: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
}

/**
 * Builds "Rowan", our original 11-part articulated Lakeland Fell Runner:
 * high-visibility saffron technical shell, Cumbria slate rucksack, wool beanie,
 * articulated limbs, trail shoes, and grounded contact shadow.
 */
export function createRunnerModel(contactShadowMap: THREE.Texture): RunnerRig {
  const root = new THREE.Group();
  const bodyPivot = new THREE.Group();
  bodyPivot.position.y = 0.88;
  root.add(bodyPivot);

  const jacketMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // High-vis Lakeland saffron gold
    roughness: 0.42,
    metalness: 0.05,
  });
  const slatePantsMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Dark slate technical trousers
    roughness: 0.78,
    metalness: 0.04,
  });
  const packMat = new THREE.MeshStandardMaterial({
    color: 0x0f766e, // Cumbria teal waterproof pack
    roughness: 0.65,
    metalness: 0.08,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf1c29d,
    roughness: 0.62,
    metalness: 0.02,
  });
  const beanieMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.88,
    metalness: 0.0,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.48,
    metalness: 0.12,
  });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.14,
    metalness: 0.45,
  });

  // 1. Torso jacket
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.56, 0.28), jacketMat);
  torso.position.y = 0.18;
  torso.castShadow = true;
  bodyPivot.add(torso);

  // 2. Collar / reflective chest trim
  const chestStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.47, 0.08, 0.295),
    new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.25, metalness: 0.3 }),
  );
  chestStripe.position.y = 0.24;
  bodyPivot.add(chestStripe);

  // 3. Technical trail rucksack (back is +Z when facing -Z)
  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 0.18), packMat);
  backpack.position.set(0, 0.2, 0.21);
  backpack.castShadow = true;
  bodyPivot.add(backpack);

  // 4. Trail scarf / wind tail
  const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.36), beanieMat);
  scarfTail.position.set(0.06, 0.44, 0.2);
  bodyPivot.add(scarfTail);

  // 5. Head + Sunglasses + Beanie
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.58, 0);
  bodyPivot.add(headGroup);

  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 14), skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.065, 0.12), visorMat);
  glasses.position.set(0, 0.02, -0.11);
  headGroup.add(glasses);

  const beanie = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.58),
    beanieMat,
  );
  beanie.position.y = 0.03;
  headGroup.add(beanie);

  // 6 & 7. Articulated Arms
  const makeArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.31, 0.4, 0);
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.068, 0.32, 4, 8), jacketMat);
    sleeve.position.y = -0.2;
    sleeve.castShadow = true;
    pivot.add(sleeve);

    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), slatePantsMat);
    glove.position.y = -0.4;
    pivot.add(glove);
    bodyPivot.add(pivot);
    return pivot;
  };
  const leftArm = makeArm(-1);
  const rightArm = makeArm(1);

  // 8 & 9. Articulated Legs + Trail Shoes
  const makeLeg = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.13, -0.08, 0);
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.082, 0.44, 4, 8), slatePantsMat);
    leg.position.y = -0.28;
    leg.castShadow = true;
    pivot.add(leg);

    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.25), shoeMat);
    shoe.position.set(0, -0.62, -0.04);
    shoe.castShadow = true;
    pivot.add(shoe);
    bodyPivot.add(pivot);
    return pivot;
  };
  const leftLeg = makeLeg(-1);
  const rightLeg = makeLeg(1);

  // Lightweight wingsuit membranes: two arm wings and one leg wing, attached to the existing rig.
  const flightGeo=new THREE.BufferGeometry();
  flightGeo.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(24*3),3).setUsage(THREE.DynamicDrawUsage));
  const flightColors:number[]=[];
  for(let i=0;i<24;i++){const col=new THREE.Color(i<18?(i%9<6?0x147b80:0xe8a832):0x24516a);flightColors.push(col.r,col.g,col.b);}
  flightGeo.setAttribute('color',new THREE.Float32BufferAttribute(flightColors,3));
  const flightSuit=new THREE.Mesh(flightGeo,new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.88,metalness:.02}));
  flightSuit.name='Deployable wingsuit';flightSuit.visible=false;flightSuit.frustumCulled=false;bodyPivot.add(flightSuit);

  // 10. Grounded Contact Shadow Disc
  const contactShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.55, 20),
    new THREE.MeshBasicMaterial({
      map: contactShadowMap,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
    }),
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.02;
  root.add(contactShadow);

  return {
    root,
    bodyPivot,
    headGroup,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    contactShadow,
    scarfTail,flightSuit,
  };
}

export function animateRunnerRig(
  rig: RunnerRig,
  params: {
    stridePhase: number;
    speedMps: number;
    isAirborne: boolean;
    isSliding: boolean;
    isGrinding: boolean;
    steerTilt: number;
    squashY: number;
    time: number;
    dt: number;
    flying?:boolean;
    flightVertical?:number;
  },
): void {
  const { stridePhase, speedMps, isAirborne, isSliding, isGrinding, steerTilt, squashY, time, dt } =
    params;

  const damp = 1 - Math.exp(-14 * dt);

  if(params.flying){
    rig.flightSuit.visible=true;rig.contactShadow.visible=false;
    const vertical=THREE.MathUtils.clamp(params.flightVertical??0,-1,1);
    rig.bodyPivot.position.y=THREE.MathUtils.lerp(rig.bodyPivot.position.y,.87,damp);
    rig.bodyPivot.rotation.x=THREE.MathUtils.lerp(rig.bodyPivot.rotation.x,-1.35+vertical*.18,damp);
    rig.bodyPivot.rotation.z=THREE.MathUtils.lerp(rig.bodyPivot.rotation.z,-steerTilt*.35,damp);
    rig.bodyPivot.scale.set(1,1,1);
    rig.headGroup.rotation.x=THREE.MathUtils.lerp(rig.headGroup.rotation.x,1.04,damp);
    rig.leftArm.rotation.set(0,0,THREE.MathUtils.lerp(rig.leftArm.rotation.z,-1.32,damp));
    rig.rightArm.rotation.set(0,0,THREE.MathUtils.lerp(rig.rightArm.rotation.z,1.32,damp));
    rig.leftLeg.rotation.set(0,0,THREE.MathUtils.lerp(rig.leftLeg.rotation.z,-.14,damp));
    rig.rightLeg.rotation.set(0,0,THREE.MathUtils.lerp(rig.rightLeg.rotation.z,.14,damp));
    rig.scarfTail.rotation.x=.25+Math.sin(time*14)*.10;
    const pos=rig.flightSuit.geometry.attributes.position;
    let i=0;
    const tri=(a:THREE.Vector3,b:THREE.Vector3,c:THREE.Vector3)=>{for(const p of [a,b,c])pos.setXYZ(i++,p.x,p.y,p.z);};
    const limb=(part:THREE.Group,y:number)=>new THREE.Vector3(0,y,.015).applyQuaternion(part.quaternion).add(part.position);
    for(const [side,arm,leg] of [[-1,rig.leftArm,rig.leftLeg],[1,rig.rightArm,rig.rightLeg]] as const){
      const shoulder=limb(arm,0),wrist=limb(arm,-.40),hip=new THREE.Vector3(side*.21,-.10,.02),thigh=limb(leg,-.30);
      const seam=wrist.clone().lerp(thigh,.36);seam.z+=.025;
      tri(shoulder,wrist,hip);tri(wrist,seam,hip);tri(seam,thigh,hip);
    }
    const lh=limb(rig.leftLeg,0),rh=limb(rig.rightLeg,0),la=limb(rig.leftLeg,-.56),ra=limb(rig.rightLeg,-.56);
    tri(lh,la,rh);tri(la,ra,rh);
    pos.needsUpdate=true;rig.flightSuit.geometry.computeVertexNormals();
    return;
  }
  if(rig.flightSuit.visible){
    rig.flightSuit.visible=false;rig.contactShadow.visible=true;rig.leftLeg.rotation.z=0;rig.rightLeg.rotation.z=0;
  }
  rig.headGroup.rotation.x=THREE.MathUtils.lerp(rig.headGroup.rotation.x,0,damp);
  if (isSliding) {
    rig.bodyPivot.position.y = THREE.MathUtils.lerp(rig.bodyPivot.position.y, 0.42, damp);
    rig.bodyPivot.rotation.x = THREE.MathUtils.lerp(rig.bodyPivot.rotation.x, 1.05, damp);
    rig.leftLeg.rotation.x = THREE.MathUtils.lerp(rig.leftLeg.rotation.x, -0.25, damp);
    rig.rightLeg.rotation.x = THREE.MathUtils.lerp(rig.rightLeg.rotation.x, 0.15, damp);
    rig.leftArm.rotation.x = THREE.MathUtils.lerp(rig.leftArm.rotation.x, -0.9, damp);
    rig.rightArm.rotation.x = THREE.MathUtils.lerp(rig.rightArm.rotation.x, -0.9, damp);
  } else if (isGrinding) {
    rig.bodyPivot.position.y = THREE.MathUtils.lerp(
      rig.bodyPivot.position.y,
      0.78 + Math.sin(time * 24) * 0.025,
      damp,
    );
    rig.bodyPivot.rotation.x = THREE.MathUtils.lerp(rig.bodyPivot.rotation.x, -0.22, damp);
    rig.leftLeg.rotation.x = THREE.MathUtils.lerp(rig.leftLeg.rotation.x, 0.35, damp);
    rig.rightLeg.rotation.x = THREE.MathUtils.lerp(rig.rightLeg.rotation.x, -0.45, damp);
    rig.leftArm.rotation.z = THREE.MathUtils.lerp(rig.leftArm.rotation.z, 0.85, damp);
    rig.rightArm.rotation.z = THREE.MathUtils.lerp(rig.rightArm.rotation.z, -0.85, damp);
  } else if (isAirborne) {
    rig.bodyPivot.position.y = THREE.MathUtils.lerp(rig.bodyPivot.position.y, 0.92, damp);
    rig.bodyPivot.rotation.x = THREE.MathUtils.lerp(rig.bodyPivot.rotation.x, -0.18, damp);
    rig.leftLeg.rotation.x = THREE.MathUtils.lerp(rig.leftLeg.rotation.x, 0.65, damp);
    rig.rightLeg.rotation.x = THREE.MathUtils.lerp(rig.rightLeg.rotation.x, -0.55, damp);
    rig.leftArm.rotation.x = THREE.MathUtils.lerp(rig.leftArm.rotation.x, -0.95, damp);
    rig.rightArm.rotation.x = THREE.MathUtils.lerp(rig.rightArm.rotation.x, -0.65, damp);
    rig.leftArm.rotation.z = THREE.MathUtils.lerp(rig.leftArm.rotation.z, 0.28, damp);
    rig.rightArm.rotation.z = THREE.MathUtils.lerp(rig.rightArm.rotation.z, -0.28, damp);
  } else {
    const amp = speedMps < 5.5 ? (speedMps / 5.5) * .35 : THREE.MathUtils.clamp(speedMps / 16, .35, 1.15);
    const swing = Math.sin(stridePhase) * 0.92 * amp;
    const bob = Math.abs(Math.cos(stridePhase)) * 0.09 * amp;
    const forwardLean = -Math.min(.12,speedMps*.025) - (speedMps / 35) * 0.24;

    rig.bodyPivot.position.y = THREE.MathUtils.lerp(rig.bodyPivot.position.y, 0.84 + bob, damp);
    rig.bodyPivot.rotation.x = THREE.MathUtils.lerp(rig.bodyPivot.rotation.x, forwardLean, damp);
    rig.leftLeg.rotation.x = swing;
    rig.rightLeg.rotation.x = -swing;
    rig.leftArm.rotation.x = -swing * 0.9;
    rig.rightArm.rotation.x = swing * 0.9;
    rig.leftArm.rotation.z = THREE.MathUtils.lerp(rig.leftArm.rotation.z, 0.12, damp);
    rig.rightArm.rotation.z = THREE.MathUtils.lerp(rig.rightArm.rotation.z, -0.12, damp);
  }

  // Lean into turns & squash-and-stretch
  rig.bodyPivot.rotation.z = THREE.MathUtils.lerp(rig.bodyPivot.rotation.z, -steerTilt * 0.28, damp);
  const invSq = 1 / Math.sqrt(Math.max(0.65, squashY));
  rig.bodyPivot.scale.set(invSq, squashY, invSq);
  rig.scarfTail.rotation.x = 0.2 + Math.sin(time * 18) * 0.18;
}

/**
 * Stagecoach Lake District Open-Top Double-Decker Bus (9-part composite)
 */
export function createLakesBusModel(): THREE.Group {
  const g = new THREE.Group();
  const navyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.35, metalness: 0.25 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.32, metalness: 0.2 });
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.38, metalness: 0.1 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.12, metalness: 0.6 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85, metalness: 0.05 });

  // Lower hull
  const lower = new THREE.Mesh(new THREE.BoxGeometry(2.45, 1.9, 8.2), navyMat);
  lower.position.y = 1.3;
  lower.castShadow = true;
  g.add(lower);

  // Cream & red upper skirt
  const upper = new THREE.Mesh(new THREE.BoxGeometry(2.42, 1.35, 8.0), redMat);
  upper.position.y = 2.9;
  upper.castShadow = true;
  g.add(upper);

  // Open-top upper deck rail
  const roofCap = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.22, 3.2), creamMat);
  roofCap.position.set(0, 3.65, -2.35);
  g.add(roofCap);

  // Front windshield
  const wind = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.0, 0.1), glassMat);
  wind.position.set(0, 1.5, -4.08);
  g.add(wind);

  // 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 14);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheelPositions: Array<[number, number]> = [
    [-1.18, -2.5],
    [1.18, -2.5],
    [-1.18, 2.5],
    [1.18, 2.5],
  ];
  for (const [wx, wz] of wheelPositions) {
    const w = new THREE.Mesh(wheelGeo, tireMat);
    w.position.set(wx, 0.48, wz);
    g.add(w);
  }

  return g;
}

/**
 * British Lakeland 4x4 Defender (7-part composite)
 */
export function createDefenderModel(paintHex = 0x3f6212): THREE.Group {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: paintHex, roughness: 0.4, metalness: 0.25 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.1 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.7 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.88 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.92, 4.1), bodyMat);
  body.position.y = 0.84;
  body.castShadow = true;
  g.add(body);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.74, 2.35), roofMat);
  cabin.position.set(0, 1.62, 0.35);
  cabin.castShadow = true;
  g.add(cabin);

  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.81, 0.56, 2.1), glassMat);
  glass.position.set(0, 1.58, 0.35);
  g.add(glass);

  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.28, 12);
  wheelGeo.rotateZ(Math.PI / 2);
  for (const [wx, wz] of [
    [-0.95, -1.3],
    [0.95, -1.3],
    [-0.95, 1.3],
    [0.95, 1.3],
  ]) {
    const w = new THREE.Mesh(wheelGeo, tireMat);
    w.position.set(wx, 0.4, wz);
    g.add(w);
  }
  return g;
}

/**
 * Windermere Heritage Lake Steamer / Ferry (6-part composite)
 */
export function createLakeSteamerModel(): THREE.Group {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.38, metalness: 0.12 });
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.72 });
  const funnelMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.45, metalness: 0.2 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.35 });

  const hull = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1.5, 15.0), hullMat);
  hull.position.y = 0.5;
  g.add(hull);

  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.9, 4.0, 4), hullMat);
  bow.rotation.x = -Math.PI / 2;
  bow.rotation.z = Math.PI / 4;
  bow.position.set(0, 0.5, -9.2);
  g.add(bow);

  const deck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.2, 14.4), deckMat);
  deck.position.y = 1.35;
  g.add(deck);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.6, 9.0), hullMat);
  cabin.position.set(0, 2.2, 0.5);
  g.add(cabin);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.86, 0.35, 15.1), trimMat);
  stripe.position.y = 1.05;
  g.add(stripe);

  const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 2.4, 12), funnelMat);
  funnel.position.set(0, 3.6, -1.2);
  g.add(funnel);

  return g;
}

/**
 * Cumbria Herdwick Sheep (5-part composite)
 */
export function createHerdwickSheepModel(): THREE.Group {
  const g = new THREE.Group();
  const woolMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.92 });
  const faceMat = new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.75 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), woolMat);
  body.scale.set(0.85, 0.85, 1.25);
  body.position.y = 0.62;
  body.castShadow = true;
  g.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 8, 8), faceMat);
  head.position.set(0, 0.76, -0.52);
  g.add(head);

  const legGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.45, 6);
  for (const [lx, lz] of [
    [-0.2, -0.28],
    [0.2, -0.28],
    [-0.2, 0.28],
    [0.2, 0.28],
  ]) {
    const leg = new THREE.Mesh(legGeo, faceMat);
    leg.position.set(lx, 0.22, lz);
    g.add(leg);
  }
  return g;
}

/**
 * Collectible OS Trig-Point Cairn Beacon
 */
export function createCairnTokenModel(): THREE.Group {
  const g = new THREE.Group();
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.55,
    roughness: 0.22,
    metalness: 0.8,
  });
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), goldMat);
  core.position.y = 0.85;
  g.add(core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.06, 8, 20),
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.7,
    }),
  );
  ring.position.y = 0.85;
  g.add(ring);
  return g;
}
