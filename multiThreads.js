/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-17 16:59:21
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-19 17:13:14
 * @Description: file content
 */
const EventEmitter = require('events');
const puppeteer = require('puppeteer');
const {
  isMainThread,
  parentPort,
  workerData,
  threadId,
  MessageChannel,
  MessagePort,
  Worker
} = require('worker_threads');
const testPage = require('./testPage');
const {
  run,
  saveData,
  getAverage,
  getMetricTPGroup,
  judgeIsMeaningfulSample
} = require('./utils');

process.env.UV_THREADPOOL_SIZE = 128;
EventEmitter.defaultMaxListeners = 100;

let allData = [];
let stopedWorker = 0;
const totalTime = 1000;
const threadNum = 10;
const pagesPerBrowser = 10;
const timeOfABrowser = totalTime;

const work = async browser => {
  const page = await browser.newPage();
  const dataOfASample = await testPage(page);
  // console.log('dataOfASample', dataOfASample);
  await page.close();
  const isMeaningfulSample = judgeIsMeaningfulSample(dataOfASample);
  if (isMeaningfulSample) {
    allData.push(dataOfASample);
  }
};

const workOfABrowser = async () => {
  const browser = await puppeteer.launch();
  await run(work.bind(null, browser), pagesPerBrowser, timeOfABrowser);
  await browser.close();
};

const workerExitListner = async code => {
  console.log(`main: worker stopped with exit code ${code}`);
  stopedWorker++;
  console.log('stopedWorker', stopedWorker);
  if (stopedWorker === threadNum) {
    const average = await getAverage(allData);
    const MetricTPGroup = getMetricTPGroup(allData);
    await saveData(
      JSON.stringify({
        id: 0,
        allData,
        MetricTPGroup,
        average
      }),
      './multi-threads-data.json'
    );
  }
};

const msgListner = msg => {
  // console.log('msg', msg);
  allData = allData.concat(msg);
  // console.log('totalData.length', totalData.length);
};

async function mainThread() {
  for (let i = 0; i < threadNum; i++) {
    const worker = new Worker(__filename);
    worker.on('exit', workerExitListner);
    worker.on('message', msgListner);
  }
}

async function workerThread() {
  await workOfABrowser(allData);
  await parentPort.postMessage(allData);
  // console.log('workerData', workerData);
}

if (isMainThread) {
  mainThread();
} else {
  workerThread();
}
