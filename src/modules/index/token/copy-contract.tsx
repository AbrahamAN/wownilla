"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/modules/index/common/site-config";

/** Copies the configured contract, preserving feedback and the legacy clipboard fallback. */
export function CopyContract() {
  const [label, setLabel] = useState("Copy");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    let copied = false;
    try {
      await navigator.clipboard.writeText(siteConfig.contract);
      copied = true;
    } catch {
      const field = document.createElement("textarea");
      field.value = siteConfig.contract;
      field.readOnly = true;
      field.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(field);
      field.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      field.remove();
      document.getElementById("copyBtn")?.focus({ preventScroll: true });
      if (!copied) {
        const contract = document.getElementById("contract");
        if (contract) {
          const range = document.createRange();
          range.selectNodeContents(contract);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
        }
      }
    }
    setLabel(copied ? "Copied!" : "Select & copy");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel("Copy"), 1600);
  }
  return (
    <button
      id="copyBtn"
      type="button"
      className="btn btn-dark shrink-0 px-3 py-1.5 text-[10px]"
      onClick={copy}
      aria-live="polite"
    >
      {label}
    </button>
  );
}
