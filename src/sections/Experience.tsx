import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function Experience() {
  const { experiences } = usePortfolio();
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 });

  const workExperience = experiences.filter(e => e.type === 'work');
  const education = experiences.filter(e => e.type === 'education');

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen bg-dark px-4 py-20 lg:px-0"
    >
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-brand-indigo/5 blur-3xl" />
      
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
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Experience & Education
            </span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            My <span className="text-gradient">Journey</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A timeline of my professional experience and educational background 
            that has shaped my skills and perspective.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Work Experience */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/10">
                <Briefcase className="h-5 w-5 text-brand-indigo" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">
                Work Experience
              </h3>
            </motion.div>

            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 h-full w-px bg-dark-200" />
              
              {workExperience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1 } : {}}
                    transition={{ 
                      delay: 0.4 + index * 0.1,
                      ease: [0.68, -0.55, 0.265, 1.55]
                    }}
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-dark-100 border-2 border-brand-indigo"
                  >
                    <Briefcase className="h-4 w-4 text-brand-indigo" />
                  </motion.div>

                  <div className="rounded-2xl border border-dark-200 bg-dark-100 p-6 transition-all duration-300 hover:border-brand-indigo/30 hover:shadow-glow-sm">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {exp.period}
                      </span>
                      <span className="text-dark-300">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </span>
                    </div>
                    
                    <h4 className="mb-1 font-display text-lg font-semibold text-white">
                      {exp.title}
                    </h4>
                    <p className="mb-4 text-primary">{exp.organization}</p>
                    
                    <ul className="space-y-2">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-indigo" />
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-violet/10">
                <GraduationCap className="h-5 w-5 text-brand-violet" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">
                Education
              </h3>
            </motion.div>

            <div className="relative space-y-6">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 h-full w-px bg-dark-200" />
              
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1 } : {}}
                    transition={{ 
                      delay: 0.4 + index * 0.1,
                      ease: [0.68, -0.55, 0.265, 1.55]
                    }}
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-dark-100 border-2 border-brand-violet"
                  >
                    <GraduationCap className="h-4 w-4 text-brand-violet" />
                  </motion.div>

                  <div className="rounded-2xl border border-dark-200 bg-dark-100 p-6 transition-all duration-300 hover:border-brand-violet/30 hover:shadow-glow-sm">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {edu.period}
                      </span>
                      <span className="text-dark-300">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {edu.location}
                      </span>
                    </div>
                    
                    <h4 className="mb-1 font-display text-lg font-semibold text-white">
                      {edu.title}
                    </h4>
                    <p className="mb-4 text-brand-violet">{edu.organization}</p>
                    
                    <ul className="space-y-2">
                      {edu.description.map((desc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-violet" />
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
