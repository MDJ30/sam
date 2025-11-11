import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import styled, { keyframes } from "styled-components";
import { Header, HeaderSpacer } from "../components/Header";
import Footer from "../components/Footer";

// ✨ Animation for shimmer
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const LoadingContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
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

// ✨ Fade-in effect
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ✨ Styled components
const ArticleWrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

const Meta = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;
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

const RecommendedSection = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
`;

const RecommendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
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
`;

// 🆕 Reaction and Comment Styles
const ReactionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0 1rem;
  button {
    background: #f5f5f5;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    &:hover { background: #eaeaea; }
    &.active { background: #007bff; color: white; }
  }
`;

const CommentSection = styled.div`
  margin-top: 3rem;
`;

const CommentInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  input, textarea {
    margin-bottom: 0.5rem;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  button {
    align-self: flex-end;
    background: #007bff;
    color: white;
    padding: 0.5rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    &:hover { background: #0056b3; }
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentCard = styled.div`
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  h4 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }
  p {
    margin-top: 0.3rem;
    font-size: 0.95rem;
    color: #444;
  }
  span {
    font-size: 0.8rem;
    color: #888;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};
const formatTimestamp = (ts) => {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : ts;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Article() {
  const [articleData, setArticleData] = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reaction, setReaction] = useState(null);
  const [reactionsCount, setReactionsCount] = useState({ like: 0, love: 0 });
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch article
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const articleDoc = await getDoc(doc(firestore, "articles", id));
        if (articleDoc.exists()) {
          const article = { id: articleDoc.id, ...articleDoc.data() };
          setArticleData(article);
          // fetch recommendations based on the loaded article
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

  // set document title instead of Helmet
  useEffect(() => {
    if (articleData && articleData.title) {
      document.title = articleData.title;
    }
  }, [articleData]);

  // Real-time reactions and comments
  useEffect(() => {
    if (!id) return;

    const reactionsRef = collection(firestore, "articles", id, "reactions");
    const unsubscribeReactions = onSnapshot(reactionsRef, (snapshot) => {
      let counts = { like: 0, love: 0 };
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "like") counts.like++;
        if (data.type === "love") counts.love++;
      });
      setReactionsCount(counts);
    });

    const commentsRef = collection(firestore, "articles", id, "comments");
    const commentsQuery = query(commentsRef, orderBy("timestamp", "desc"));
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      const commentsList = [];
      snapshot.forEach((doc) => commentsList.push({ id: doc.id, ...doc.data() }));
      setComments(commentsList);
    });

    return () => {
      unsubscribeReactions();
      unsubscribeComments();
    };
  }, [id]);

  // added: centralized recommended fetch function
  const getRecommendedArticles = async (currentArticle) => {
    try {
      const articlesRef = collection(firestore, "articles");

      // First try: same category (most recent)
      const categoryQuery = query(articlesRef, orderBy("timestamp", "desc"), limit(6));
      const categorySnapshot = await getDocs(categoryQuery);
      let recommendations = [];
      categorySnapshot.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        if (docSnap.id !== id && data.category === currentArticle.category) {
          recommendations.push(data);
        }
      });

      // If fewer than 3, add recent articles regardless of category
      if (recommendations.length < 3) {
        const recentQuery = query(articlesRef, orderBy("timestamp", "desc"), limit(6));
        const recentSnapshot = await getDocs(recentQuery);
        recentSnapshot.forEach((docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };
          if (docSnap.id !== id && !recommendations.find((r) => r.id === docSnap.id)) {
            recommendations.push(data);
          }
        });
      }

      setRecommendedArticles(recommendations.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleReaction = async (type) => {
    try {
      const userId = "anonymous";
      const reactionRef = doc(firestore, "articles", id, "reactions", userId);

      if (reaction === type) {
        setReaction(null);
        await setDoc(reactionRef, { type: null });
      } else {
        setReaction(type);
        await setDoc(reactionRef, { type });
      }
    } catch (error) {
      console.error("Error setting reaction:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentName.trim() || !commentText.trim()) return alert("Please fill out all fields.");

    try {
      const commentsRef = collection(firestore, "articles", id, "comments");
      await addDoc(commentsRef, {
        name: commentName,
        text: commentText,
        timestamp: serverTimestamp(),
      });
      setCommentName("");
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <LoadingSkeleton />
        <Footer />
      </>
    );

  if (!articleData)
    return (
      <>
        <Header />
        <ArticleWrapper><h2>Article not found</h2></ArticleWrapper>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <ArticleWrapper>
        <ImageContainer>
          <ArticleImage src={articleData.image} alt={articleData.title} />
        </ImageContainer>
        <Title>{articleData.title}</Title>
        <Meta>
          Posted on {formatDate(articleData.date)} · {articleData.category} · {articleData.author}
        </Meta>

        {articleData.content.split("\n\n").map((p, i) => (
          <Paragraph key={i}>{p}</Paragraph>
        ))}

        {/* 🆕 Reaction Bar */}
        <ReactionBar>
          <button
            className={reaction === "like" ? "active" : ""}
            onClick={() => handleReaction("like")}
          >
            👍 {reactionsCount.like}
          </button>
          <button
            className={reaction === "love" ? "active" : ""}
            onClick={() => handleReaction("love")}
          >
            ❤️ {reactionsCount.love}
          </button>
        </ReactionBar>

        {/* 🆕 Comments */}
        <CommentSection>
          <h3>Comments ({comments.length})</h3>
          <CommentInput>
            <input
              type="text"
              placeholder="Your name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
            />
            <textarea
              rows="3"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
          </CommentInput>

          <CommentList>
            {comments.map((comment) => (
              <CommentCard key={comment.id}>
                <h4>{comment.name}</h4>
                <p>{comment.text}</p>
                <span>{formatTimestamp(comment.timestamp)}</span>
              </CommentCard>
            ))}
          </CommentList>
        </CommentSection>

        {/* 🆕 Recommended Articles */}
        {recommendedArticles.length > 0 && (
          <RecommendedSection>
            <h3>Recommended for you</h3>
            <RecommendedGrid>
              {recommendedArticles.map((rec) => (
                <RecommendedCard
                  key={rec.id}
                  onClick={() => navigate(`/article/${rec.id}`)}
                >
                  <RecommendedImage src={rec.image} alt={rec.title} />
                  <RecommendedArticleTitle>{rec.title}</RecommendedArticleTitle>
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
