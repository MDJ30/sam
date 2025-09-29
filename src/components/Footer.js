// Footer.js
import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const FooterWrapper = styled.footer`
  background: #2f2f2f;
  color: #ddd;
  padding: 50px 20px 20px 20px;
  font-size: 14px;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
`;

const FooterColumn = styled.div`
  flex: 1;
  min-width: 250px;

  h4 {
    font-size: 14px;
    color: #fff;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    margin-bottom: 10px;
    line-height: 1.6;
  }

  strong {
    color: #fff;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;

  input {
    padding: 8px 12px;
    border: none;
    outline: none;
    width: 220px;
    border-radius: 2px 0 0 2px;
  }

  button {
    background: #000;
    border: none;
    padding: 9px 12px;
    cursor: pointer;
    color: #fff;
    border-radius: 0 2px 2px 0;

    &:hover {
      background: #444;
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #444;
  padding-top: 15px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
`;

// Responsive styling
const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    ${FooterContent} {
      flex-direction: column;
      align-items: flex-start;
    }

    ${SearchBox} input {
      width: 100%;
    }
  }
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <ResponsiveWrapper>
        <FooterContent>
          <FooterColumn>
            <h4>About Us</h4>
            <p>
              DXGN 89.9 Spirit FM is the official Catholic radio station owned
              and operated by the Archdiocese of Davao.
            </p>
          </FooterColumn>

          <FooterColumn>
            <h4>Visit Us</h4>
            <p>
              <strong>Address</strong> <br />
              PHASE 6, DECA HOMES, TUGBOK DISTRICT, DAVAO CITY
            </p>
            <p>
              <strong>Contact #</strong>09055162157<br />
              <strong>Tel #</strong>287-7843<br />
              <strong>Priest's Hours:</strong> WEDNESDAY-THURSDAY: 9:00AM-11:30AM<br />
              <strong>Office Hours:</strong> TUESDAY-SUNDAY: 9:00AM-4:00PM
            </p>
          </FooterColumn>

          <FooterColumn>
            <h4>Search</h4>
            <SearchBox>
              <input type="text" placeholder="Search..." />
              <button>
                <FaSearch />
              </button>
            </SearchBox>
          </FooterColumn>
        </FooterContent>
      </ResponsiveWrapper>

      <FooterBottom>
        Copyright © 2025 OUR LADY OF GUADALUPE PARISH. All rights reserved.
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;
