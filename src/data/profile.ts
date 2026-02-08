import type { Profile, Experience, Skill, Project } from '@/types';

export const profile: Profile = {
  name: "Ahmed Abu Bakar",
  title: "Computer Science Student & Creative Designer",
  tagline: "Blending creativity with logic to build transformative digital experiences",
  email: "ahmedchad27@gmail.com",
  phone: "+8801789598935",
  location: "Dhaka, Bangladesh",
  bio: "I am a passionate learner and multidisciplinary thinker with a strong foundation in both programming and graphic design. My journey blends creativity with logic, whether I'm writing code to solve complex problems or designing visuals that communicate powerful stories. As an aspiring researcher, I am deeply interested in exploring the intersection of technology, data, and human impact.",
  socialLinks: [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/ahmed-abu-bakar-9a94b831b",
      icon: "linkedin"
    },
    {
      platform: "GitHub",
      url: "https://github.com/Ahmedbracu",
      icon: "github"
    },
    {
      platform: "Facebook",
      url: "https://facebook.com/share/1Gw2cbrRvt",
      icon: "facebook"
    }
  ]
};

export const experiences: Experience[] = [
  {
    id: "1",
    title: "Student Graphic Designer",
    organization: "Creative IT Institute",
    location: "Dhaka, Bangladesh",
    period: "2023 - Present",
    description: [
      "Designed logos, branding materials, and social media content using Adobe Illustrator and Photoshop",
      "Collaborated on real-life client projects and branding campaigns",
      "Gained experience with color theory, visual hierarchy, and typography"
    ],
    type: "work"
  },
  {
    id: "2",
    title: "Bachelor of Computer Science and Engineering",
    organization: "BRAC University",
    location: "Dhaka, Bangladesh",
    period: "May 2023 - Present",
    description: [
      "Pursuing undergraduate degree in Computer Science",
      "Focusing on programming fundamentals, data structures, and algorithms",
      "Active in coding projects and technical workshops"
    ],
    type: "education"
  },
  {
    id: "3",
    title: "Higher Secondary Certificate (HSC)",
    organization: "Dhaka Commerce College",
    location: "Dhaka, Bangladesh",
    period: "2020 - 2022",
    description: [
      "Completed higher secondary education",
      "Developed strong analytical and problem-solving skills"
    ],
    type: "education"
  },
  {
    id: "4",
    title: "Secondary School Certificate (SSC)",
    organization: "Little Flowers Preparatory School",
    location: "Dhaka, Bangladesh",
    period: "2018 - 2020",
    description: [
      "Completed secondary education with distinction",
      "Built foundation in mathematics and science"
    ],
    type: "education"
  }
];

export const skills: Skill[] = [
  // Programming Languages
  { name: "Java", level: 85, category: "programming", icon: "code" },
  { name: "Python", level: 75, category: "programming", icon: "code" },
  { name: "C", level: 60, category: "programming", icon: "code" },
  { name: "HTML/CSS", level: 80, category: "programming", icon: "layout" },
  
  // Concepts
  { name: "Data Structures", level: 80, category: "programming", icon: "database" },
  { name: "Algorithms", level: 75, category: "programming", icon: "cpu" },
  { name: "OOP", level: 85, category: "programming", icon: "box" },
  { name: "Git & GitHub", level: 70, category: "tools", icon: "git-branch" },
  
  // Design
  { name: "Adobe Illustrator", level: 90, category: "design", icon: "pen-tool" },
  { name: "Adobe Photoshop", level: 85, category: "design", icon: "image" },
  { name: "Branding", level: 88, category: "design", icon: "palette" },
  { name: "Typography", level: 82, category: "design", icon: "type" },
  { name: "UI Mockups", level: 75, category: "design", icon: "layout" },
  
  // Soft Skills
  { name: "Research", level: 85, category: "soft", icon: "search" },
  { name: "Leadership", level: 78, category: "soft", icon: "users" },
  { name: "Communication", level: 88, category: "soft", icon: "message-circle" },
  { name: "Problem Solving", level: 82, category: "soft", icon: "lightbulb" }
];

export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Business Card Design",
    description: "Professional business card designs for various clients with modern aesthetics and brand alignment.",
    category: "design",
    technologies: ["Adobe Illustrator", "Adobe Photoshop"],
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Logo Design Collection",
    description: "Custom logo designs that capture brand essence and create memorable visual identities.",
    category: "design",
    technologies: ["Adobe Illustrator"],
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    title: "Social Media Campaign",
    description: "Eye-catching social media graphics and campaign materials for brand promotion.",
    category: "design",
    technologies: ["Adobe Photoshop", "Adobe Illustrator"],
    createdAt: "2024-01-05"
  },
  {
    id: "4",
    title: "T-Shirt Design Series",
    description: "Creative t-shirt designs with unique illustrations and typography for print-ready mockups.",
    category: "design",
    technologies: ["Adobe Illustrator", "DTF Printing"],
    createdAt: "2023-12-20"
  },
  {
    id: "5",
    title: "Weather Application",
    description: "A Java-based weather application that fetches current weather data using OpenWeatherMap API.",
    category: "programming",
    link: "https://ahmedbracu.github.io/WeatherApp.github.io/",
    technologies: ["Java", "API Integration", "JSON"],
    createdAt: "2023-11-15"
  },
  {
    id: "6",
    title: "Data Structures Implementation",
    description: "Java implementations of fundamental data structures including Queues, Stacks, Trees, and Heaps.",
    category: "programming",
    technologies: ["Java", "Algorithms"],
    createdAt: "2023-10-20"
  },
  {
    id: "7",
    title: "UI/UX Design Portfolio",
    description: "Collection of UI/UX designs that make digital products simple, usable, and visually engaging.",
    category: "uiux",
    technologies: ["Figma", "Adobe XD"],
    createdAt: "2023-09-10"
  },
  {
    id: "8",
    title: "Brand Identity Package",
    description: "Complete brand identity design including letterhead, envelope, and invoice templates.",
    category: "design",
    technologies: ["Adobe Illustrator", "Adobe InDesign"],
    createdAt: "2023-08-15"
  }
];

export const ADMIN_PASSWORD = "ahmed2024";
