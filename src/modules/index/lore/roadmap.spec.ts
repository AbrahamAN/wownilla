import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

/** Activates a marker the way the current project's pointer would. */
async function point(page: Page, marker: Locator, touch: boolean) {
  const box = await marker.boundingBox();
  if (!box) throw new Error("Marker has no layout box");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  if (touch) await page.touchscreen.tap(x, y);
  else await page.mouse.move(x, y);
}

test.beforeEach(async ({ page }) => {
  // The floating world never settles, so pointer tests run against still art.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("roadmap shows four waypoints with one active phase and a readable ledger", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/#lore");
  const lore = page.locator("#lore");
  await expect(lore.getByRole("heading", { level: 2 })).toHaveText(
    "The Road Ahead",
  );
  const markers = lore.locator(".rm-marker");
  await expect(markers).toHaveCount(4);
  await expect(
    lore.locator('.rm-marker[data-status="in-progress"]'),
  ).toHaveCount(1);
  await expect(markers.first()).toHaveAttribute("data-status", "in-progress");
  await expect(lore.locator('.rm-marker[data-status="locked"]')).toHaveCount(3);
  const ledger = lore.getByRole("listitem");
  await expect(ledger).toHaveCount(4);
  await expect(ledger.first()).toContainText("The Awakening");
  await expect(ledger.first()).toContainText("In progress");
  await expect(ledger.last()).toContainText("The Eternal Realm");
  await expect(ledger.last()).toContainText("Locked");
  expect(errors).toEqual([]);
});

test("each marker opens a tooltip that stays inside the viewport", async ({
  page,
  hasTouch,
}) => {
  await page.goto("/#lore");
  const stage = page.locator(".rm-stage");
  await stage.scrollIntoViewIfNeeded();
  const markers = page.locator(".rm-marker");
  const tooltip = page.getByRole("tooltip");
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("Viewport is not set");
  const expected = [
    ["The Awakening", "In progress"],
    ["The Expansion", "Locked"],
    ["The Ascension", "Locked"],
    ["The Eternal Realm", "Locked"],
  ] as const;
  for (const [index, [title, status]] of expected.entries()) {
    await point(page, markers.nth(index), hasTouch);
    await expect(tooltip).toHaveCount(1);
    await expect(tooltip).toContainText(title);
    await expect(tooltip).toContainText(status);
    await expect(markers.nth(index)).toHaveAttribute("aria-expanded", "true");
    await expect(tooltip.locator("svg[viewBox='0 0 16 16']")).toHaveCount(
      status === "Locked" ? 1 : 0,
    );
    const box = await tooltip.boundingBox();
    if (!box) throw new Error("Tooltip has no layout box");
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  }
  await page.keyboard.press("Escape");
  await expect(tooltip).toHaveCount(0);
});

test("a second tap or a tap outside closes the tooltip", async ({
  page,
  hasTouch,
}) => {
  test.skip(!hasTouch, "Touch-only interaction");
  await page.goto("/#lore");
  await page.locator(".rm-stage").scrollIntoViewIfNeeded();
  const marker = page.locator(".rm-marker").nth(1);
  const tooltip = page.getByRole("tooltip");
  await point(page, marker, true);
  await expect(tooltip).toContainText("The Expansion");
  await point(page, marker, true);
  await expect(tooltip).toHaveCount(0);
  await point(page, marker, true);
  await expect(tooltip).toHaveCount(1);
  await page.locator("#lore h2").tap();
  await expect(tooltip).toHaveCount(0);
});

test("keyboard focus opens each phase and locked phases stay locked", async ({
  page,
  hasTouch,
}) => {
  test.skip(hasTouch, "Keyboard journey runs on desktop");
  await page.goto("/#lore");
  const markers = page.locator(".rm-marker");
  await markers.first().focus();
  await page.keyboard.press("Tab");
  await expect(markers.nth(1)).toBeFocused();
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toContainText("The Expansion");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(tooltip).toContainText("Locked");
  await expect(markers.nth(1)).toHaveAttribute("data-status", "locked");
});

test("the world floats by default and holds still under reduced motion", async ({
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
