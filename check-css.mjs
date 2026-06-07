import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });

// Check computed background of hero section
const heroBg = await page.evaluate(() => {
  const hero = document.querySelector('section');
  return window.getComputedStyle(hero).backgroundColor;
});
console.log('Hero bg:', heroBg);

// Check if CSS variable is defined
const cssVar = await page.evaluate(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-purple-deeper');
});
console.log('--color-purple-deeper:', cssVar);

// Check what class the section has
const heroClass = await page.evaluate(() => {
  return document.querySelector('section')?.className || 'none';
});
console.log('Hero classes:', heroClass.substring(0, 200));

// Check navbar bg
const navBg = await page.evaluate(() => {
  const nav = document.querySelector('nav');
  return window.getComputedStyle(nav).backgroundColor;
});
console.log('Nav bg:', navBg);

// Check why-us section
const whyUsBg = await page.evaluate(() => {
  const section = document.getElementById('why-us');
  return section ? window.getComputedStyle(section).backgroundColor : 'not found';
});
console.log('Why-us bg:', whyUsBg);

// Check footer bg
const footerBg = await page.evaluate(() => {
  const footer = document.querySelector('footer');
  return footer ? window.getComputedStyle(footer).backgroundColor : 'not found';
});
console.log('Footer bg:', footerBg);

await browser.close();
