interface Job {
  title: string;
  company: string;
  description: string;
  website: string;
  logo: string;
  location: string;
  technologies: string[];
  dates: string[];
  current: boolean;
}

const jobs: Job[] = [
  {
    title: "Robotics Intern",
    company: "moss",
    description: "perception for outdoor robotics",
    website: "https://moss.ag/",
    logo: "/assets/jobs/moss.jpg",
    location: "San Francisco, California",
    technologies: [],
    dates: ["inc. 2026.5"],
    current: false,
  },
  {
    title: "Robotics SWE",
    company: "WATonomous",
    description: "prediction pipelines for autonomous vehicles",
    website: "https://watonomous.ca/projects/eve",
    logo: "/assets/jobs/watonomous.jpg",
    location: "Waterloo, Ontario",
    technologies: ["C++", "ROS 2", "Docker", "Foxglove"],
    dates: ["2025.9", "present"],
    current: true,
  },
];

export default jobs;
