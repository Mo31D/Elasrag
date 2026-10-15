export const narration = new Audio('/adam/audio/english-001.mp3');
const voice = new Audio('/adam/audio/english-001.mp3');
let stopAt = 0,
  finish: (() => void) | undefined;
export function segment(start: number, end: number, done?: () => void) {
  voice.pause();
  narration.pause();
  stopAt = end;
  finish = done;
  narration.currentTime = start;
  return narration.play();
}
narration.addEventListener('timeupdate', () => {
  if (stopAt && narration.currentTime >= stopAt) {
    narration.pause();
    stopAt = 0;
    finish?.();
  }
});
export function stop() {
  narration.pause();
  voice.pause();
}
export async function replay(start: number, end: number, rate = 1) {
  narration.pause();
  voice.pause();
  voice.playbackRate = rate;
  voice.currentTime = start;
  voice.ontimeupdate = () => {
    if (voice.currentTime >= end) voice.pause();
  };
  await voice.play();
}
export function setAudio(url: string) {
  stop();
  narration.src = url;
  voice.src = url;
}
export async function mediaStore(file?: File) {
  return new Promise<Blob | undefined>((resolve, reject) => {
    const r = indexedDB.open('ala-private-media', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('audio');
    r.onerror = () => reject(r.error);
    r.onsuccess = () => {
      const db = r.result,
        t = db.transaction('audio', file ? 'readwrite' : 'readonly'),
        s = t.objectStore('audio');
      const q = file ? s.put(file, 'episode1') : s.get('episode1');
      q.onsuccess = () => {
        const value = q.result;
        t.oncomplete = () => {
          db.close();
          resolve(file || value);
        };
      };
      q.onerror = () => {
        db.close();
        reject(q.error);
      };
    };
  });
}
