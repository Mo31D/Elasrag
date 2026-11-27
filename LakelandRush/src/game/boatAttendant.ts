// Reference-based station beside the mapped building immediately north of Waterhead Coffee Shop.
// Coordinates are a placement estimate, not a surveyed position of a real individual.
export const ATTENDANT_STATION={x:86.65,z:-294.2,yaw:-Math.PI/2};
export const ATTENDANT_LINES=[
 'Welcome to Waterhead! Fancy a trip out on the lake?',
 'Choose a rowboat or motorboat. Approach an available boat to board.',
 'Use the movement control to steer and the accelerator to increase your speed.',
 'When you are ready, stop your boat in a clear area before leaving it.'
] as const;
export function attendantInRange(x:number,z:number,y:number,ground:number){
 return Math.hypot(x-ATTENDANT_STATION.x,z-ATTENDANT_STATION.z)<3.2&&Math.abs(y-ground)<1.8;
}
