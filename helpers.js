/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-12 17:42:17
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-17 20:18:21
 * @Description: file content
 */
const getTimeFromPerformanceMetrics = (metrics, name) => metrics.metrics.find(x => x.name === name).value * 1000;

const extractDataFromPerformanceTiming = (timing, ...dataNames) => {
  const { navigationStart } = timing;

  const extractedData = {};
  dataNames.forEach(name => {
    extractedData[name] = timing[name] - navigationStart;
  });

  return extractedData;
};

const extractDataFromPerformanceMetrics = (metrics, ...dataNames) => {
  const navigationStart = getTimeFromPerformanceMetrics(
    metrics,
    'NavigationStart'
  );

  const extractedData = {};
  dataNames.forEach(name => {
    extractedData[name] = getTimeFromPerformanceMetrics(metrics, name) - navigationStart;
  });

  return extractedData;
};

module.exports = {
  extractDataFromPerformanceMetrics,
  extractDataFromPerformanceTiming,
  getTimeFromPerformanceMetrics
};
