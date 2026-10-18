// Original, reviewed context art. Illustration cues never establish vocabulary mastery.
export const PLAY_ART_VERSION=1;
export const PLAY_ART=Object.freeze({world:'/adam/assets/play/world-map-v1.webp',school:'/adam/assets/play/school-clues-v1.webp',reveal:'/adam/assets/play/trophy-safe-v1.webp',words:'/adam/assets/play/word-stories-v1.webp'});
const contexts=Object.freeze({
 notice:[0,0,'A boy notices a feather beside a trophy stand.'],
 puzzled:[100,0,'A girl is unsure how to complete a jigsaw.'],
 investigate:[0,50,'Two detectives examine footprints with a magnifying glass.'],
 relieved:[100,50,'A boy finds his lost dog safe and hugs it.'],
 curious:[0,100,'A girl looks closely at a beetle on a leaf.'],
 confident:[100,100,'A boy calmly explains the model bridge he built.']
});
export function wordScene(word,cls=''){
 const key=String(word?.term||word?.word||word?.label||'').toLowerCase();const item=contexts[key];if(!item)return '';
 const safeClass=String(cls).replace(/[^a-zA-Z0-9 _-]/g,'');
 return `<span class="word-story-art ${safeClass}" role="img" aria-label="${item[2]}" style="--scene-image:url(${PLAY_ART.words});--scene-x:${item[0]}%;--scene-y:${item[1]}%"></span>`;
}
