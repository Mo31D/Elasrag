// This entry has no imports, so a missing module still leaves a usable homepage.
import('./discovery.js').then(() => import('./main.js')).catch(error => {
  console.warn('Creation Engine modules unavailable:', error.message);
  document.body.dataset.experience = 'fallback';
  document.body.dataset.phase = 'hero';
  document.querySelector('#engine-status').textContent = 'Choose a point to meet Mo and explore the work.';
  document.querySelector('#explore-engine').hidden = true;
  document.querySelector('.stage-navigation').hidden = true;
});
