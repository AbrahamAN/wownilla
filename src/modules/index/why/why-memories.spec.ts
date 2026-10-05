import { expect, test } from "@playwright/test";

test("each heartbeat reveals a different clip and stops with pause, hidden tabs, and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/#why");
  const background = page.locator(".why-memories");
  await expect(background).toHaveAttribute("data-beating", "true");
  const active = background.locator('.why-memory[data-active="true"]');
  await expect(active).toHaveCount(1);
  const first = await active.locator("video").getAttribute("data-src");
  await page.clock.runFor(2400);
  await expect(active).toHaveCount(1);
  expect(await active.locator("video").getAttribute("data-src")).not.toBe(
    first,
  );
  await expect(active).toHaveCSS("animation-name", "whyHeartbeat");
  await page.getByRole("button", { name: "Pause memories" }).click();
  const paused = await active.locator("video").getAttribute("data-src");
  await expect(background).toHaveAttribute("data-running", "false");
  await expect(active).toHaveCSS("animation-play-state", "paused");
  await page.clock.runFor(7200);
  expect(await active.locator("video").getAttribute("data-src")).toBe(paused);
  await page.getByRole("button", { name: "Play memories" }).click();
  await expect(background).toHaveAttribute("data-running", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(background).toHaveAttribute("data-running", "false");
  const hidden = await active.locator("video").getAttribute("data-src");
  await page.clock.runFor(7200);
  expect(await active.locator("video").getAttribute("data-src")).toBe(hidden);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(background).toHaveAttribute("data-beating", "false");
  await expect(active).toHaveCSS("animation-name", "none");
});

test("four silent memories load on visibility, loop, and support keyboard pause", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const requests: string[] = [];
  page.on("request", (request) => {
    if (
      request.url().includes("/assets/memory-") &&
      request.url().endsWith(".mp4")
    )
      requests.push(request.url());
  });
  await page.goto("/#top");
  const videos = page.locator(".why-memories video");
  await expect(videos).toHaveCount(4);
  await expect(page.locator("#heroContent")).toBeInViewport();
  expect(requests).toEqual([]);
  await page
    .locator("#why")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(() =>
      videos.evaluateAll((elements) =>
        elements.every(
          (el) =>
            el instanceof HTMLVideoElement && !el.paused && el.currentTime > 0,
        ),
      ),
    )
    .toBe(true);
  expect(new Set(requests).size).toBe(4);
  expect(
    await videos.evaluateAll((elements) =>
      elements.every(
        (el) =>
          el instanceof HTMLVideoElement &&
          el.muted &&
          el.loop &&
          el.playsInline &&
          !el.controls,
      ),
    ),
  ).toBe(true);
  const first = videos.first();
  await first.evaluate((el) => {
    if (el instanceof HTMLVideoElement) el.currentTime = el.duration - 0.2;
  });
  await expect
    .poll(() =>
      first.evaluate(
        (el) => el instanceof HTMLVideoElement && el.currentTime < 1,
      ),
    )
    .toBe(true);
  const pause = page.getByRole("button", { name: "Pause memories" });
  await pause.focus();
  await pause.press("Space");
  await expect
    .poll(() =>
      videos.evaluateAll((elements) =>
        elements.every((el) => el instanceof HTMLVideoElement && el.paused),
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Play memories" }).press("Space");
  await expect
    .poll(() =>
      videos.evaluateAll((elements) =>
        elements.every((el) => el instanceof HTMLVideoElement && !el.paused),
      ),
    )
    .toBe(true);
});

test("memories pause offscreen and in hidden tabs without losing the user's pause", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#why");
  const videos = page.locator(".why-memories video");
  await expect(videos).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Pause memories" }),
  ).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() =>
      videos.evaluateAll((elements) =>
        elements.every((el) => el instanceof HTMLVideoElement && el.paused),
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
  await expect(
    page.getByRole("button", { name: "Pause memories" }),
  ).toBeVisible();
  await page
    .locator("#token")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(() =>
      videos.evaluateAll((elements) =>
        elements.every((el) => el instanceof HTMLVideoElement && el.paused),
      ),
    )
    .toBe(true);
  await page
    .locator("#why")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page.getByRole("button", { name: "Pause memories" }).click();
  await page
    .locator("#token")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await page
    .locator("#why")
    .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect(
    page.getByRole("button", { name: "Play memories" }),
  ).toBeVisible();
  expect(
    await videos.evaluateAll((elements) =>
      elements.every((el) => el instanceof HTMLVideoElement && el.paused),
    ),
  ).toBe(true);
});

test("reduced motion keeps posters without downloading video until explicitly requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#why");
  const videos = page.locator(".why-memories video");
  await expect(videos).toHaveCount(4);
  expect(
    await videos.evaluateAll((elements) =>
      elements.every(
        (el) =>
          !el.hasAttribute("src") &&
          el.getAttribute("poster")?.endsWith(".webp"),
      ),
    ),
  ).toBe(true);
  await expect(page.locator("#why .why-story")).toBeVisible();
  await page.getByRole("button", { name: "Play memories" }).click();
  await expect(
    page.getByRole("button", { name: "Pause memories" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      videos.evaluateAll((elements) =>
        elements.every((el) => el instanceof HTMLVideoElement && !el.paused),
      ),
    )
    .toBe(true);
});

test("media errors and autoplay rejection preserve the story and poster backdrop", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException("Blocked", "NotAllowedError"));
  });
  await page.route("**/assets/memory-*.mp4", (route) => route.abort());
  await page.goto("/#why");
  await expect(page.locator(".why-memory")).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Play memories" }),
  ).toBeVisible();
  for (const pane of await page.locator(".why-memory").all())
    await expect(pane).toHaveCSS("background-image", /memory-.*\.webp/);
  await expect(page.locator("#why h2")).toHaveText(
    "The loot changed. The party didn’t.",
  );
  await expect(page.locator("#why .why-story p")).toHaveCount(3);
  expect(errors).toEqual([]);
});

test("posters and the unchanged story remain visible without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/#why`);
  await expect(page.locator(".why-memory")).toHaveCount(4);
  await expect(page.locator("#why .why-story")).toBeVisible();
  await expect(page.locator(".why-memories-control")).toBeHidden();
  expect(
    await page
      .locator(".why-memories video")
      .evaluateAll((elements) =>
        elements.every((el) => !el.hasAttribute("src")),
      ),
  ).toBe(true);
  await context.close();
});
