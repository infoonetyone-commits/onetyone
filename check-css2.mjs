import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

// Get all CSS stylesheets content
const cssContent = await page.evaluate(async () => {
  const sheets = [];
  for (const sheet of document.styleSheets) {
    try {
      const rules = Array.from(sheet.cssRules || []);
      const relevant = rules
        .map(r => r.cssText)
        .filter(t => t.includes('purple') || t.includes('lavender') || t.includes('color-'))
        .slice(0, 20);
      if (relevant.length) sheets.push(relevant.join('\n'));
    } catch(e) {}
  }
  return sheets.join('\n\n---\n\n');
});
console.log('Relevant CSS:\n', cssContent.substring(0, 3000));

await browser.close();
