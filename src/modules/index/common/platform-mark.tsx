/** Reuses compact platform marks in the shared launch links while preserving Wownilla's palette. */
export function PlatformMark({ platform }: { platform: "long" | "robinhood" }) {
  if (platform === "robinhood") {
    return (
      <span className="platform-mark robinhood-mark" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.84 24h.53c.096 0 .192-.048.224-.128C7.591 13.696 11.94 8.656 14.67 5.638c.112-.128.064-.225-.096-.225h-4.88a.55.55 0 0 0-.45.225L5.746 9.972c-.514.642-.642 1.236-.642 2.086v4.43c-1.14 3.194-1.862 5.361-2.392 7.32-.032.125.016.192.129.192M20.447.646c-.754-.802-4.157-.834-5.73-.224a3 3 0 0 0-.786.465 41 41 0 0 0-3.323 3.178c-.112.113-.064.225.097.225h5.409c.497 0 .786.289.786.786v6.1c0 .16.128.208.225.064l3.258-4.254c.53-.69.69-.898.835-1.861.192-1.413.08-3.58-.77-4.479m-6.982 16.18 2.231-3.676a.7.7 0 0 0 .064-.29V6.73c0-.16-.112-.225-.224-.097-3.355 3.74-5.971 7.672-8.395 12.407-.06.12.016.225.16.177l5.009-1.54c.565-.174.882-.402 1.155-.852" />
        </svg>
      </span>
    );
  }
  return (
    <svg
      className="platform-mark long-mark"
      width="43"
      height="15"
      viewBox="0 0 94 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 1h5v17h12v5H0V1Z" />
      <path d="M29 0c-8 0-12 5-12 12s4 12 12 12v-5c-4 0-7-3-7-7s3-7 7-7V0Zm4 0v5c4 0 7 3 7 7s-3 7-7 7v5c8 0 12-5 12-12S41 0 33 0Z" />
      <path d="M49 1h5l12 14V1h5v22h-5L54 9v14h-5V1Z" />
      <path d="m94 4-3 4c-2-2-4-3-6-3-4 0-7 3-7 7s3 7 7 7c2 0 3 0 5-1v-3h-6v-4h11v10c-3 2-6 3-10 3-7 0-12-5-12-12S78 0 85 0c4 0 7 1 9 4Z" />
    </svg>
  );
}
