# Creation Engine 01: asset reference

An original axial optical cartridge supported by two bearing housings, six field-stator cassettes and two independently pivoted gimbal bands. This is an exhibition sculpture with mechanically coherent component relationships, not a simulation of a real energy source.

## Rebuild

Requires Blender 4.3+; no external assets, textures or paid dependencies.

```sh
blender -b --python creation-engine/tools/generate_engine.py -- --render
```

Outputs `creation-engine.glb`, editable `engine.blend`, and transparent `engine-poster.png` to `creation-engine/assets/`. Omit `--render` to skip the offline poster. Pass `--output /absolute/directory` to override. The CPU Cycles render disables denoising for compatibility with Blender builds without OpenImageDenoise.

## Coordinates and hierarchy

Model origin is the cartridge centre. The GLB deliberately preserves a Z axis shaft (`export_yup=False`). Model radius is approximately 2.35 units; assembled depth approximately 2.4. Camera at `(6, 3, 8)` shows the front and internal turbine assembly. Units are metres at exhibition scale.

The GLB root is `ELASRAG_Creation_Engine_01`. All 16 mechanical component roots have glTF extras:

- `component: true`
- `role`: `core`, `stator`, `housing`, `rotor`, `glass`, `pod`, `gimbal`
- `explode`: an XYZ displacement vector in model space, relative to assembled local position

| Name | Role | Assembly relationship |
| --- | --- | --- |
| `01_Core_cartridge` | core | Luminous axial capsule, rails, ferrules and circulation bands |
| `02_Stator_cage` | stator | Bearing races, rollers and six axial bridges |
| `03_Front_bearing_housing`, `03_Rear_bearing_housing` | housing | Axially removable collars with grooves, index marks and recessed fasteners |
| `04_Front_rotor`, `04_Rear_rotor` | rotor | Eighteen swept blades, hub and perimeter per rotor; Z rotation pivot |
| `05_Front_optical_shield`, `05_Rear_optical_shield` | glass | Six smoked-glass inspection panels per shield, with open inspection gaps and gaskets |
| `06_Field_pod_01`–`06_Field_pod_06` | pod | Six equally spaced radial field cassettes, cooling fins and couplings |
| `07_Gimbal_01`, `07_Gimbal_02` | gimbal | Indexed split quadrants, four journal blocks and pins per band |

Preserve root transforms as the assembled state. Animate each component toward `position + explode * amount`; the displacement does not replace the assembled position. Gimbal and pod roots have intentional initial rotations. Add rotational animation to these initial orientations rather than replacing them.

Meshes within each component are joined by material. Result: 55 meshes/material primitives, 137,844 triangles, six materials, no textures. The self-contained GLB is approximately 2.9 MB. Mesh names are descriptive; material assignments, bevels and weighted normals are baked for portable glTF rendering. The editable `.blend` retains individually named component roots and geometry. The Python source is the master for changing proportions or regenerating component detail.

## Materials

- `Titanium · satin`: 0.94 metallic / 0.29 roughness, body machining
- `Titanium · diamond cut`: metallic / 0.19 roughness, turned edges and fasteners
- `Graphite · ceramic`: dark metallic supports, sockets and gaskets
- `Energy · warm white`: restrained cool-white emission, capsule and cassette inlays
- `Index · ivory`: small warm calibration markers
- `Glass · smoked optical`: 0.94 transmission / 0.06 roughness / IOR 1.46

Use a studio environment or broad rectangular lights for readable metal reflections. Do not substitute saturated lighting for reflections. Transmission may be reduced or disabled at lower rendering quality. The asset intentionally contains no embedded lights, cameras, animations, texture downloads, or runtime dependencies. The `.blend` includes an offline camera and studio lighting, excluded from the GLB export.

## Extending

Change dimensions, ring segmentation, blade counts, light placement and material roughness in the generator. Add new components with `component()` to retain the same extras contract. Keep geometry generation separate from web animation: any future renderer can load this asset and choose its own timeline. For physical simulation, add verified constraints and collision shapes separately; the present sculpture does not claim simulation accuracy.
