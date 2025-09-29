// Article.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ArticleWrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: "Georgia", serif;
  color: #222;
  line-height: 1.7;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #111;
`;

const Meta = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;

  span {
    font-weight: 500;
    color: #444;
  }
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
`;

const ImageContainer = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ArticleContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

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
    return <div>Loading...</div>;
  }

  if (!articleData) {
    return <div>Article not found</div>;
  }

  return (
    <>
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
            Posted on <span>{articleData.date}</span> in{" "}
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
