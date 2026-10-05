import { MsftProvider } from "./common/msft-provider";
import "./intro/music.css";
import "./common/project.css";
import "./hero/logo.css";
import "./common/navigation.css";
import "./common/footer.css";
import "./hero/hero.css";
import "./why/why.css";
import "./common/coin.css";
import "./about/about.css";
import "./common/bars.css";
import "./hero/achievement.css";
import "./lore/lore.css";
import "./community/community.css";
import "./avatar/avatar.css";
import "./intro/intro.css";
import "./token/token.css";
import "./token/vault.css";
import "./common/reduced-motion.css";
import { Artwork } from "@/modules/common/artwork";
import { Experience } from "@/modules/index/intro/experience";
import { QueueScene } from "@/modules/index/intro/queue-scene";
import { Navigation } from "@/modules/index/common/navigation";
import { HeroSection } from "@/modules/index/hero/hero-section";
import { WhySection } from "@/modules/index/why/why-section";
import { AboutSection } from "@/modules/index/about/about-section";
import { TokenSection } from "@/modules/index/token/token-section";
import { GuildVault } from "@/modules/index/token/guild-vault";
import { LoreSection } from "@/modules/index/lore/lore-section";
import { CommunitySection } from "@/modules/index/community/community-section";
import { AvatarSection } from "@/modules/index/avatar/avatar-section";
import { Footer } from "@/modules/index/common/footer";
import { ScrollProgress } from "@/modules/index/common/navigation";

/** Composes server-rendered sections inside the shared intro and audio lifecycle. */
export function IndexPage() {
  return (
    <>
      <Artwork />
      <MsftProvider>
        <Experience scene={<QueueScene />}>
          <Navigation />
          <HeroSection />
          <WhySection />
          <AboutSection />
          <TokenSection />
          <GuildVault />
          <LoreSection />
          <CommunitySection />
          <AvatarSection />
          <Footer />
          <ScrollProgress />
        </Experience>
      </MsftProvider>
    </>
  );
}
