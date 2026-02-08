import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { Project, Profile, Skill, Experience, SocialLink } from '@/types';
import { profile as defaultProfile, defaultProjects, skills as defaultSkills, experiences as defaultExperiences, ADMIN_PASSWORD } from '@/data/profile';
import {
  isSupabaseConfigured,
  getProfile,
  updateProfileInDb,
  getProjects,
  addProjectToDb,
  updateProjectInDb,
  deleteProjectFromDb,
  getSkills,
  addSkillToDb,
  updateSkillInDb,
  deleteSkillFromDb,
  getExperiences,
  addExperienceToDb,
  updateExperienceInDb,
  deleteExperienceFromDb,
  uploadBase64Image,
} from '@/services/supabaseService';

interface PortfolioContextType {
  // Data
  projects: Project[];
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];

  // Loading state
  isLoading: boolean;
  isSynced: boolean;

  // Admin state
  isAdmin: boolean;
  adminPassword?: string;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (password: string) => void;

  // Project CRUD
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Profile editing
  updateProfile: (updates: Partial<Profile>) => void;
  updateProfileImage: (imageUrl: string) => void;
  updateSocialLink: (platform: string, updates: Partial<SocialLink>) => void;

  // Skills CRUD
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (name: string, updates: Partial<Skill>) => void;
  deleteSkill: (name: string) => void;

  // Experience CRUD
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio-projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });

  const [currentProfile, setCurrentProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('portfolio-profile');
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('portfolio-skills');
    return saved ? JSON.parse(saved) : defaultSkills;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('portfolio-experiences');
    return saved ? JSON.parse(saved) : defaultExperiences;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const saved = localStorage.getItem('portfolio-admin');
    return saved === 'true';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('portfolio-password') || ADMIN_PASSWORD;
  });

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadFromSupabase() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        const [profileData, projectsData, skillsData, experiencesData] = await Promise.all([
          getProfile(),
          getProjects(),
          getSkills(),
          getExperiences(),
        ]);

        if (profileData) {
          setCurrentProfile(profileData);
          localStorage.setItem('portfolio-profile', JSON.stringify(profileData));
        }

        if (projectsData.length > 0) {
          setProjects(projectsData);
          localStorage.setItem('portfolio-projects', JSON.stringify(projectsData));
        }

        if (skillsData.length > 0) {
          setSkills(skillsData);
          localStorage.setItem('portfolio-skills', JSON.stringify(skillsData));
        }

        if (experiencesData.length > 0) {
          setExperiences(experiencesData);
          localStorage.setItem('portfolio-experiences', JSON.stringify(experiencesData));
        }

        setIsSynced(true);
      } catch (error) {
        console.error('Error loading from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFromSupabase();
  }, []);

  // Persist to localStorage (backup)
  useEffect(() => {
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio-profile', JSON.stringify(currentProfile));
  }, [currentProfile]);

  useEffect(() => {
    localStorage.setItem('portfolio-skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('portfolio-experiences', JSON.stringify(experiences));
  }, [experiences]);

  useEffect(() => {
    localStorage.setItem('portfolio-admin', String(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('portfolio-password', adminPassword);
  }, [adminPassword]);

  const login = (password: string): boolean => {
    if (password === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const changePassword = (password: string) => {
    setAdminPassword(password);
  };

  // Project CRUD
  const addProject = useCallback(async (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => [newProject, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const saved = await addProjectToDb(project);
        if (saved) {
          setProjects(prev => prev.map(p => p.id === newProject.id ? saved : p));
        } else {
          toast.error('Failed to save project to database. Please check your connection or permissions.');
        }
      } catch (error) {
        console.error('Error adding project:', error);
        toast.error('An unexpected error occurred while saving the project.');
      }
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );

    if (isSupabaseConfigured) {
      await updateProjectInDb(id, updates);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));

    if (isSupabaseConfigured) {
      await deleteProjectFromDb(id);
    }
  }, []);

  // Profile editing
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    // Handle image uploads
    let processedUpdates = { ...updates };

    if (isSupabaseConfigured) {
      if (updates.profileImage && updates.profileImage.startsWith('data:')) {
        const url = await uploadBase64Image(updates.profileImage, 'profile');
        if (url) processedUpdates.profileImage = url;
      }
      if (updates.logoImage && updates.logoImage.startsWith('data:')) {
        const url = await uploadBase64Image(updates.logoImage, 'logo');
        if (url) processedUpdates.logoImage = url;
      }
    }

    setCurrentProfile(prev => ({ ...prev, ...processedUpdates }));

    if (isSupabaseConfigured) {
      const success = await updateProfileInDb(processedUpdates);
      if (!success) {
        toast.error('Failed to update profile in database.');
      }
    }
  }, []);

  const updateProfileImage = useCallback(async (imageUrl: string) => {
    let finalUrl = imageUrl;

    if (isSupabaseConfigured && imageUrl.startsWith('data:')) {
      const url = await uploadBase64Image(imageUrl, 'profile');
      if (url) finalUrl = url;
    }

    setCurrentProfile(prev => ({ ...prev, profileImage: finalUrl }));

    if (isSupabaseConfigured) {
      await updateProfileInDb({ profileImage: finalUrl });
    }
  }, []);

  const updateSocialLink = useCallback(async (platform: string, updates: Partial<SocialLink>) => {
    setCurrentProfile(prev => {
      const existingLinkIndex = prev.socialLinks.findIndex(link => link.platform === platform);
      let newSocialLinks;

      if (existingLinkIndex >= 0) {
        // Update existing
        newSocialLinks = prev.socialLinks.map((link, index) =>
          index === existingLinkIndex ? { ...link, ...updates } : link
        );
      } else {
        // Add new (Upsert)
        // We need 'icon' and 'url' to be present if adding new, or at least 'url'
        newSocialLinks = [...prev.socialLinks, {
          platform,
          url: updates.url || '',
          icon: updates.icon || 'link'
        }];
      }

      const newProfile = {
        ...prev,
        socialLinks: newSocialLinks,
      };

      if (isSupabaseConfigured) {
        updateProfileInDb({ socialLinks: newProfile.socialLinks });
      }

      return newProfile;
    });
  }, []);

  // Skills CRUD
  const addSkill = useCallback(async (skill: Omit<Skill, 'id'>) => {
    setSkills(prev => [...prev, skill as Skill]);

    if (isSupabaseConfigured) {
      await addSkillToDb(skill);
    }
  }, []);

  const updateSkill = useCallback(async (name: string, updates: Partial<Skill>) => {
    setSkills(prev =>
      prev.map(s => (s.name === name ? { ...s, ...updates } : s))
    );

    if (isSupabaseConfigured) {
      await updateSkillInDb(name, updates);
    }
  }, []);

  const deleteSkill = useCallback(async (name: string) => {
    setSkills(prev => prev.filter(s => s.name !== name));

    if (isSupabaseConfigured) {
      await deleteSkillFromDb(name);
    }
  }, []);

  // Experience CRUD
  const addExperience = useCallback(async (experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString(),
    };
    setExperiences(prev => [newExperience, ...prev]);

    if (isSupabaseConfigured) {
      const saved = await addExperienceToDb(experience);
      if (saved) {
        setExperiences(prev => prev.map(e => e.id === newExperience.id ? saved : e));
      }
    }
  }, []);

  const updateExperience = useCallback(async (id: string, updates: Partial<Experience>) => {
    setExperiences(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );

    if (isSupabaseConfigured) {
      await updateExperienceInDb(id, updates);
    }
  }, []);

  const deleteExperience = useCallback(async (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));

    if (isSupabaseConfigured) {
      await deleteExperienceFromDb(id);
    }
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        profile: currentProfile,
        skills,
        experiences,
        isLoading,
        isSynced,
        isAdmin,
        adminPassword,
        login,
        logout,
        changePassword,
        addProject,
        updateProject,
        deleteProject,
        updateProfile,
        updateProfileImage,
        updateSocialLink,
        addSkill,
        updateSkill,
        deleteSkill,
        addExperience,
        updateExperience,
        deleteExperience,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
