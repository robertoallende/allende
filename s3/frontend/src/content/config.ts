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
    description: "Reflections on making software in the cloud."
  },
  football: {
    title: "Football Notes",
    directory: "football_blog",
    icon: "Volleyball",
    description: "About my journey in amateur football."
  },
  projects: {
    title: "Projects", 
    directory: "projects",
    icon: "CodeIcon",
    description: "Projects I have been involved with recently."
  },
  about: {
    title: "About",
    directory: "about", 
    icon: "UserIcon",
    description: "I love making things—apps, platforms, and even football teams."
  }
};
