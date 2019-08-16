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
  let hasRun = 0;
  const concurrentPool = [];
  return new Promise((resolve, reject) => {
    let timer = setInterval(() => {
      concurrentPool.push(fn());
      hasRun++;
      if (hasRun === times) {
        console.log('concurrentPool', concurrentPool);
        Promise.all(concurrentPool).then(() => {
          clearInterval(timer);
          timer = null;
          console.log('hasRun', hasRun);
          console.log('111');
          resolve();
        }).catch((err) => {
          console.log(err);
          reject();
        })
      }
    }, interval);
  });
};

const saveData = data => {
  const out = fs.createWriteStream('./anotherMessage.json');
  out.write(data);
};

module.exports = { run, saveData };
