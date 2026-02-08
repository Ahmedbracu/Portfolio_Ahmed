import { useState, useRef, useCallback, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Code2,
  Briefcase,
  FolderOpen,
  Link as LinkIcon,
  Plus,
  Pencil,
  Trash2,
  Save,
  Image as ImageIcon,
  MapPin,
  Linkedin,
  Upload,
  Shield,
  Menu,
  X,
  ZoomIn,
  ZoomOut,
  Check,
  Github,
  Gitlab,
  Layers,
  Codepen,
  Dribbble,
  Pin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Video,
  Ghost,
  MessageCircle,
  Gamepad2,
  Phone,
  Send,
  BookOpen,
  Twitch,
  Music,
  CloudLightning,
  Globe,
  Mail,
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import type { Skill, Experience, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AdminTab = 'profile' | 'skills' | 'experience' | 'projects' | 'social' | 'logo' | 'security';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Utility to create the cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.resolve('');
  }

  // set canvas size to match the bounding box
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
}

// Helper function to convert file to base64 (for initial load)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'profile' as AdminTab, label: 'Profile', icon: User },
    { id: 'skills' as AdminTab, label: 'Skills', icon: Code2 },
    { id: 'experience' as AdminTab, label: 'Experience', icon: Briefcase },
    { id: 'projects' as AdminTab, label: 'Projects', icon: FolderOpen },
    { id: 'social' as AdminTab, label: 'Social Links', icon: LinkIcon },
    { id: 'logo' as AdminTab, label: 'Logo', icon: ImageIcon },
    { id: 'security' as AdminTab, label: 'Security', icon: Shield },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        className="!fixed !left-0 !top-0 !translate-x-0 !translate-y-0 !m-0 w-screen h-screen max-w-none rounded-none border-0 md:!fixed md:!top-1/2 md:!left-1/2 md:!-translate-x-1/2 md:!-translate-y-1/2 md:!w-[87.5vw] md:!h-[85vh] md:!max-w-none md:!rounded-xl md:border md:border-dark-200 bg-dark-100 text-white p-0 overflow-hidden"
      >
        {/* PC Close Button - Always visible on larger screens */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute top-4 right-4 z-[100] h-8 w-8 items-center justify-center rounded-lg bg-dark-200 text-muted-foreground hover:bg-dark-100 hover:text-white transition-colors"
          title="Close admin panel"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-full flex-col md:flex-row relative">

          {/* Mobile Header - High Z-Index ensuring it's above content */}
          <div className="relative z-50 flex items-center justify-between border-b border-dark-200 bg-dark p-4 md:hidden">
            <h2 className="font-display text-lg font-semibold text-white">
              Admin Panel
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle menu">
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} title="Close admin panel">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            absolute top-[60px] bottom-0 left-0 z-40 w-64 bg-dark p-4 border-r border-dark-200 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:top-0 md:relative md:translate-x-0 md:w-56 md:flex md:flex-col md:static
          `}>
            {/* Mobile Close Button (inside sidebar) */}
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h2 className="font-display text-lg font-semibold text-white">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Header */}
            <div className="hidden items-center justify-between mb-6 md:flex">
              <h2 className="font-display text-lg font-semibold text-white">
                Admin Panel
              </h2>
            </div>

            <nav className="space-y-1 overflow-y-auto flex-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-sm transition-colors text-left ${activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-dark-200 hover:text-white'
                      }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content - Full Height Container */}
          <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
            {/* Scrollable Content Area - Explicit scroll setup */}
            <div
              className="h-full w-full overflow-y-auto overflow-x-hidden"
              style={{
                maxHeight: '100%',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}
              data-lenis-prevent
            >
              <div className="p-4 sm:p-6 pb-20 md:pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'profile' && <ProfileEditor />}
                    {activeTab === 'skills' && <SkillsEditor />}
                    {activeTab === 'experience' && <ExperienceEditor />}
                    {activeTab === 'projects' && <ProjectsEditor />}
                    {activeTab === 'social' && <SocialLinksEditor />}
                    {activeTab === 'logo' && <LogoEditor />}
                    {activeTab === 'security' && <SecurityEditor />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Image Upload Component with Cropper
interface ImageUploadProps {
  currentImage: string;
  onImageChange: (base64: string) => void;
  label: string;
}

function ImageUpload({ currentImage, onImageChange, label }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await fileToBase64(file);
      setImageSrc(imageDataUrl);
      setIsCropping(true);
    }
  };

  const handleCropSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onImageChange(croppedImage);
        setIsCropping(false);
        setImageSrc(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium text-white">{label}</Label>

      {/* Cropper Modal Overlay */}
      <AnimatePresence>
        {isCropping && imageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          >
            <div className="w-full max-w-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Crop Image</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsCropping(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-dark-200">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <ZoomOut className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[zoom]}
                    min={1}
                    max={3}
                    step={0.1}
                    onValueChange={(value) => setZoom(value[0])}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsCropping(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-accent"
                    onClick={handleCropSave}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Save Crop
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-6 p-4 border border-dark-200 rounded-xl bg-dark/50">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-dark-200 bg-dark shadow-xl">
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto border-dark-200 hover:bg-dark-100"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Image
          </Button>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG. Max 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}

// Profile Editor
function ProfileEditor() {
  const { profile, updateProfile, updateProfileImage } = usePortfolio();
  const [formData, setFormData] = useState({
    name: profile.name,
    title: profile.title,
    tagline: profile.tagline,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    bio: profile.bio,
  });

  const handleSave = () => {
    updateProfile(formData);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-dark-100 pb-4 border-b border-dark-200 z-10">
        <h3 className="font-display text-xl font-semibold">Edit Profile</h3>
        <Button onClick={handleSave} className="bg-gradient-accent">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        <ImageUpload
          label="Profile Photo"
          currentImage={profile.profileImage || '/profile.jpg'}
          onImageChange={updateProfileImage}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-base">Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Tagline</Label>
          <Input
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="border-dark-200 bg-dark text-white p-3 h-auto"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-base">Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base">Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Bio</Label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="min-h-[150px] border-dark-200 bg-dark text-white p-4"
          />
        </div>
      </div>
    </div>
  );
}

// LogoEditor
function LogoEditor() {
  const { profile, updateProfile } = usePortfolio();
  const [logoImage, setLogoImage] = useState(profile.logoImage || '');

  const handleSave = () => {
    updateProfile({ logoImage });
    toast.success('Logo updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-dark-100 pb-4 border-b border-dark-200 z-10">
        <h3 className="font-display text-xl font-semibold">Edit Logo</h3>
        <Button onClick={handleSave} className="bg-gradient-accent">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        <ImageUpload
          label="Site Logo (replaces the 'A' icon)"
          currentImage={logoImage}
          onImageChange={setLogoImage}
        />

        <div className="rounded-xl border border-dark-200 bg-dark p-4">
          <p className="text-sm text-muted-foreground mb-3">Preview:</p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent overflow-hidden">
              {logoImage ? (
                <img src={logoImage} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-lg font-bold text-white">A</span>
              )}
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Ahmed</h3>
              <p className="text-xs text-muted-foreground">Portfolio</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Upload a square image for best results. Recommended size: 100x100 pixels.
        </p>
      </div>
    </div>
  );
}

// Skills Editor
function SkillsEditor() {
  const { skills, addSkill, updateSkill, deleteSkill } = usePortfolio();
  const [isAdding, setIsAdding] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addSkill({
      name: formData.get('name') as string,
      level: parseInt(formData.get('level') as string),
      category: formData.get('category') as 'programming' | 'design' | 'tools' | 'soft',
      icon: formData.get('icon') as string || 'code',
    });
    setIsAdding(false);
    toast.success('Skill added successfully!');
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSkill) return;
    const formData = new FormData(e.currentTarget);
    updateSkill(editingSkill.name, {
      name: formData.get('name') as string,
      level: parseInt(formData.get('level') as string),
      category: formData.get('category') as 'programming' | 'design' | 'tools' | 'soft',
      icon: formData.get('icon') as string,
    });
    setEditingSkill(null);
    toast.success('Skill updated successfully!');
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryLabels: Record<string, string> = {
    programming: 'Programming',
    design: 'Design',
    tools: 'Tools',
    soft: 'Soft Skills',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-dark-100 pb-4 border-b border-dark-200 z-10">
        <h3 className="font-display text-xl font-semibold">Manage Skills</h3>
        <Button onClick={() => setIsAdding(true)} className="bg-gradient-accent">
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              {categoryLabels[category] || category}
            </h4>
            <div className="space-y-3">
              {categorySkills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center justify-between rounded-lg border border-dark-200 bg-dark p-3"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-white truncate">{skill.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="h-2 w-20 sm:w-24 overflow-hidden rounded-full bg-dark-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-violet"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10">{skill.level}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-dark-200 hover:text-white"
                      title="Edit skill"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.name)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/20 hover:text-red-500"
                      title="Delete skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="border-dark-200 bg-dark-100 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Skill Name</Label>
              <Input name="name" required className="border-dark-200 bg-dark text-white" />
            </div>
            <div>
              <Label>Proficiency Level (0-100)</Label>
              <Input
                name="level"
                type="number"
                min="0"
                max="100"
                required
                className="border-dark-200 bg-dark text-white"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select name="category" required>
                <SelectTrigger className="border-dark-200 bg-dark text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-dark-200 bg-dark-100">
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="soft">Soft Skills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Icon (optional)</Label>
              <Input name="icon" className="border-dark-200 bg-dark text-white" placeholder="code" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-accent">Add Skill</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={!!editingSkill} onOpenChange={() => setEditingSkill(null)}>
        <DialogContent className="border-dark-200 bg-dark-100 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          {editingSkill && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label>Skill Name</Label>
                <Input
                  name="name"
                  defaultValue={editingSkill.name}
                  required
                  className="border-dark-200 bg-dark text-white"
                />
              </div>
              <div>
                <Label>Proficiency Level (0-100)</Label>
                <Input
                  name="level"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={editingSkill.level}
                  required
                  className="border-dark-200 bg-dark text-white"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select name="category" defaultValue={editingSkill.category}>
                  <SelectTrigger className="border-dark-200 bg-dark text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-dark-200 bg-dark-100">
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="soft">Soft Skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Icon</Label>
                <Input
                  name="icon"
                  defaultValue={editingSkill.icon}
                  className="border-dark-200 bg-dark text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingSkill(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-accent">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Experience Editor
function ExperienceEditor() {
  const { experiences, deleteExperience, addExperience, updateExperience } = usePortfolio();
  const [isAdding, setIsAdding] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addExperience({
      title: formData.get('title') as string,
      organization: formData.get('organization') as string,
      location: formData.get('location') as string,
      period: formData.get('period') as string,
      description: (formData.get('description') as string).split('\n').filter(Boolean),
      type: formData.get('type') as 'work' | 'education',
    });
    setIsAdding(false);
    toast.success('Experience added successfully!');
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExp) return;
    const formData = new FormData(e.currentTarget);
    updateExperience(editingExp.id, {
      title: formData.get('title') as string,
      organization: formData.get('organization') as string,
      location: formData.get('location') as string,
      period: formData.get('period') as string,
      description: (formData.get('description') as string).split('\n').filter(Boolean),
      type: formData.get('type') as 'work' | 'education',
    });
    setEditingExp(null);
    toast.success('Experience updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-dark-100 pb-4 border-b border-dark-200 z-10">
        <h3 className="font-display text-xl font-semibold">Manage Experience</h3>
        <Button onClick={() => setIsAdding(true)} className="bg-gradient-accent">
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-8">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="rounded-xl border border-dark-200 bg-dark p-4 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-white text-lg">{exp.title}</h4>
                <div className="flex items-center gap-2 text-primary mt-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{exp.organization}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingExp(exp)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-dark-200 hover:text-white"
                  title="Edit experience"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteExperience(exp.id)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/20 hover:text-red-500"
                  title="Delete experience"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-dark-200/50 px-2 py-1 rounded">
                <MapPin className="h-3 w-3" />
                <span>{exp.location}</span>
              </div>
              <span>•</span>
              <span className="bg-dark-200/50 px-2 py-1 rounded">{exp.period}</span>
            </div>

            <div className="text-muted-foreground text-sm leading-relaxed border-t border-dark-200 pt-3">
              <ul className="list-disc pl-4 space-y-1">
                {exp.description.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-dark-200 rounded-xl">
            No experience added yet. Click the button above to add one.
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-lg border-dark-200 bg-dark-100 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <Label>Title/Position</Label>
              <Input name="title" required className="border-dark-200 bg-dark text-white p-3 h-auto" />
            </div>
            <div className="space-y-2">
              <Label>Organization/School</Label>
              <Input name="organization" required className="border-dark-200 bg-dark text-white p-3 h-auto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" required className="border-dark-200 bg-dark text-white p-3 h-auto" />
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <Input name="period" required className="border-dark-200 bg-dark text-white p-3 h-auto" placeholder="2023 - Present" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select name="type" required>
                <SelectTrigger className="border-dark-200 bg-dark text-white p-3 h-auto">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="border-dark-200 bg-dark-100 text-white">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (one per line)</Label>
              <Textarea
                name="description"
                className="border-dark-200 bg-dark text-white p-3 h-auto min-h-[100px]"
                placeholder="Description points..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-accent">Add</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingExp} onOpenChange={() => setEditingExp(null)}>
        <DialogContent className="max-w-lg border-dark-200 bg-dark-100 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
          </DialogHeader>
          {editingExp && (
            <form onSubmit={handleEdit} className="space-y-6">
              <div className="space-y-2">
                <Label>Title/Position</Label>
                <Input
                  name="title"
                  defaultValue={editingExp.title}
                  required
                  className="border-dark-200 bg-dark text-white p-3 h-auto"
                />
              </div>
              <div className="space-y-2">
                <Label>Organization/School</Label>
                <Input
                  name="organization"
                  defaultValue={editingExp.organization}
                  required
                  className="border-dark-200 bg-dark text-white p-3 h-auto"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    name="location"
                    defaultValue={editingExp.location}
                    required
                    className="border-dark-200 bg-dark text-white p-3 h-auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Input
                    name="period"
                    defaultValue={editingExp.period}
                    required
                    className="border-dark-200 bg-dark text-white p-3 h-auto"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select name="type" defaultValue={editingExp.type}>
                  <SelectTrigger className="border-dark-200 bg-dark text-white p-3 h-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-dark-200 bg-dark-100 text-white">
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description (one per line)</Label>
                <Textarea
                  name="description"
                  defaultValue={editingExp.description.join('\n')}
                  className="border-dark-200 bg-dark text-white p-3 h-auto min-h-[100px]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingExp(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-accent">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Projects Editor
function ProjectsEditor() {
  const { projects, deleteProject, addProject, updateProject } = usePortfolio();
  const [isAdding, setIsAdding] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectImage, setProjectImage] = useState('');

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setProjectImage(base64);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addProject({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as 'design' | 'programming' | 'uiux',
      image: projectImage || undefined,
      liveUrl: (formData.get('liveUrl') as string) || undefined,
      githubUrl: (formData.get('githubUrl') as string) || undefined,
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()).filter(Boolean),
    });
    setProjectImage('');
    setIsAdding(false);
    toast.success('Project added successfully!');
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;
    const formData = new FormData(e.currentTarget);
    updateProject(editingProject.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as 'design' | 'programming' | 'uiux',
      image: projectImage || editingProject.image,
      liveUrl: (formData.get('liveUrl') as string) || undefined,
      githubUrl: (formData.get('githubUrl') as string) || undefined,
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()).filter(Boolean),
    });
    setProjectImage('');
    setEditingProject(null);
    toast.success('Project updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-dark-100 pb-4 border-b border-dark-200 z-10">
        <h3 className="font-display text-xl font-semibold">Manage Projects</h3>
        <Button onClick={() => setIsAdding(true)} className="bg-gradient-accent">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="space-y-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-dark-200 bg-dark overflow-hidden group"
          >
            <div className="aspect-video w-full bg-dark-200 relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg transition-colors" title="Live Preview">
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg transition-colors" title="View Code">
                      <Code2 className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white text-lg">{project.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-dark-200 hover:text-white"
                    title="Edit project"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-red-500/20 hover:text-red-500"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-dark-200 rounded-xl">
            No projects added yet. Click the button above to add one.
          </div>
        )}
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-lg border-dark-200 bg-dark-100 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <Label>Project Image</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg bg-dark-200 overflow-hidden flex-shrink-0">
                  {projectImage ? (
                    <img src={projectImage} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" required className="border-dark-200 bg-dark text-white p-3 h-auto" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                required
                className="border-dark-200 bg-dark text-white p-3 h-auto min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select name="category" required>
                  <SelectTrigger className="border-dark-200 bg-dark text-white p-3 h-auto">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="border-dark-200 bg-dark-100 text-white">
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="uiux">UI/UX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Technologies (comma separated)</Label>
                <Input name="technologies" className="border-dark-200 bg-dark text-white p-3 h-auto" placeholder="React, Node.js, etc." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input name="liveUrl" className="border-dark-200 bg-dark text-white p-3 h-auto" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input name="githubUrl" className="border-dark-200 bg-dark text-white p-3 h-auto" placeholder="https://github.com/..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-accent">Add Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => { setEditingProject(null); setProjectImage(''); }}>
        <DialogContent className="max-w-lg border-dark-200 bg-dark-100 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <form onSubmit={handleEdit} className="space-y-6">
              <div className="space-y-2">
                <Label>Project Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-dark-200 overflow-hidden flex-shrink-0">
                    {(projectImage || editingProject.image) ? (
                      <img src={projectImage || editingProject.image} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Change Image
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  name="title"
                  defaultValue={editingProject.title}
                  required
                  className="border-dark-200 bg-dark text-white p-3 h-auto"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  defaultValue={editingProject.description}
                  required
                  className="border-dark-200 bg-dark text-white p-3 h-auto min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" defaultValue={editingProject.category}>
                    <SelectTrigger className="border-dark-200 bg-dark text-white p-3 h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-dark-200 bg-dark-100 text-white">
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="uiux">UI/UX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <Input
                    name="technologies"
                    defaultValue={editingProject.technologies.join(', ')}
                    className="border-dark-200 bg-dark text-white p-3 h-auto"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Live URL</Label>
                  <Input
                    name="liveUrl"
                    defaultValue={editingProject.liveUrl}
                    className="border-dark-200 bg-dark text-white p-3 h-auto"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    name="githubUrl"
                    defaultValue={editingProject.githubUrl}
                    className="border-dark-200 bg-dark text-white p-3 h-auto"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setEditingProject(null); setProjectImage(''); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-accent">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Social Links Editor
const ALL_SOCIAL_PLATFORMS = [
  // Tech
  { platform: "GitHub", icon: "github" },
  { platform: "LinkedIn", icon: "linkedin" },
  { platform: "GitLab", icon: "gitlab" },
  { platform: "StackOverflow", icon: "layers" },
  { platform: "CodePen", icon: "codepen" },
  { platform: "Dev.to", icon: "code" },

  // Design
  { platform: "Behance", icon: "image" },
  { platform: "Dribbble", icon: "dribbble" },
  { platform: "Pinterest", icon: "pin" },
  { platform: "Instagram", icon: "instagram" },

  // Social
  { platform: "Facebook", icon: "facebook" },
  { platform: "Twitter", icon: "twitter" },
  { platform: "YouTube", icon: "youtube" },
  { platform: "TikTok", icon: "video" },
  { platform: "Snapchat", icon: "ghost" },
  { platform: "Reddit", icon: "message-circle" },
  { platform: "Discord", icon: "gamepad-2" },
  { platform: "WhatsApp", icon: "phone" },
  { platform: "Telegram", icon: "send" },

  // Content/Other
  { platform: "Medium", icon: "book-open" },
  { platform: "Twitch", icon: "twitch" },
  { platform: "Spotify", icon: "music" },
  { platform: "Soundcloud", icon: "cloud-lightning" },
  { platform: "Vimeo", icon: "video" },
  { platform: "Website", icon: "globe" },
  { platform: "Email", icon: "mail" }
];

function SocialLinksEditor() {
  const { profile, updateSocialLink } = usePortfolio();
  const [editing, setEditing] = useState<string | null>(null);

  const handleSave = (platform: string, url: string, icon: string) => {
    updateSocialLink(platform, { url, icon, platform });
    setEditing(null);
    toast.success(`${platform} link updated successfully!`);
  };

  const iconMap: Record<string, React.ElementType> = {
    github: Github,
    linkedin: Linkedin,
    gitlab: Gitlab,
    layers: Layers,
    codepen: Codepen,
    code: Code2,
    image: ImageIcon,
    dribbble: Dribbble,
    pin: Pin,
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
    video: Video,
    ghost: Ghost,
    'message-circle': MessageCircle,
    'gamepad-2': Gamepad2,
    phone: Phone,
    send: Send,
    'book-open': BookOpen,
    twitch: Twitch,
    music: Music,
    'cloud-lightning': CloudLightning,
    globe: Globe,
    mail: Mail,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-dark-100 pb-4 border-b border-dark-200 z-10">
        <h3 className="font-display text-xl font-semibold">Edit Social Links</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ALL_SOCIAL_PLATFORMS.map((platformDef) => {
          const Icon = iconMap[platformDef.icon] || LinkIcon;
          const existingLink = profile.socialLinks.find(l => l.platform === platformDef.platform);
          const currentUrl = existingLink?.url || '';

          return (
            <div
              key={platformDef.platform}
              className="rounded-lg border border-dark-200 bg-dark p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-200 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-white">{platformDef.platform}</span>
              </div>

              {editing === platformDef.platform ? (
                <div className="flex gap-2">
                  <Input
                    defaultValue={currentUrl}
                    className="flex-1 border-dark-200 bg-dark-100 text-white text-sm h-8"
                    id={`url-${platformDef.platform}`}
                    placeholder="https://..."
                  />
                  <Button
                    onClick={() => {
                      const input = document.getElementById(`url-${platformDef.platform}`) as HTMLInputElement;
                      handleSave(platformDef.platform, input.value, platformDef.icon);
                    }}
                    className="bg-gradient-accent h-8 w-8 p-0"
                    size="icon"
                  >
                    <Save className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs truncate flex-1 ${currentUrl ? 'text-muted-foreground' : 'text-dark-300 italic'}`}
                    title={currentUrl}
                  >
                    {currentUrl || 'No link added'}
                  </span>
                  <button
                    onClick={() => setEditing(platformDef.platform)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-dark-200 hover:text-white transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Security Editor
function SecurityEditor() {
  const { adminPassword, changePassword } = usePortfolio();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (formData.currentPassword !== adminPassword) {
      setStatus({ type: 'error', message: 'Current password is incorrect' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    changePassword(formData.newPassword);
    setStatus({ type: 'success', message: 'Password updated successfully' });
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between sticky top-0 bg-dark-100 pb-4 border-b border-dark-200 z-10">
        <h3 className="font-display text-xl font-semibold">Security Settings</h3>
      </div>

      <div className="max-w-md space-y-8">
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-500">Admin Access</h4>
              <p className="text-sm text-yellow-500/80 mt-1">
                Change the password used to access this Admin Panel. Make sure to choose a strong password.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">Current Password</Label>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base">New Password</Label>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base">Confirm New Password</Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="border-dark-200 bg-dark text-white p-3 h-auto"
              required
            />
          </div>

          {status.message && (
            <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
              {status.message}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" className="bg-gradient-accent w-full sm:w-auto">
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
