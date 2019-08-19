/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-12 19:47:24
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-19 17:08:16
 * @Description: file content
 */

const fs = require('fs');

// let conCurrent = (fn, limit, asyncHandle) => {
//   let myPromise = () => {
//     return new Promise((resolve, reject) => {
//       if(fn()) resolve();
//     })
//   };
//   let asyncList = []; // 正在进行的所有并发异步操作
//   while (limit--) {
//     asyncList.push(myPromise);
//   }
//   return Promise.all(asyncList); // 所有并发异步操作都完成后，本次并发控制迭代完成
// };

const run = async (fn, times, totalTime) => {
  const interval = totalTime / times;
  let hasRunTimes = 0;
  const concurrentPool = [];
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      concurrentPool.push(fn());
      hasRunTimes++;
      if (hasRunTimes === times) {
        // console.log('concurrentPool', concurrentPool);
        clearInterval(timer);
        timer = null;
        console.log('hasRunTimes', hasRunTimes);
        if (concurrentPool.length === 0) resolve();
        else {
          Promise.all(concurrentPool)
            .then(() => {
              resolve();
            })
            .catch(err => {
              console.log(err);
              reject();
            });
        }
      }
    }, interval);
  });
};

const saveData = (data, destinationDir) => {
  const out = fs.createWriteStream(destinationDir);
  out.write(data);
};

const getAverage = allData => {
  // console.log('allData', allData);
  const average = {};
  const amount = allData.length;
  allData.forEach(item => {
    for (const key in item) {
      const value = item[key];
      if (key in average) average[key] += value;
      else average[key] = value;
    }
  });
  for (const key in average) {
    const value = average[key];
    average[key] = (value / amount).toFixed(0);
  }
  average.amount = amount;
  return average;
};

// const findTheBestThreadNum = (totalTimes, fn) => {
//   const minPagesPerBrowser = 5;
//   const maxPagesPerBrowser = 10;
//   for (
//     let pagesPerBrowser = minPagesPerBrowser;
//     pagesPerBrowser < maxPagesPerBrowser;
//     pagesPerBrowser++
//   ) {
//     const threadNum = totalTimes / pagesPerBrowser;
//     if (threadNum > 50) {
//       break; // To avoid the computer burned
//     }
//     fn(pagesPerBrowser, threadNum);
//   }
// };

const getTP = (TPNum, samplerGroup) => {
  samplerGroup.sort((prev, next) => prev - next);
  const index = Math.floor((samplerGroup.length * TPNum) / 100);
  return samplerGroup[index];
};

const getMetricTPGroup = allData => {
  const MetricTPGroup = {};
  const TPNumGroup = [50, 80, 90, 95, 99];
  const processedData = {};
  allData.forEach(sampler => {
    for (const [metric, value] of Object.entries(sampler)) {
      if (!processedData[metric]) {
        processedData[metric] = [value];
      } else processedData[metric].push(value);
    }
  });
  for (const [metric, arr] of Object.entries(processedData)) {
    const TPGroup = {};
    TPNumGroup.forEach(TPNum => {
      TPGroup[`TP${TPNum}`] = getTP(TPNum, arr).toFixed(0);
    });
    // console.log('TPGroup', TPGroup);
    MetricTPGroup[metric] = TPGroup;
  }
  return MetricTPGroup;
};

const judgeIsMeaningfulSample = dataOfASample => dataOfASample && Object.values(dataOfASample).every(metric => metric > 0);

module.exports = {
  run,
  saveData,
  getAverage,
  getMetricTPGroup,
  judgeIsMeaningfulSample
};
