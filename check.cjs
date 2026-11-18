const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:3000/');
  const res = await p.evaluate(() => {
    const g = (sel, props) => {
      const el = document.querySelector(sel);
      if (!el) return { missing: sel };
      const cs = getComputedStyle(el);
      const o = {};
      props.forEach(pr => o[pr] = cs[pr]);
      const r = el.getBoundingClientRect();
      o.rect = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      return o;
    };
    return {
      body: g('body', ['backgroundColor', 'color', 'fontFamily']),
      navbar: g('.navbar', ['position', 'height', 'backgroundColor', 'zIndex']),
      container: g('.container', ['maxWidth', 'paddingLeft']),
      hero: g('.hero', ['minHeight', 'paddingTop']),
      h1: g('.hero h1', ['fontSize', 'fontFamily', 'color', 'lineHeight']),
      grid: g('.hero-content', ['display', 'gridTemplateColumns']),
      btn: g('.btn-primary', ['backgroundColor', 'color']),
      revealCount: document.querySelectorAll('.reveal').length,
      revealVisible: document.querySelectorAll('.reveal.in').length,
    };
  });
  console.log(JSON.stringify(res, null, 2));
  await b.close();
})();
