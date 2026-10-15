# Cell Transport Lab — independent GCSE Biology experience

A standalone, dependency-free static web application for AQA GCSE Biology 8461 Section 4.1.3 and Required Practical 3. This is **not** part of Adam Learning Adventures, and does not read Adam profiles, XP, accounts, or backend state.

## Modules

- Intro with three-question ungraded diagnostic.
- Diffusion canvas: stochastic random motion without bias force, left/right populations, pore count, temperature, rolling crossings, tracer, and population chart.
- Osmosis: idealised partially permeable membrane with bi-directional water movement, adjustable solute fractions, cell illustrations and state predictions. Conceptual, *not* a quantitative osmotic pressure simulation.
- Active transport: carrier-limited model with an energy gate, substrate reservoir and counter-current uptake.
- Comparison sorting challenge, AQA-required practical with explicitly **simulated** data and worked calculation, and an eight-question **21 mark** assessment with transparent self-marking.

## Running

Serve this folder over HTTP(S), such as `python3 -m http.server 8000` from the repository root, then visit `/adam/cell-transport-lab/`. No build, keys or runtime dependencies.

The narration paths are `audio/intro/*.wav` and `audio/diffusion/*.wav`. If the WAV files are not present on the server, the Narration studio accepts manual WAV imports for the session. The full local downloadable package includes the 11 available British narration files; no speech synthesis is used and 56 clips remain pending. Static WAV files may be added as they are produced.

## Educational and technical caveats

- Particles and speeds are not to scale, temperature is intentionally visually amplified and apparent equilibrium is only approximate and stochastic.
- Osmosis uses a conceptual probabilistic counter model, **not** a molecular dynamics or water-potential calculation.
- Active transport simulates net uptake only under a chosen impermeable-membrane model and does not solve real biochemical kinetics.
- The potato data is entirely fictional, clearly labelled, and does not replace the actual required practical.
- This is an educational revision experience, not a certified AQA product. Optional user progress is stored solely in a separate localStorage key `ctl-completed-v1`.

## Quality checks

Run JavaScript syntax tests with `node --check app.js && node --check simulations.js`. Test live interactions and keyboard/mobile behaviour in a modern browser. No external analytics or accounts.

