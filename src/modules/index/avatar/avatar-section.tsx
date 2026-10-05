import { AvatarStudio } from "./avatar-studio";

/** Closes the landing with the avatar forge; copy stays server rendered. */
export function AvatarSection() {
  return (
    <section
      id="avatar"
      className="avatar-section"
      aria-labelledby="avatar-title"
    >
      <div className="avatar-content">
        <p className="eyebrow">Wowow</p>
        <h2 id="avatar-title" className="font-friz text-parch">
          Forge your face.
        </h2>
        <p className="avatar-description text-parch2">
          Build a guild portrait layer by layer, then download it or post it
          on X.
        </p>
        <AvatarStudio />
      </div>
    </section>
  );
}
