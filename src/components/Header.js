import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import logo from "../2.png";
import styled from 'styled-components';
import {
  HamburgerIcon,
} from "../styles/Home";

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${({ $isActive }) => $isActive ? '#c0392b' : '#333'};
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #c0392b;
  }

  &.active {
    color: #c0392b;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background: #c0392b;
    }
  }
`;
const SearchIcon = styled(FaSearch)`
  cursor: pointer;
  font-size: 18px;
  color: #333;
  transition: color 0.3s ease;
  z-index: 2;

  &:hover {
    color: #c0392b;
  }
`;

// ✅ NavLinks fixed
const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin: 0 10px;
  }

  li:last-child {
    margin-left: auto;
    padding-left: 15px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 20px 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 100;
    transition: all 0.3s ease;

    /* 👇 hide menu by default */
    opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-20px')});

    li {
      margin: 10px 0;
      width: 100%;
      text-align: center;
      opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
      transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-10px')});
      transition: all 0.3s ease;
    }
  }
`;



const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 15px;

  @media (max-width: 768px) {
    width: 80%;
    margin: 10px auto;
    justify-content: center;
  }
`;
const HeaderSpacer = styled.div`
  height: ${({ shrink }) => (shrink ? '60px' : '80px')};
  
  @media (max-width: 768px) {
    height: ${({ shrink }) => (shrink ? '50px' : '70px')};
  }
`;

const SearchBar = styled.input`
  position: absolute;
  right: 25px;
  width: ${({ isOpen }) => (isOpen ? "200px" : "0")};
  padding: ${({ isOpen }) => (isOpen ? "8px 35px 8px 12px" : "0")};
  border: ${({ isOpen }) => (isOpen ? "1px solid #ddd" : "none")};
  border-radius: 20px;
  outline: none;
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  transition: all 0.3s ease;
  background: white;
  z-index: 1;

  @media (max-width: 768px) {
    position: relative;
    right: auto;
    width: ${({ isOpen }) => (isOpen ? "100%" : "0")};
    max-width: 200px;
    margin: 0 auto;
  }
`;

const MobileMenuOverlay = styled.div`
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
    visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
    transition: all 0.3s ease;
    z-index: 99;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  right: 25px;
  width: 200px;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
  display: ${({ show }) => (show ? 'block' : 'none')};

  @media (max-width: 768px) {
    right: 50%;
    transform: translateX(50%);
    width: 80%;
    max-width: 300px;
  }
`;

const SearchResultItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
  transform: translateY(${({ hide }) => (hide ? '-100%' : '0')});
  background: white;
`;

const Navbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ shrink }) => (shrink ? '0.5rem 2rem' : '1rem 2rem')};
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: ${({ shrink }) => (shrink ? '0.5rem 1rem' : '1rem')};
  }
`;

const Logo = styled.img`
  height: ${({ shrink }) => (shrink ? '40px' : '50px')};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    height: ${({ shrink }) => (shrink ? '30px' : '40px')};
  }
`;

const SCROLL_THRESHOLD = 100;

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [articles, setArticles] = useState([]);
  const [shrink, setShrink] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on page refresh
  useEffect(() => {
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };

    // Scroll to top when location changes
    window.scrollTo(0, 0);

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  // Reset active link when route changes
 useEffect(() => {
  const handleScroll = () => {
    const isHomePage = location.pathname === "/";
    const isNewsPage = location.pathname === "/news";

    if (isHomePage) {
      setActiveLink("home");
    } else if (isNewsPage) {
      setActiveLink("news");
    } else {
      const path = location.pathname.substring(1);
      setActiveLink(path || "home");
    }
  };

  // Initial state when route changes
  if (location.pathname === "/news") {
    setActiveLink("news");
  }
  
  handleScroll();
  window.addEventListener("scroll", handleScroll);
  
  return () => window.removeEventListener("scroll", handleScroll);
}, [location]);


  // Add this new useEffect for fetching articles
  useEffect(() => {
    const articlesRef = collection(firestore, 'articles');
    const unsubscribe = onSnapshot(
      query(articlesRef, orderBy('timestamp', 'desc')),
      (snapshot) => {
        const articlesData = [];
        snapshot.forEach(doc => {
          articlesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setArticles(articlesData);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add search handler
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // Add result click handler
  const handleResultClick = (articleId) => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(`/article/${articleId}`);
  };

  const handleNavClick = (linkName) => {
    setActiveLink(linkName);
    setIsMenuOpen(false);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    setActiveLink("home");
    setIsMenuOpen(false);
    navigate('/');
    window.scrollTo(0, 0);
  };

  // Update the handleNewsClick function
const handleNewsClick = (e) => {
  e.preventDefault();
  navigate('/news', { state: { fromOtherPage: true } });
  setIsMenuOpen(false);
  // Don't set active link here as it will be handled by useEffect
};

  // Add this new useEffect for scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if header should shrink
      if (currentScrollY > SCROLL_THRESHOLD) {
        setShrink(true);
      } else {
        setShrink(false);
      }

      // Determine if header should hide
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <HeaderContainer hide={hideHeader}>
      <Navbar shrink={shrink}>
        <Logo src={logo} alt="Spirit FM Logo" shrink={shrink} />
        <HamburgerIcon
          className={isMenuOpen ? 'open' : ''}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </HamburgerIcon>

        <NavLinks isOpen={isMenuOpen}>
          <li>
            <StyledNavLink
              as="a"
              href="/"
              className={activeLink === "home" ? "active" : ""}
              onClick={handleHomeClick}
            >
              Home
            </StyledNavLink>
          </li>
          <li>
            <StyledNavLink 
              to="/about"
              onClick={() => handleNavClick('about')}
            >
              About Us
            </StyledNavLink>
          </li>
     <li>
  <StyledNavLink 
    to="/news"
    className={activeLink === "news" ? "active" : ""}
    onClick={handleNewsClick}
    $isActive={activeLink === "news"}
  >
    News
  </StyledNavLink>
</li>
          <li>
            <StyledNavLink 
              to="/team"
              onClick={() => handleNavClick('team')}
            >
              Team
            </StyledNavLink>
          </li>
          
          <li>
            <SearchContainer>
              <SearchBar
                type="text"
                placeholder="Search articles..."
                isOpen={isSearchOpen}
                id="searchInput"
                value={searchQuery}
                onChange={handleSearch}
              />
              <SearchIcon onClick={handleSearchClick} />
              <SearchResults show={searchResults.length > 0 && isSearchOpen}>
                {searchResults.map(article => (
                  <SearchResultItem
                    key={article.id}
                    onClick={() => handleResultClick(article.id)}
                  >
                    {article.title}
                  </SearchResultItem>
                ))}
              </SearchResults>
            </SearchContainer>
          </li>
        </NavLinks>
      </Navbar>
      <MobileMenuOverlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
    </HeaderContainer>
  );
};
export { Header, HeaderSpacer };
