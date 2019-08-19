<!--
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-18 23:53:28
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-19 08:55:16
 * @Description: file content
 -->

# test-automation

## Install

`sudo yarn install`
If you hav install the puppeteer in the project, you can skip the puppeteer's download by run as follows:
`sudo env PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install`
Tips:

1. If `sudo yarn install` get stuck when download 'puppeteer' you can try to change the mirror of Chrominum following the code below:

```sh
sudo PUPPETEER_DOWNLOAD_HOST=https://storage.googleapis.com.cnpmjs.org cnpm i puppeteer -D
```

2. If 1 don't work for you, you can try:

```sh
vi .npmrc
type puppeteer_download_host = https://npm.taobao.org/mirrors
```

## Use

1. single thread mode:

```sh
node singleThread.js
```

2. multiple threads mode:

```sh
node --experimental-worker multiThreads.js
```

## Performance Analyse

```sh
node --prof singleProcess.js
```

Info: Replace the filename of log according to your output file.

```sh
node --prof-process isolate-0x104000c00-v8.log > processed.txt
```

## Performance Metrics

白屏时间（first Paint Time）——用户从打开页面开始到页面开始有东西呈现为止
First Contentful Paint: First Contentful Paint marks the time at which the first text or image is painted.
First Meaningful Paint: First Meaningful Paint measures when the primary content of a page is visible.
用户可操作时间(dom Interactive)——用户可以进行正常的点击、输入等操作

## Statistics Metrics

TP50/80/90/95/99
TP=Top Percentile，Top 百分数，是一个统计学里的术语，与平均数、中位数都是一类。
TP50、TP90 和 TP99 等指标常用于系统性能监控场景，指高于 50%、90%、99%等百分线的情况。

## Use Guide

### SingleThread Mode

In singleThread mode, the config of 5 browsers with 10 pages per browser, tends to run better than the config of 10 browsers with 5 pages per browser.

## Todo

1. Improve the concurrent efficiency when trying to view many pages at one time.
2. Provide GUI for the output of project.
