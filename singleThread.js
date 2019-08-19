/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-15 11:53:23
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-19 17:07:37
 * @Description: file content
 */
const EventEmitter = require('events');
const puppeteer = require('puppeteer');
const testPage = require('./testPage');
const {
  run, saveData, getAverage, getMetricTPGroup, judgeIsMeaningfulSample
} = require('./utils');

process.env.UV_THREADPOOL_SIZE = 128;
EventEmitter.defaultMaxListeners = 100;

const totalTime = 1000;
const browserNum = 5;
const pagesPerBrowser = 10;
const timeOfABrowser = totalTime / browserNum;

const work = async (browser, allData) => {
  const page = await browser.newPage();
  const dataOfASample = await testPage(page);
  await page.close();
  const isMeaningfulSample = judgeIsMeaningfulSample(dataOfASample);
  if (isMeaningfulSample) {
    allData.push(dataOfASample);
  }
  return Promise.resolve();
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
  await run(work.bind(null, browser, allData), pagesPerBrowser, timeOfABrowser);
  await browser.close();
  return Promise.resolve();
};

(async () => {
  const allData = [];
  await run(workOfABrowser.bind(null, allData), browserNum, totalTime);
  const average = getAverage(allData);
  const MetricTPGroup = getMetricTPGroup(allData);

  await saveData(
    JSON.stringify({
      id: 0,
      allData,
      MetricTPGroup,
      average
    }),
    './single-thread-data.json'
  );
})();
