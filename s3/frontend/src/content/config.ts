export interface TopicConfig {
  title: string;
  directory: string;
  icon: string;
  description: string;
}

export const contentConfig: Record<string, TopicConfig> = {
  software: {
    title: "Software Engineering Notes",
    directory: "software_blog",
    icon: "BookOpenIcon",
    description: "Reflections on building and leading in the cloud era, from AI-first experiments to hard-earned lessons in delivering scalable, resilient systems."
  },
  football: {
    title: "Football Notes",
    directory: "football_blog",
    icon: "Volleyball",
    description: "Reflections and thoughts about my journey in amateur football, both as a master team player and captain, and as a junior coach."
  },
  projects: {
    title: "Projects", 
    directory: "projects",
    icon: "CodeIcon",
    description: "Here are some of the projects I've built and contributed to."
  },
  about: {
    title: "About",
    directory: "about", 
    icon: "UserIcon",
    description: "Hello! I'm Roberto, a passionate software engineer with a love for building innovative solutions."
  }
};
