export interface TopicConfig {
  title: string;
  directory: string;
  icon: string;
  description: string;
}

export const contentConfig: Record<string, TopicConfig> = {
  software: {
    title: "Software Blog",
    directory: "software_blog",
    icon: "BookOpenIcon",
    description: "I write about software development, technology trends, and lessons learned from building applications."
  },
  football: {
    title: "Football Blog",
    directory: "football_blog",
    icon: "Volleyball",
    description: "My thoughts and analysis on football, tactics, and the beautiful game."
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
