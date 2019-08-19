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
    // It sees that the size of viewport will slow down the puppeteer's spped
    // await page.setViewport({ width: 1920, height: 1080 });
    // await page.goto('https://summit.aelf.io/test.html');
    // await page.goto('http://192.168.199.216:5000/test.html');
    await page.goto(url, {
      timeout: 120000,
      waitUntil: 'networkidle2'
    });

    // const paints = await page.evaluate(_ => performance.getEntriesByType('paint')[0].startTime);

    const perfGroup = JSON.parse(
      await page.evaluate(() => {
        const firstContentfulPaint = performance.getEntriesByType('paint')[1]
          .startTime;
        const firstPaint = performance.getEntriesByType('paint')[0].startTime;
        return JSON.stringify({
          perf: window.performance.timing,
          firstPaint,
          firstContentfulPaint
        });
      })
    );

    const {
      firstPaint,
      firstContentfulPaint,
      perf: performanceTiming
    } = perfGroup;

    const metricsB = extractDataFromPerformanceTiming(
      performanceTiming,
      'responseEnd',
      'domContentLoadedEventEnd',
      'loadEventEnd',
      'domInteractive'
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

    return {
      ...metricsB,
      firstPaint,
      firstContentfulPaint,
      ...metricsA
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = testPage;
