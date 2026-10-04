/** One community quest; map coordinates preserve the original route and artwork. */
export interface RoadmapPhase {
  id: string;
  mark: string;
  numeral: string;
  title: string;
  description: string;
  items: { text: string; evaluation?: boolean }[];
  qualification?: string;
  position: { x: number; y: number };
}

/** Intrinsic map size shared by its original SVG layers and route. */
export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 625;

/** Approved quests retain legacy waypoint identifiers as incoming-link destinations. */
export const ROADMAP_PHASES: readonly RoadmapPhase[] = [
  {
    id: "awakening",
    mark: "01",
    numeral: "QUEST 01",
    title: "GET THE GUILD TOGETHER",
    description:
      "Launch $NILLA, open the tavern on X, and give the community its first home.",
    items: [
      { text: "Launch on LONG." },
      { text: "Publish the token details and fee breakdown." },
      { text: "Open the X Community." },
      { text: "Release a starter pack of memes and artwork." },
    ],
    position: { x: 25.5, y: 63.2 },
  },
  {
    id: "expansion",
    mark: "02",
    numeral: "QUEST 02",
    title: "MAKE SOME NEW STORIES",
    description: "Get names out of the chat and into the party.",
    items: [
      { text: "Host our first community WoW event." },
      { text: "Run a community meme contest." },
      { text: "Establish a recurring gathering players can plan around." },
      { text: "Share the best moments, screenshots, and terrible pulls." },
    ],
    position: { x: 46, y: 27.2 },
  },
  {
    id: "ascension",
    mark: "03",
    numeral: "QUEST 03",
    title: "EXPAND THE INVENTORY",
    description: "Build on what the guild actually uses.",
    items: [
      { text: "Publish a clear view of the vault and its activity." },
      { text: "Explore additional burn mechanics.", evaluation: true },
      {
        text: "Evaluate MSFT stock-token rewards for eligible holders.",
        evaluation: true,
      },
    ],
    qualification:
      "Future token features depend on technical feasibility and LONG support. We’ll publish the rules before anything goes live.",
    position: { x: 70, y: 60.8 },
  },
  {
    id: "eternal-realm",
    mark: "04",
    numeral: "QUEST 04",
    title: "THE GUILD TAKES THE LEAD",
    description: "The next adventure shouldn’t always come from us.",
    items: [
      { text: "Open community suggestions for events and challenges." },
      { text: "Run community polls to choose upcoming activities." },
      {
        text: "Support player-hosted gatherings across regions and time zones.",
      },
      { text: "Publish the next quests based on what the guild wants to do." },
    ],
    position: { x: 85, y: 22.4 },
  },
];
