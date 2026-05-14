import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

function analyzeCanvasPng(buffer) {
  const image = PNG.sync.read(buffer);
  let brightPixels = 0;
  let variedPixels = 0;

  for (let y = 0; y < image.height; y += 12) {
    for (let x = 0; x < image.width; x += 12) {
      const index = (image.width * y + x) << 2;
      const red = image.data[index];
      const green = image.data[index + 1];
      const blue = image.data[index + 2];
      const brightness = red + green + blue;

      if (brightness > 42) {
        brightPixels += 1;
      }

      if (Math.max(red, green, blue) - Math.min(red, green, blue) > 12) {
        variedPixels += 1;
      }
    }
  }

  return { brightPixels, variedPixels };
}

for (const viewport of viewports) {
  test(`3D intro renders a nonblank canvas on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();
    await page.waitForTimeout(2500);

    const firstFrame = analyzeCanvasPng(await canvas.screenshot());
    expect(firstFrame.brightPixels).toBeGreaterThan(40);
    expect(firstFrame.variedPixels).toBeGreaterThan(20);

    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), viewport.height * 2.2);
    await page.waitForTimeout(900);

    const zoomFrame = analyzeCanvasPng(await canvas.screenshot());
    expect(zoomFrame.brightPixels).toBeGreaterThan(40);
    expect(zoomFrame.variedPixels).toBeGreaterThan(20);
  });
}
