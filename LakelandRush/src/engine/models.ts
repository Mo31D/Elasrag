import * as THREE from 'three';
import {batchAnimalDetail} from './animalDetail';

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
 * Lakeland fell walker: weatherproof shell, technical hiking trousers,
 * expedition rucksack and walking boots. Retains the original animated rig,
 * forward direction (-Z), joint anchors and gameplay scale.
 */
export function createRunnerModel(contactShadowMap: THREE.Texture): RunnerRig {
  const root = new THREE.Group();
  root.name = 'Lakeland fell walker';
  const bodyPivot = new THREE.Group();
  bodyPivot.position.y = 0.88;
  root.add(bodyPivot);
  const mat = (color:number,roughness=.88) => new THREE.MeshStandardMaterial({color,roughness,metalness:0});
  const shell=mat(0x344354,.79), shellDark=mat(0x263342), shellLight=mat(0x48596a);
  const trousers=mat(0x59616b), knee=mat(0x424b54), seam=mat(0x353e49);
  const packRed=mat(0xb82b23,.86), packLight=mat(0xda4435), packDark=mat(0x8a2523);
  const packBase=mat(0x303b3e), webbing=mat(0x858d90), buckles=mat(0x282d30);
  const skin=mat(0xc99c7b,.82), skinShade=mat(0x9b6e57), cap=mat(0x795a3d), capBand=mat(0x59452f);
  const hair=mat(0x49382d), eyes=mat(0x353331), zip=mat(0x161e26), silver=mat(0xa6b1b5,.52);
  const boot=mat(0x48413a), rubber=mat(0x24282a), bootTrim=mat(0x70604c), laces=mat(0x9b8c72);
  const add=(g:THREE.Group,geo:THREE.BufferGeometry,m:THREE.Material,x=0,y=0,z=0,shadow=true)=>{
    const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=shadow;o.receiveShadow=true;g.add(o);return o;
  };
  const ell=(g:THREE.Group,m:THREE.Material,x:number,y:number,z:number,rx:number,ry:number,rz:number)=>{
    const o=add(g,new THREE.SphereGeometry(1,18,12),m,x,y,z);o.scale.set(rx,ry,rz);return o;
  };
  const box=(g:THREE.Group,m:THREE.Material,x:number,y:number,z:number,w:number,h:number,d:number)=>
    add(g,new THREE.BoxGeometry(w,h,d),m,x,y,z);
  // Continuous tapered, rounded cross-sections instead of rectangular body blocks.
  const form=(g:THREE.Group,m:THREE.Material,profile:number[][],sx:number,sz:number,x=0,y=0,z=0)=>{
    const o=add(g,new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(p[1],p[0])),24),m,x,y,z);
    o.scale.set(sx,1,sz);return o;
  };
  const line=(g:THREE.Group,m:THREE.Material,pts:number[][],radius=.005)=>{
    const curve=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));
    return add(g,new THREE.TubeGeometry(curve,Math.max(6,pts.length*3),radius,5,false),m,0,0,0,false);
  };
  const fixed=new THREE.Group();bodyPivot.add(fixed);
  // Tailored waterproof jacket: curved shoulders, waist, hip and collar.
  form(fixed,shell,[[-.115,0],[-.105,.185],[-.045,.203],[.10,.183],[.25,.205],[.37,.222],[.435,.198],[.47,.133],[.48,0]],1,.67);
  ell(fixed,trousers,0,-.085,0,.206,.115,.132);
  form(fixed,shellDark,[[.395,0],[.405,.127],[.49,.123],[.52,.105],[.52,0]],1,.89);
  // Folded rain hood rests behind the collar, below the pack lid.
  ell(fixed,shellLight,0,.465,.097,.147,.076,.096);
  line(fixed,zip,[[0,-.085,-.131],[0,.11,-.127],[0,.29,-.141],[0,.45,-.109]],.007);
  box(fixed,silver,.009,.405,-.127,.014,.024,.01);
  for(const s of [-1,1]){
    line(fixed,shellDark,[[s*.16,-.058,-.086],[s*.12,.025,-.126],[s*.135,.145,-.135]],.005);
    line(fixed,zip,[[s*.132,.025,-.12],[s*.145,.135,-.131]],.006);
    line(fixed,shellLight,[[s*.19,.24,-.09],[s*.175,.35,-.105],[s*.12,.424,-.09]],.005);
  }
  // Full-size technical red rucksack: curved load, floating lid, side gussets,
  // dark reinforced base, stitched outer pocket and compression webbing.
  form(fixed,packRed,[[-.104,0],[-.091,.128],[-.035,.181],[.10,.192],[.28,.194],[.40,.176],[.46,.124],[.465,0]],1,.83,0,.025,.235);
  ell(fixed,packDark,0,.045,.24,.182,.145,.145);
  ell(fixed,packBase,0,-.026,.246,.181,.082,.151);
  ell(fixed,packLight,0,.454,.239,.19,.083,.15);
  ell(fixed,packRed,0,.218,.356,.137,.177,.055);
  line(fixed,packDark,[[-.13,.35,.373],[-.146,.22,.388],[-.108,.07,.373],[0,.041,.389],[.108,.07,.373],[.146,.22,.388],[.13,.35,.373]],.005);
  line(fixed,zip,[[0,.354,.402],[.006,.245,.414],[.008,.12,.405]],.005);
  box(fixed,silver,.013,.28,.419,.012,.026,.009);
  for(const s of [-1,1]){
    // Shoulder harness wraps over jacket to the front, hip belt and chest strap.
    line(fixed,packBase,[[s*.132,.31,.155],[s*.136,.465,.078],[s*.143,.437,-.083],[s*.13,.27,-.147],[s*.123,.087,-.135],[s*.168,-.01,-.077]],.023);
    line(fixed,webbing,[[s*.132,.31,.175],[s*.138,.465,.088],[s*.15,.435,-.101],[s*.139,.25,-.164],[s*.13,.08,-.149]],.012);
    ell(fixed,packBase,s*.172,.02,.225,.043,.122,.112);
    line(fixed,webbing,[[s*.175,.395,.245],[s*.135,.32,.375],[s*.11,.17,.411],[s*.14,.03,.367]],.011);
    line(fixed,webbing,[[s*.195,.24,.25],[s*.184,.23,.333],[s*.14,.2,.389]],.009);
    line(fixed,webbing,[[s*.192,.105,.24],[s*.181,.09,.33],[s*.145,.07,.377]],.009);
    box(fixed,buckles,s*.12,.173,.416,.039,.034,.018);
    box(fixed,buckles,s*.139,.19,-.17,.036,.043,.018);
    line(fixed,packBase,[[s*.14,-.055,.236],[s*.2,-.045,.105],[s*.19,-.046,-.052],[s*.10,-.045,-.126],[0,-.046,-.145]],.027);
  }
  line(fixed,webbing,[[-.14,.18,-.164],[0,.17,-.154],[.14,.18,-.164]],.009);
  box(fixed,buckles,0,.17,-.165,.039,.027,.021);
  box(fixed,buckles,0,-.045,-.155,.061,.039,.029);
  line(fixed,webbing,[[-.05,.515,.226],[-.047,.558,.225],[.047,.558,.225],[.05,.515,.226]],.008);
  // Small loose adjustment strap replaces the old exaggerated flying scarf.
  // Keep its own mesh because the existing animation drives it independently.
  const scarfTail=add(bodyPivot,new THREE.BoxGeometry(.027,.13,.009),webbing,.155,.035,.345,false);
  scarfTail.name='Loose rucksack adjustment strap';

  const headGroup=new THREE.Group();headGroup.position.set(0,.58,0);bodyPivot.add(headGroup);
  ell(headGroup,skin,0,.021,-.006,.112,.151,.108);
  ell(headGroup,skin,0,-.051,-.028,.09,.085,.085);
  ell(headGroup,skin,0,-.015,-.105,.025,.042,.03);
  ell(headGroup,skinShade,0,-.075,-.102,.035,.009,.007);
  for(const s of [-1,1]){
    ell(headGroup,skin,s*.112,-.01,0,.023,.043,.022);
    ell(headGroup,eyes,s*.045,.024,-.103,.018,.008,.006);
    line(headGroup,hair,[[s*.024,.043,-.102],[s*.048,.046,-.108],[s*.066,.043,-.097]],.004);
    ell(headGroup,hair,s*.091,.036,.018,.024,.061,.065);
  }
  // Wool walking beanie with rolled rim and subtle knitted ribs.
  ell(headGroup,cap,0,.098,.005,.124,.121,.117);
  form(headGroup,capBand,[[.048,.116],[.051,.123],[.085,.125],[.091,.118]],1,.96,0,0,.005);
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8,c=Math.cos(a),s=Math.sin(a);
    line(headGroup,cap,[[c*.124,.054,.005+s*.119],[c*.125,.07,.005+s*.12],[c*.123,.085,.005+s*.118]],.002);
  }
  ell(fixed,skin,0,.506,0,.067,.076,.064);

  const makeArm=(side:-1|1)=>{
    const pivot=new THREE.Group();pivot.position.set(side*.267,.365,0);bodyPivot.add(pivot);
    form(pivot,shell,[[-.405,0],[-.392,.045],[-.32,.055],[-.22,.063],[-.13,.076],[-.025,.08],[.04,.065],[.055,0]],1,.91);
    ell(pivot,shellLight,0,-.024,.006,.077,.07,.072);
    ell(pivot,shellDark,0,-.207,.026,.057,.075,.039);
    form(pivot,shellDark,[[-.406,.048],[-.404,.053],[-.365,.054],[-.362,.049]],1,.9);
    ell(pivot,skin,0,-.443,-.002,.049,.066,.031);
    ell(pivot,skin,-side*.036,-.435,-.018,.022,.039,.023);
    line(pivot,seam,[[side*.062,-.05,.013],[side*.065,-.16,.015],[side*.051,-.31,.008]],.004);
    return pivot;
  };
  const leftArm=makeArm(-1),rightArm=makeArm(1);
  const makeLeg=(side:-1|1)=>{
    const pivot=new THREE.Group();pivot.position.set(side*.115,-.08,0);bodyPivot.add(pivot);
    form(pivot,trousers,[[-.59,0],[-.575,.052],[-.46,.064],[-.33,.072],[-.24,.082],[-.10,.101],[.025,.105],[.065,.073],[.07,0]],1,.9);
    ell(pivot,knee,0,-.288,-.044,.075,.11,.038);
    line(pivot,seam,[[side*.086,-.08,0],[side*.073,-.27,.014],[side*.058,-.45,.007],[side*.052,-.56,.005]],.004);
    line(pivot,seam,[[side*.057,-.13,-.067],[side*.042,-.18,-.076]],.006);
    // Mid-height hiking boot, shaped toe box, protective rand, heel and tread.
    ell(pivot,boot,0,-.557,.013,.072,.119,.076);
    ell(pivot,boot,0,-.625,-.054,.079,.066,.149);
    ell(pivot,bootTrim,0,-.598,-.084,.063,.036,.098);
    ell(pivot,rubber,0,-.662,-.06,.081,.032,.151);
    ell(pivot,rubber,0,-.635,-.166,.075,.039,.044);
    for(let i=0;i<4;i++){
      const z=-.159+i*.058;
      for(const s of [-1,1])box(pivot,rubber,s*.043,-.69,z,.06,.014,.033);
      const y=-.577+i*.018;
      line(pivot,laces,[[-.039,y,-.111+i*.022],[0,y-.006,-.121+i*.022],[.039,y,-.111+i*.022]],.004);
    }
    return pivot;
  };
  const leftLeg=makeLeg(-1),rightLeg=makeLeg(1);
  // Merge same-material decorations per joint to keep rendering lightweight.
  for(const g of [fixed,headGroup,leftArm,rightArm,leftLeg,rightLeg])batchAnimalDetail(g);

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
    waterMode?:'land'|'swimming'|'rowing';
  },
): void {
  const { stridePhase, speedMps, isAirborne, isSliding, isGrinding, steerTilt, squashY, time, dt } =
    params;

  const damp = 1 - Math.exp(-14 * dt);

  if(params.waterMode==='swimming'||params.waterMode==='rowing'){
    const swimming=params.waterMode==='swimming',moving=speedMps>.06,phase=swimming?stridePhase*2:stridePhase;
    rig.flightSuit.visible=false;rig.contactShadow.visible=false;rig.bodyPivot.scale.set(1,1,1);
    rig.bodyPivot.position.y=THREE.MathUtils.lerp(rig.bodyPivot.position.y,swimming?.86:.12,damp);
    rig.bodyPivot.rotation.set(swimming?-1.30:Math.sin(phase)*.15,0,swimming&&moving?Math.sin(phase)*.08:0);
    rig.headGroup.rotation.x=swimming?1.10:0;
    rig.leftArm.rotation.set(swimming?(moving?-.9+Math.sin(phase)*1.7:-.4):-.9,0,swimming?-.25:-.25);
    rig.rightArm.rotation.set(swimming?(moving?-.9-Math.sin(phase)*1.7:-.4):-.9,0,.25);
    rig.leftLeg.rotation.set(swimming?(moving?Math.sin(phase*2)*.28:0):-1.4,0,0);
    rig.rightLeg.rotation.set(swimming?(moving?-Math.sin(phase*2)*.28:0):-1.4,0,0);
    rig.scarfTail.rotation.x=.1;return;
  }
  if(params.flying){
    rig.flightSuit.visible=true;rig.contactShadow.visible=false;
    const vertical=THREE.MathUtils.clamp(params.flightVertical??0,-1,1);
    rig.bodyPivot.position.y=THREE.MathUtils.lerp(rig.bodyPivot.position.y,.87,damp);
    rig.bodyPivot.rotation.x=THREE.MathUtils.lerp(rig.bodyPivot.rotation.x,-1.35+vertical*.18,damp);
    rig.bodyPivot.rotation.z=THREE.MathUtils.lerp(rig.bodyPivot.rotation.z,-steerTilt*.35,damp);
    rig.bodyPivot.scale.set(1,1,1);
    rig.headGroup.rotation.x=THREE.MathUtils.lerp(rig.headGroup.rotation.x,1.18,damp);
    rig.leftArm.rotation.set(0,0,THREE.MathUtils.lerp(rig.leftArm.rotation.z,-1.32,damp));
    rig.rightArm.rotation.set(0,0,THREE.MathUtils.lerp(rig.rightArm.rotation.z,1.32,damp));
    rig.leftLeg.rotation.set(0,0,THREE.MathUtils.lerp(rig.leftLeg.rotation.z,-.22,damp));
    rig.rightLeg.rotation.set(0,0,THREE.MathUtils.lerp(rig.rightLeg.rotation.z,.22,damp));
    rig.scarfTail.rotation.x=.25+Math.sin(time*14)*.10;
    const pos=rig.flightSuit.geometry.attributes.position;
    let i=0;
    const tri=(a:THREE.Vector3,b:THREE.Vector3,c:THREE.Vector3)=>{for(const p of [a,b,c])pos.setXYZ(i++,p.x,p.y,p.z);};
    const limb=(part:THREE.Group,y:number)=>new THREE.Vector3(0,y,.015).applyQuaternion(part.quaternion).add(part.position);
    for(const [side,arm,leg] of [[-1,rig.leftArm,rig.leftLeg],[1,rig.rightArm,rig.rightLeg]] as const){
      const shoulder=limb(arm,0),wrist=limb(arm,-.40),hip=new THREE.Vector3(side*.21,-.10,.02),thigh=limb(leg,-.30);
      const seam=wrist.clone().lerp(thigh,.36);seam.x+=side*.13;seam.z+=.025;
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
  rig.contactShadow.visible=true;
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
 const g=new THREE.Group(),wool=new THREE.MeshStandardMaterial({color:0xaaa59f,roughness:1}),light=new THREE.MeshStandardMaterial({color:0xd6d1c5,roughness:1}),face=new THREE.MeshStandardMaterial({color:0xd9d4cc,roughness:.88}),hoof=new THREE.MeshStandardMaterial({color:0x393735,roughness:.8}),eye=new THREE.MeshStandardMaterial({color:0x30251b});
 function oval(parent:THREE.Group,mat:THREE.Material,x:number,y:number,z:number,a:number,b:number,c:number){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,12,9),mat);mesh.scale.set(a,b,c);mesh.position.set(x,y,z);parent.add(mesh);mesh.castShadow=true;return mesh;}
 const body=new THREE.Group();g.add(body);oval(body,wool,0,.64,.02,.35,.37,.57);
 for(let i=0;i<32;i++){const t=i*2.399963,a=-.83+1.66*(i+.5)/32,r=Math.sqrt(1-a*a);oval(body,i%4===0?light:wool,.32*r*Math.sin(t),.64+.32*r*Math.cos(t),a*.52,.11,.105,.13);}
 oval(body,light,0,.63,.58,.10,.16,.13);
 const head=new THREE.Group();head.position.set(0,.76,-.52);g.add(head);oval(head,face,0,0,0,.15,.205,.19);oval(head,face,0,-.095,-.133,.115,.105,.15);oval(head,hoof,0,-.09,-.259,.078,.038,.037);
 for(const side of [-1,1]){const ear=oval(head,face,side*.17,.08,-.018,.14,.047,.068);ear.rotation.z=side*.25;oval(head,hoof,side*.22,.079,-.03,.062,.028,.045);oval(head,eye,side*.124,.034,-.112,.024,.017,.021);oval(head,hoof,side*.03,-.133,-.24,.017,.007,.018);}
 for(const [x,z] of [[-.2,-.28],[.2,-.28],[-.2,.28],[.2,.28]]){const leg=new THREE.Group();leg.position.set(x,.22,z);g.add(leg);oval(leg,face,0,.035,0,.052,.21,.06);oval(leg,hoof,0,-.18,-.012,.057,.045,.075);}
 batchAnimalDetail(g);return g;
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
