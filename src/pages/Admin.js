import React, { useState, useEffect } from 'react';
import { ref, push, set, remove, onValue } from 'firebase/database'; // Added onValue here
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, firestore } from '../config/firebase';
import styled from 'styled-components';

const AdminWrapper = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  text-align: center;
  
  ${({ type }) => type === 'success' && `
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  `}
  
  ${({ type }) => type === 'error' && `
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-top: 1rem;
  border-radius: 4px;
`;

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [headline, setHeadline] = useState({ 
    title: '', 
    date: '', 
    image: null,
    imagePreview: null
  });
  const [localNews, setLocalNews] = useState({ 
    title: '', 
    date: '', 
    image: null,
    imagePreview: null
  });
  const [quote, setQuote] = useState('');
  const [isLoading, setIsLoading] = useState({
    headline: false,
    localNews: false,
    quote: false
  });
  const [message, setMessage] = useState({
    text: '',
    type: ''
  });
  const [currentContent, setCurrentContent] = useState({
    headlines: [],
    localNews: [],
    quote: ''
  });
  const [editMode, setEditMode] = useState({
    headline: null,
    localNews: null
  });

  useEffect(() => {
    const checkCredentials = () => {
      const username = prompt('Enter username:');
      const password = prompt('Enter password:');

      // Replace with your desired credentials
      if (username === 'admin' && password === 'admin123') {
        setIsAuthenticated(true);
        console.log('Login successful!');
      } else {
        console.error('Invalid credentials');
        checkCredentials(); // Retry if credentials are invalid
      }
    };

    if (!isAuthenticated) {
      checkCredentials();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Fetch headlines from Firestore
    const headlinesRef = collection(firestore, 'headlines');
    const unsubscribeHeadlines = onSnapshot(headlinesRef, (snapshot) => {
      const headlines = [];
      snapshot.forEach(doc => {
        headlines.push({ id: doc.id, ...doc.data() });
      });
      setCurrentContent(prev => ({ ...prev, headlines }));
    });

    // Fetch local news from Realtime Database
    const newsRef = ref(db, 'localNews');
    const unsubscribeNews = onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const news = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setCurrentContent(prev => ({ ...prev, localNews: news }));
      }
    });

    // Fetch quote
    const quoteRef = ref(db, 'quote');
    const unsubscribeQuote = onValue(quoteRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentContent(prev => ({ ...prev, quote: data || '' }));
    });

    return () => {
      unsubscribeHeadlines();
      unsubscribeNews();
      unsubscribeQuote();
    };
  }, []);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64Image = await convertToBase64(file);
        if (type === 'headline') {
          setHeadline(prev => ({
            ...prev,
            image: base64Image,
            imagePreview: URL.createObjectURL(file)
          }));
        } else {
          setLocalNews(prev => ({
            ...prev,
            image: base64Image,
            imagePreview: URL.createObjectURL(file)
          }));
        }
      } catch (error) {
        console.error('Error converting image:', error);
        setMessage({
          text: 'Failed to process image. Please try again.',
          type: 'error'
        });
      }
    }
  };

  const handleHeadlineSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, headline: true }));
    try {
      if (editMode.headline) {
        await updateDoc(doc(firestore, 'headlines', editMode.headline), {
          title: headline.title,
          date: headline.date,
          image: headline.image,
          timestamp: new Date()
        });
        setMessage({ text: 'Headline updated successfully!', type: 'success' });
        setEditMode({ ...editMode, headline: null });
      } else {
        const headlinesRef = collection(firestore, 'headlines');
        await addDoc(headlinesRef, {
          title: headline.title,
          date: headline.date,
          image: headline.image,
          timestamp: new Date()
        });
        
        setMessage({
          text: 'Headline added successfully!',
          type: 'success'
        });
      }
      setHeadline({ title: '', date: '', image: null, imagePreview: null });
    } catch (error) {
      console.error('Error with headline:', error);
      setMessage({ text: 'Operation failed. Please try again.', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, headline: false }));
    }
  };

  const handleLocalNewsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, localNews: true }));
    try {
      if (editMode.localNews) {
        await updateDoc(doc(firestore, 'localNews', editMode.localNews), {
          title: localNews.title,
          date: localNews.date,
          image: localNews.image,
          timestamp: new Date()
        });
        setMessage({ text: 'Local news updated successfully!', type: 'success' });
        setEditMode({ ...editMode, localNews: null });
      } else {
        const newsRef = ref(db, 'localNews');
        await push(newsRef, {
          title: localNews.title,
          date: localNews.date,
          image: localNews.image,
          timestamp: Date.now()
        });
        
        setMessage({
          text: 'Local news added successfully!',
          type: 'success'
        });
      }
      setLocalNews({ title: '', date: '', image: null, imagePreview: null });
    } catch (error) {
      console.error('Error with local news:', error);
      setMessage({ text: 'Operation failed. Please try again.', type: 'error' });
    } finally {
      setIsLoading(prev => ({ ...prev, localNews: false }));
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, quote: true }));
    try {
      const quoteRef = ref(db, 'quote');
      await set(quoteRef, quote);
      setQuote('');
      setMessage({
        text: 'Quote updated successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating quote:', error);
      setMessage({
        text: 'Failed to update quote. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, quote: false }));
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleDeleteHeadline = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'headlines', id));
      setMessage({ text: 'Headline deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting headline:', error);
      setMessage({ text: 'Failed to delete headline', type: 'error' });
    }
  };

  const handleDeleteLocalNews = async (id) => {
    try {
      await remove(ref(db, `localNews/${id}`));
      setMessage({ text: 'Local news deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting local news:', error);
      setMessage({ text: 'Failed to delete local news', type: 'error' });
    }
  };

  const handleEditHeadline = async (headline) => {
    setHeadline({
      title: headline.title,
      date: headline.date,
      image: headline.image,
      imagePreview: headline.image
    });
    setEditMode({ ...editMode, headline: headline.id });
  };

  const handleEditLocalNews = async (news) => {
    setLocalNews({
      title: news.title,
      date: news.date,
      image: news.image,
      imagePreview: news.image
    });
    setEditMode({ ...editMode, localNews: news.id });
  };

  if (!isAuthenticated) {
    return <div>Authenticating...</div>;
  }

  return (
    <AdminWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <Button onClick={() => setIsAuthenticated(false)}>Logout</Button>
      </div>
      
      {message.text && (
        <Message type={message.type}>{message.text}</Message>
      )}
      
      <Section>
        <h2>Current Headlines</h2>
        <div style={{ marginBottom: '2rem' }}>
          {currentContent.headlines.map(headline => (
            <div key={headline.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <img 
                src={headline.image} 
                alt={headline.title} 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h3>{headline.title}</h3>
                <p>{headline.date}</p>
              </div>
              <div>
                <Button onClick={() => handleEditHeadline(headline)}>Edit</Button>
                <Button 
                  onClick={() => handleDeleteHeadline(headline.id)}
                  style={{ backgroundColor: '#dc3545', marginLeft: '0.5rem' }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        <h2>{editMode.headline ? 'Edit Headline' : 'Add Headline'}</h2>
        <Form onSubmit={handleHeadlineSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={headline.title}
            onChange={(e) => setHeadline({...headline, title: e.target.value})}
            required
          />
          <Input
            type="date"
            value={headline.date}
            onChange={(e) => setHeadline({...headline, date: e.target.value})}
            required
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'headline')}
            required
          />
          {headline.imagePreview && (
            <ImagePreview src={headline.imagePreview} alt="Preview" />
          )}
          <Button type="submit" disabled={isLoading.headline}>
            {isLoading.headline ? <LoadingSpinner /> : 'Add Headline'}
          </Button>
        </Form>
      </Section>

      <Section>
        <h2>Current Local News</h2>
        <div style={{ marginBottom: '2rem' }}>
          {currentContent.localNews.map(news => (
            <div key={news.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}>
              <img 
                src={news.image} 
                alt={news.title} 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h3>{news.title}</h3>
                <p>{news.date}</p>
              </div>
              <div>
                <Button onClick={() => handleEditLocalNews(news)}>Edit</Button>
                <Button 
                  onClick={() => handleDeleteLocalNews(news.id)}
                  style={{ backgroundColor: '#dc3545', marginLeft: '0.5rem' }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        <h2>{editMode.localNews ? 'Edit Local News' : 'Add Local News'}</h2>
        <Form onSubmit={handleLocalNewsSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={localNews.title}
            onChange={(e) => setLocalNews({...localNews, title: e.target.value})}
            required
          />
          <Input
            type="date"
            value={localNews.date}
            onChange={(e) => setLocalNews({...localNews, date: e.target.value})}
            required
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'localNews')}
            required
          />
          {localNews.imagePreview && (
            <ImagePreview src={localNews.imagePreview} alt="Preview" />
          )}
          <Button type="submit" disabled={isLoading.localNews}>
            {isLoading.localNews ? <LoadingSpinner /> : 'Add Local News'}
          </Button>
        </Form>
      </Section>

      <Section>
        <h2>Current Quote</h2>
        <div style={{ 
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <p>{currentContent.quote}</p>
        </div>

        <h2>Update Quote</h2>
        <Form onSubmit={handleQuoteSubmit}>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows="4"
            placeholder="Enter quote"
          />
          <Button type="submit" disabled={isLoading.quote}>
            {isLoading.quote ? <LoadingSpinner /> : 'Update Quote'}
          </Button>
        </Form>
      </Section>
    </AdminWrapper>
  );
}

export default Admin;