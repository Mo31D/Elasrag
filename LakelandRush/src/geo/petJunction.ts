import type {Point} from './parking';
// Reference IMG_2299: view north from Old Toll House toward the Waterhead fork.
// Coordinates are matched to existing mapped roads/sidewalks, not a survey.
export const PET_JUNCTION_CHUNK='0_-1';
export const PET_JUNCTION_WALL_ID=1567958550;
export const GARDEN_WALL:Point[]=[[142.5,-231.6],[141.8,-239.3],[141.4,-241],[141,-242.7],[137.8,-259.4],[136.8,-278.1]];
export const GATE_Z=-244.4,GATE_WIDTH=1.65;
export function gardenWallX(z:number){
 for(let i=1;i<GARDEN_WALL.length;i++){const a=GARDEN_WALL[i-1],b=GARDEN_WALL[i];if(z<=a[1]&&z>=b[1])return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]);}
 return z>GARDEN_WALL[0][1]?GARDEN_WALL[0][0]:GARDEN_WALL.at(-1)![0];
}
export function petGardenRuns(){
 const cuts=[...GARDEN_WALL.map(p=>p[1]),GATE_Z+GATE_WIDTH/2,GATE_Z-GATE_WIDTH/2].sort((a,b)=>b-a);
 return cuts.slice(1).flatMap((z,i)=>{const a=cuts[i];if(Math.abs((a+z)/2-GATE_Z)<GATE_WIDTH/2)return [];return [{a:[gardenWallX(a),a] as Point,b:[gardenWallX(z),z] as Point}];});
}
export const PET_SIGNAL_POINTS=[
 {x:126.5,z:-251.8,yaw:0.24,main:true,sensor:true},
 {x:139.1,z:-247.3,yaw:0.24,main:true,sensor:false},
 {x:125.0,z:-273.7,yaw:2.97,main:true,sensor:false},
 {x:116,z:-265.5,yaw:-.65,main:false,sensor:false}
];
export const PET_LAMP_POINTS:Point[]=[[142.5,-244.5],[125.2,-280.2],[135.1,-316.5]];
export const PET_TREE_POINTS=[{x:145,z:-245,height:12,spread:6},{x:144.6,z:-264,height:10,spread:5.2},{x:102,z:-282,height:10.3,spread:5.8}];
export function petJunctionReserved(x:number,z:number){return x>119&&x<150&&z>-280&&z<-230;}
export function petJunctionPavement():Point[][]{
 const zs=[-231.6,-239.3,-241,-242.7,-259.4,-275.5];
 // Existing mapped east-side pavement follows the boundary, with access to gate.
 const outer=zs.map(z=>[gardenWallX(z)-.24,z] as Point),inner=zs.map(z=>[gardenWallX(z)-1.55,z] as Point);
 return [[...outer,...inner.reverse()]];
}
