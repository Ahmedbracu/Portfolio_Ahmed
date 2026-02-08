import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Code2,
  Briefcase,
  FolderOpen,
  Mail,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export function SidePanel() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAdmin, profile } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Side Panel */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 top-0 z-50 hidden h-screen w-[280px] flex-col border-r border-dark-200 bg-dark lg:flex"
      >
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-dark-200 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent overflow-hidden">
              {profile.logoImage ? (
                <img src={profile.logoImage} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-lg font-bold text-white">A</span>
              )}
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">{profile.name.split(' ')[0]}</h3>
              <p className="text-xs text-muted-foreground">Portfolio</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-dark-100 hover:text-white'
                      }`}
                  >
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-2 w-2 rounded-full bg-primary"
                      />
                    )}
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Admin indicator */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-dark-200 p-4"
          >
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3">
              <Settings className="h-5 w-5 text-primary animate-spin-slow" />
              <span className="text-sm font-medium text-primary">Admin Mode</span>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="border-t border-dark-200 p-4">
          <p className="text-center text-xs text-muted-foreground">
            © 2024 Ahmed Abu Bakar
          </p>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed left-0 right-0 top-0 z-50 lg:hidden ${isScrolled ? 'bg-dark/95 backdrop-blur-md' : 'bg-transparent'
          } transition-all duration-300`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent overflow-hidden">
              {profile.logoImage ? (
                <img src={profile.logoImage} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-lg font-bold text-white">A</span>
              )}
            </div>
            <span className="font-display font-semibold text-white">{profile.name.split(' ')[0]}</span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-100 text-white"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-dark/98 backdrop-blur-lg lg:hidden"
          >
            <nav className="flex h-full flex-col items-center justify-center">
              <ul className="space-y-4">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button
                        onClick={() => scrollToSection(item.id)}
                        className={`flex items-center gap-4 text-2xl font-display transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                          }`}
                      >
                        <Icon className="h-6 w-6" />
                        {item.label}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
