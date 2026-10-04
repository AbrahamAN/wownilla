import { expect, test } from "@playwright/test";
import {
  projectDestinations,
  siteConfig,
  type ProjectConfig,
} from "../common/site-config";

test("Auction House presents approved copy and unavailable trading controls", async ({
  page,
}) => {
  await page.goto("/#token");
  const section = page.locator("#token");
  await expect(
    section.getByRole("heading", {
      name: "You used to spend gold here.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(section.locator(".auction-heading > p:last-child")).toHaveText(
    "$NILLA on Robinhood Chain, launched through LONG. For players who remember when checking the market meant visiting the auction house.",
  );
  await expect(
    section.getByRole("button", { name: "Buy $NILLA" }),
  ).toBeDisabled();
  await expect(
    section.getByRole("button", { name: "View Chart" }),
  ).toBeDisabled();
  await expect(
    section.getByRole("button", { name: "Copy Contract", exact: true }),
  ).toBeDisabled();
  await expect(section).toContainText("Contract unavailable");
  await expect(section).not.toContainText("NILLA-CONTRACT-COMING-SOON");
  for (const text of [
    "Guild Handbook",
    "How to join the Raid",
    "holders are the guild",
    "Prelaunch",
    "Verified deployment",
    "Provider support",
  ])
    await expect(section).not.toContainText(text);
  await expect(section.locator(".auction-pair-details")).toContainText(
    "Robinhood Chain",
  );
  await expect(section.locator(".auction-pair-details")).toContainText(
    "Unavailable",
  );
});

test("market has comfortable chart space and ordered controls without provider requests", async ({
  page,
}, testInfo) => {
  const providerRequests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (/geckoterminal|dexscreener/i.test(request.url()))
      providerRequests.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto("/#market");
    const market = page.getByRole("region", {
      name: "The Auction House trading panel",
    });
    await expect(market).toBeInViewport();
    await expect(
      market.locator("iframe, a[href^='http']:not(.msft-contract a)"),
    ).toHaveCount(0);
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
    if (width === 390) {
      const order = await market.evaluate((element) =>
        [
          ".auction-actions",
          ".auction-contract",
          ".market-frame",
          ".auction-pair-details",
        ].map(
          (selector) =>
            element.querySelector(selector)?.getBoundingClientRect().top ?? -1,
        ),
      );
      expect(order).toEqual([...order].sort((a, b) => a - b));
    }
  }
  await page.goto("/#token");
  await page.screenshot({
    path: `/private/tmp/wownilla-auction-test-${testInfo.project.name}.png`,
  });
  expect(providerRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test("Auction House remains readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: { width: 320, height: 1100 },
  });
  const page = await context.newPage();
  await page.goto("/#token");
  await expect(page.locator("#token h2")).toBeVisible();
  await expect(page.locator("#market")).toContainText(
    "$NILLA chart unavailable",
  );
  await expect(page.locator("#market")).toContainText(
    "Wownilla is independent of Microsoft and Robinhood.",
  );
  await context.close();
});

test("a chart link needs verified token, quote, pool, network and provider URL", () => {
  const token: ProjectConfig["token"] = {
    ...siteConfig.token,
    verified: true,
    format: "evm",
    value: `0x${"1".repeat(40)}`,
  };
  const quote: ProjectConfig["quote"] = {
    ...siteConfig.quote,
    verified: true,
    format: "evm",
    value: `0x${"2".repeat(40)}`,
  };
  const config: ProjectConfig = {
    ...siteConfig,
    launchStatus: "live",
    token,
    quote,
    chain: { ...siteConfig.chain, providerNetwork: "test-network" },
    market: {
      ...siteConfig.market,
      verified: true,
      pairId: "test-pool",
      chartUrl: "https://www.geckoterminal.com/test-network/pools/test-pool",
    },
  };
  expect(projectDestinations(config).chart).toBe(config.market.chartUrl);
  for (const invalid of [
    { ...config, token: { ...token, verified: false } },
    { ...config, quote: { ...quote, verified: false } },
    { ...config, market: { ...config.market, verified: false } },
    {
      ...config,
      market: {
        ...config.market,
        chartUrl: "https://www.geckoterminal.com/test-network/pools/wrong-pool",
      },
    },
    {
      ...config,
      market: {
        ...config.market,
        chartUrl: "https://evil.example/test-network/pools/test-pool",
      },
    },
  ])
    expect(projectDestinations(invalid).chart).toBeUndefined();
  expect(projectDestinations().chart).toBeUndefined();
  expect(siteConfig.market.chartUrl).toBe("");
});
