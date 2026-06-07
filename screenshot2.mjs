import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots2', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

await page.screenshot({ path: 'screenshots2/01-hero.png' });

await page.evaluate(() => document.getElementById('services')?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots2/02-services.png' });

await page.evaluate(() => document.getElementById('why-us')?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots2/03-why-us.png' });

await page.evaluate(() => document.getElementById('process')?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots2/04-process.png' });

await page.evaluate(() => document.getElementById('founding')?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots2/05-founding.png' });

await page.evaluate(() => document.getElementById('contact')?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots2/06-contact.png' });

await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots2/07-footer.png' });

await browser.close();
console.log('done');
