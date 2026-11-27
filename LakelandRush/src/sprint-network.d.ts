declare module 'virtual:sprint-network' {
 const routes: Record<string,{points:Array<[number,number]>;segments:import('./types/game').RaceRoadSegment[]}|null>;
 export default routes;
}
