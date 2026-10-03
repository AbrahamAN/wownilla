import { expect, test } from "@playwright/test";
import {
  isUsableAddress,
  projectDestinations,
  safeProjectUrl,
  siteConfig,
} from "../common/site-config";

test("prelaunch and invalid addresses cannot expose trading destinations", () => {
  expect(projectDestinations().buy).toBeUndefined();
  expect(isUsableAddress(siteConfig.token)).toBe(false);
  expect(
    projectDestinations({
      ...siteConfig,
      launchStatus: "live",
      links: { ...siteConfig.links, buy: "https://app.uniswap.org/swap" },
    }).buy,
  ).toBeUndefined();
  expect(
    isUsableAddress({
      ...siteConfig.token,
      verified: true,
      format: "evm",
      value: "0xWOWN…ILLA — Soon™",
    }),
  ).toBe(false);
  expect(
    isUsableAddress({
      ...siteConfig.token,
      verified: true,
      format: "evm",
      value: `0x${"0".repeat(40)}`,
    }),
  ).toBe(false);
  expect(
    isUsableAddress({
      ...siteConfig.token,
      verified: true,
      format: "evm",
      value: `0x${"1".repeat(40)}`,
    }),
  ).toBe(true);
});

test("public links reject roots, unexpected hosts, credentials and executable protocols", () => {
  for (const url of [
    "https://t.me",
    "https://discord.com",
    "https://dexscreener.com",
    "javascript:alert(1)",
    "http://x.com/Wownillaa",
    "https://user:pass@x.com/test",
  ])
    expect(safeProjectUrl(url)).toBeUndefined();
  expect(
    safeProjectUrl("https://evil.example/test", ["x.com"]),
  ).toBeUndefined();
  expect(safeProjectUrl("https://x.com/Wownillaa", ["x.com"])).toBe(
    "https://x.com/Wownillaa",
  );
});

test("Auction House reserves an honest chart placeholder before launch", async ({
  page,
}) => {
  await page.goto("/#market");
  await expect(page.locator("#queue")).toHaveCount(0);
  await expect(page.locator("#market")).toBeInViewport();
  await expect(page.locator("#market")).toContainText(
    "$NILLA chart coming soon",
  );
  await expect(page.locator("#market iframe")).toHaveCount(0);
  await expect(
    page.locator("#market a[href^='http']:not(.msft-contract a)"),
  ).toHaveCount(0);
});

test("launch platform links are informational while NILLA trading remains gated", () => {
  expect(siteConfig.ticker).toBe("$NILLA");
  expect(siteConfig.chain.name).toBe("Robinhood Chain");
  expect(siteConfig.launchpad.url).toBe("https://app.long.xyz/");
  expect(projectDestinations().buy).toBeUndefined();
  expect(safeProjectUrl(siteConfig.launchpad.url, ["app.long.xyz"], true)).toBe(
    "https://app.long.xyz/",
  );
  expect(
    safeProjectUrl("https://t.me/", ["app.long.xyz"], true),
  ).toBeUndefined();
  expect(
    safeProjectUrl(siteConfig.launchpad.url, ["app.long.xyz"]),
  ).toBeUndefined();
});
