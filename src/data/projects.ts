// Single source of truth lives in public/data so the data is also served
// statically over HTTP (e.g. for the SSH TUI at tui.seanyang.me).
import projects from '../../public/data/projects.json'

export interface Project {
  title: string;
  description: string;
  github: string;
  technologies: string[];
}

export default projects as Project[]
