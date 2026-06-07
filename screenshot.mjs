import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Full page screenshot
await page.screenshot({ path: 'screenshots/01-hero.png', fullPage: false });
console.log('hero done');

// Scroll to marquee
await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'instant' }));
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/02-marquee-services.png' });
console.log('marquee done');

// Scroll to services
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.8, behavior: 'instant' }));
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/03-services.png' });
console.log('services done');

// Scroll to why-us
await page.evaluate(() => {
  document.getElementById('why-us')?.scrollIntoView();
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/04-why-us.png' });
console.log('why-us done');

// Scroll to process
await page.evaluate(() => {
  document.getElementById('process')?.scrollIntoView();
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/05-process.png' });
console.log('process done');

// Scroll to founding
await page.evaluate(() => {
  document.getElementById('founding')?.scrollIntoView();
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/06-founding.png' });
console.log('founding done');

// Scroll to contact
await page.evaluate(() => {
  document.getElementById('contact')?.scrollIntoView();
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/07-contact.png' });
console.log('contact done');

// Footer
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/08-footer.png' });
console.log('footer done');

// Full page
await page.screenshot({ path: 'screenshots/00-full.png', fullPage: true });
console.log('full page done');

await browser.close();
console.log('ALL DONE');
