// Footer.js
import React from "react";
import styled from "styled-components";
import logo from "../2.png";

const FooterWrapper = styled.footer`
  background: #2f2f2f;
  color: #ddd;
  padding: 50px 20px 20px 20px;
  font-size: 14px;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
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

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;

  img {
    height: 120px;
    margin-bottom: 15px;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));

    &:hover {
      transform: scale(1.1);
    }
  }

  p {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin: 0;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    img {
      height: 100px;
    }

    p {
      font-size: 14px;
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

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <LogoContainer>
          <img src={logo} alt="Spirit FM Logo" />
          <p>OUR LADY OF GUADALUPE PARISH</p>
        </LogoContainer>

        <FooterColumn>
          <h4>Visit Us</h4>
          <p>
            <strong>Address</strong> <br />
            PHASE 6, DECA HOMES, TUGBOK DISTRICT, DAVAO CITY
          </p>
          <p>
            <strong>Contact #</strong>0912 216 5421<br />
            <strong>Tel #</strong> 287-7843<br />
            <strong>Priest's Hours:</strong> WEDNESDAY-THURSDAY: 9:00AM-11:30AM<br />
            <strong>Office Hours:</strong> TUESDAY-SUNDAY: 9:00AM-4:00PM
          </p>
        </FooterColumn>
      </FooterContent>

      <FooterBottom>
        Copyright © 2025 OUR LADY OF GUADALUPE PARISH. All rights reserved.
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;
