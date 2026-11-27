import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {suppressPageZoom} from './game/pageZoom';
suppressPageZoom();

createRoot(document.getElementById('root')!).render(<App />);
