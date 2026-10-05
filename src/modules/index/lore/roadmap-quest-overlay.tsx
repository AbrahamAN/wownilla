"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { MotionValue } from "motion/react";
import { createPortal } from "react-dom";

/** Keeps cursor previews in the top layer and uses a native modal for touch and keyboard access. */
export function RoadmapQuestOverlay({
  questId,
  modal,
  cursorX,
  cursorY,
  onDismiss,
  children,
}: {
  questId: string;
  modal: boolean;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  onDismiss: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.querySelectorAll("details").forEach((panel) => {
      panel.open = panel.dataset.quest === questId;
    });
    if (modal) dialog.showModal();
    else {
      // Dialog popovers receive focus by default; a mouse preview must preserve it.
      const previousFocus = document.activeElement;
      dialog.showPopover();
      dialog.blur();
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus({ preventScroll: true });
      }
    }

    /** Measures the open quest and keeps its cursor offset inside the viewport. */
    const position = () => {
      if (modal) return;
      const { width, height } = dialog.getBoundingClientRect();
      const x = cursorX.get();
      const y = cursorY.get();
      const left = x + 18 + width <= innerWidth - 12 ? x + 18 : x - width - 18;
      dialog.style.left = `${Math.max(12, Math.min(left, innerWidth - width - 12))}px`;
      dialog.style.top = `${Math.max(12, Math.min(y + 18, innerHeight - height - 12))}px`;
    };
    position();
    const stopX = cursorX.on("change", position);
    const stopY = cursorY.on("change", position);
    window.addEventListener("resize", position);
    return () => {
      stopX();
      stopY();
      window.removeEventListener("resize", position);
      if (dialog.open) dialog.close();
      if (dialog.matches(":popover-open")) dialog.hidePopover();
    };
  }, [questId, modal, cursorX, cursorY]);

  useEffect(() => {
    if (modal) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", dismiss);
    return () => {
      window.removeEventListener("keydown", dismiss);
    };
  }, [modal, onDismiss]);

  return createPortal(
    <dialog
      ref={dialogRef}
      popover={modal ? undefined : "manual"}
      role={modal ? "dialog" : "tooltip"}
      aria-modal={modal || undefined}
      aria-labelledby={`roadmap-${questId}-title`}
      className="roadmap-quests quest-overlay"
      data-enhanced="true"
      data-selected={questId}
      data-mode={modal ? "modal" : "tooltip"}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss();
      }}
    >
      <div className="quest-overlay-content">
        {modal ? (
          <button
            type="button"
            className="quest-close font-narrow"
            onClick={onDismiss}
          >
            <span aria-hidden="true">×</span> Close quest
          </button>
        ) : null}
        {children}
      </div>
    </dialog>,
    document.body,
  );
}
