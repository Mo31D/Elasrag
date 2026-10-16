// A qualitative illustration, not a measured molecular simulation.
export function mountParticleView(host) {
  let mixed=false,material='sugar';
  host.innerHTML=`<details class="particle-view"><summary>✦ Zoom inside the mixture</summary><div class="particle-body"><p>Clear does not mean empty. Use the model to see material spread through water.</p><div class="particle-controls"><button type="button" data-material="sugar" aria-pressed="true">Sugar</button><button type="button" data-material="sand" aria-pressed="false">Sand</button><button type="button" data-stir>Stir the mixture ↻</button><button type="button" data-reset>Reset model</button></div><svg viewBox="0 0 360 220" role="img" aria-label="Simplified view of a mixture"></svg><p class="particle-caption" role="status"></p><small>Illustrative model: colours and sizes are symbolic. Sand grains are much larger than dissolved sugar particles. Stirring does not make sand soluble.</small></div></details>`;
  const draw=()=>{
    const water=Array.from({length:30},(_,i)=>`<circle cx="${18+(i%10)*36}" cy="${38+Math.floor(i/10)*58}" r="7" fill="#76d2e0" opacity=".65"/>`).join('');
    const dots=Array.from({length:12},(_,i)=>{
      const x=mixed&&material==='sugar'?28+(i%4)*98:137+(i%4)*27;
      const y=mixed&&material==='sugar'?37+Math.floor(i/4)*70:164+Math.floor(i/4)*16;
      return `<circle cx="${x}" cy="${y}" r="${material==='sand'?9:5}" fill="${material==='sand'?'#d3a565':'#ffe49a'}"/>`;
    }).join('');
    host.querySelector('svg').innerHTML=`<rect x="2" y="2" width="356" height="216" rx="20" fill="#123f50" stroke="#8ad6c0" stroke-width="2"/>${water}${dots}`;
    host.querySelector('.particle-caption').textContent=!mixed?'Before stirring: the added material is gathered near the bottom.':material==='sugar'?'Sugar particles spread through the water. The sugar is still present even though we cannot see separate grains.':'Sand remains as visible grains and settles. It has not dissolved.';
    host.querySelectorAll('[data-material]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.material===material)));
  };
  host.querySelectorAll('[data-material]').forEach(b=>b.onclick=()=>{material=b.dataset.material;mixed=false;draw()});
  host.querySelector('[data-stir]').onclick=()=>{mixed=true;draw()};
  host.querySelector('[data-reset]').onclick=()=>{mixed=false;draw()};draw();
}
