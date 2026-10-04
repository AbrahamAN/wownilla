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
  const quests = lore.locator(".quest-panel");
  await expect(quests).toHaveCount(4);
  const mobile = testInfo.project.name === "mobile";
  for (let index = 0; index < 4; index++) {
    if (mobile) {
      if (index > 0) await quests.nth(index).locator("summary").click();
    } else {
      await lore.locator(".rm-marker").nth(index).click();
      await page.mouse.move(0, 0);
      await expect(lore.locator(".rm-marker").nth(index)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    }
    await expect(quests.nth(index).locator(".quest-description")).toBeVisible();
    await expect(quests.nth(index).locator(".quest-checklist li")).toHaveCount(
      index === 2 ? 3 : 4,
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
      await quests
        .nth(index)
        .screenshot({
          path: `/private/tmp/wownilla-roadmap-quest3-${testInfo.project.name}.png`,
        });
    }
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

test("keyboard activates quest selection or native mobile disclosure", async ({
  page,
}, testInfo) => {
  await page.goto("/#lore");
  if (testInfo.project.name === "mobile") {
    const summary = page.locator(
      '.quest-panel[data-quest="ascension"] summary',
    );
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.locator('.quest-panel[data-quest="ascension"] .quest-qualification'),
    ).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(page.locator(".rm-marker").first()).toHaveAttribute(
      "tabindex",
      "-1",
    );
  } else {
    const markers = page.locator(".rm-marker");
    await markers.first().focus();
    await page.keyboard.press("Tab");
    await expect(markers.nth(1)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(markers.nth(1)).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Space");
    await expect(markers.nth(2)).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator('.quest-panel[data-quest="ascension"] .quest-qualification'),
    ).toBeVisible();
  }
});

test("legacy quest anchors select and reveal the matching future quest", async ({
  page,
}) => {
  await page.goto("/#roadmap-ascension");
  const quest = page.locator("#roadmap-ascension");
  await expect(quest.locator(".quest-qualification")).toBeVisible();
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
