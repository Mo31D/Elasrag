import { useEffect, useState } from 'react';
import navigation from '../data/ambleside-navigation.json';
import { getWorldDiscoveries, WORLD_JOURNAL_EVENT } from '../game/worldJournal';

export default function WorldJournal() {
  const [discoveries,setDiscoveries] = useState(getWorldDiscoveries);
  const [mode,setMode] = useState('private');
  const [reaction,setReaction] = useState('');
  useEffect(()=>{
    const sync = () => setDiscoveries(getWorldDiscoveries());
    window.addEventListener(WORLD_JOURNAL_EVENT,sync);
    return ()=>window.removeEventListener(WORLD_JOURNAL_EVENT,sync);
  },[]);
  const visits = navigation.stops.filter(stop=>discoveries.includes(stop.id));
  return <main style={{height:'100dvh'}} className="overflow-auto bg-[#101c1b] p-5 text-[#f3f0e5]">
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-3xl font-semibold">My Holiday</h1>
        <a href={import.meta.env.BASE_URL} className="rounded-lg bg-[#e7c987] px-4 py-2 font-bold text-[#192420]">Open world</a>
      </header>
      <section className="rounded-xl bg-[#182825] p-4">
        <h2 className="text-xl font-semibold">Virtual passport</h2>
        <p className="my-2 text-sm">Fast travel to a place in Free Roam to record a virtual discovery on this device.</p>
        <ul className="space-y-1">{visits.map(stop=><li key={stop.id}>{stop.name}</li>)}</ul>
        <p className="mt-3 font-semibold">{visits.length} {visits.length===1?'stamp':'stamps'} · {visits.length*10} demo points with no financial value</p>
      </section>
      <section className="space-y-3 rounded-xl bg-[#182825] p-4">
        <h2 className="text-xl font-semibold">Social interaction demo</h2>
        <p>Try an avatar reaction locally. Rowan is a fictional demo profile.</p>
        <label className="block">Availability
          <select value={mode} onChange={event=>{setMode(event.target.value);setReaction('');}}
            className="ml-2 rounded border border-[#708e81] bg-[#1c3029] p-2">
            <option value="private">Private</option><option value="gaming">Open to game interactions</option>
          </select>
        </label>
        {mode==='gaming' && <div className="flex items-center gap-3">
          <span aria-label="Fictional avatar" className="grid size-10 place-items-center rounded-full bg-[#e7c987] font-bold text-[#192420]">R</span>
          <span>Rowan · fictional demo</span>
          <button className="rounded border border-[#6b8e7e] px-3 py-2" onClick={()=>setReaction('Rowan waves back in the local demo.')}>Wave</button>
        </div>}
        <p role="status">{reaction}</p>
      </section>
    </div>
  </main>;
}
