# Visual benchmarks

| View | Eye (X, Y, Z) | Aim (X, Y, Z) |
| --- | --- | --- |
| `waterhead` | 10, 8.5, −219 | 89, 4.5, −274 |
| `waterhead-close` | 45, 3.4, −229 | 74, 3.5, −239 |

Both use the exported 64° vertical FOV, a fresh profile with clear weather and Auto quality, and fixed water-animation time. The runner and route markers are hidden in the development-only benchmark. The camera angles are game evaluation positions with the main facade in view. They approximate the broad direction of the historical reference.

Install `playwright-core` in a separate directory or make it available to Node. Start `npm run dev` and run:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs node scripts/capture-waterhead.mjs
BENCHMARK_VIEW=waterhead-close BENCHMARK_PROFILE=desktop \
  PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs node scripts/capture-waterhead.mjs
```

The capture script defaults to Chromium and forces SwiftShader. It supports `CHROMIUM_PATH`, `GAME_URL` and `BENCHMARK_OUTPUT`. The original matched Waterhead frame was captured from a temporary checkout of the baseline with the same benchmark camera hook. The additional `baseline.jpg` records the original sprint HUD and nearby scenery.

- [Matched original view](evidence/original-waterhead-desktop.jpg)
- [Current desktop view](evidence/waterhead-desktop.jpg)
- [Booking office close view](evidence/waterhead-close-desktop.jpg)
- [iPhone viewport](evidence/waterhead-iphone.jpg), [iPad viewport](evidence/waterhead-ipad.jpg), [Android viewport](evidence/waterhead-android.jpg)
- [Historical comparison photograph](https://commons.wikimedia.org/wiki/File:Ambleside_booking_office_and_pier,_Waterhead_-_geograph.org.uk_-_1732669.jpg)

The booking office's pointed upper window, green joinery, front gable and lower wing match visible cues in the reference. The silhouette, proportions and unphotographed sides are approximate. Deck geometry now follows the mapped outline. The concrete/plinth transitions, railings, plaza, roofs surrounding the office, distant ridgeline and other commercial frontages still need work. The benchmark review still needs people familiar with the site.
