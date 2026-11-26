import { lazy, Suspense } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const Inspector = lazy(() => import('./components/WorldInspector'));
const Journal = lazy(() => import('./components/WorldJournal'));
const page = new URLSearchParams(window.location.search);
const Entry = page.has('inspect') ? Inspector : page.has('holiday') ? Journal : null;
createRoot(document.getElementById('root')!).render(Entry
  ? <Suspense fallback={<p>Loading Lakeland World…</p>}><Entry /></Suspense>
  : <><App /><nav aria-label="Lakeland World tools" className="fixed bottom-2 left-2 z-[60] flex gap-1 text-sm text-white">
    <a className="rounded bg-slate-950/90 px-2 py-1" href="?inspect">World inspector</a>
    <a className="rounded bg-slate-950/90 px-2 py-1" href="?holiday">My Holiday</a>
  </nav></>);
