const {
  extractDataFromPerformanceMetrics,
  extractDataFromPerformanceTiming
} = require('./helpers');

async function testPage(page) {
  try {
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    await page.setViewport({ width: 1920, height: 1080 });
    // await page.goto('https://summit.aelf.io');
    await page.goto('http://192.168.199.216:5000 ');
    // await page.evaluate(() => {
    //   document.documentElement.scrollTop = 1000;
    // });
    // await page.screenshot({ path: './assets/example.png' })

    await page.waitFor(1000); // todo: emmmmm?
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    const performanceMetrics = await client.send('Performance.getMetrics');

    const metricsA = extractDataFromPerformanceMetrics(
      performanceMetrics,
      'FirstMeaningfulPaint'
    );
    const metricsB = extractDataFromPerformanceTiming(
      performanceTiming,
      'responseEnd',
      'domInteractive',
      'domContentLoadedEventEnd',
      'loadEventEnd'
    );
    return { ...metricsA, ...metricsB };
  } catch (err) {
    console.log(err);
  }
}

module.exports = testPage;
