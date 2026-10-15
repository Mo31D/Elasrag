import {SOURCE_URL,DFE_34_ENTRIES,DFE_56_ENTRIES,DFE_34_VARIANTS,DFE_56_VARIANTS,DFE_Y1_EXCEPTION_EXAMPLES,DFE_Y2_EXCEPTION_EXAMPLES,DFE_Y1_PHONICS_EXAMPLES,DFE_Y2_PHONICS_EXAMPLES,DFE_SOURCE_PAGES} from './curriculum-dfe.js';
const put=(map,id,kind,stage,group,page,pattern)=>{
 id=String(id).toLowerCase();
 if(!id||!/^[a-z][a-z'’-]*$/.test(id))return;
 const list=map.get(id)||[];
 if(!list.some(x=>x.kind===kind&&x.group===group&&x.pattern===pattern))
 list.push(Object.freeze({kind,stage,group,page,pattern:pattern||null,source:SOURCE_URL}));
 map.set(id,list);
};
const SOURCE_MAP=new Map();
for(const t of DFE_Y1_EXCEPTION_EXAMPLES)put(SOURCE_MAP,t,'dfe-example',1,'Year 1 common exception word examples',DFE_SOURCE_PAGES.year1Examples,'exception words');
for(const [pattern,words] of Object.entries(DFE_Y1_PHONICS_EXAMPLES))for(const w of words.split(' '))put(SOURCE_MAP,w,'dfe-example',1,'Year 1 phonics spelling examples',40,pattern);
for(const t of DFE_Y2_EXCEPTION_EXAMPLES)put(SOURCE_MAP,t,'dfe-example',2,'Year 2 common exception word examples',DFE_SOURCE_PAGES.year2Examples,'exception words');
for(const [pattern,words] of Object.entries(DFE_Y2_PHONICS_EXAMPLES))for(const w of words.split(' '))put(SOURCE_MAP,w,'dfe-example',2,'Year 2 spelling-pattern examples',45,pattern);
for(const entry of DFE_34_ENTRIES)for(const t of DFE_34_VARIANTS[entry]||[entry])put(SOURCE_MAP,t,'statutory',3,'Years 3–4 spelling list',DFE_SOURCE_PAGES.years34,null);
for(const entry of DFE_56_ENTRIES)for(const t of DFE_56_VARIANTS[entry]||[entry])put(SOURCE_MAP,t,'statutory',5,'Years 5–6 spelling list',DFE_SOURCE_PAGES.years56,null);
export const CURRICULUM_SOURCES = SOURCE_MAP;
export const curriculumLinks=(w)=>CURRICULUM_SOURCES.get(w.id)||[];
export const curriculumYear=(w)=>Math.min(...curriculumLinks(w).map(c=>c.stage),w.stage);
export function belongsToBand(w,band){
 const refs=curriculumLinks(w);
 if(band==='eyfs')return w.stage===0;
 if(band==='y1')return refs.some(s=>s.stage===1);
 if(band==='y2')return refs.some(s=>s.stage===2);
 if(band==='y34')return refs.some(s=>s.stage===3&&s.kind==='statutory');
 if(band==='y56')return refs.some(s=>s.stage===5&&s.kind==='statutory');
 return true;
}
export function sourceLabel(w){
 const refs=curriculumLinks(w);
 if(refs.some(x=>x.kind==='statutory'))return refs.some(x=>x.stage===3)?'DfE statutory · Years 3–4':'DfE statutory · Years 5–6';
 if(refs.some(x=>x.kind==='dfe-example'))return refs.some(x=>x.stage===1)?'DfE example · Year 1':'DfE example · Year 2';
 return 'Extra practice · not a DfE word list';
}
export const CURRICULUM_BANDS=[
 {id:'eyfs',label:'EYFS practice',minYear:0,note:'Foundational practice, not a statutory word list'},
 {id:'y1',label:'Year 1 examples',minYear:1,note:'DfE spelling examples (non-statutory words)'},
 {id:'y2',label:'Year 2 examples',minYear:2,note:'DfE spelling examples (non-statutory words)'},
 {id:'y34',label:'Years 3–4',minYear:3,note:'DfE statutory 100-entry group list'},
 {id:'y56',label:'Years 5–6',minYear:5,note:'DfE statutory 100-entry group list'}
];
