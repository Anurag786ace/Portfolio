import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AudienceSection from './components/AudienceSection';
import WorksSection from './components/WorksSection';
import TopicsSection from './components/TopicsSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import './App.css';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      // Scroll progress from 0 (top of hero) to 1.0 (past hero)
      const progress = Math.min(Math.max(scrollY / (heroHeight * 0.75), 0), 1.2);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreWork = () => {
    const el = document.getElementById('works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    setModalOpen(true);
  };

  return (
    <div className="portfolio-app">
      {/* Navigation */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Hero Section with Interactive 3D Head */}
      <HeroSection
        scrollProgress={scrollProgress}
        onExploreWork={handleExploreWork}
        onOpenContact={handleOpenContact}
      />

      {/* Audience / Impact Section */}
      <AudienceSection />

      {/* Selected Works & Creative Lab */}
      <WorksSection />

      {/* Topics & Domain Mastery */}
      <TopicsSection />

      {/* About & Philosophy */}
      <AboutSection onOpenContact={handleOpenContact} />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Subscribe & Connect Modal */}
      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
