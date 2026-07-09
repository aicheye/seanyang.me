import projects from '@public/data/projects.json'

export interface Project {
  title: string;
  description: string;
  github: string;
  technologies: string[];
  /** Path (under /public) to a GIF or image demo shown in the modal. */
  media?: string;
  /**
   * For GIFs: length of one play-through in seconds. When set, the modal
   * auto-closes after this long. Omit for static images (they stay open
   * until the user closes them).
   */
  mediaDuration?: number;
}

export default projects as Project[]
