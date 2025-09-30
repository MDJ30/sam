import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  Hero,
  QuoteSection,
  HeraldLogo
} from "../styles/Home";
import Footer from "../components/Footer";
import styled, { keyframes } from "styled-components";
import { ref, onValue } from 'firebase/database';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, firestore } from '../config/firebase';
import { useNavigate } from 'react-router-dom';



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
    transform: translateY(-2px);
    transition: transform 0.2s ease;
  }

  h3 {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    color: #333;
    cursor: pointer;

    &:hover {
      color: #0056b3;
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
  cursor: pointer;
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

// Add after existing imports
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonCard = styled.div`
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  height: 280px;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
`;

const SkeletonHeadline = styled.div`
  height: 100px;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 4px;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
`;

const SkeletonImage = styled.div`
  width: 100%;
  height: 400px;
  background: #f0f0f0;
  border-radius: 8px;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
`;

function Home() {
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);
  const [heroHeight, setHeroHeight] = useState(400);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [headlineData, setHeadlineData] = useState(initialHeadlineData);
  const [localNewsData, setLocalNewsData] = useState([]);
  const [quoteText, setQuoteText] = useState('');
  const navigate = useNavigate();

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
    setIsLoading(true);
    // Fetch headlines from Firestore
    const headlinesRef = collection(firestore, 'headlines');
    const unsubscribeHeadlines = onSnapshot(
      query(
        headlinesRef,
        orderBy('timestamp', 'desc'),
        limit(3)
      ),
      (snapshot) => {
        const headlines = [];
        snapshot.forEach(doc => {
          headlines.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setHeadlineData(headlines);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching headlines:", error);
        setIsLoading(false);
      }
    );

    // Replace local news fetch with articles fetch from Firestore
    const articlesRef = collection(firestore, 'articles');
    const unsubscribeArticles = onSnapshot(
      query(
        articlesRef,
        orderBy('timestamp', 'desc'),
        limit(4)
      ),
      (snapshot) => {
        const articles = [];
        snapshot.forEach(doc => {
          articles.push({
            id: doc.id,
            articleId: doc.id, // Set articleId to the document id
            ...doc.data(),
          });
        });
        setLocalNewsData(articles);
      },
      (error) => {
        console.error("Error fetching articles:", error);
      }
    );

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
      unsubscribeArticles();
      unsubscribeQuote();
    };
  }, []);

  const handleArticleClick = (article) => {
    if (article.articleId) {
      navigate(`/article/${article.articleId}`);
    }
  };

  // Add skeleton loading component
  const LoadingSkeleton = () => (
    <>
      <HeadlinesSection>
        <div>
          {[1, 2, 3].map((n) => (
            <SkeletonHeadline key={n} />
          ))}
        </div>
        <SkeletonImage />
      </HeadlinesSection>
      <LocalNewsGrid>
        {[1, 2, 3, 4].map((n) => (
          <SkeletonCard key={n} />
        ))}
      </LocalNewsGrid>
    </>
  );

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
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <HeadlinesSection>
                  <Headlines>
                    {headlineData.length === 0 ? (
                      // Show skeletons if no headline data
                      Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonHeadline key={index} />
                      ))
                    ) : (
                      headlineData.map((headline, index) => (
                        <HeadlineCard 
                          key={headline.id || index}
                          className={activeIndex === index ? 'active' : ''}
                          onClick={() => {
                            setActiveIndex(index);
                            handleArticleClick(headline);
                          }}
                          style={{ cursor: headline.articleId ? 'pointer' : 'default' }}
                        >
                          <span>{formatDate(headline.date)}</span>
                          <h3>{headline.title}</h3>
                        </HeadlineCard>
                      ))
                    )}
                  </Headlines>
                  <CarouselContainer>
                    {headlineData.length === 0 ? (
                      // Show skeleton image if no headline data
                      <SkeletonImage />
                    ) : (
                      headlineData.map((headline, index) => (
                        <CarouselImage
                          key={headline.id || index}
                          src={headline.image}
                          alt={headline.title}
                          active={activeIndex === index}
                          onClick={() => handleArticleClick(headline)}
                          style={{ cursor: headline.articleId ? 'pointer' : 'default' }}
                        />
                      ))
                    )}
                  </CarouselContainer>
                </HeadlinesSection>
              </>
            )}
          </Section>

          <Section>
            <SectionTitle>NEWS</SectionTitle>
            {isLoading ? (
              <LocalNewsGrid>
                {[1, 2, 3, 4].map((n) => (
                  <SkeletonCard key={n} />
                ))}
              </LocalNewsGrid>
            ) : (
              <LocalNewsGrid>
                {localNewsData.length === 0 ? (
                  // Show skeletons if no local news data
                  Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                ) : (
                  localNewsData.map((article, index) => (
                    <NewsCard 
                      key={article.id}
                      onClick={() => handleArticleClick(article)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={article.image} alt={article.title}/>
                      <div className="info">
                        <span>{formatDate(article.date)}</span>
                        <h3>{article.title}</h3>
                      </div>
                    </NewsCard>
                  ))
                )}
              </LocalNewsGrid>
            )}
          </Section>
        </div>
      </ContentWrapper>
      <Footer/>
    </>
  );
};


export default Home;