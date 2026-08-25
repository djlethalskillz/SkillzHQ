import { chromium } from 'playwright-core';

const URL = process.argv[2] || 'http://localhost:3000';
const TAG = process.argv[3] || 'local';
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME, headless: true });

async function measure(name, viewport) {
  const page = await browser.newPage({ viewport });
  const bytes = {};
  page.on('response', (r) => {
    const cl = parseInt(r.headers()['content-length'] || '0', 10);
    const u = r.url();
    if (cl && (u.includes('assets/') || u.includes('_next/static'))) {
      const f = u.split('/').pop().split('?')[0].slice(0, 45);
      bytes[f] = cl;
    }
  });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(1000);
  const data = await page.evaluate(() => {
    const hero = document.getElementById('landing');
    const hr = hero.getBoundingClientRect();
    const giant = [];
    document.querySelectorAll('h1,h2,h3,[class*=text-giant]').forEach(el => {
      const c = getComputedStyle(el);
      if (c.fontSize) giant.push({ tag: el.tagName, cls: el.className.slice(0, 40), t: el.textContent.trim().slice(0, 25), size: c.fontSize, font: c.fontFamily.split(',')[0] });
    });
    return {
      heroH: Math.round(hr.height), scrollH: document.documentElement.scrollHeight,
      cls: window.__cls, giant: giant.slice(0, 16),
    };
  });
  data.bytes = bytes;
  data.totalKB = Object.values(bytes).reduce((a, b) => a + b, 0) / 1024;
  await page.screenshot({ path: `lab/live/${TAG}-${name}-full.png`, fullPage: true });
  await page.screenshot({ path: `lab/live/${TAG}-${name}-hero.png`, clip: { x: 0, y: 0, width: viewport.width, height: Math.min(1000, viewport.height) } });
  await page.close();
  return data;
}

const d = await measure('desktop', { width: 1440, height: 900 });
const m = await measure('mobile', { width: 390, height: 844 });
console.log(JSON.stringify({ desktop: d, mobile: m }, null, 1));
await browser.close();
