import { PortfolioProvider } from '@/context/PortfolioContext';
import { useLenis } from '@/hooks/useLenis';
import { SidePanel } from '@/components/SidePanel';
import { AdminButton } from '@/components/AdminButton';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Skills } from '@/sections/Skills';
import { Experience } from '@/sections/Experience';
import { Projects } from '@/sections/Projects';
import { Contact } from '@/sections/Contact';

function AppContent() {
  useLenis();

  return (
    <div className="min-h-screen bg-dark">
      <SidePanel />

      <main className="lg:ml-[280px]">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <AdminButton />
    </div>
  );
}

import { useState } from 'react';
import { Loader } from '@/components/Loader';

// ... (existing imports)

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

export default App;
