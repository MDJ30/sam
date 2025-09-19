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

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 15px;
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

const SearchBar = styled.input`
  position: absolute;
  right: 25px;
  width: ${props => props.isOpen ? '200px' : '0'};
  padding: ${props => props.isOpen ? '8px 35px 8px 12px' : '0'};
  border: ${props => props.isOpen ? '1px solid #ddd' : 'none'};
  border-radius: 20px;
  outline: none;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  background: white;
  z-index: 1;

  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '150px' : '0'};
    right: 20px;
  }
`;

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
`;

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('searchInput').focus();
      }, 100);
    }
  };

  return (
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
      <NavLinks isOpen={isMenuOpen}>
        <li><StyledNavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</StyledNavLink></li>
        <li><StyledNavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About Us</StyledNavLink></li>
        <li><StyledNavLink to="/programs" className={({ isActive }) => isActive ? 'active' : ''}>Programs</StyledNavLink></li>
        <li><StyledNavLink to="/team" className={({ isActive }) => isActive ? 'active' : ''}>Team</StyledNavLink></li>
        <li><StyledNavLink to="/videos" className={({ isActive }) => isActive ? 'active' : ''}>Videos</StyledNavLink></li>
        <li><StyledNavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact Us</StyledNavLink></li>
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
  );
};

export default Header;