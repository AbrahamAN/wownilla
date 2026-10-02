import { expect, test } from "@playwright/test";
import { normalizeMsft } from "./msft-data";
import { siteConfig } from "./site-config";

const deployments = [
  { chainId: 4663, contractAddress: siteConfig.msft.address },
];
const registry = {
  assets: [
    {
      tokenSymbol: "MSFT",
      status: "ASSET_STATUS_ACTIVE",
      deployments,
      currentMultiplier: "1.002",
    },
  ],
};
const quote = {
  tokenSymbol: "MSFT",
  deployments,
  bid: "500",
  ask: "502",
  currency: "USD",
  generatedAt: new Date().toISOString(),
  isTradingHalt: false,
};
const snapshot = {
  address: siteConfig.msft.address,
  price: 502.002,
  generatedAt: new Date().toISOString(),
  observedAt: new Date().toISOString(),
  halted: false,
};

test("validates issuer registry and quote identity before deriving token midpoint", () => {
  expect(normalizeMsft(registry, { quotes: [quote] }).price).toBeCloseTo(
    502.002,
  );
  expect(() =>
    normalizeMsft(
      {
        assets: [
          {
            ...registry.assets[0],
            deployments: [
              { chainId: 1, contractAddress: siteConfig.msft.address },
            ],
          },
        ],
      },
      { quotes: [quote] },
    ),
  ).toThrow();
  for (const invalid of [
    { ...quote, deployments: [] },
    { ...quote, ask: "NaN" },
    { ...quote, ask: "499" },
    { ...quote, currency: "EUR" },
    { ...quote, generatedAt: "invalid" },
  ]) {
    expect(normalizeMsft(registry, { quotes: [invalid] }).price).toBeNull();
  }
  expect(normalizeMsft(registry, null).address).toBe(siteConfig.msft.address);
});

test("shared fetch supplies distinct full MSFT copy and source-priced navbar", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/msft", async (route) => {
    requests++;
    await route.fulfill({ json: snapshot });
  });
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          document.documentElement.dataset.msftCopied = value;
        },
      },
    }),
  );
  await page.goto("/#top");
  await expect(page.locator("#navpill .msft-price")).toContainText(
    "MSFT $502.00",
  );
  const control = page.locator("#heroContent .msft-contract");
  await control
    .getByRole("button", { name: "Copy MSFT token contract" })
    .click();
  expect(await page.locator("html").getAttribute("data-msft-copied")).toBe(
    siteConfig.msft.address,
  );
  await expect(control.getByRole("status")).toHaveText("Copied full address.");
  await expect(control.getByRole("link")).toHaveAttribute(
    "href",
    siteConfig.msft.explorerUrl,
  );
  const row = control.locator(".contract-row");
  expect(
    await row.evaluate((element) => {
      const address = element.querySelector(".contract-value");
      const button = element.querySelector("button");
      if (!(address instanceof HTMLElement) || !(button instanceof HTMLElement))
        return false;
      return (
        getComputedStyle(address).textOverflow === "ellipsis" &&
        button.getBoundingClientRect().left >=
          address.getBoundingClientRect().right &&
        button.textContent?.trim() === "" &&
        button.querySelector("svg") !== null
      );
    }),
  ).toBe(true);
  expect(requests).toBe(1);
  await expect(page.locator("#heroContent .contract-address")).toContainText(
    "NILLA-CONTRACT-COMING-SOON",
  );
});

test("empty, stale and failed prices remain truthful; invalid identity cannot enable copy", async ({
  page,
}) => {
  await page.route("**/api/msft", (route) =>
    route.fulfill({
      json: { ...snapshot, generatedAt: "2020-01-01T00:00:00Z" },
    }),
  );
  await page.goto("/#top");
  await expect(page.locator(".msft-price")).toHaveAttribute(
    "title",
    /Stale quote/,
  );
  await page.route("**/api/msft", (route) =>
    route.fulfill({ json: { ...snapshot, price: null, generatedAt: null } }),
  );
  await page.reload();
  await expect(page.locator(".msft-price")).toContainText("MSFT —");
  await expect(
    page.locator("#heroContent .msft-contract button"),
  ).toBeEnabled();
  await page.route("**/api/msft", (route) =>
    route.fulfill({ json: { ...snapshot, address: "0xwrong" } }),
  );
  await page.reload();
  await expect(page.locator(".msft-price")).toHaveAttribute(
    "title",
    /Retrying/,
  );
  await expect(
    page.locator("#heroContent .msft-contract button"),
  ).toBeDisabled();
  await expect(page.locator("#heroContent .msft-contract")).not.toContainText(
    "NILLA-CONTRACT",
  );
  await page.route("**/api/msft", (route) =>
    route.fulfill({ status: 503, json: { error: "Provider failed" } }),
  );
  await page.reload();
  await expect(page.locator(".msft-price")).toHaveAttribute(
    "title",
    /Retrying/,
  );
  await expect(
    page.locator("#heroContent .msft-contract button"),
  ).toBeDisabled();
});

test("polling pauses while hidden and resumes with one request", async ({
  page,
}) => {
  await page.clock.install();
  let requests = 0;
  await page.route("**/api/msft", async (route) => {
    requests++;
    await route.fulfill({ json: snapshot });
  });
  await page.goto("/#top");
  await expect(page.locator(".msft-price")).toContainText("$502.00");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.fastForward(180000);
  expect(requests).toBe(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => requests).toBe(2);
});
