"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Sends visitors of a shared avatar link on to the forge. The hop happens in
 * the browser because a server redirect would hide this page's share-card
 * metadata from link crawlers.
 */
export function AvatarRedirect({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(href);
  }, [href, router]);
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <a className="btn btn-gold px-6 py-4 text-xs" href={href}>
        Open the avatar forge
      </a>
    </main>
  );
}
