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
  {id:'090079731801',name:"Windermere Bus Rail Interchange",mode:'bus',lat:54.37972854,lon:-2.90342499,bearing:0,source:'https://www.geopunk.co.uk/bus-stop/090079731801'},
  {id:'090079732809',name:"Windermere Bus Rail Interchange (second stop)",mode:'bus',lat:54.37988119,lon:-2.90344374,bearing:0,source:'https://www.geopunk.co.uk/bus-stop/090079732809'},
  {id:'090079732089',name:"St Martins Church (opp)",mode:'bus',lat:54.36386272,lon:-2.92046773,bearing:225,source:'https://www.geopunk.co.uk/bus-stop/090079732089'},
  {id:'090079732243',name:"Royalty Cinema (north eastbound)",mode:'bus',lat:54.36661358,lon:-2.91683534,bearing:45,source:'https://www.geopunk.co.uk/bus-stop/090079732243'},
  {id:'090079413285',name:"Croft Lodge (westbound)",mode:'bus',lat:54.42360418,lon:-2.97629051,bearing:270,source:'https://www.geopunk.co.uk/bus-stop/090079413285'},
  {id:'090079644896',name:"Wray Castle Road End (northbound)",mode:'bus',lat:54.40563084,lon:-2.98164069,bearing:0,source:'https://www.geopunk.co.uk/bus-stop/090079644896'},
  {id:'090079733908',name:"Blackwell House (northbound)",mode:'bus',lat:54.34287329,lon:-2.92212135,bearing:0,source:'https://www.geopunk.co.uk/bus-stop/090079733908'},
  {id:'WDM',name:'Windermere Railway Station',mode:'rail',lat:54.37960543,lon:-2.903389364,bearing:0,source:'https://www.geopunk.co.uk/railways/stations/windermere-station'},
];
export const TRANSIT = records.map(record => {
  const [x,z] = latLonToWorld(record.lat,record.lon);
  return {...record,x,z};
});
