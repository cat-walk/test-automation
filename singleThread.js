/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-15 11:53:23
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-19 08:23:30
 * @Description: file content
 */
const EventEmitter = require('events');
const puppeteer = require('puppeteer');
const testPage = require('./testPage');
const {
  run, saveData, getAverage, getMetricTPGroup
} = require('./utils');

process.env.UV_THREADPOOL_SIZE = 128;
EventEmitter.defaultMaxListeners = 100;

const work = async (browser, allData) => {
  const page = await browser.newPage();
  const dataOfASample = await testPage(page);
  await page.close();
  const isMeaningfulSample = dataOfASample && Object.values(dataOfASample).every(metric => metric > 0);
  if (isMeaningfulSample) {
    allData.push(dataOfASample);
  }
};

const workOfABrowser = async allData => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '–disable-gpu',
      '–disable-dev-shm-usage',
      '–disable-setuid-sandbox',
      '–no-first-run',
      '–no-sandbox',
      '–no-zygote',
      '–single-process',
      '--disable-extensions'
    ] // for improve perf
  });
  await run(work.bind(null, browser, allData), 5, 1000);
  await browser.close();
};

(async () => {
  const allData = [];
  await run(workOfABrowser.bind(null, allData), 10, 1000);
  const average = await getAverage(allData);
  const MetricTPGroup = await getMetricTPGroup(allData);

  await saveData(
    JSON.stringify({
      id: 0,
      allData,
      average,
      MetricTPGroup
    }),
    './data.json'
  );
})();
