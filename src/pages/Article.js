// Article.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firestore } from "../config/firebase";
import styled, { keyframes } from "styled-components";
import { Header, HeaderSpacer } from '../components/Header';
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

// Shimmer animation for loading
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const LoadingContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 0 1rem;
  }
`;

const SkeletonBlock = styled.div`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  background: #f0f0f0;
  margin-bottom: ${(props) => props.mb || "1rem"};
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px);
  background-size: 600px 100%;
`;

function LoadingSkeleton() {
  return (
    <LoadingContainer>
      <SkeletonBlock height="400px" mb="2rem" />
      <SkeletonBlock width="80%" height="40px" />
      <SkeletonBlock width="60%" height="20px" mb="2rem" />
      <SkeletonBlock height="100px" />
      <SkeletonBlock height="100px" />
      <SkeletonBlock height="100px" />
    </LoadingContainer>
  );
}

// Fade-in effect
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styles
const ArticleWrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: "Georgia", serif;
  color: #222;
  line-height: 1.7;
  animation: ${fadeIn} 0.5s ease-out;
  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 0 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #111;
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }
`;

const Meta = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;
  span { font-weight: 500; color: #444; }
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
    line-height: 1.6;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    max-height: 300px;
    margin-bottom: 1.5rem;
  }
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  @media (max-width: 768px) { height: auto; }
`;

const ArticleContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (max-width: 768px) { padding: 0 1rem; }
`;

const RecommendedSection = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`;

const RecommendedTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #111;
  @media (max-width: 768px) { font-size: 1.5rem; }
`;

const RecommendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const RecommendedCard = styled.div`
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: translateY(-5px); }
`;

const RecommendedImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const RecommendedArticleTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const RecommendedMeta = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function Article() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [articleData, setArticleData] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch recommended articles
  const getRecommendedArticles = async (currentArticle) => {
    try {
      const articlesRef = collection(firestore, "articles");

      // First try: same category
      const categoryQuery = query(
        articlesRef,
        orderBy("timestamp", "desc"),
        limit(6)
      );

      const categorySnapshot = await getDocs(categoryQuery);
      let recommendations = [];
      categorySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        if (doc.id !== id && data.category === currentArticle.category) {
          recommendations.push(data);
        }
      });

      // If fewer than 3, get recent regardless of category
      if (recommendations.length < 3) {
        const recentQuery = query(
          articlesRef,
          orderBy("timestamp", "desc"),
          limit(6)
        );
        const recentSnapshot = await getDocs(recentQuery);
        recentSnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          if (doc.id !== id && !recommendations.find(r => r.id === doc.id)) {
            recommendations.push(data);
          }
        });
      }

      setRecommendedArticles(recommendations.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Fetch article
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const articleDoc = await getDoc(doc(firestore, "articles", id));
        if (articleDoc.exists()) {
          const article = { id: articleDoc.id, ...articleDoc.data() };
          setArticleData(article);
          await getRecommendedArticles(article);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  // Handle recommended click
  const handleRecommendedClick = (articleId) => {
    navigate(`/article/${articleId}`);
    window.scrollTo(0, 0);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <LoadingSkeleton />
        <Footer />
      </>
    );
  }

  // Article not found
  if (!articleData) {
    return (
      <>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <HeaderSpacer shrink={window.scrollY > 100} />
        <ArticleWrapper><h2>Article not found</h2></ArticleWrapper>
        <Footer />
      </>
    );
  }

  return (
    <>
      {articleData && (
        <Helmet>
          <title>{articleData.title}</title>
          <meta property="og:title" content={articleData.title} />
          <meta property="og:description" content={articleData.content.slice(0, 200) + "..."} />
          <meta property="og:image" content={`https://ourladyofguadalupe.vercel.app/api/og?title=${encodeURIComponent(articleData.title)}&image=${encodeURIComponent(articleData.image)}`} />
          <meta property="og:url" content={`https://ourladyofguadalupe.vercel.app/article/${id}`} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={`https://ourladyofguadalupe.vercel.app/api/og?title=${encodeURIComponent(articleData.title)}&image=${encodeURIComponent(articleData.image)}`} />
          <meta name="twitter:title" content={articleData.title} />
          <meta name="twitter:description" content={articleData.content.slice(0, 200) + "..."} />
        </Helmet>
      )}

      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <ArticleWrapper>
        <ImageContainer>
          <ArticleImage src={articleData.image} alt={articleData.title} />
        </ImageContainer>
        <ArticleContent>
          <Title>{articleData.title}</Title>
          <Meta>
            Posted on <span>{formatDate(articleData.date)}</span> in{" "}
            <span>{articleData.category}</span> by{" "}
            <span>{articleData.author}</span>
          </Meta>
          {articleData.content.split("\n\n").map((p, i) => (
            <Paragraph key={i}>{p}</Paragraph>
          ))}
        </ArticleContent>

        {recommendedArticles.length > 0 && (
          <RecommendedSection>
            <RecommendedTitle>Recommended Articles</RecommendedTitle>
            <RecommendedGrid>
              {recommendedArticles.map((article) => (
                <RecommendedCard key={article.id} onClick={() => handleRecommendedClick(article.id)}>
                  {article.image && (
                    <RecommendedImage src={article.image} alt={article.title} loading="lazy" />
                  )}
                  <RecommendedArticleTitle>{article.title}</RecommendedArticleTitle>
                  <RecommendedMeta>
                    {article.date && formatDate(article.date)} · {article.category}
                  </RecommendedMeta>
                </RecommendedCard>
              ))}
            </RecommendedGrid>
          </RecommendedSection>
        )}
      </ArticleWrapper>
      <Footer />
    </>
  );
}

export default Article;
