/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-15 11:53:23
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-17 20:29:53
 * @Description: file content
 */
const EventEmitter = require('events');
const puppeteer = require('puppeteer');
const testPage = require('./testPage');
const { run, saveData, getAverage } = require('./utils');

process.env.UV_THREADPOOL_SIZE = 128;
EventEmitter.defaultMaxListeners = 100;

const workOfABrowser = async allData => {
  const browser = await puppeteer.launch({
    headless: true,
    // args: [
    //   '–disable-gpu',
    //   '–disable-dev-shm-usage',
    //   '–disable-setuid-sandbox',
    //   '–no-first-run',
    //   '–no-sandbox',
    //   '–no-zygote',
    //   '–single-process'
    // ]
  });
  const work = async () => {
    const page = await browser.newPage();
    const dataOfASample = await testPage(page);
    await page.close();
    if (dataOfASample && dataOfASample.FirstMeaningfulPaint > 0) {
      allData.push(dataOfASample);
    }
  };
  await run(work, 10, 100);
  await browser.close();
};

(async () => {
  const allData = [];
  await run(workOfABrowser.bind(null, allData), 10, 1000);
  const average = await getAverage(allData);
  await saveData(
    JSON.stringify({
      id: 0,
      allData,
      average
    }),
    './data.json'
  );
})();
