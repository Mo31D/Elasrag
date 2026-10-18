// Reusable exploration tools. Exploring a model is supported learning, not
// independent assessment, and never awards points by itself.
export function mountVisualTool(host, model, onExplore = () => {}) {
  const kind = model === 'fraction-amount' || model === 'percent' ? 'fractions'
    : model === 'rectangle' ? 'garden' : model === 'coordinates' ? 'map' : null;
  if (!kind) return;
  host.innerHTML = `<details class="visual-tool" open><summary>✦ Open the hands-on ${kind === 'fractions' ? 'fraction lanterns' : kind === 'garden' ? 'garden builder' : 'treasure grid'}</summary><div class="visual-tool-body"></div></details>`;
  const body = host.querySelector('.visual-tool-body');
  const details = host.querySelector('details');
  details.addEventListener('toggle', () => { if (details.open) onExplore(); });
  if (kind === 'fractions') {
    body.innerHTML = `<p>Tap equal pieces to light them. Compare a fraction with a percentage.</p><label>Equal parts <select aria-label="Number of equal parts"><option value="4">4 quarters</option><option value="2">2 halves</option><option value="10">10 tenths</option></select></label><div class="visual-pieces"></div><output aria-live="polite"></output><p class="visual-note">Each piece is an equal part of the same whole. This sandbox does not submit an answer.</p>`;
    let denominator = 4, selected = new Set();
    const draw = () => {
      const pieces = body.querySelector('.visual-pieces');
      pieces.style.setProperty('--parts', denominator);
      pieces.innerHTML = Array.from({length:denominator},(_,i)=>`<button type="button" aria-label="Piece ${i+1} of ${denominator}" aria-pressed="${selected.has(i)}" data-piece="${i}">✦</button>`).join('');
      body.querySelector('output').textContent = `${selected.size}/${denominator} of the whole = ${selected.size / denominator * 100}%`;
      pieces.querySelectorAll('button').forEach(b => b.onclick = () => {
        const i = Number(b.dataset.piece); selected.has(i) ? selected.delete(i) : selected.add(i); onExplore(); draw();
      });
    };
    body.querySelector('select').onchange = e => {denominator=Number(e.target.value);selected=new Set();onExplore();draw()};
    draw();
  } else if (kind === 'garden') {
    body.innerHTML = `<p>Change the garden. The border is its perimeter; the tiles fill its area.</p><label>Length: <output id="garden-length">8</output> m<input type="range" min="2" max="10" value="8" aria-label="Garden length"></label><label>Width: <output id="garden-width">5</output> m<input type="range" min="2" max="8" value="5" aria-label="Garden width"></label><div class="visual-garden" aria-label="Garden made of square metre tiles"></div><output class="garden-result" aria-live="polite"></output>`;
    const sliders = body.querySelectorAll('input');
    const draw = () => {
      const length=Number(sliders[0].value),width=Number(sliders[1].value),garden=body.querySelector('.visual-garden');
      body.querySelector('#garden-length').textContent=length;body.querySelector('#garden-width').textContent=width;
      garden.style.setProperty('--columns',length);
      garden.innerHTML=Array.from({length:length*width},()=>'<i></i>').join('');
      body.querySelector('.garden-result').textContent=`Perimeter: ${length} + ${width} + ${length} + ${width} = ${2*(length+width)} m. Area: ${length} × ${width} = ${length*width} m².`;
    };
    sliders.forEach(s=>s.oninput=()=>{onExplore();draw()});draw();
  } else {
    body.innerHTML = `<p>Travel across first, then up. Tap a square to place your explorer. Find the treasure at (3, 5).</p><div class="visual-map"><span class="map-axis">y ↑</span><div role="group" aria-label="Coordinate points, x across and y up" class="visual-grid">${Array.from({length:36},(_,i)=>{const x=i%6,y=5-Math.floor(i/6);return `<button type="button" data-x="${x}" data-y="${y}" aria-label="Point (${x}, ${y})">${x===3&&y===5?'◆':`<small>${x},${y}</small>`}</button>`}).join('')}</div><span class="map-axis">0 → x · across first</span></div><output aria-live="polite">Choose a point on the map.</output>`;
    body.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{
      onExplore();body.querySelectorAll('[data-x]').forEach(x=>x.classList.remove('chosen'));b.classList.add('chosen');
      const x=Number(b.dataset.x),y=Number(b.dataset.y);
      body.querySelector('output').textContent=x===3&&y===5?'Treasure found: 3 across, then 5 up → (3, 5).':`You moved ${x} across, then ${y} up → (${x}, ${y}). Try the treasure point.`;
    });
  }
}
