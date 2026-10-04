"use client";

import { useEffect, useRef, useState } from "react";

/** Reports clipboard success only after a full-address write resolves; denial leaves selectable text. */
export function CopyContract({
  address,
  label,
  placeholder = false,
  successMessage = "Copied full address.",
  showLabel = false,
  copyLabel = "Copy",
}: {
  address: string;
  label: string;
  placeholder?: boolean;
  successMessage?: string;
  showLabel?: boolean;
  copyLabel?: string;
}) {
  const [feedback, setFeedback] = useState("");
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [denied, setDenied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timer.current);
    };
  }, []);
  async function copy() {
    if (!address || pending) return;
    clearTimeout(timer.current);
    setPending(true);
    setCopied(false);
    setFeedback("");
    setDenied(false);
    try {
      await navigator.clipboard.writeText(address);
      if (mounted.current) {
        setCopied(true);
        setFeedback(
          placeholder
            ? "Copied placeholder — not a live contract."
            : successMessage,
        );
        timer.current = setTimeout(() => {
          setCopied(false);
          setFeedback("");
        }, 2000);
      }
    } catch {
      if (mounted.current) {
        setDenied(true);
        setFeedback(
          "Copy did not complete. Select the text below and copy manually.",
        );
      }
    } finally {
      if (mounted.current) {
        setPending(false);
      }
    }
  }
  return (
    <div className="copy-control">
      <button
        type="button"
        className="btn btn-dark contract-copy-icon"
        onClick={copy}
        disabled={!address}
        aria-disabled={!address || pending}
        aria-busy={pending}
        data-copied={copied}
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
      >
        {showLabel ? (
          <span className="copy-button-label">
            {copied ? "Copied!" : copyLabel}
          </span>
        ) : null}
        <svg
          className="copy-glyph"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h4" />
        </svg>
        <svg
          className="copy-check"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </button>
      <span
        role="status"
        className={denied ? "copy-feedback text-sm text-parch2" : "sr-only"}
      >
        {pending ? "Copying…" : feedback}
        {denied ? (
          <code className="copy-full-value block mt-2">{address}</code>
        ) : null}
      </span>
    </div>
  );
}
