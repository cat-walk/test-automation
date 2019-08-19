const {
  extractDataFromPerformanceMetrics,
  extractDataFromPerformanceTiming,
  getTimeFromPerformanceMetrics
} = require('./helpers');

async function testPage(page) {
  try {
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');
    const url = 'https://baidu.com';
    // const url = 'https://summit.aelf.io/test.html';
    // await page.goto('http://192.168.199.216:5000/test.html');

    // It sees that the size of viewport wxll slow down the puppeteer's spped
    // await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url, {
      timeout: 120000,
      waitUntil: 'networkidle2'
    });

    const perfGroup = JSON.parse(
      await page.evaluate(() => {
        const firstContentfulPaint = performance.getEntriesByType('paint')[1]
          .startTime;
        // const firstPaint = performance.getEntriesByType('paint')[0].startTime;
        return JSON.stringify({
          performanceTiming: window.performance.timing,
          // firstPaint,
          firstContentfulPaint
        });
      })
    );

    let firstMeaningfulPaint = 0;
    let performanceMetrics;
    let runTimes = 0;
    while (firstMeaningfulPaint === 0) {
      await page.waitFor(300);
      performanceMetrics = await client.send('Performance.getMetrics');
      firstMeaningfulPaint = getTimeFromPerformanceMetrics(
        performanceMetrics,
        'FirstMeaningfulPaint'
      );
      runTimes++;
      if (runTimes === 30) break;
    }
    const metricsA = extractDataFromPerformanceMetrics(
      performanceMetrics,
      'FirstMeaningfulPaint'
    );

    const {
      // firstPaint,
      firstContentfulPaint,
      performanceTiming
    } = perfGroup;

    const metricsB = extractDataFromPerformanceTiming(
      performanceTiming,
      'responseEnd',
      'domContentLoadedEventEnd',
      'loadEventEnd',
      'domInteractive'
    );

    return {
      ...metricsB,
      // firstPaint,
      firstContentfulPaint,
      ...metricsA
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = testPage;
