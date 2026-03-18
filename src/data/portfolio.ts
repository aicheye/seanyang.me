interface Project {
  title: string;
  description: string;
  github: string;
  languages: string[];
}

const portfolio: Project[] = [
  {
    title: "swarm_ws",
    description: "decentralized robotic swarm maze solver",
    github: "https://github.com/RRohan4/swarm_ws",
    languages: ["C++", "ROS 2", "Docker"],
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
    languages: ["Python"],
  },
  {
    title: "aicheye's Combat Tagging",
    description: "minecraft mod with 1k+ downloads",
    github: "https://github.com/aicheye/combat-tag",
    languages: ["Java"],
  },
];

export default portfolio;
