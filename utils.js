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

let conCurrent = (fn, limit, asyncHandle) => {
  for(let i=0; i < limit; i++){
    setTimeout(fn, 0);
  };
};

module.exports = { conCurrent };
