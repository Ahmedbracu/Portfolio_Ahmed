import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Profile, Project, Skill, Experience } from '@/types';

// ============ PROFILE ============

export async function getProfile(): Promise<Profile | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data ? mapProfileFromDb(data) : null;
}

export async function updateProfileInDb(profile: Partial<Profile>): Promise<boolean> {
    if (!supabase) return false;

    const dbData = mapProfileToDb(profile);

    const { error } = await supabase
        .from('profile')
        .update(dbData)
        .eq('id', (await supabase.from('profile').select('id').single()).data?.id);

    if (error) {
        console.error('Error updating profile:', error);
        return false;
    }

    return true;
}

// ============ PROJECTS ============

export async function getProjects(): Promise<Project[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return data?.map(mapProjectFromDb) || [];
}

export async function addProjectToDb(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project | null> {
    if (!supabase) return null;

    const dbData = {
        title: project.title,
        description: project.description,
        category: project.category,
        image: project.image || '',
        link: project.link || '',
        live_url: project.liveUrl || '',
        github_url: project.githubUrl || '',
        technologies: project.technologies,
    };

    const { data, error } = await supabase
        .from('projects')
        .insert(dbData)
        .select()
        .single();

    if (error) {
        console.error('Error adding project:', error);
        return null;
    }

    return mapProjectFromDb(data);
}

export async function updateProjectInDb(id: string, updates: Partial<Project>): Promise<boolean> {
    if (!supabase) return false;

    const dbData: Record<string, unknown> = {};
    if (updates.title !== undefined) dbData.title = updates.title;
    if (updates.description !== undefined) dbData.description = updates.description;
    if (updates.category !== undefined) dbData.category = updates.category;
    if (updates.image !== undefined) dbData.image = updates.image;
    if (updates.link !== undefined) dbData.link = updates.link;
    if (updates.liveUrl !== undefined) dbData.live_url = updates.liveUrl;
    if (updates.githubUrl !== undefined) dbData.github_url = updates.githubUrl;
    if (updates.technologies !== undefined) dbData.technologies = updates.technologies;

    const { error } = await supabase
        .from('projects')
        .update(dbData)
        .eq('id', id);

    if (error) {
        console.error('Error updating project:', error);
        return false;
    }

    return true;
}

export async function deleteProjectFromDb(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting project:', error);
        return false;
    }

    return true;
}

// ============ SKILLS ============

export async function getSkills(): Promise<Skill[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching skills:', error);
        return [];
    }

    return data?.map(mapSkillFromDb) || [];
}

export async function addSkillToDb(skill: Omit<Skill, 'id'>): Promise<Skill | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('skills')
        .insert({
            name: skill.name,
            level: skill.level,
            category: skill.category,
            icon: skill.icon || 'code',
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding skill:', error);
        return null;
    }

    return mapSkillFromDb(data);
}

export async function updateSkillInDb(name: string, updates: Partial<Skill>): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('skills')
        .update(updates)
        .eq('name', name);

    if (error) {
        console.error('Error updating skill:', error);
        return false;
    }

    return true;
}

export async function deleteSkillFromDb(name: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('skills')
        .delete()
        .eq('name', name);

    if (error) {
        console.error('Error deleting skill:', error);
        return false;
    }

    return true;
}

// ============ EXPERIENCES ============

export async function getExperiences(): Promise<Experience[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching experiences:', error);
        return [];
    }

    return data?.map(mapExperienceFromDb) || [];
}

export async function addExperienceToDb(exp: Omit<Experience, 'id'>): Promise<Experience | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('experiences')
        .insert({
            title: exp.title,
            organization: exp.organization,
            location: exp.location,
            period: exp.period,
            description: exp.description,
            type: exp.type,
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding experience:', error);
        return null;
    }

    return mapExperienceFromDb(data);
}

export async function updateExperienceInDb(id: string, updates: Partial<Experience>): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('experiences')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating experience:', error);
        return false;
    }

    return true;
}

export async function deleteExperienceFromDb(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting experience:', error);
        return false;
    }

    return true;
}

// ============ IMAGE UPLOAD ============

export async function uploadImage(file: File, path: string): Promise<string | null> {
    if (!supabase) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, { upsert: true });

    if (error) {
        console.error('Error uploading image:', error);
        return null;
    }

    const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export async function uploadBase64Image(base64: string, path: string): Promise<string | null> {
    if (!supabase) return null;

    // Convert base64 to blob
    const base64Data = base64.split(',')[1];
    if (!base64Data) return base64; // Return original if not valid base64

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    const fileName = `${path}-${Date.now()}.jpg`;
    const filePath = `${path}/${fileName}`;

    const { error } = await supabase.storage
        .from('portfolio')
        .upload(filePath, blob, { upsert: true });

    if (error) {
        console.error('Error uploading base64 image:', error);
        return null;
    }

    const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

// ============ HELPER: Check if configured ============

export { isSupabaseConfigured };

// ============ MAPPERS ============

function mapProfileFromDb(data: Record<string, unknown>): Profile {
    return {
        name: data.name as string || '',
        title: data.title as string || '',
        tagline: data.tagline as string || '',
        email: data.email as string || '',
        phone: data.phone as string || '',
        location: data.location as string || '',
        bio: data.bio as string || '',
        profileImage: data.profile_image as string || '',
        logoImage: data.logo_image as string || '',
        socialLinks: (data.social_links as Profile['socialLinks']) || [],
    };
}

function mapProfileToDb(profile: Partial<Profile>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (profile.name !== undefined) result.name = profile.name;
    if (profile.title !== undefined) result.title = profile.title;
    if (profile.tagline !== undefined) result.tagline = profile.tagline;
    if (profile.email !== undefined) result.email = profile.email;
    if (profile.phone !== undefined) result.phone = profile.phone;
    if (profile.location !== undefined) result.location = profile.location;
    if (profile.bio !== undefined) result.bio = profile.bio;
    if (profile.profileImage !== undefined) result.profile_image = profile.profileImage;
    if (profile.logoImage !== undefined) result.logo_image = profile.logoImage;
    if (profile.socialLinks !== undefined) result.social_links = profile.socialLinks;
    result.updated_at = new Date().toISOString();
    return result;
}

function mapProjectFromDb(data: Record<string, unknown>): Project {
    return {
        id: data.id as string,
        title: data.title as string || '',
        description: data.description as string || '',
        category: data.category as Project['category'] || 'programming',
        image: data.image as string || '',
        link: data.link as string || '',
        liveUrl: data.live_url as string || '',
        githubUrl: data.github_url as string || '',
        technologies: (data.technologies as string[]) || [],
        createdAt: data.created_at as string || new Date().toISOString(),
    };
}

function mapSkillFromDb(data: Record<string, unknown>): Skill {
    return {
        name: data.name as string || '',
        level: data.level as number || 50,
        category: data.category as Skill['category'] || 'programming',
        icon: data.icon as string || 'code',
    };
}

function mapExperienceFromDb(data: Record<string, unknown>): Experience {
    return {
        id: data.id as string,
        title: data.title as string || '',
        organization: data.organization as string || '',
        location: data.location as string || '',
        period: data.period as string || '',
        description: (data.description as string[]) || [],
        type: data.type as Experience['type'] || 'work',
    };
}
