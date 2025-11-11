import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import styled from "styled-components";

const StatsWrapper = styled.div`
  padding: 2rem;
  width: 90%;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
`;

// 🔹 Password Protection Styles
const PasswordContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const PasswordBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }

  button {
    width: 100%;
    padding: 0.8rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: #0056b3;
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 0.9rem;
  margin-top: -0.8rem;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background: #f8f8f8;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  button {
    background: #007bff;
    border: none;
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background: #0056b3;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);

  h2 {
    margin-top: 0;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  button.close {
    background: #ccc;
    color: #333;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 1rem;
    float: right;

    &:hover {
      background: #999;
      color: white;
    }
  }
`;

const CommentCard = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.8rem;

  h4 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }

  p {
    font-size: 0.95rem;
    margin: 0.3rem 0;
    color: #444;
  }

  span {
    font-size: 0.8rem;
    color: #777;
  }
`;

// 🔹 Change this to your desired password
const ADMIN_PASSWORD = "admin123";

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 6px solid rgba(255,255,255,0.2);
  border-top-color: #007bff;
  animation: spin 0.9s linear infinite;
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: white;
  margin-top: 12px;
  font-size: 0.95rem;
  text-align: center;
`;

const AdminStatistics = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // NEW: loading state
  const [loading, setLoading] = useState(false);

  // 🔹 Handle password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      setPasswordInput("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const q = query(collection(firestore, "articles"), orderBy("views", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const articlesData = [];

        for (const docSnap of snapshot.docs) {
          const article = { id: docSnap.id, ...docSnap.data() };

          // 🔹 Fetch reactions
          const reactionsRef = collection(firestore, "articles", docSnap.id, "reactions");
          const reactionsSnap = await getDocs(reactionsRef);
          let likes = 0;
          let loves = 0;
          reactionsSnap.forEach((r) => {
            const data = r.data();
            if (data.type === "like") likes++;
            if (data.type === "love") loves++;
          });

          // 🔹 Fetch comments
          const commentsRef = collection(firestore, "articles", docSnap.id, "comments");
          const commentsSnap = await getDocs(commentsRef);
          const commentCount = commentsSnap.size;

          // 🔹 Add computed stats
          articlesData.push({
            ...article,
            likes,
            loves,
            comments: commentCount,
          });
        }

        setArticles(articlesData);
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, [isAuthenticated]);

  // 🔹 Open modal and fetch article comments
  const handleViewComments = async (articleId, title) => {
    const commentsRef = collection(firestore, "articles", articleId, "comments");
    const commentsQuery = query(commentsRef, orderBy("timestamp", "desc"));
    const commentsSnap = await getDocs(commentsQuery);

    const commentsData = commentsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSelectedArticle(title);
    setComments(commentsData);
    setShowModal(true);
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

  // 🔹 Show password screen if not authenticated
  if (!isAuthenticated) {
    return (
      <PasswordContainer>
        <PasswordBox>
          <h2>🔒 Admin Access</h2>
          <p>Enter your password to access the statistics dashboard</p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />
            {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
            <button type="submit">Access Dashboard</button>
          </form>
        </PasswordBox>
      </PasswordContainer>
    );
  }

  return (
    <StatsWrapper>
      {loading && (
        <LoadingOverlay>
          <div style={{ textAlign: "center" }}>
            <Spinner />
            <LoadingText>Loading statistics…</LoadingText>
          </div>
        </LoadingOverlay>
      )}

      <Title>📈 Article Statistics & Insights</Title>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Views</th>
            <th>👍 Likes</th>
            <th>❤️ Loves</th>
            <th>💬 Comments</th>
            <th>Last Viewed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.views || 0}</td>
              <td>{a.likes || 0}</td>
              <td>{a.loves || 0}</td>
              <td>{a.comments || 0}</td>
              <td>
                {a.lastViewed
                  ? new Date(a.lastViewed.seconds * 1000).toLocaleString()
                  : "—"}
              </td>
              <td>
                <button onClick={() => handleViewComments(a.id, a.title)}>
                  View Comments
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 🔹 Comments Modal */}
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>💬 Comments for "{selectedArticle}"</h2>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <CommentCard key={comment.id}>
                  <h4>{comment.name}</h4>
                  <p>{comment.text}</p>
                  <span>{formatTimestamp(comment.timestamp)}</span>
                </CommentCard>
              ))
            )}
            <button className="close" onClick={() => setShowModal(false)}>
              Close
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </StatsWrapper>
  );
};

export default AdminStatistics;
