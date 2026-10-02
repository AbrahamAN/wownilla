import { expect, test } from "@playwright/test";

test("how it works presents user-specified pair, vault and guild plans without claiming deployment", async ({
  page,
}) => {
  await page.goto("/#token");
  const section = page.locator("#token");
  await expect(
    section.getByRole("heading", { name: "How it works", exact: true }),
  ).toBeVisible();
  const cards = section.locator(".how-it-works-card");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText("$NILLA");
  await expect(cards.nth(0)).toContainText("tokenized $MSFT");
  await expect(cards.nth(0)).toContainText("Robinhood");
  await expect(cards.nth(1)).toContainText("LONG");
  await expect(cards.nth(1)).toContainText("Trading fees");
  await expect(cards.nth(1)).toContainText("LONG community vault");
  await expect(cards.nth(2)).toContainText("Guild driven");
  await expect(cards.nth(2)).toContainText("holders are the guild");
  await expect(cards.nth(2)).toContainText("fully guide");
  await expect(section.locator(".how-it-works-card .plate")).toHaveText([
    "Planned",
    "Planned",
    "Planned",
  ]);
  await expect(section).toContainText("await verification");
  await expect(section).not.toContainText("1B");
  await expect(section).not.toContainText("90%");
  await expect(section).not.toContainText("The Character Sheet");
});

test("market keeps a stable, data-free frame at all review widths", async ({
  page,
}) => {
  const providerRequests: string[] = [];
  page.on("request", (request) => {
    if (/geckoterminal|dexscreener/i.test(request.url()))
      providerRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1440, 720]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/#market");
    const columns = await page
      .locator(".how-it-works-grid")
      .evaluate(
        (grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(width >= 1024 ? 3 : 1);

    const market = page.getByRole("region", { name: "The Auction House" });
    await expect(market).toBeInViewport();
    await expect(market).toContainText("Verified deployment");
    await expect(market).toContainText("Verified pair");
    await expect(market).toContainText("Provider support");
    await expect(market.locator("iframe, a[href^='http']")).toHaveCount(0);
    expect(
      await market
        .locator(".market-frame")
        .evaluate((frame) => frame.getBoundingClientRect().height),
    ).toBe(width >= 768 ? 520 : 420);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(providerRequests).toEqual([]);
});

test("how it works and market content remain readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto("/#token");
  const cards = page.locator("#token .how-it-works-card");
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS("opacity", "1");
  }
  await expect(cards.first()).toContainText("$NILLA");
  await expect(page.locator("#market")).toContainText(
    "$NILLA chart coming soon",
  );
  await context.close();
});
