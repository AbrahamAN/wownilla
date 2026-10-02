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
      .getByRole("link", { name: "Token", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Open menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  } else {
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Token", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/#token$/);
  await expect(page.locator("#token")).toBeInViewport();
});

test("prelaunch exposes labeled placeholder copy without trade redirects or generic socials", async ({
  page,
}) => {
  await page.goto("/#token");
  await expect(
    page
      .locator("#heroContent")
      .getByRole("button", { name: "Copy token contract placeholder" }),
  ).toBeEnabled();
  await expect(
    page.locator("#heroContent").getByRole("button", { name: "Buy $NILLA" }),
  ).toBeDisabled();
  const urls = await page
    .locator("a[href^='http']")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(urls).not.toContain("https://dexscreener.com");
  expect(urls).not.toContain("https://discord.com");
  expect(urls).not.toContain("https://t.me");
  expect(urls).not.toContain("https://x.com/Wownillaa");
});

test("checkpoint uses NILLA, branded social placeholders and external buy arrows", async ({
  page,
}) => {
  await page.goto("/#top");
  await expect(page.locator("#heroContent")).toContainText("$NILLA");
  await expect(page.locator("body")).not.toContainText("$WOWN");
  await expect(page.locator("body")).not.toContainText("Join the Horde");
  await expect(page.locator("body")).not.toContainText("unavailable");
  const actions = page.locator("#heroContent .project-actions");
  const buy = actions.getByRole("button", { name: "Buy $NILLA", exact: true });
  await expect(buy).toBeDisabled();
  await expect(buy.locator(".external-arrow")).toBeVisible();
  for (const name of ["X"]) {
    const social = actions.getByRole("button", {
      name: `${name} · coming soon`,
      exact: true,
    });
    await expect(social).toBeDisabled();
    await expect(social.locator("svg")).toBeVisible();
  }
  await expect(actions.locator(".social-links button")).toHaveCount(1);
  await expect(
    page.locator("#heroContent").getByRole("link", { name: "LONG launchpad" }),
  ).toHaveAttribute("href", "https://app.long.xyz/");
  await expect(
    page.locator("#heroContent").getByRole("link", { name: "Robinhood Chain" }),
  ).toHaveAttribute("href", "https://robinhood.com/us/en/crypto/chain/");
});

test("hero puts placeholder directly beneath logo and includes the punchline and platform marks", async ({
  page,
}) => {
  await page.goto("/#top");
  const hero = page.locator("#heroContent");
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(
    "The onchain vanilla guild.",
  );
  await expect(hero).not.toContainText("Read the Lore");
  await expect(hero).not.toContainText("$NILLA token contract");
  await expect(hero.locator(".hero-contract .contract-address")).toBeVisible();
  await expect(hero.locator(".robinhood-mark")).toBeVisible();
  await expect(hero.locator(".long-mark")).toBeVisible();
  expect(
    await hero.evaluate((root) => {
      const logo = root.querySelector(".hero-wordmark")?.parentElement;
      return logo?.nextElementSibling?.classList.contains("hero-contract");
    }),
  ).toBe(true);
});
