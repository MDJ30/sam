import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Header, HeaderSpacer } from '../components/Header';
import Footer from "../components/Footer";

const NewsWrapper = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const ArticleCard = styled.div`
  margin-bottom: 3rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 2rem;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    color: #222;
  }

  h2 a {
    text-decoration: none;
    color: #000;
    cursor: pointer;

    &:hover {
      color: #007bff;
    }
  }

  .meta {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;

    span {
      margin-right: 10px;
    }
  }

  .excerpt {
    font-size: 1rem;
    color: #444;
    margin-bottom: 1rem;
  }

  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
`;

const Button = styled.button`
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background: #000;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    background: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;

    &:disabled {
      background: #aaa;
      cursor: not-allowed;
    }

    &:hover:enabled {
      background: #0056b3;
    }
  }
`;

function News() {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const articlesPerPage = 10;

  useEffect(() => {
    const articlesRef = collection(firestore, "articles");
    const q = query(articlesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = [];
      snapshot.forEach((doc) => {
        articlesData.push({ id: doc.id, ...doc.data() });
      });
      setArticles(articlesData);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // 🔹 Handle article click with view count
  const handleArticleClick = async (articleId) => {
    if (!articleId) return;

    try {
      // Increment the view count
      const articleRef = doc(firestore, "articles", articleId);
      await updateDoc(articleRef, {
        views: increment(1),
        lastViewed: new Date(),
      });

      // Navigate to article
      navigate(`/article/${articleId}`);
    } catch (error) {
      console.error("Error updating view count:", error);
      // Still navigate even if there's an error
      navigate(`/article/${articleId}`);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeaderSpacer shrink={window.scrollY > 100} />
      <NewsWrapper>
        <h1>Latest News</h1>

        {currentArticles.length === 0 ? (
          <p>No articles available.</p>
        ) : (
          currentArticles.map((article) => (
            <ArticleCard key={article.id}>
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  onClick={() => handleArticleClick(article.id)}
                />
              )}
              <h2>
                <a onClick={() => handleArticleClick(article.id)}>
                  {article.title}
                </a>
              </h2>
              <div className="meta">
                Posted on{" "}
                <span>{formatDate(article.date)}</span> in{" "}
                <span>{article.category}</span> by{" "}
                <span>{article.author}</span>
              </div>
              <p className="excerpt">
                {article.content.length > 180
                  ? article.content.substring(0, 180) + "..."
                  : article.content}
              </p>
              <Button onClick={() => handleArticleClick(article.id)}>
                READ MORE
              </Button>
            </ArticleCard>
          ))
        )}

        {totalPages > 1 && (
          <Pagination>
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </Pagination>
        )}
      </NewsWrapper>
      <Footer />
    </>
  );
}

export default News;
