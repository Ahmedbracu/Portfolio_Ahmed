import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, GraduationCap, Sparkles } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function About() {
  const { profile } = usePortfolio();
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  const stats = [
    { icon: GraduationCap, label: 'Education', value: 'BRAC University' },
    { icon: MapPin, label: 'Location', value: profile.location },
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Phone, label: 'Phone', value: profile.phone },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen bg-dark px-4 py-20 lg:px-0"
    >
      {/* Background decoration */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-brand-indigo/5 blur-3xl" />
      
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              About Me
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Who I <span className="text-gradient">Am</span>
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 rounded-full bg-gradient-to-b from-brand-indigo to-brand-violet" />
              <p className="pl-6 text-lg leading-relaxed text-muted-foreground">
                {profile.bio}
              </p>
            </div>
            
            <p className="pl-6 text-muted-foreground">
              With a thirst for knowledge and a growing focus on leadership, I actively seek 
              opportunities to guide and grow with others, while continuing to expand my skills 
              across both technical and creative domains. I believe in lifelong learning, 
              thoughtful collaboration, and building systems that are not just functional but 
              transformative.
            </p>

            {/* Passion Tags */}
            <div className="flex flex-wrap gap-3 pl-6 pt-4">
              {['Programming', 'Design', 'Research', 'Leadership'].map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="rounded-full border border-dark-200 bg-dark-100 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-brand-indigo hover:text-white"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-2xl border border-dark-200 bg-dark-100 p-6 transition-all duration-300 hover:border-brand-indigo/50 hover:shadow-glow-sm"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-dark-200 transition-colors group-hover:bg-primary/10">
                      <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <p className="mb-1 text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-display font-semibold text-white">{stat.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 text-center"
        >
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-dark-200 bg-gradient-to-br from-dark-100 to-dark p-8 sm:p-12">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-indigo">
                <span className="text-lg text-white">"</span>
              </div>
            </div>
            <blockquote className="pt-4">
              <p className="text-lg font-medium italic text-white sm:text-xl">
                "I enjoy working on meaningful projects that challenge me to ask deeper questions 
                and find innovative solutions."
              </p>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
