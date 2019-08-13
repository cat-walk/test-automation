const puppeteer = require('puppeteer');
const testPage = require('./testPage');
const { conCurrent } = require('./utils');

(async () => {
  const summary = [];
  const browser = await puppeteer.launch();

  let main = async () => {
    const page = await browser.newPage();
    summary.push(await testPage(page));
  };

  conCurrent(main, 10);
  setTimeout(() => {
    console.log('summary', summary);
    const result = {};
    const amount = summary.length;
    summary.forEach(item => {
      for (let key in item) {
        const value = item[key];
        if (key in summary) summary[key] += value;
        else result[key] = value;
      }
    });
    for (let key in result) {
      const value = result(key);
      result[key] = value / amount;
    }
    result.amount = amount;
    console.log('result', result);
  }, 3000);
})();
