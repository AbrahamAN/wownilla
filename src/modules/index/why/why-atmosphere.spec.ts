import { expect, test } from "@playwright/test";

test("Why embers rise smoothly behind the readable story", async ({
  page,
}, testInfo) => {
  await page.goto("/#why");
  const atmosphere = page.locator(".why-atmosphere");
  await expect(atmosphere).toHaveAttribute("aria-hidden", "true");
  await expect(atmosphere).toHaveAttribute("data-running", "true");
  const ember = atmosphere.locator(".dust.magic").first();
  await expect(ember).toHaveCSS("animation-play-state", "running");
  await expect(ember).toHaveCSS("animation-duration", "30s");
  const initialY = await ember.evaluate(
    (element) => element.getBoundingClientRect().top,
  );
  await expect
    .poll(() =>
      ember.evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(initialY - 2);
  await expect(page.locator("#why h2")).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .locator("#why")
    .screenshot({
      path: `/private/tmp/wownilla-why-particles-${testInfo.project.name}.png`,
    });
});

test("Why pauses its embers offscreen and while the tab is hidden", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#why");
  const atmosphere = page.locator(".why-atmosphere");
  await expect(atmosphere).toHaveAttribute("data-running", "true");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(atmosphere).toHaveAttribute("data-running", "false");
  await expect(atmosphere.locator(".dust").first()).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(atmosphere).toHaveAttribute("data-running", "true");
  await page
    .locator("#token")
    .evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
  await expect(atmosphere).toHaveAttribute("data-running", "false");
});

test("Why removes decorative motion when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#why");
  await expect(page.locator(".why-atmosphere")).toBeHidden();
  await expect(page.locator(".why-atmosphere .dust")).toHaveCount(0);
  await expect(page.locator("#why h2")).toBeVisible();
  await expect(page.locator("#why .why-story")).toBeVisible();
});
