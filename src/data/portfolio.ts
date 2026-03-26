interface Project {
  title: string;
  description: string;
  github: string;
  languages: string[];
}

const portfolio: Project[] = [
  {
    title: "swarm_ws",
    description: "robotic swarm maze exploration",
    github: "https://github.com/RRohan4/swarm_ws",
    languages: ["Python", "ROS 2", "Docker"],
  },
  {
    title: "CRusTTY",
    description: "tui c interpreter from scratch",
    github: "https://github.com/aicheye/crustty",
    languages: ["Rust", "C"],
  },
  {
    title: "Wunder RNN Challenge",
    description: "top 5% market prediction model",
    github: "https://github.com/aicheye/wundernn",
    languages: ["Python", "ML", "Jupyter"],
  },
  {
    title: "aicheye's Combat Tagging",
    description: "minecraft mod w/ 1k+ downloads",
    github: "https://github.com/aicheye/combat-tag",
    languages: ["Java", "Gradle"],
  },
  {
    title: "Bucket",
    description: "intuitive student dashboard",
    github: "https://github.com/aicheye/bucket",
    languages: ["TypeScript", "React", "GraphQL"],
  },
  {
    title: "ezp2p Arcade",
    description: "p2p serverless minigames",
    github: "https://github.com/aicheye/ezp2p",
    languages: ["TypeScript", "Vite", "WebRTC"],
  },
];

export default portfolio;
