import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["src/modules/common/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^@/modules/(?!common/)",
              message:
                "Page-independent common code cannot depend on a page module.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "test-results/**",
    "playwright-report/**",
    "next-env.d.ts",
  ]),
]);
