const { App, downloadVideo } = require("./core").default;

const app = new App();

const start = async () => {
  await app.open({ url: "https://www.douyin.com/" });
  const { page, browser } = app;
  await page.waitForTimeout(10000);
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(1000);
    const title = await page.$eval(
      ".video-info-detail > .title > span > span > span > span > span",
      (e) => e.textContent
    );
    const src = await page.$eval(".swiperVideo > video", (e) => e.src);
    const video = {
      src,
      title,
    };
    await downloadVideo(video);
    await page.waitForTimeout(1000);
  }
  await browser.close();
};

exports.default = start;
