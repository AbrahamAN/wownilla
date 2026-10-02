import { expect, test } from "@playwright/test";

test("requires Enter World when audible autoplay is blocked", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Blocked", "NotAllowedError"));
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Enter World", exact: true }),
  ).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Enter World", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("missing music does not trap the visitor in the queue", async ({
  page,
}) => {
  await page.route("**/assets/hero-theme.webm", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 12000 });
  await expect(page.locator("#musicBtn")).toHaveCount(0);
  await expect(page.locator("#heroContent")).toBeVisible();
});

test("copies the configured contract and exposes a manual fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.resolve() },
    });
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Blocked", "NotAllowedError"));
  });
  await page.goto("/#token");
  await page.locator("#qCancel").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.locator("#copyBtn").click();
  await expect(page.locator("#copyBtn")).toHaveText("Copied!");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    });
    document.execCommand = () => false;
  });
  await page.locator("#copyBtn").click();
  await expect(page.locator("#copyBtn")).toHaveText("Select & copy");
  expect(
    await page.evaluate(() => window.getSelection()?.toString()),
  ).toContain("0xWOWN");
});

test("renders a moving dungeon and preserves bounded chat and XP", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#qCancel").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const canvas = page.locator("#dungeon");
  await expect
    .poll(() =>
      canvas.evaluate((element) =>
        element instanceof HTMLCanvasElement ? element.width : 0,
      ),
    )
    .toBeGreaterThan(300);
  const firstFrame = await canvas.evaluate((element) =>
    element instanceof HTMLCanvasElement ? element.toDataURL() : "",
  );
  expect(firstFrame.length).toBeGreaterThan(10000);
  const colorCount = await canvas.evaluate((element) => {
    if (!(element instanceof HTMLCanvasElement)) return 0;
    const context = element.getContext("2d");
    if (!context) return 0;
    const pixels = context.getImageData(
      0,
      0,
      element.width,
      element.height,
    ).data;
    const colors = new Set<string>();
    for (let index = 0; index < pixels.length; index += 400) {
      colors.add(`${pixels[index]},${pixels[index + 1]},${pixels[index + 2]}`);
    }
    return colors.size;
  });
  expect(colorCount).toBeGreaterThan(16);
  await expect
    .poll(() =>
      canvas.evaluate((element) =>
        element instanceof HTMLCanvasElement ? element.toDataURL() : "",
      ),
    )
    .not.toBe(firstFrame);
  await page
    .locator("footer")
    .evaluate((element) =>
      element.scrollIntoView({ behavior: "instant", block: "end" }),
    );
  await expect(page.locator("#xp-label")).toHaveText("LVL 60 · DING!");
  await expect(page.locator("#chat p")).toHaveCount(9, { timeout: 10000 });
  await expect
    .poll(() => page.locator("#chat p").count())
    .toBeLessThanOrEqual(9);
});

test("reduced motion keeps the dungeon still and content readable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Blocked", "NotAllowedError"));
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#qCancel").click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const canvas = page.locator("#dungeon");
  const firstFrame = await canvas.evaluate((element) =>
    element instanceof HTMLCanvasElement ? element.toDataURL() : "",
  );
  await page.waitForTimeout(350);
  expect(
    await canvas.evaluate((element) =>
      element instanceof HTMLCanvasElement ? element.toDataURL() : "",
    ),
  ).toBe(firstFrame);
  await expect(page.locator(".dust")).toHaveCount(0);
  await expect(page.locator("#chat p")).toHaveCount(7);
  await page.locator("#token").scrollIntoViewIfNeeded();
  await expect(page.locator("#token h2")).toHaveText("The Character Sheet");
});

test("server content remains visible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/#token`);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#token h2")).toBeVisible();
  await expect(page.locator("#token .reveal").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await context.close();
});

test("pauses background music and preserves mute when the tab returns", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const audio = page.locator("#heroMusic");
  await expect
    .poll(() =>
      audio.evaluate(
        (element) => element instanceof HTMLAudioElement && !element.paused,
      ),
    )
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() =>
      audio.evaluate(
        (element) => element instanceof HTMLAudioElement && element.paused,
      ),
    )
    .toBe(true);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() =>
      audio.evaluate(
        (element) => element instanceof HTMLAudioElement && !element.paused,
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Mute music" }).click();
  await expect
    .poll(() =>
      audio.evaluate(
        (element) => element instanceof HTMLAudioElement && element.paused,
      ),
    )
    .toBe(true);
  await page.evaluate(() =>
    document.dispatchEvent(new Event("visibilitychange")),
  );
  await expect(
    page.getByRole("button", { name: "Play music" }),
  ).toHaveAttribute("aria-pressed", "false");
  expect(
    await audio.evaluate(
      (element) => element instanceof HTMLAudioElement && element.paused,
    ),
  ).toBe(true);
});
