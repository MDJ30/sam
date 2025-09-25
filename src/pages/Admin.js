import React, { useState, useEffect } from 'react';
import { ref, push, set } from 'firebase/database';
import { collection, addDoc } from 'firebase/firestore';
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

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [headline, setHeadline] = useState({ 
    title: '', 
    date: '', 
    imageUrl: '' // Changed from image to imageUrl
  });
  const [localNews, setLocalNews] = useState({ 
    title: '', 
    date: '', 
    imageUrl: '' // Changed from image to imageUrl
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

  const handleHeadlineSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, headline: true }));
    try {
      // Using Firestore for headlines
      const headlinesRef = collection(firestore, 'headlines');
      await addDoc(headlinesRef, {
        ...headline,
        timestamp: new Date()
      });
      
      setHeadline({ title: '', date: '', imageUrl: '' });
      setMessage({
        text: 'Headline added successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding headline:', error);
      setMessage({
        text: 'Failed to add headline. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, headline: false }));
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleLocalNewsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, localNews: true }));
    try {
      // Using Realtime Database for local news
      const newsRef = ref(db, 'localNews');
      await push(newsRef, {
        ...localNews,
        timestamp: Date.now()
      });
      
      setLocalNews({ title: '', date: '', imageUrl: '' });
      setMessage({
        text: 'Local news added successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding local news:', error);
      setMessage({
        text: 'Failed to add local news. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(prev => ({ ...prev, localNews: false }));
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
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
        <h2>Add Headline</h2>
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
            type="url"
            placeholder="Image URL"
            value={headline.imageUrl}
            onChange={(e) => setHeadline({...headline, imageUrl: e.target.value})}
            required
          />
          <Button type="submit" disabled={isLoading.headline}>
            {isLoading.headline ? <LoadingSpinner /> : 'Add Headline'}
          </Button>
        </Form>
      </Section>

      <Section>
        <h2>Add Local News</h2>
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
            type="url"
            placeholder="Image URL"
            value={localNews.imageUrl}
            onChange={(e) => setLocalNews({...localNews, imageUrl: e.target.value})}
            required
          />
          <Button type="submit" disabled={isLoading.localNews}>
            {isLoading.localNews ? <LoadingSpinner /> : 'Add Local News'}
          </Button>
        </Form>
      </Section>

      <Section>
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