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
import './App.css';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
      <Navbar onOpenContact={handleOpenContact} />

      {/* Hero Section with Interactive 3D Head */}
      <HeroSection
        scrollProgress={scrollProgress}
        onExploreWork={handleExploreWork}
        onOpenContact={handleOpenContact}
      />

      {/* Marquee divider band */}
      <InfiniteMarquee
        items={['REACT', 'THREE.JS', 'GLSL SHADERS', 'AI AGENTS', 'WEBGL', 'TYPESCRIPT', 'CREATIVE CODE', 'FULL-STACK']}
        speed={30}
      />

      {/* Audience / Impact Section */}
      <AudienceSection />

      {/* Selected Works & Creative Lab */}
      <WorksSection />

      {/* Reverse direction marquee */}
      <InfiniteMarquee
        items={['DESIGN SYSTEMS', 'PERFORMANCE', 'ALGORITHMIC THINKING', 'CINEMATIC WEB', 'OPEN SOURCE', 'NODE.JS']}
        speed={35}
        reverse={true}
      />

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
