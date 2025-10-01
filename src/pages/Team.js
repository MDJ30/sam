// Team.js
import React from "react";
import styled from "styled-components";
import { Header, HeaderSpacer } from "../components/Header";
import Footer from "../components/Footer";
import sam from "../sam.jpg";

const TeamContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 40px;
  max-width: 1200px;
  margin: auto;
`;

const Card = styled.div`
  background: #fff;
  border: 2px solid #eaeaea;
  border-radius: 12px;
  text-align: center;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #ff6600;
  }
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 15px;
  border: 3px solid #ff6600;
  border-radius: 8px; /* <-- box with slightly rounded corners */
`;

const Name = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const Title = styled.p`
  margin: 5px 0 0;
  font-size: 1rem;
  font-weight: 500;
  color: #777;
`;

const teamMembers = [
  { name: "Sam Denielle M. Palmon", title: "Director/ Media Head", img: sam },
   { 
    name: "Lizel Tuazon Mapa", 
    title: "Captioner", 
    img: "https://via.placeholder.com/100" 
  },
  { 
    name: "Alyana Mae M. Frigillana", 
    title: "Layout Artist", 
    img: "https://via.placeholder.com/100" 
  },
  { 
    name: "Arrah Lyka L. Galeos", 
    title: "Layout Artist", 
    img: "https://via.placeholder.com/100" 
  },
  { 
    name: "Romy Jun L. Cuyos Jr.", 
    title: "Cinematographer", 
    img: "https://via.placeholder.com/100" 
  },
  { 
    name: "Faith Angel E. Lauronal", 
    title: "Cinematographer", 
    img: "https://via.placeholder.com/100" 
  },
  { 
    name: "Paul Jake S. Caburay", 
    title: "Cinematographer/Editor", 
    img: "https://via.placeholder.com/100" 
  },
];

function Team() {
  return (
    <>
      <Header />
      <HeaderSpacer />
      <TeamContainer>
        {teamMembers.map((member, index) => (
          <Card key={index}>
            <ProfileImage src={member.img} alt={member.name} />
            <Name>{member.name}</Name>
            <Title>{member.title}</Title>
          </Card>
        ))}
      </TeamContainer>
      <Footer />
    </>
  );
}

export default Team;
