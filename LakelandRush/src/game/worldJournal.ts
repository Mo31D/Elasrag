export const WORLD_JOURNAL_EVENT = 'lakeland-world-journal';
const KEY = 'lakeland-world-v2-discoveries';

export function getWorldDiscoveries(): string[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(data) ? data.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}

export function recordWorldDiscovery(id: string) {
  const current = getWorldDiscoveries();
  if (current.includes(id)) return;
  try { localStorage.setItem(KEY, JSON.stringify([...current,id])); }
  catch { return; }
  window.dispatchEvent(new Event(WORLD_JOURNAL_EVENT));
}
