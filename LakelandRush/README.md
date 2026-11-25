# Lakeland Rush

A Three.js and React parkour game set around Windermere. This repository continues the Google AI Studio export.

```sh
bun install --frozen-lockfile
npm run dev
npm run lint
node --import tsx --test src/{geo,game}/*.test.ts
npm run build
```

Open the Vite URL. Choose a sprint for arcade play or **Windermere Free Roam** to start near the booking office on The Esplanade. The game runs without an AI account or backend. Node 24 and the exported Bun lockfile were used for the baseline.

See [current development status](DEVELOPMENT_STATUS.md), [data regeneration](DATA_SOURCES.md), and [the Waterhead benchmark](VISUAL_BENCHMARKS.md).

The owner-private playable preview is available at https://lakeland-rush-waterhead.elasrag.chatgpt.site/. Open it using the ChatGPT account that owns the Site. Select **Windermere Free Roam** to arrive at Waterhead near the pier.

A production ZIP contains the static web root. Extract it to the root of an HTTPS static host. To build the export locally with fixed comparison cameras, run `VITE_ENABLE_WATERHEAD_BENCHMARK=1 npm run build`. See VISUAL_BENCHMARKS.md for the capture commands.
