import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  Palette,
  Code2,
  Layout
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { Project } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ProjectCategory = 'all' | 'design' | 'programming' | 'uiux';

const categoryIcons: Record<string, React.ElementType> = {
  design: Palette,
  programming: Code2,
  uiux: Layout,
};

const categoryLabels: Record<string, string> = {
  all: 'All Projects',
  design: 'Design',
  programming: 'Programming',
  uiux: 'UI/UX',
};

export function Projects() {
  const { projects, isAdmin, addProject, updateProject, deleteProject } = usePortfolio();
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addProject({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as 'design' | 'programming' | 'uiux',
      link: formData.get('link') as string || undefined,
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()).filter(Boolean),
    });

    setIsAddDialogOpen(false);
  };

  const handleEditProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    const formData = new FormData(e.currentTarget);

    updateProject(editingProject.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as 'design' | 'programming' | 'uiux',
      link: formData.get('link') as string || undefined,
      technologies: (formData.get('technologies') as string).split(',').map(t => t.trim()).filter(Boolean),
    });

    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setDeleteConfirmId(null);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative min-h-screen bg-dark px-4 py-20 lg:px-0"
    >
      {/* Background decoration */}
      <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-pink/5 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-primary">
                Portfolio
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              My <span className="text-gradient">Projects</span>
            </h2>
          </div>

          {/* Admin Add Button */}
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-accent px-4 py-2 text-sm font-medium text-white shadow-glow-sm hover:shadow-glow"
            >
              <Plus className="h-4 w-4" />
              Add Project
            </motion.button>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 flex flex-wrap gap-2"
        >
          {(Object.keys(categoryLabels) as ProjectCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${activeFilter === category
                ? 'text-white'
                : 'text-muted-foreground hover:text-white'
                }`}
            >
              {activeFilter === category && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-full bg-gradient-accent"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{categoryLabels[category]}</span>
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const Icon = categoryIcons[project.category] || FolderOpen;

              const CardContent = (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-2xl border border-dark-200 bg-dark-100 transition-all duration-300 hover:border-brand-indigo/50 hover:shadow-glow-sm cursor-pointer"
                >
                  {/* Admin Actions - High Z-Index to stay clickable */}
                  {isAdmin && (
                    <div className="absolute right-3 top-3 z-30 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingProject(project);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-200 text-white transition-colors hover:bg-brand-indigo shadow-lg"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteConfirmId(project.id);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-200 text-white transition-colors hover:bg-red-500 shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-dark-200 to-dark">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-dark-300 transition-colors group-hover:text-brand-indigo/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full bg-dark-200/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                        {categoryLabels[project.category]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="mb-2 font-display text-lg font-semibold text-white transition-colors group-hover:text-brand-indigo">
                      {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-dark-200 px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="rounded-md bg-dark-200 px-2 py-0.5 text-xs text-muted-foreground">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Link Indicator (Visible if linked) */}
                    {(project.liveUrl || project.link) && (
                      <div className="flex items-center gap-1.5 text-sm text-brand-indigo transition-colors hover:text-brand-violet">
                        View Project
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );

              // Wrap in anchor if link exists
              if (project.liveUrl || project.link) {
                return (
                  <a
                    key={project.id}
                    href={project.liveUrl || project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    {CardContent}
                  </a>
                );
              }

              return <div key={project.id} className="h-full">{CardContent}</div>;
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <FolderOpen className="mx-auto mb-4 h-16 w-16 text-dark-300" />
            <p className="text-muted-foreground">No projects found in this category.</p>
          </motion.div>
        )}
      </div>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg border-dark-200 bg-dark-100 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add New Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProject} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                className="border-dark-200 bg-dark text-white"
                placeholder="Project title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                className="border-dark-200 bg-dark text-white"
                placeholder="Project description"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger className="border-dark-200 bg-dark text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-dark-200 bg-dark-100">
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="programming">Programming</SelectItem>
                  <SelectItem value="uiux">UI/UX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="link">Project Link (optional)</Label>
              <Input
                id="link"
                name="link"
                type="url"
                className="border-dark-200 bg-dark text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                name="technologies"
                required
                className="border-dark-200 bg-dark text-white"
                placeholder="React, TypeScript, Tailwind"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-dark-200"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-accent">
                Add Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-lg border-dark-200 bg-dark-100 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <form onSubmit={handleEditProject} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingProject.title}
                  required
                  className="border-dark-200 bg-dark text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingProject.description}
                  required
                  className="border-dark-200 bg-dark text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select name="category" defaultValue={editingProject.category}>
                  <SelectTrigger className="border-dark-200 bg-dark text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-dark-200 bg-dark-100">
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="uiux">UI/UX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-link">Project Link (optional)</Label>
                <Input
                  id="edit-link"
                  name="link"
                  type="url"
                  defaultValue={editingProject.link || ''}
                  className="border-dark-200 bg-dark text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-technologies">Technologies (comma-separated)</Label>
                <Input
                  id="edit-technologies"
                  name="technologies"
                  defaultValue={editingProject.technologies.join(', ')}
                  required
                  className="border-dark-200 bg-dark text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProject(null)}
                  className="border-dark-200"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-gradient-accent">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm border-dark-200 bg-dark-100 text-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Delete Project?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The project will be permanently removed.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="border-dark-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
