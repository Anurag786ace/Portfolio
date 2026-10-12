import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InfiniteMarquee from './components/InfiniteMarquee';
import AudienceSection from './components/AudienceSection';
import WorksSection from './components/WorksSection';
import TopicsSection from './components/TopicsSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import ProjectModal from './components/ProjectModal';
import { sound } from './utils/audio';
import './App.css';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('alabaster'); // 'alabaster' | 'obsidian' | 'emerald'
  const [soundEnabled, setSoundEnabled] = useState(sound.isSoundEnabled());

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Theme synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  // Global keyboard shortcuts (⌘K or Ctrl+K for Command Palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / (heroHeight * 0.75), 0), 1.2);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  const handleExploreWork = () => {
    const el = document.getElementById('works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    sound.playClick();
  };

  const handleOpenContact = () => {
    setContactModalOpen(true);
    sound.playOpen();
  };

  return (
    <div
      className="portfolio-app"
      style={{
        opacity: pageLoaded ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar
        onOpenContact={handleOpenContact}
        onOpenCommandPalette={() => setCmdPaletteOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

      {/* Hero Section with Interactive 3D Head */}
      <HeroSection
        scrollProgress={scrollProgress}
        onExploreWork={handleExploreWork}
        onOpenContact={handleOpenContact}
      />

      {/* Marquee divider band */}
      <InfiniteMarquee
        items={['REACT 19', 'THREE.JS', 'GLSL SHADERS', 'AI AGENTS', 'WEBGL 2.0', 'TYPESCRIPT', 'CREATIVE CODE', 'FULL-STACK']}
        speed={30}
      />

      {/* Audience / Impact Section */}
      <AudienceSection />

      {/* Selected Works & Creative Lab */}
      <WorksSection onSelectProject={(p) => setSelectedProject(p)} />

      {/* Reverse direction marquee */}
      <InfiniteMarquee
        items={['DESIGN SYSTEMS', 'PERFORMANCE', 'ALGORITHMIC DEPTH', 'CINEMATIC WEB', 'OPEN SOURCE', 'NODE.JS']}
        speed={35}
        reverse={true}
      />

      {/* Topics & Domain Mastery + Skill Orbit */}
      <TopicsSection />

      {/* About, Philosophy, Milestones & Resume */}
      <AboutSection onOpenContact={handleOpenContact} />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Connect Modal */}
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        onSelectTheme={setCurrentTheme}
        currentTheme={currentTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenContact={handleOpenContact}
      />

      {/* Project Case Study Drawer */}
      <ProjectModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        onOpenContact={handleOpenContact}
      />
    </div>
  );
}
