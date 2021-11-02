const puppeteer = require("puppeteer");
const https = require("https");
const path = require("path");
const fs = require("fs");

const publicExecutablePath =
  "C:\\Users\\17687\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

const publicUserAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36";

const publicViewport = {
  width: 1920,
  height: 1080,
};

class App {
  constructor({ executablePath } = {}) {
    this.browser = null;
    this.page = null;
    this.executablePath = executablePath || publicExecutablePath;
  }
  async open({ url } = {}) {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: this.executablePath,
    });
    this.browser = browser;
    const page = await browser.newPage();
    this.page = page;
    await page.setUserAgent(publicUserAgent);
    await page.setViewport(publicViewport);
    await page.goto(url);
  }
}

const downloadVideo = async (video) => {
  // 判断视频文件是否已经下载
  if (!fs.existsSync(`${path.resolve("assets/video", `${video.title}.mp4`)}`)) {
    await getVideoData(video.src, "binary").then((fileData) => {
      console.log("下载视频中：", video.title);
      savefileToPath(video.title, fileData).then((res) =>
        console.log(`${res}: ${video.title}`)
      );
    });
  } else {
    console.log(`视频文件已存在：${video.title}`);
  }
};

/**
 * 获取视频流
 */
function getVideoData(url, encoding) {
  return new Promise((resolve, reject) => {
    let req = https.get(url, function (res) {
      let result = "";
      encoding && res.setEncoding(encoding);
      res.on("data", function (d) {
        result += d;
      });
      res.on("end", function () {
        resolve(result);
      });
      res.on("error", function (e) {
        reject(e);
      });
    });
    req.end();
  });
}

/**
 * 保存视频到本地
 */
function savefileToPath(fileName, fileData) {
  let fileFullName = `${path.resolve("assets/video", `${fileName}.mp4`)}`;
  return new Promise((resolve, reject) => {
    fs.writeFile(fileFullName, fileData, "binary", function (err) {
      if (err) {
        console.log("savefileToPath error:", err);
        reject(err);
      }
      resolve("已下载");
    });
  });
}

exports.default = { App, downloadVideo };
