const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const routes = ['/', '/services', '/about', '/sign-in', '/sign-up', '/dashboard/customer', '/payment/cancel'];
  for (const r of routes) {
    const p = await b.newPage();
    const errs = [];
    p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,100)); });
    p.on('pageerror', e => errs.push(e.message.slice(0,100)));
    await p.goto('http://localhost:3000'+r, { waitUntil:'domcontentloaded' });
    await p.waitForTimeout(1500);
    const title = await p.title();
    const textLen = (await p.locator('body').innerText()).length;
    console.log(r, '| title:', title.slice(0,30), '| textLen:', textLen, '| errors:', errs.length, errs.slice(0,2));
    await p.close();
  }
  await b.close();
})();
