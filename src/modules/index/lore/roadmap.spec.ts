import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("roadmap preserves artwork and makes all four approved quests readable", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#lore");
  const lore = page.locator("#lore");
  await expect(lore.getByRole("heading", { level: 2 })).toHaveText(
    "First, gather the party.",
  );
  await expect(lore.locator(".rm-marker")).toHaveCount(4);
  await expect(lore.locator(".rm-land svg")).toBeVisible();
  await expect(lore.locator(".rm-route svg")).toBeVisible();
  const quests = page.locator(".quest-panel");
  await expect(quests).toHaveCount(0);
  for (let index = 0; index < 4; index++) {
    await lore.locator(".rm-marker").nth(index).click();

    await expect(lore.locator(".rm-marker").nth(index)).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator(".quest-panel:visible")).toHaveCount(1);
    await expect(quests.nth(index).locator(".quest-description")).toBeVisible();
    await expect(quests.nth(index).locator(".quest-checklist li")).toHaveCount(
      index === 1 || index === 2 ? 3 : 4,
    );
    if (index === 2) {
      await expect(quests.nth(index).locator(".quest-evaluation")).toHaveText([
        "Under evaluation",
        "Under evaluation",
      ]);
      await expect(
        quests.nth(index).locator(".quest-qualification"),
      ).toBeVisible();
      await expect(quests.nth(index)).toContainText(
        "We’ll publish the rules before anything goes live.",
      );
      await quests.nth(index).screenshot({
        path: `/private/tmp/wownilla-roadmap-quest3-${testInfo.project.name}.png`,
      });
    }
    await page.getByRole("button", { name: "Close quest" }).click();
  }
  await expect(lore).not.toContainText("Locked");
  await expect(lore).not.toContainText("In progress");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("checkpoint details stay hidden until selection on every screen size", async ({
  page,
}) => {
  await page.goto("/#lore");
  await expect(page.locator(".roadmap-quests")).toHaveAttribute(
    "data-enhanced",
    "true",
  );
  await expect(page.locator(".quest-panel:visible")).toHaveCount(0);
  await expect(
    page.getByText("Hover or select a checkpoint to view its quest."),
  ).toBeVisible();
  const sectionHeight = await page
    .locator("#lore")
    .evaluate((section) => section.getBoundingClientRect().height);
  await page.locator(".rm-marker").nth(1).click();
  await expect(page.locator(".quest-panel:visible")).toHaveCount(1);
  await expect(
    page.locator("#roadmap-expansion .quest-description"),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page
      .locator("#lore")
      .evaluate((section) => section.getBoundingClientRect().height),
  ).toBe(sectionHeight);
  await page.setViewportSize({ width: 768, height: 1000 });
  await expect(page.locator(".quest-panel:visible")).toHaveCount(1);
  await expect(
    page.locator("#roadmap-expansion .quest-description"),
  ).toBeVisible();
});

test("keyboard opens a modal and restores checkpoint focus on Escape", async ({
  page,
}) => {
  await page.goto("/#lore");
  const markers = page.locator(".rm-marker");
  await markers.first().focus();
  await page.keyboard.press("Tab");
  await expect(markers.nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close quest" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(markers.nth(1)).not.toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Close quest" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(markers.nth(1)).toBeFocused();
});

test("legacy quest anchors select and reveal the matching future quest", async ({
  page,
}) => {
  await page.goto("/#roadmap-ascension");
  const quest = page.locator("#roadmap-ascension");
  await expect(quest.locator(".quest-qualification")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(quest).toBeInViewport();
});

test("all future quests can be expanded without JavaScript at narrow widths", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/#lore`);
  const quests = page.locator(".quest-panel");
  await expect(quests.first()).toHaveAttribute("open", "");
  for (let index = 1; index < 4; index++) {
    await quests.nth(index).locator("summary").press("Enter");
    await expect(quests.nth(index).locator(".quest-description")).toBeVisible();
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("the original world floats and honors reduced motion", async ({
  page,
}) => {
  await page.goto("/#lore");
  const float = page.locator(".rm-float");
  await expect(float).toHaveCSS("animation-name", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(float).toHaveCSS("animation-name", "rm-float");
  await expect(page.locator(".rm-world")).toHaveCSS(
    "transform-style",
    "preserve-3d",
  );
});

test("mouse tooltip follows its checkpoint cursor without lengthening the section", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "Touch checkpoints use the modal.",
  );
  await page.goto("/#lore");
  const lore = page.locator("#lore");
  const height = await lore.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  const marker = page.locator(".rm-marker").nth(2);
  await marker.hover();
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toBeVisible();
  expect(
    await tooltip.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(false);
  await expect(tooltip).toContainText("EXPAND THE INVENTORY");
  // Hover again after selection so the active pin's larger scale is settled.
  await marker.hover();
  const before = await tooltip.boundingBox();
  const markerBounds = await marker.boundingBox();
  if (!before || !markerBounds)
    throw new Error("Checkpoint tooltip must have visible bounds");
  await page.mouse.move(
    markerBounds.x + markerBounds.width / 2 + 3,
    markerBounds.y + markerBounds.height / 2,
  );
  await expect(tooltip).toBeVisible();
  await expect
    .poll(async () => {
      const bounds = await tooltip.boundingBox();
      return bounds ? Math.abs(bounds.x - before.x) : 0;
    })
    .toBeGreaterThan(1);
  const after = await tooltip.boundingBox();
  if (!after) throw new Error("Tooltip disappeared while over its checkpoint");
  expect(after.x).toBeGreaterThanOrEqual(12);
  expect(after.y).toBeGreaterThanOrEqual(12);
  expect(after.x + after.width).toBeLessThanOrEqual(1440 - 12);
  expect(after.y + after.height).toBeLessThanOrEqual(1000 - 12);
  expect(
    await lore.evaluate((element) => element.getBoundingClientRect().height),
  ).toBe(height);
  await page.keyboard.press("Escape");
  await expect(tooltip).toHaveCount(0);
  await page.mouse.move(0, 0);
  await marker.hover();
  await expect(tooltip).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCount(0);
});
