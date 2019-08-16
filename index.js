const puppeteer = require('puppeteer');
const testPage = require('./testPage');
const { run, saveData } = require('./utils');

(async () => {
  const allData = [];
  const browser = await puppeteer.launch();

  let main = async () => {
    const page = await browser.newPage();
    const aTestSample = await testPage(page);
    allData.push(aTestSample);
    if(typeof aTestSample === 'object') {
      return Promise.resolve();
    }
  };

  run(main, 3, 1000).then(() => {
    const average = {};
    const amount = allData.length;
    allData.forEach(item => {
      for (let key in item) {
        const value = item[key];
        if (key in average) average[key] += value;
        else average[key] = value;
      }
    });
    for (let key in average) {
      const value = average[key];
      average[key] = (value / amount).toFixed(0);
    }
    average.amount = amount;
    console.log('average', average);
    saveData(
      JSON.stringify({
        id: 0,
        allData,
        average
      })
    );
    browser.close();
  }).catch((err) => {
    console.log(err);
  }
  );
  // setTimeout(() => {
  // const average = {};
  // const amount = allData.length;
  // allData.forEach(item => {
  //   for (let key in item) {
  //     const value = item[key];
  //     if (key in average) average[key] += value;
  //     else average[key] = value;
  //   }
  // });
  // for (let key in average) {
  //   const value = average[key];
  //   average[key] = (value / amount).toFixed(0);
  // }
  // average.amount = amount;
  // console.log('average', average);
  // saveData(
  //   JSON.stringify({
  //     id: 0,
  //     allData,
  //     average
  //   })
  // );
  // browser.close();
  // }, 10000);
})();
