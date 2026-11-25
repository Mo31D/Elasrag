import { mkdir, stat } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const { chromium, devices } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright-core');
const output = process.env.BENCHMARK_OUTPUT ?? 'evidence';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const profiles = [
    ['desktop', { viewport: { width: 1280, height: 800 } }],
    ['iphone', devices['iPhone 13']],
    ['ipad', devices['iPad Pro 11 landscape']],
    ['android', devices['Pixel 7']],
  ];
  for (const [name, profile] of profiles) {
    if (process.env.BENCHMARK_PROFILE && name !== process.env.BENCHMARK_PROFILE) continue;
    const page = await browser.newPage(profile);
    const errors = [];
    const fixture = process.env.BENCHMARK_STATIC_DIRECTORY;
    if (fixture) {
      const root = resolve(fixture);
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'waterhead.local') return route.abort();
        const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
        if (!path.startsWith(root + sep) || !(await stat(path).catch(() => null))?.isFile()) {
          return route.fulfill({ status: 404, body: 'Missing fixture' });
        }
        return route.fulfill({ path });
      });
    }
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      const content = message.text();
      if ((message.type() === 'error' && /THREE|WebGL|shader/i.test(content))
        || /Waterhead asset could not load/.test(content)) errors.push(content);
    });
    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/regions/')) {
        errors.push(`${response.status()} ${response.url()}`);
      }
    });
    const view = process.env.BENCHMARK_VIEW ?? 'waterhead';
    const origin = fixture ? 'http://waterhead.local' : process.env.GAME_URL ?? 'http://localhost:3000';
    await page.goto(`${origin}/?benchmark=${view}`);
    const canvas = page.locator('canvas[data-benchmark]');
    await canvas.waitFor({ timeout: 60_000 });
    await page.getByRole('button', { name: 'Start Run' }).waitFor();
    await page.addStyleTag({
      content: '#root > div > :not([data-testid="game-canvas-mount"]) { visibility: hidden !important }',
    });
    await page.waitForTimeout(1500);
    const prefix = process.env.BENCHMARK_PREFIX ?? view;
    await page.screenshot({ path: join(output, `${prefix}-${name}.jpg`), quality: 85, scale: 'css' });
    console.log(name, await canvas.getAttribute('data-benchmark'));
    if (errors.length) throw new Error(errors.join('\n'));
    await page.close();
  }
} finally {
  await browser.close();
}
