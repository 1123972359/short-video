/**
 * 未完善
 */
const { App, downloadVideo } = require("./core").default;

const app = new App();

const start = async () => {
  await app.open({
    url: "https://www.kuaishou.com/short-video/3xnri52dxq8y5dk?authorId=3xdvea3y6dcbmxw&streamSource=brilliant&hotChannelId=00&area=brilliantxxcarefully",
  });
  const { page, browser } = app;
  await page.waitForTimeout(10000);

  let cache = "";

  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(1000);
    const title = new Date().getTime();
    const src = await page.$eval(".player-video", (e) => e.src);
    if (cache != src) {
      cache = src;
      const video = {
        src,
        title,
      };
      await downloadVideo(video);
      await page.waitForTimeout(1000);
    } else {
      console.log("相同资源");
    }
  }
  await browser.close();
};

exports.default = start;
