import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Palette, 
  Wrench, 
  Users, 
  Cpu, 
  Database, 
  Box, 
  GitBranch,
  PenTool,
  Image,
  Type,
  Layout,
  Search,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const iconMap: Record<string, React.ElementType> = {
  code: Code2,
  cpu: Cpu,
  database: Database,
  box: Box,
  'git-branch': GitBranch,
  'pen-tool': PenTool,
  image: Image,
  type: Type,
  layout: Layout,
  palette: Palette,
  search: Search,
  users: Users,
  lightbulb: Lightbulb,
  'message-circle': MessageCircle,
  wrench: Wrench,
};

interface SkillCardProps {
  category: string;
  categorySkills: Array<{ name: string; level: number; category: string; icon?: string }>;
  index: number;
  isVisible: boolean;
}

function SkillCard({ category, categorySkills, index, isVisible }: SkillCardProps) {
  const [animatedLevels, setAnimatedLevels] = useState<number[]>(
    categorySkills.map(() => 0)
  );

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedLevels(categorySkills.map(s => s.level));
      }, 300 + index * 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, index, categorySkills]);

  const categoryIcons: Record<string, React.ElementType> = {
    programming: Code2,
    design: Palette,
    tools: Wrench,
    soft: Users,
  };

  const CategoryIcon = categoryIcons[category] || Code2;
  const categoryLabels: Record<string, string> = {
    programming: 'Programming & Tech',
    design: 'Graphic Design',
    tools: 'Tools & Technologies',
    soft: 'Soft Skills',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: 0.2 + index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="rounded-2xl border border-dark-200 bg-dark-100 p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <CategoryIcon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-white">
          {categoryLabels[category] || category}
        </h3>
      </div>

      <div className="space-y-4">
        {categorySkills.map((skill, skillIndex) => {
          const Icon = iconMap[skill.icon || 'code'] || Code2;
          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 + skillIndex * 0.05 }}
              className="group"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  <span className="text-sm text-white">{skill.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {animatedLevels[skillIndex]}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-dark-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedLevels[skillIndex]}%` }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.4 + index * 0.1 + skillIndex * 0.05
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-violet"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export function Skills() {
  const { skills } = usePortfolio();
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categoryOrder = ['programming', 'design', 'tools', 'soft'];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen bg-dark px-4 py-20 lg:px-0"
    >
      {/* Background decoration */}
      <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-brand-violet/5 blur-3xl" />
      
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              My Skills
            </span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            What I <span className="text-gradient">Do</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A combination of technical expertise and creative skills that allow me to 
            bring ideas to life through code and design.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {categoryOrder.map((category, index) => (
            groupedSkills[category] && (
              <SkillCard
                key={category}
                category={category}
                categorySkills={groupedSkills[category]}
                index={index}
                isVisible={isVisible}
              />
            )
          ))}
        </div>

        {/* Skill Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid gap-8 rounded-3xl border border-dark-200 bg-gradient-to-br from-dark-100 to-dark p-8 sm:grid-cols-3 sm:p-12"
        >
          <div className="text-center">
            <div className="mb-2 font-display text-4xl font-bold text-gradient">
              4+
            </div>
            <p className="text-sm text-muted-foreground">Programming Languages</p>
          </div>
          <div className="text-center">
            <div className="mb-2 font-display text-4xl font-bold text-gradient">
              20+
            </div>
            <p className="text-sm text-muted-foreground">Design Projects</p>
          </div>
          <div className="text-center">
            <div className="mb-2 font-display text-4xl font-bold text-gradient">
              2+
            </div>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
