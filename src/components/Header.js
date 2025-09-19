import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import logo from "../2.png";
import styled from 'styled-components';
import {
  Navbar,
  Logo,
  HamburgerIcon,
} from "../styles/Home";

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #333;
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

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  return (
    <>
      <Navbar>
  <Logo src={logo} alt="Spirit FM Logo" />

  <HamburgerIcon
    className={isMenuOpen ? 'open' : ''}
    onClick={() => setIsMenuOpen(!isMenuOpen)}
  >
    <span></span>
    <span></span>
    <span></span>
  </HamburgerIcon>

  {/* ✅ now NavLinks will only appear on mobile when open */}
  <NavLinks isOpen={isMenuOpen}>
    <li><StyledNavLink to="/">Home</StyledNavLink></li>
    <li><StyledNavLink to="/about">About Us</StyledNavLink></li>
    <li><StyledNavLink to="/programs">Programs</StyledNavLink></li>
    <li><StyledNavLink to="/team">Team</StyledNavLink></li>
    <li><StyledNavLink to="/videos">Videos</StyledNavLink></li>
    <li><StyledNavLink to="/contact">Contact Us</StyledNavLink></li>
    <li>
      <SearchContainer>
        <SearchBar
          type="text"
          placeholder="Search..."
          isOpen={isSearchOpen}
          id="searchInput"
        />
        <SearchIcon onClick={handleSearchClick} />
      </SearchContainer>
    </li>
  </NavLinks>
</Navbar>

      {/* Mobile overlay (dark background) */}
    <MobileMenuOverlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />

    </>
  );
};

export default Header;
