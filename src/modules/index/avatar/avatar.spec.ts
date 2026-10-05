import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import {
  decodeTraits,
  encodeTraits,
  isItemAllowed,
  randomTraits,
} from "./avatar-code";
import { categories, gallery, RACE_CATEGORY } from "./avatar.config";

/** Resolves once the preview has painted something other than transparency. */
async function waitForAvatar(page: Page) {
  await expect
    .poll(() =>
      page.locator(".avatar-canvas").evaluate((element) => {
        if (!(element instanceof HTMLCanvasElement)) return 0;
        const pixel = element.getContext("2d")?.getImageData(8, 8, 1, 1).data;
        return pixel ? pixel[3] : 0;
      }),
    )
    .toBeGreaterThan(0);
}

const code = (page: Page) => page.getByTestId("avatar-code");

test("random avatars never break race rules and round-trip their code", () => {
  for (let run = 0; run < 500; run++) {
    const traits = randomTraits();
    for (const category of categories) {
      const id = traits[category.id];
      const item = category.items.find((entry) => entry.id === id);
      if (id === null) expect(category.optional).toBe(true);
      else expect(item && isItemAllowed(item, traits[RACE_CATEGORY])).toBe(true);
    }
    expect(decodeTraits(encodeTraits(traits))).toEqual(traits);
  }
  expect(decodeTraits("nope")).toBeNull();
  expect(decodeTraits("Z".repeat(categories.length))).toBeNull();
});

test("direct entry shows a live forge that fits the viewport", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#avatar");
  await expect(
    page.getByRole("heading", { name: "Forge your face." }),
  ).toBeVisible();
  await waitForAvatar(page);
  await expect(page.locator(".avatar-card")).toHaveCount(
    Math.min(8, gallery.length),
  );
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("choices update the preview quickly and survive a reload", async ({
  page,
}) => {
  await page.goto("/#avatar");
  await waitForAvatar(page);
  const initial = await code(page).textContent();

  const elapsed = await page.evaluate(async () => {
    const canvas = document.querySelector(".avatar-canvas");
    const option = document.querySelector('button[title="Midnight Blue"]');
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error("no canvas");
    if (!(option instanceof HTMLButtonElement)) throw new Error("no option");
    const context = canvas.getContext("2d");
    const sample = () => context?.getImageData(8, 8, 1, 1).data.join(",");
    const before = sample();
    const start = performance.now();
    option.click();
    while (sample() === before) {
      if (performance.now() - start > 2000) throw new Error("no repaint");
      await new Promise(requestAnimationFrame);
    }
    return performance.now() - start;
  });
  expect(elapsed).toBeLessThan(100);

  const changed = await code(page).textContent();
  expect(changed).not.toBe(initial);
  await expect(page).toHaveURL(new RegExp(`c=${changed?.slice(1)}`));

  await page.reload();
  await expect(code(page)).toHaveText(changed ?? "");
  await expect(
    page.getByRole("button", { name: "Midnight Blue" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Random" }).click();
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(code(page)).toHaveText(changed ?? "");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(code(page)).toHaveText(initial ?? "");
});

test("race rules, hidden layers, and keyboard tabs", async ({ page }) => {
  await page.goto("/#avatar");
  await page.getByRole("tab", { name: "Race" }).click();
  await page.getByRole("button", { name: "Fish-folk", exact: true }).click();
  await page.getByRole("tab", { name: "Beard" }).click();
  await expect(page.getByRole("button", { name: "Braided" })).toBeDisabled();

  await page.getByRole("tab", { name: "Headgear" }).click();
  await page.getByRole("button", { name: "Iron Helm" }).click();
  await page.getByRole("tab", { name: "Headgear" }).press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Hair" })).toBeFocused();
  await expect(page.getByText("Hidden while wearing Iron Helm.")).toBeVisible();
});

test("gallery picks load into the forge", async ({ page }) => {
  await page.goto("/#avatar");
  const initial = await code(page).textContent();
  await page.getByRole("button", { name: /^Use Warchief/ }).click();
  await expect(code(page)).not.toHaveText(initial ?? "");
});

test("the downloaded PNG matches the preview", async ({ page }) => {
  await page.goto("/#avatar");
  await waitForAvatar(page);
  await page.getByRole("button", { name: /^Use Brewmaster/ }).click();
  const current = (await code(page).textContent())?.slice(1);

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PNG" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe(`wowow-${current}.png`);
  const file = await readFile(await download.path());
  expect(file.readUInt32BE(16)).toBe(1024);
  expect(file.readUInt32BE(20)).toBe(1024);

  const preview = await page.locator(".avatar-canvas").evaluate((element) =>
    element instanceof HTMLCanvasElement ? element.toDataURL("image/png") : "",
  );
  expect(file.toString("base64")).toBe(preview.split(",")[1]);

  const [small] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "400 × 400" }).click(),
  ]);
  expect((await readFile(await small.path())).readUInt32BE(16)).toBe(400);
});

test("sharing opens X with the avatar page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Touch uses the share sheet.");
  await page.context().route("https://x.com/**", (route) =>
    route.fulfill({ body: "ok" }),
  );
  await page.goto("/#avatar");
  const current = (await code(page).textContent())?.slice(1);
  const [popup] = await Promise.all([
    page.context().waitForEvent("page"),
    page.getByRole("button", { name: "Share on X" }).click(),
  ]);
  const intent = new URL(popup.url());
  expect(intent.pathname).toBe("/intent/post");
  expect(intent.searchParams.get("url")).toContain(`/avatar?c=${current}`);
});

test("shared avatar pages carry a composed card image", async ({
  page,
  request,
}) => {
  const shared = encodeTraits(decodeTraits(encodeTraits(randomTraits())) ?? {});
  const card = await request.get(`/api/og?c=${shared}`);
  expect(card.ok()).toBe(true);
  expect(card.headers()["content-type"]).toContain("image/png");
  expect((await card.body()).byteLength).toBeGreaterThan(5000);

  const html = await (await request.get(`/avatar?c=${shared}`)).text();
  expect(html).toContain(`/api/og?c=${shared}`);
  expect(html).toContain("summary_large_image");

  await page.goto(`/avatar?c=${shared}`);
  await expect(page).toHaveURL(new RegExp(`\\?c=${shared}#avatar$`));
  await expect(code(page)).toHaveText(`#${shared}`);
});
