import { expect, test } from "@playwright/test";
import { projectDestinations, siteConfig } from "../common/site-config";

test("community action accepts only an X Community destination", () => {
  expect(projectDestinations().community).toBeUndefined();
  for (const community of [
    "https://x.com/example",
    "https://x.com/",
    "http://x.com/i/communities/123",
    "https://x.com/i/communities/123?redirect=other",
  ]) {
    expect(
      projectDestinations({
        ...siteConfig,
        links: { ...siteConfig.links, community },
      }).community,
    ).toBeUndefined();
  }
  expect(
    projectDestinations({
      ...siteConfig,
      links: {
        ...siteConfig.links,
        community: "https://x.com/i/communities/123",
      },
    }).community,
  ).toBe("https://x.com/i/communities/123");
});

test("Hero preserves layout order, readable controls and a valid scroll destination", async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === "mobile") {
    await page.setViewportSize({ width: 390, height: 844 });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#top");
  await expect(page.locator("#dungeon")).toBeVisible();
  const boxes = await page.locator("#heroContent").evaluate((root) => {
    const rect = (selector: string) => {
      const element = root.querySelector(selector);
      if (!element) throw new Error(`Missing ${selector}`);
      const box = element.getBoundingClientRect();
      return {
        top: box.top,
        bottom: box.bottom,
        left: box.left,
        right: box.right,
        width: box.width,
        height: box.height,
      };
    };
    return {
      logo: rect(".hero-logo"),
      heading: rect("h1"),
      description: rect(".hero-proposition"),
      actions: rect(".hero-actions"),
      contract: rect(".hero-contract"),
      badges: rect(".hero-badges"),
      copy: rect(".contract-copy-icon"),
      pageWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
    };
  });
  expect(boxes.pageWidth).toBeLessThanOrEqual(boxes.viewport);
  expect(boxes.copy.height).toBeGreaterThanOrEqual(44);
  if (testInfo.project.name === "desktop") {
    expect(boxes.logo.right).toBeLessThan(boxes.heading.left);
    expect(boxes.logo.width).toBeLessThan(440);
    expect(boxes.contract.top - boxes.logo.bottom).toBeLessThan(25);
  } else {
    expect(boxes.heading.top).toBeGreaterThanOrEqual(boxes.logo.bottom);
    expect(boxes.description.top).toBeGreaterThan(boxes.heading.bottom);
    expect(boxes.actions.top).toBeGreaterThan(boxes.description.bottom);
    expect(boxes.contract.top).toBeGreaterThan(boxes.actions.bottom);
    expect(boxes.badges.top).toBeGreaterThan(boxes.contract.bottom);
  }
  await page.screenshot({
    path: `/private/tmp/wownilla-hero-${testInfo.project.name}.png`,
    fullPage: false,
  });
  await page.locator("#top").screenshot({
    path: `/private/tmp/wownilla-hero-${testInfo.project.name}-section.png`,
  });
  const cue = page.getByRole("link", { name: "Begin Your Quest" });
  await cue.focus();
  await expect(cue).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#why$/);
  await expect(page.locator("#why")).toHaveCount(1);
});

test("Hero fits a narrow mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#top");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".hero-contract-strip button")).toBeDisabled();
  await expect(
    page.getByRole("link", { name: "Begin Your Quest" }),
  ).toBeVisible();
});
