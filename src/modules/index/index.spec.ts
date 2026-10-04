import { expect, test } from "@playwright/test";

test("direct token entry bypasses intro and serves indexable content", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#token");
  await expect(page.locator("#queue")).toHaveCount(0);
  await expect(page.locator("#token")).toBeInViewport();
  await expect(page).toHaveTitle("WOWNILLA — Enter the Horde");
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Allow: /");
  expect(errors).toEqual([]);
});

test("music is opt-in and menu supports native token links and Escape", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Skip intro · Enter World", exact: true })
    .click();
  await expect(page.locator("#queue")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Play music" }),
  ).toHaveAttribute("aria-pressed", "false");
  if (await page.getByRole("button", { name: "Open menu" }).isVisible()) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .locator("#mobileMenu")
      .getByRole("link", { name: "Auction House", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else {
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Auction House", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/#token$/);
  await expect(page.locator("#token")).toBeInViewport();
});

test("Hero keeps missing destinations and contract unavailable without redirecting", async ({
  page,
}) => {
  await page.goto("/#top");
  const hero = page.locator("#heroContent");
  await expect(
    hero.getByRole("button", { name: "Copy $NILLA contract address" }),
  ).toBeDisabled();
  await expect(hero.getByRole("button", { name: "Buy $NILLA" })).toBeDisabled();
  await expect(
    hero.getByRole("button", { name: "Join the Tavern" }),
  ).toBeDisabled();
  await expect(hero).toContainText("Contract unavailable");
  await expect(hero).not.toContainText("NILLA-CONTRACT-COMING-SOON");
  await expect(hero).not.toContainText("MSFT");
  await expect(hero).not.toContainText("Prelaunch");
  await expect(hero.locator(".faction-badge")).toHaveCount(0);
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(
    "The onchain vanilla guild.",
  );
  await expect(hero.locator(".hero-proposition")).toHaveText(
    "$NILLA on Robinhood Chain, launched through LONG. Both factions welcome. Someone tell the healer.",
  );
  await expect(
    hero.getByRole("link", { name: "LONG launchpad" }),
  ).toHaveAttribute("href", "https://app.long.xyz/");
  await expect(
    hero.getByRole("link", { name: "Robinhood Chain" }),
  ).toHaveAttribute("href", "https://robinhood.com/us/en/crypto/chain/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});
