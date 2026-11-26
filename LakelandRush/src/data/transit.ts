import { latLonToWorld } from '../geo/projection';

export interface TransitRecord {
  id: string; name: string; mode: 'bus' | 'rail';
  lat: number; lon: number; source: string; bearing: number;
}
// Published stop coordinates, not a field survey of poles or shelters.
// Bus coordinates: Traveline National Dataset, Open Government Licence, via UK City Map.
const records: TransitRecord[] = [
  {id:'090079412887',name:'Waterhead Pier',mode:'bus',lat:54.420115,lon:-2.961983,bearing:0,source:'https://www.ukcitymap.com/pier-os-info-090079412887.html'},
  {id:'090079411913',name:'Waterhead Hotel for Pier',mode:'bus',lat:54.421001,lon:-2.961387,bearing:0,source:'https://www.ukcitymap.com/waterhead-hotel-for-pier-os-info-090079411913.html'},
  {id:'090079412735',name:'Hayes Garden Centre (near)',mode:'bus',lat:54.425816,lon:-2.961623,bearing:180,source:'https://www.ukcitymap.com/hayes-garden-centre-near-info-090079412735.html'},
  {id:'090079412561',name:'Loughrigg Avenue',mode:'bus',lat:54.427788,lon:-2.962332,bearing:0,source:'https://www.ukcitymap.com/loughrigg-avenue-near-info-090079412561.html'},
  {id:'090079414625',name:'Climbing Wall (opp)',mode:'bus',lat:54.429063,lon:-2.962393,bearing:180,source:'https://www.ukcitymap.com/climbing-wall-opp-info-090079414625.html'},
  {id:'090079412212',name:'Ambleside bus interchange (Stand 1)',mode:'bus',lat:54.429973,lon:-2.963247,bearing:90,source:'https://www.ukcitymap.com/bus-interchange-stand-1-info-090079412212.html'},
  {id:'090079412211',name:'Ambleside bus interchange (Stand 2)',mode:'bus',lat:54.429962,lon:-2.963555,bearing:90,source:'https://www.ukcitymap.com/bus-interchange-stand-2-info-090079412211.html'},
  {id:'WDM',name:'Windermere Railway Station',mode:'rail',lat:54.37960543,lon:-2.903389364,bearing:0,source:'https://www.geopunk.co.uk/railways/stations/windermere-station'},
];
export const TRANSIT = records.map(record => {
  const [x,z] = latLonToWorld(record.lat,record.lon);
  return {...record,x,z};
});
