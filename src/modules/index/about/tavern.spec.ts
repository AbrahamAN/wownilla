import { expect, test } from "@playwright/test";

test("Tavern preserves legacy entry and keeps the Community invitation honest", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (testInfo.project.name === "mobile") {
    await page.setViewportSize({ width: 390, height: 1100 });
  }
  for (const anchor of ["about", "tavern"]) {
    await page.goto(`/#${anchor}`);
    await expect(page.locator("#queue")).toHaveCount(0);
    await expect(page.locator("#tavern")).toBeInViewport();
    await expect(page.locator("#tavern h2")).toBeInViewport();
  }
  const tavern = page.locator("#tavern");
  await expect(
    tavern.getByRole("button", { name: "Join the Tavern" }),
  ).toBeDisabled();
  await expect(tavern).toContainText("X Community link unavailable.");
  await expect(tavern.locator(".tooltip-card")).toHaveCount(0);
  const artwork = tavern.locator("img");
  await expect(artwork).toHaveAttribute("alt", "");
  await expect
    .poll(() =>
      artwork.evaluate((element) =>
        element instanceof HTMLImageElement ? element.naturalWidth : 0,
      ),
    )
    .toBeGreaterThan(0);
  if (testInfo.project.name === "mobile") {
    const positions = await tavern.evaluate((section) => {
      const copy = section.querySelector(".tavern-copy");
      const scene = section.querySelector(".tavern-scene");
      return {
        copyBottom: copy?.getBoundingClientRect().bottom,
        sceneTop: scene?.getBoundingClientRect().top,
      };
    });
    expect(positions.sceneTop).toBeGreaterThan(positions.copyBottom ?? 0);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `/private/tmp/wownilla-tavern-${testInfo.project.name}.png`,
  });
  expect(errors).toEqual([]);
});

test("Tavern remains readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/#about`);
  await expect(page.locator("#tavern h2")).toBeVisible();
  await expect(page.locator(".tavern-description")).toBeVisible();
  await expect(page.locator(".tavern-welcome")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("Tavern embers rise and hearth light changes while the scene is visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#tavern");
  await page.locator(".tavern-scene").scrollIntoViewIfNeeded();
  const atmosphere = page.locator(".tavern-atmosphere");
  await expect(atmosphere).toHaveAttribute("data-running", "true");
  await expect(atmosphere).toHaveAttribute("aria-hidden", "true");
  const ember = atmosphere.locator(".dust.magic").first();
  const light = atmosphere.locator(".tavern-firelight");
  await expect(ember).toHaveCSS("animation-play-state", "running");
  const initialY = await ember.evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  await expect
    .poll(() =>
      ember.evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(initialY - 2);
  const initialLight = await light.evaluate(
    (element) => getComputedStyle(element).opacity,
  );
  await expect
    .poll(() => light.evaluate((element) => getComputedStyle(element).opacity))
    .not.toBe(initialLight);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(atmosphere).toHaveAttribute("data-running", "false");
  await expect(ember).toHaveCSS("animation-play-state", "paused");
  await expect(light).toHaveCSS("animation-play-state", "paused");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(atmosphere).toHaveAttribute("data-running", "true");
  await page
    .locator("#lore")
    .evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
  await expect(atmosphere).not.toBeInViewport();
  await expect(atmosphere).toHaveAttribute("data-running", "false");
});

test("Tavern keeps its artwork and invitation still under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#tavern");
  await expect(page.locator(".tavern-atmosphere")).toBeHidden();
  await expect(page.locator(".tavern-atmosphere .dust")).toHaveCount(0);
  await expect(page.locator(".tavern-artwork")).toBeVisible();
  await expect(page.locator("#tavern h2")).toBeVisible();
});
