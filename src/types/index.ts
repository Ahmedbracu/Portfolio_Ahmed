export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'design' | 'programming' | 'uiux';
  image?: string;
  link?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  createdAt: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'programming' | 'design' | 'tools' | 'soft';
  icon?: string;
}

export interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  type: 'work' | 'education';
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage?: string;
  logoImage?: string;
  socialLinks: SocialLink[];
}

export interface AdminState {
  isAuthenticated: boolean;
  password: string;
}
