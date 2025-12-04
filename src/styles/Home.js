import styled from "styled-components";
import bg from "../pages/pics/logo.jpg";

export const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 50px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 15px 20px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Logo = styled.img`
  height: 100px;

  @media (max-width: 768px) {
    height: 80px;
  }
`;

export const HamburgerIcon = styled.div`
  display: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
    position: absolute;
    right: 20px;
    top: 20px;
    width: 30px;
    height: 22px;
    
    span {
      display: block;
      position: absolute;
      height: 3px;
      width: 100%;
      background: #333;
      transition: all 0.3s ease;
      
      &:nth-child(1) { top: 0; }
      &:nth-child(2) { top: 9px; }
      &:nth-child(3) { top: 18px; }
    }
    
    &.open {
      span:nth-child(1) {
        transform: rotate(45deg);
        top: 9px;
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: rotate(-45deg);
        top: 9px;
      }
    }
  }
`;

export const NavLinks = styled.ul`
  list-style: none;
  display: flex;
  gap: 25px;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    background: #fff;
    position: absolute;
    top: 100%;
    left: 0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
  }

  li {
    font-weight: 500;
    cursor: pointer;
    position: relative;

    &:hover {
      color: #c0392b;
    }

    &.active {
      color: #c0392b;
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
  }
`;

export const Hero = styled.section`
  width: 100%;
  height: ${props => props.height}px;
  background: url(${bg}) no-repeat center center;
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: height 0.3s ease-out;

  @media (max-width: 768px) {
    height: ${props => Math.max(150, props.height * 0.7)}px;
    background-size: 105%; /* Zoom out the image */
    background-position: top center; /* Adjust position to show more of the image */
  }

  @media (max-width: 480px) {
    background-size: 108%; /* Further zoom out for smaller devices */
  }
`;

export const HeroText = styled.div`
  background: rgba(0,0,0,0.6);
  padding: 20px 40px;
  border-radius: 10px;
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  text-align: center;

  @media (max-width: 768px) {
    padding: 15px 25px;
    font-size: 20px;
  }
`;

export const QuoteSection = styled.section`
  text-align: center;
  padding: 50px 20px;
  max-width: 900px;
  margin: auto;

  p {
    font-size: 20px;
    font-style: italic;
    color: #333;
    margin-bottom: 30px;

    @media (max-width: 768px) {
      font-size: 16px;
      padding: 0 15px;
    }
  }
`;

export const HeraldLogo = styled.img`
  height: 70px;

  @media (max-width: 768px) {
    height: 50px;
  }
`;