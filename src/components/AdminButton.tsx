import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Lock, LogOut, Eye, EyeOff } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { AdminPanel } from './AdminPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AdminButton() {
  const { isAdmin, login, logout } = usePortfolio();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(password);
    if (success) {
      setIsLoginOpen(false);
      setPassword('');
      setIsPanelOpen(true);
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    logout();
    setIsPanelOpen(false);
  };

  const handleButtonClick = () => {
    if (isAdmin) {
      setIsPanelOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      {/* Admin Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleButtonClick}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isAdmin
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30'
            : 'bg-gradient-accent shadow-glow'
        }`}
      >
        <Settings className={`h-5 w-5 text-white ${isAdmin ? 'animate-spin-slow' : ''}`} />
      </motion.button>

      {/* Logout Button (when admin) */}
      <AnimatePresence>
        {isAdmin && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="fixed bottom-6 right-24 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30 transition-all duration-300"
          >
            <LogOut className="h-5 w-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="max-w-sm border-dark-200 bg-dark-100 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 font-display text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              Admin Login
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">
                Enter password to access admin features
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="border-dark-200 bg-dark pr-10 text-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLoginOpen(false)}
                className="flex-1 border-dark-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-accent"
              >
                Login
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Panel */}
      <AdminPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />

      {/* Admin Mode Indicator */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">Admin Mode</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
