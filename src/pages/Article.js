// Article.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import styled, { keyframes } from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

// Add loading animation keyframes
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
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

const SkeletonImage = styled.div`
  width: 100%;
  height: 400px;
  background: #f0f0f0;
  margin-bottom: 2rem;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;

  @media (max-width: 768px) {
    height: 250px;
    margin-bottom: 1.5rem;
  }
`;

const SkeletonTitle = styled.div`
  width: 80%;
  height: 40px;
  background: #f0f0f0;
  margin-bottom: 1rem;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
`;

const SkeletonMeta = styled.div`
  width: 60%;
  height: 20px;
  background: #f0f0f0;
  margin-bottom: 2rem;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
`;

const SkeletonParagraph = styled.div`
  width: 100%;
  height: 100px;
  background: #f0f0f0;
  margin-bottom: 1rem;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 600px 100%;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

  span {
    font-weight: 500;
    color: #444;
  }

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

  @media (max-width: 768px) {
    height: auto;
  }
`;

const ArticleContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long", // This displays month as words (e.g., "September" instead of "09")
    day: "numeric",
    year: "numeric",
  });
};

function LoadingSkeleton() {
  return (
    <LoadingContainer>
      <SkeletonImage />
      <SkeletonTitle />
      <SkeletonMeta />
      <SkeletonParagraph />
      <SkeletonParagraph />
      <SkeletonParagraph />
    </LoadingContainer>
  );
}

function Article() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get article ID from URL

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleDoc = await getDoc(doc(firestore, "articles", id));
        if (articleDoc.exists()) {
          setArticleData(articleDoc.data());
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <LoadingSkeleton />
        <Footer />
      </>
    );
  }

  if (!articleData) {
    return (
      <>
        <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <ArticleWrapper>
          <h2>Article not found</h2>
        </ArticleWrapper>
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
          <meta
            property="og:description"
            content={articleData.content.slice(0, 200) + "..."}
          />
          <meta
            property="og:image"
            content={`https://ourladyofguadalupe.vercel.app/api/og?title=${encodeURIComponent(
              articleData.title
            )}&image=${encodeURIComponent(articleData.image)}`}
          />
          <meta
            property="og:url"
            content={`https://ourladyofguadalupe.vercel.app/article/${id}`}
          />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:image"
            content={`https://ourladyofguadalupe.vercel.app/api/og?title=${encodeURIComponent(
              articleData.title
            )}&image=${encodeURIComponent(articleData.image)}`}
          />
          <meta name="twitter:title" content={articleData.title} />
          <meta
            name="twitter:description"
            content={articleData.content.slice(0, 200) + "..."}
          />
        </Helmet>
      )}
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <ArticleWrapper>
        <ImageContainer>
          <ArticleImage
            src={articleData.image}
            alt={articleData.title}
          />
        </ImageContainer>
        <ArticleContent>
          <Title>{articleData.title}</Title>
          <Meta>
            Posted on{" "}
            <span>{formatDate(articleData.date)}</span> in{" "}
            <span>{articleData.category}</span> by{" "}
            <span>{articleData.author}</span>
          </Meta>
          {articleData.content.split("\n\n").map((paragraph, index) => (
            <Paragraph key={index}>{paragraph}</Paragraph>
          ))}
        </ArticleContent>
      </ArticleWrapper>
      <Footer />
    </>
  );
}

export default Article;
