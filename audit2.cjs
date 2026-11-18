const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  p.on('console', m => { if (m.type()==='error') console.log('CONSOLE ERROR:', m.text().slice(0,1500)); });
  p.on('pageerror', e => console.log('PAGE ERROR:', e.message.slice(0,1500)));
  await p.goto('http://localhost:3000/', { waitUntil:'networkidle' });
  await p.waitForTimeout(2000);
  await b.close();
})();
