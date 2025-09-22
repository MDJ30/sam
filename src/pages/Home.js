import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  Hero,
  QuoteSection,
  HeraldLogo
} from "../styles/Home";
import Footer from "../components/Footer";
import styled from "styled-components";
import sample from "../sample.jpg";
import pic from "../3.jpg";
import sam from "../4.jpg";
import lip from "../5.jpg";


const ContentWrapper = styled.div`
  margin: 2rem 5%;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
`;

const Headlines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-height: 400px; // Match carousel height
  overflow-y: auto;  // Allow scrolling if content overflows
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;


const HeadlineCard = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #eee;
  padding: 1rem;
  transition: all 0.3s ease;

  &:last-child {
    border: none;
  }

  &:hover {
    background-color: #f8f9fa;
  }

  h3 {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    color: #333;
    cursor: pointer;

    &:hover {
      color: #007bff;
    }
  }

  span {
    font-size: 0.9rem;
    color: gray;
  }

  &.active {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
  }
`;

const LocalNewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const NewsCard = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  .info {
    padding: 1rem;
    span {
      font-size: 0.85rem;
      color: gray;
    }
    h3 {
      margin-top: 0.3rem;
      font-size: 1rem;
      color: #222;
    }
  }
`;

// Add carousel data
const headlineData = [
  {
    date: "September 14, 2025",
    title: "An ancient and yet existent ministry",
    image: sample
  },
  {
    date: "September 7, 2025",
    title: "The Call That Waited, The Heart That Answered",
    image: pic
  },
  {
    date: "August 31, 2025",
    title: "Pilgrims of Hope for the Care of Creation",
    image: sam
  },
  {
    date: "August 24, 2025",
    title: "Archdiocese of Davao to host 3,000 delegates for Divine Mercy Congress",
    image: lip
  }
];

// Add new styled components
const HeadlinesSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 100%;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
  opacity: ${props => props.active ? '1' : '0'};
  position: absolute;
  top: 0;
  left: 0;
`;


function Home() {
  const [heroHeight, setHeroHeight] = useState(400);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Add carousel rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === headlineData.length - 1 ? 0 : current + 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      <ContentWrapper>
        <div>
          <Section>
            <SectionTitle>HEADLINES</SectionTitle>
            <HeadlinesSection>
              <Headlines>
                {headlineData.map((headline, index) => (
                  <HeadlineCard 
                    key={index}
                    className={activeIndex === index ? 'active' : ''}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span>{headline.date}</span>
                    <h3>{headline.title}</h3>
                  </HeadlineCard>
                ))}
              </Headlines>
              <CarouselContainer>
                {headlineData.map((headline, index) => (
                  <CarouselImage
                    key={index}
                    src={headline.image}
                    alt={headline.title}
                    active={activeIndex === index}
                  />
                ))}
              </CarouselContainer>
            </HeadlinesSection>
          </Section>

          <Section>
            <SectionTitle>LOCAL NEWS</SectionTitle>
            <LocalNewsGrid>
              <NewsCard>
                <img src={sample} alt="News1"/>
                <div className="info">
                  <span>September 14, 2025</span>
                  <h3>Lakbay Laum Journey in Our Lady of Guadalupe Parish</h3>
                </div>
              </NewsCard>
              <NewsCard>
                <img src={pic} alt="News2"/>
                <div className="info">
                  <span>September 14, 2025</span>
                  <h3>HCM STEM Synergy: Igniting Minds, Empowering Teams</h3>
                </div>
              </NewsCard>
              <NewsCard>
                <img src={sam} alt="News3"/>
                <div className="info">
                  <span>September 14, 2025</span>
                  <h3>Protect Environment Program in School</h3>
                </div>
              </NewsCard>
              <NewsCard>
                <img src={lip} alt="News4"/>
                <div className="info">
                  <span>September 14, 2025</span>
                  <h3>Community Gathering and Formation</h3>
                </div>
              </NewsCard>
            </LocalNewsGrid>
          </Section>
        </div>
      </ContentWrapper>
      <Footer/>
    </>
  );
}

export default Home;