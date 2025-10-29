#!/usr/bin/env node
// Lightweight performance measurement using Puppeteer.
// Usage: node scripts/measure-performance.js [url]

const puppeteer = require('puppeteer');

const url = process.argv[2] || 'http://localhost:3000/about';

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  console.log('Measuring', url);

  // Retry loop for server readiness
  let browser;
  for (let attempt = 1; attempt <= 12; attempt++) {
    try {
      browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(30000);
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Collect performance entries from the page
      const data = await page.evaluate(() => {
        const nav = (performance.getEntriesByType('navigation') || [])[0] || {};
        const paints = (performance.getEntriesByType('paint') || []).map(p => ({ name: p.name, startTime: p.startTime }));
        const lcp = (performance.getEntriesByType && performance.getEntriesByType('largest-contentful-paint')) || [];
        const lcpEntries = (lcp || []).map(e => ({ startTime: e.startTime, size: e.size || null, url: e.url || null }));
        const resources = (performance.getEntriesByType('resource') || []).slice(0, 20).map(r => ({ name: r.name, duration: r.duration, transferSize: r.transferSize || 0 }));
        return { nav, paints, lcpEntries, resources };
      });

      // Also ask Chromium for some high-level metrics
      const chromeMetrics = await page.metrics();

      console.log('--- Performance summary ---');
      console.log(JSON.stringify({ url, nav: data.nav, paints: data.paints, lcp: data.lcpEntries, chromeMetrics }, null, 2));

      await browser.close();
      return;
    } catch (err) {
      if (browser) try { await browser.close(); } catch (e) {}
      console.log(`Attempt ${attempt} — host not ready or navigation failed: ${err.message}`);
      if (attempt < 12) await wait(2000);
      else {
        console.error('Server did not respond in time. Aborting.');
        process.exit(1);
      }
    }
  }
}

run().catch(err => {
  console.error('Measurement failed:', err);
  process.exit(1);
});
