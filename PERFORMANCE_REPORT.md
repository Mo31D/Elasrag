# Performance report

The fixed Waterhead view was tested in Chromium with the software WebGL renderer. Triangle and draw-call counts are Three.js frame submissions. Texture and geometry counts are renderer allocations. FPS samples are short and reflect SwiftShader and browser scheduling.

| View | Draw calls | Triangles | Textures | Software FPS sample |
| --- | ---: | ---: | ---: | ---: |
| Original export · desktop 1280×800 | 80 | 266,114 | 8 | 1 |
| Waterhead · desktop 1280×800 | 82 | 234,211 | 13 | 1 |
| Waterhead · iPhone 13 emulation | 55 | 206,509 | 13 | 4 |
| Waterhead · iPad Pro 11 landscape emulation | 75 | 230,045 | 13 | 1 |
| Waterhead · Pixel 7 emulation | 54 | 206,473 | 13 | 4 |
| Booking office detail · desktop | 83 | 239,117 | 13 | 1 |

Production preview passed start-sprint, keyboard/touch jump input, pause/resume, return to title, and Free Roam start on desktop and in Pixel 7 emulation. The Vite build produced a 963 KB minified main JS entry and a 45 KB dynamic GLTF loader. They gzip to approximately 260 KB and 13 KB respectively. The authored GLB is 16 KB. The survey JSON is 149 KB and shared slate maps total approximately 415 KB on disk.

A provisional Waterhead budget for the next pass is ≤100 submitted calls and ≤250k triangles in the desktop comparison scene. The six shared 512² maps have an upper estimate of 8 MiB decoded as RGBA8 with mipmaps, excluding the legacy textures. GPU time, actual VRAM, chunk latency, battery impact and movement frame pacing require physical-device testing. A 60 FPS target on capable devices and a 30 FPS floor on supported lower-power devices remain unverified.

## Waterfront production pass

The same wide comparison camera submitted 170,702 triangles and 133 calls on desktop, and 166,098 triangles and 125 calls in the landscape iPad Pro emulation. The prior Waterhead pass submitted 234,211 and 230,045 triangles respectively. Terrain index tiles share vertex buffers and cull by bounds. The detailed models and tiles increase draw calls. Mobile GPU time, Safari compatibility and sustainable frame rates require physical-device tests. SwiftShader ran the wide iPad-emulated screenshot around 1 FPS in the capture sample.

The same production build passed sprint start, keyboard and iPad-emulated tap input, pause and resume, and Free Roam. The three new Meshopt GLBs total approximately 299 KB. Renderer measurements are draw statistics and software-rendered samples.
