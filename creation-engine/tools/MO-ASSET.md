# MO Signature 01 — personal capability sculpture

This original asset replaces an anonymous energy-machine metaphor with a personal monogram. A continuous load-bearing **M** sits inside a broken **O** rail. The M represents Mo; four removable tactile cartridges connect technology, AI, design and strategy to the same personal framework. Open space is part of the design. The model has no turbine, spherical shell or arbitrary orbiting decoration.

## Source and rebuilding

```sh
blender -b --python creation-engine/tools/generate_mo_signature.py -- --render
```

Requires Blender 4.3+, no downloads, add-ons, fonts, texture files, paid tools or services. Outputs `mo-signature.glb`, compressed editable `mo-signature.blend` and optional `mo-poster.png` to `creation-engine/assets`. `--output /absolute/directory` changes that directory. Omit `--render` to skip the offline CPU Cycles render. The delivered transparent WebP is a compact derivative of that render.

The procedural Python source is the master. It contains the M polygon, support rail radii, copper segment, four node definitions and raised geometry glyphs. The previous Creation Engine asset and its source remain preserved independently.

## Coordinate contract

- Front is +Z, monogram upright is +Y; depth extends along Z.
- GLB export intentionally uses `export_yup=False` to retain these axes.
- Assembled bounds approximately X/Y ±2.25, Z −0.38 to +0.31.
- Suggested view `(3.4, 1.5, 12)` looks down onto the front at a small angle while retaining M readability. Avoid continuous rotations that turn the monogram edge-on.
- All seven component roots contain `component: true`, `role`, and `explode` extras. Apply explode as an offset from the saved assembled position.

| Component | Role | Capability | Assembled pivot |
| --- | --- | --- | --- |
| `Mo_Core` | core | `mo` | `(0, 0, 0)` |
| `O_Frame` | housing | — | `(0, 0, 0)` |
| `Connection_Bridges` | stator | — | `(0, 0, 0)` |
| `Node_Technology` | pod | `technology` | `(−1.432, 1.432, −0.06)` |
| `Node_AI` | pod | `ai` | `(1.432, 1.432, −0.06)` |
| `Node_Design` | pod | `design` | `(1.432, −1.432, −0.06)` |
| `Node_Strategy` | pod | `strategy` | `(−1.432, −1.432, −0.06)` |

Capability roots carry `label`; peripheral roots also carry `hotspot: [0, 0, 0.26]`, a **local** position on the selector face. Transform that point into world space before projecting to screen. Keep their pivots intact when animating a selected cartridge.

## Geometry and material design

- Continuous bevelled M body, recessed graphite face and four thin embedded conductor runs.
- Copper foot ferrules and a vertex datum emphasise deliberate construction.
- Four broken O quadrants with a graphite backbone, titanium face, polished chamfer, fastener sockets and sparse calibration marks.
- Four structural bridges physically connect the monogram to the outer support rail.
- Four removable capability cartridges have 20 knurled grip features each, a copper selector shell, graphite face and polished bezel.
- Each cartridge uses a distinct raised geometry glyph: circuit traces, triangular AI network, design construction lines, or a strategy compass.
- A single upper copper rail segment introduces intentional asymmetry.

Five untextured PBR materials: satin titanium, polished titanium, matte graphite, brushed champagne copper and restrained white emission. Meshes are combined by material within each component. Model: 32 meshes/material primitives, 46,232 triangles, 1,181,008 bytes. No lights, cameras, animations or external dependencies are embedded in the GLB. The editable `.blend` includes an offline exhibition camera and studio lighting.

## Interaction guidance

The glyphs and five capability roots provide semantic interaction targets. Clicking a peripheral selector should highlight or gently actuate that cartridge and reveal its capability; clicking the M should introduce Mo. Present the corresponding text outside WebGL for keyboard and screen-reader access. Keep semantic names separate from visual mesh/material names. The four selectors are deliberate places to click, not random particles.

Use broad neutral environment reflections for metallic readability. Keep copper restrained. The front should remain legible in default and reset views. The model supports a compact exploded inspection but does not require spinning to convey depth.

## Validation performed

- Blender 4.3 procedural construction and GLB export completed.
- Named component pivots and glTF extras inspected in the exported container.
- Self-contained glTF 2.0 header/length, seven components, five capability mappings, five materials and triangle count checked.
- Offline transparent poster rendered and visually reviewed.
- Generator Python syntax checked.

Runtime browser interaction tests belong to the homepage integration report.
