import { projectDestinations } from "./site-config";

const socials = [
  {
    key: "x",
    label: "X",
    path: "M18.9 2h3.3l-7.2 8.3L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.9L.5 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.8L6.4 3.9H4.5L17.7 20Z",
  },
];

/** Shows recognizable social marks in Wownilla's gold framing, with quiet placeholders for missing invites. */
export function SocialLinks() {
  const links = projectDestinations();
  return (
    <div
      className="social-links flex items-center gap-2"
      role="group"
      aria-label="Social channels"
    >
      {socials.map((social) => {
        const href =
          social.key === "x"
            ? links.x
            : social.key === "telegram"
              ? links.telegram
              : links.discord;
        const icon = (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={social.path} />
          </svg>
        );
        return href ? (
          <a
            key={social.key}
            className="social-link btn btn-dark"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow on ${social.label}`}
            title={social.label}
          >
            {icon}
          </a>
        ) : (
          <button
            key={social.key}
            type="button"
            className="social-link btn btn-dark"
            disabled
            aria-label={`${social.label} · coming soon`}
            title={`${social.label} · coming soon`}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
