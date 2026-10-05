import type { Item } from "./avatar.config";

/** Native layer resolution; the preview canvas uses it so exports match exactly. */
export const AVATAR_SIZE = 1024;

/** Export sizes: full resolution and the common profile-picture size. */
export type ExportSize = 1024 | 400;

const cache = new Map<string, Promise<HTMLImageElement | null>>();

/**
 * Loads a layer once and shares it between every canvas. A failed load
 * resolves to `null` (and is retried next time) so one missing file never
 * blanks the whole avatar.
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  const cached = cache.get(src);
  if (cached) return cached;
  const pending = new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => {
      cache.delete(src);
      resolve(null);
    };
    image.src = src;
  });
  cache.set(src, pending);
  return pending;
}

/** Warms the cache for a category so switching options does not flicker. */
export function preloadLayers(items: readonly Item[]): void {
  for (const item of items) void loadImage(item.src);
}

/** Imperative handle over one avatar canvas and its optional circular mirror. */
export interface AvatarRenderer {
  /** Draws the layers bottom to top once all of them are decoded. */
  render(layers: readonly Item[]): Promise<void>;
  /** Encodes the last rendered avatar, waiting for any render in flight. */
  exportPng(size: ExportSize): Promise<Blob | null>;
  /** Drops pending draws so a stale render cannot paint after unmount. */
  dispose(): void;
}

/**
 * Keeps compositing outside React: the previous frame stays on screen until
 * the next one is fully loaded, and only the newest request is painted.
 */
export function createAvatarRenderer(
  canvas: HTMLCanvasElement,
  mirror?: HTMLCanvasElement | null,
): AvatarRenderer {
  let request = 0;
  let settled: Promise<void> = Promise.resolve();

  function paint(images: readonly (HTMLImageElement | null)[]) {
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const image of images) {
      if (image) context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    const mirrorContext = mirror?.getContext("2d");
    if (mirror && mirrorContext) {
      mirrorContext.clearRect(0, 0, mirror.width, mirror.height);
      mirrorContext.drawImage(canvas, 0, 0, mirror.width, mirror.height);
    }
  }

  return {
    render(layers) {
      const current = ++request;
      settled = Promise.all(layers.map((layer) => loadImage(layer.src))).then(
        (images) => {
          if (current === request) paint(images);
        },
      );
      return settled;
    },
    async exportPng(size) {
      await settled;
      let source = canvas;
      if (size !== canvas.width) {
        source = document.createElement("canvas");
        source.width = size;
        source.height = size;
        const context = source.getContext("2d");
        if (!context) return null;
        context.imageSmoothingQuality = "high";
        context.drawImage(canvas, 0, 0, size, size);
      }
      return new Promise((resolve) => source.toBlob(resolve, "image/png"));
    },
    dispose() {
      request += 1;
    },
  };
}
