<!--
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-18 23:53:28
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-08-19 03:13:24
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
