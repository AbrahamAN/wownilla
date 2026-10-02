import { expect, test } from "@playwright/test";

test("faction badge rotates Horde, neutral and Alliance sigils with pause controls", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/#top");
  const badge = page.locator(".faction-badge");
  await expect(badge).toHaveAttribute("data-faction", "horde");
  await page.clock.fastForward(6000);
  await expect(badge).toHaveAttribute("data-faction", "neutral");
  await page
    .getByRole("button", { name: "Pause faction messages", exact: true })
    .click();
  await page.clock.fastForward(18000);
  await expect(badge).toHaveAttribute("data-faction", "neutral");
  await page.getByRole("button", { name: "Next faction message" }).click();
  await expect(badge).toHaveAttribute("data-faction", "alliance");
  const allianceColor = await badge
    .locator(".faction-sigil")
    .evaluate((element) => getComputedStyle(element).color);
  await page.getByRole("button", { name: "Next faction message" }).click();
  await expect(badge).toHaveAttribute("data-faction", "horde");
  expect(
    await badge
      .locator(".faction-sigil")
      .evaluate((element) => getComputedStyle(element).color),
  ).not.toBe(allianceColor);
});

test("reduced motion keeps the badge static but supports manual message changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/#top");
  const badge = page.locator(".faction-badge");
  await expect(badge).toHaveAttribute("data-faction", "horde");
  await page.clock.fastForward(18000);
  await expect(badge).toHaveAttribute("data-faction", "horde");
  await page.getByRole("button", { name: "Next faction message" }).click();
  await expect(badge).toHaveAttribute("data-faction", "neutral");
});

test("hidden tab pauses faction rotation", async ({ page }) => {
  await page.clock.install();
  await page.goto("/#top");
  await expect(page.locator(".faction-badge")).toHaveAttribute(
    "data-faction",
    "horde",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.fastForward(18000);
  await expect(page.locator(".faction-badge")).toHaveAttribute(
    "data-faction",
    "horde",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.fastForward(6000);
  await expect(page.locator(".faction-badge")).toHaveAttribute(
    "data-faction",
    "neutral",
  );
});

test("animated faction changes settle in the same frame and reduced motion skips transforms", async ({
  page,
}) => {
  await page.goto("/#top");
  const badge = page.locator(".faction-badge");
  await page
    .getByRole("button", { name: "Pause faction messages", exact: true })
    .click();
  const height = await badge.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  await page.getByRole("button", { name: "Next faction message" }).click();
  await expect(badge.locator(".faction-message-text")).toHaveText(
    "One guild. Every faction.",
  );
  await expect(badge.locator(".faction-message-text")).toHaveCount(1);
  expect(
    await badge.evaluate((element) => element.getBoundingClientRect().height),
  ).toBe(height);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Next faction message" }).click();
  await expect(badge.locator(".faction-message-text")).toHaveText(
    "For the Alliance",
  );
  await expect(badge.locator(".faction-message-text")).toHaveCSS(
    "transform",
    "none",
  );
});
