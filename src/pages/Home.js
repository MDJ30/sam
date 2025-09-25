import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  Hero,
  QuoteSection,
  HeraldLogo
} from "../styles/Home";
import Footer from "../components/Footer";
import styled from "styled-components";
import { ref, onValue } from 'firebase/database';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, firestore } from '../config/firebase';


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
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);

    img {
      transform: scale(1.1);
    }

    h3 {
      color: #007bff;
    }
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
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
      transition: color 0.3s ease;
    }
  }
`;
// Remove initialHeadlineData or keep as fallback
const initialHeadlineData = [];

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

// Add this helper function at the top level
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};


function Home() {
  const [heroHeight, setHeroHeight] = useState(400);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [headlineData, setHeadlineData] = useState(initialHeadlineData);
  const [localNewsData, setLocalNewsData] = useState([]);
  const [quoteText, setQuoteText] = useState('');

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
    }, 2000);

    return () => clearInterval(interval);
  }, [headlineData.length]);

  useEffect(() => {
    // Fetch headlines from Firestore
    const headlinesRef = collection(firestore, 'headlines');
    const unsubscribeHeadlines = onSnapshot(headlinesRef, (snapshot) => {
      const headlines = [];
      snapshot.forEach(doc => {
        headlines.push({
          id: doc.id,
          ...doc.data(),
          // No need to transform image field as it's already Base64
        });
      });
      setHeadlineData(headlines);
    }, (error) => {
      console.error("Error fetching headlines:", error);
    });

    // Fetch local news from Realtime Database
    const newsRef = ref(db, 'localNews');
    const unsubscribeNews = onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const news = Object.values(data).map(item => ({
          ...item,
          // No need to transform image field as it's already Base64
        }));
        setLocalNewsData(news);
      }
    }, (error) => {
      console.error("Error fetching local news:", error);
    });

    // Fetch quote from Realtime Database
    const quoteRef = ref(db, 'quote');
    const unsubscribeQuote = onValue(quoteRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuoteText(data);
      }
    }, (error) => {
      console.error("Error fetching quote:", error);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeHeadlines();
      unsubscribeNews();
      unsubscribeQuote();
    };
  }, []);

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Hero height={heroHeight}>
      </Hero>
      <QuoteSection>
        <p>{quoteText}</p>
      </QuoteSection>
      <ContentWrapper>
        <div>
          <Section>
            <SectionTitle>HEADLINES</SectionTitle>
            <HeadlinesSection>
              <Headlines>
                {headlineData.map((headline, index) => (
                  <HeadlineCard 
                    key={headline.id || index}
                    className={activeIndex === index ? 'active' : ''}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span>{formatDate(headline.date)}</span>
                    <h3>{headline.title}</h3>
                  </HeadlineCard>
                ))}
              </Headlines>
              <CarouselContainer>
                {headlineData.map((headline, index) => (
                  <CarouselImage
                    key={headline.id || index}
                    src={headline.image} // Changed from imageUrl to image
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
              {localNewsData.map((news, index) => (
                <NewsCard key={index}>
                  <img src={news.image} alt={`News${index + 1}`}/> {/* Changed from imageUrl to image */}
                  <div className="info">
                    <span>{formatDate(news.date)}</span>
                    <h3>{news.title}</h3>
                  </div>
                </NewsCard>
              ))}
            </LocalNewsGrid>
          </Section>
        </div>
      </ContentWrapper>
      <Footer/>
    </>
  );
}

export default Home;