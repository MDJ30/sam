import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  Hero,
  QuoteSection,
  HeraldLogo
} from "../styles/Home";
import Footer from "../components/Footer";

function Home() {
  const [heroHeight, setHeroHeight] = useState(400);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close menu when screen size changes
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newHeight = Math.max(isMobile ? 150 : 200, 400 - scrollPosition * 0.5);
      setHeroHeight(newHeight);
      // Close menu when scrolling
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Handle clicking outside to close menu
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isMenuOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Hero height={heroHeight}>
      </Hero>
      <QuoteSection>
        <p>
          Do not be troubled or weighed down with grief.
          Do not fear any illness or vexation, anxiety or pain
          Am I not here who am your Mother?
          Are you not under my shadow and protection?
          Am I not your fountain of life?
          Are you not in the folds of my mantle?
          In the crossing of my arms?
          Is there anything else you need?

          Our Lady of Guadalupe to Juan Diego
        </p>
      </QuoteSection>
      <Footer/>
    </>
  );
}

export default Home;