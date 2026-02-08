import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Globe,
  Video,
  Ghost,
  MessageCircle,
  Gamepad2,
  BookOpen,
  Music,
  CloudLightning,
  Layers,
  Codepen,
  Code2,
  Image as ImageIcon,
  Dribbble,
  Pin,
  Gitlab
} from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  twitch: Twitch,
  globe: Globe,
  mail: Mail,
  video: Video,
  ghost: Ghost,
  'message-circle': MessageCircle,
  'gamepad-2': Gamepad2,
  phone: Phone,
  send: Send,
  'book-open': BookOpen,
  music: Music,
  'cloud-lightning': CloudLightning,
  layers: Layers,
  codepen: Codepen,
  code: Code2,
  image: ImageIcon,
  dribbble: Dribbble,
  pin: Pin,
  gitlab: Gitlab,
};

export function Contact() {
  const { profile } = usePortfolio();
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Construct email body with name at the end
    const emailBody = `${message}\n\n---\nBy ${name}`;

    // Open default mail client
    const mailtoLink = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}&from=${encodeURIComponent(email)}`;
    window.location.href = mailtoLink;
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: MapPin, label: 'Location', value: profile.location, href: '#' },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen bg-dark px-4 py-20 lg:px-0"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-brand-indigo/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              Get In Touch
            </span>
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have a project in mind or want to collaborate? I'd love to hear from you.
            Reach out and let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <h3 className="mb-6 font-display text-2xl font-semibold text-white">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="group flex items-center gap-4 rounded-xl border border-dark-200 bg-dark-100 p-4 transition-all duration-300 hover:border-brand-indigo/30 hover:shadow-glow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-200 transition-colors group-hover:bg-primary/10">
                        <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-white">{item.value}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="mb-4 font-display text-lg font-semibold text-white">
                Follow Me
              </h3>
              <div className="flex gap-3">
                {profile.socialLinks.map((link, index) => {
                  const Icon = iconMap[link.icon] || Mail;
                  return (
                    <motion.a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        delay: 0.6 + index * 0.1,
                        ease: [0.68, -0.55, 0.265, 1.55]
                      }}
                      whileHover={{ scale: 1.1 }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-dark-100 text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Availability Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="rounded-2xl border border-dark-200 bg-gradient-to-br from-dark-100 to-dark p-6"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </div>
                <span className="font-medium text-white">Available for work</span>
              </div>
              <p className="text-sm text-muted-foreground">
                I'm currently open to new opportunities, freelance projects, and collaborations.
                Let's discuss how we can work together.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-dark-200 bg-dark-100 p-6 sm:p-8">
              <h3 className="mb-6 font-display text-xl font-semibold text-white">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-white">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      className="border-dark-200 bg-dark text-white placeholder:text-muted-foreground focus:border-brand-indigo focus:ring-brand-indigo/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Your Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="border-dark-200 bg-dark text-white placeholder:text-muted-foreground focus:border-brand-indigo focus:ring-brand-indigo/20"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject" className="text-white">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="What's this about?"
                    className="border-dark-200 bg-dark text-white placeholder:text-muted-foreground focus:border-brand-indigo focus:ring-brand-indigo/20"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="border-dark-200 bg-dark text-white placeholder:text-muted-foreground focus:border-brand-indigo focus:ring-brand-indigo/20 resize-none"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Your name will be added at the end of the message automatically.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-accent transition-all duration-300 hover:shadow-glow"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Open in Mail App
                </Button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-20 border-t border-dark-200 pt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
