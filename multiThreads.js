/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-17 16:59:21
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-19 01:47:35
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
const { run, saveData, getAverage } = require('./utils');

process.env.UV_THREADPOOL_SIZE = 128;
EventEmitter.defaultMaxListeners = 100;

let allData = [];
let stopedWorker = 0;
const totalTime = 1000;
const threadNum = 10;
const pagesPerBrowser = 5;
const timeOfABrowser = totalTime / threadNum;

const workOfABrowser = async () => {
  const browser = await puppeteer.launch();
  const work = async () => {
    const page = await browser.newPage();
    const dataOfASample = await testPage(page);
    // console.log('dataOfASample', dataOfASample);
    await page.close();
    if (dataOfASample.FirstMeaningfulPaint > 0) {
      allData.push(dataOfASample);
      // if (allData.length === 1) console.log('allData with length===1', allData);
    }
  };
  await run(work, pagesPerBrowser, timeOfABrowser);
  await browser.close();
};

const workerExitListner = async code => {
  console.log(`main: worker stopped with exit code ${code}`);
  stopedWorker++;
  console.log('stopedWorker', stopedWorker);
  if (stopedWorker === threadNum) {
    const average = await getAverage(allData);
    await saveData(
      JSON.stringify({
        id: 0,
        average,
        allData
      }),
      './data.json'
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
  parentPort.postMessage(allData);
  // console.log('workerData', workerData);
}

if (isMainThread) {
  mainThread();
} else {
  workerThread();
}
