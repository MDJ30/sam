// Team.js
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Header, HeaderSpacer } from "../components/Header";
import Footer from "../components/Footer";
import sam from "../sam.jpg";

// Add fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrapper = styled.div`
  padding: 60px 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const TeamHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const TeamTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TeamDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const TeamContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  position: relative;
  width: 90%;
  max-width: 600px;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-20px)')};
  transition: all 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  padding: 5px;
  
  &:hover {
    color: #ff6600;
  }
`;

const ModalImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  object-fit: cover;
  margin-bottom: 20px;
  border: 6px solid #ff6600;
`;

const ModalName = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  color: #ff6600;
  margin-bottom: 20px;
`;



const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  text-align: center;
  padding: 40px 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${({ index }) => `${index * 0.1}s`};
  opacity: 0;
  animation-fill-mode: forwards;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 60px;
  margin-bottom: 20px;
  border: 4px solid #ff6600;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const Name = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Title = styled.p`
  margin: 0;
  font-size: 1.1rem;
  color: #ff6600;
  font-weight: 500;
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
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <>
      <Header />
      <HeaderSpacer />
      <PageWrapper>
        <TeamHeader>
          <TeamTitle>Our Team</TeamTitle>
          <TeamDescription>
            Meet the talented individuals who bring creativity and expertise to our media team.
          </TeamDescription>
        </TeamHeader>
        <TeamContainer>
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              index={index}
              onClick={() => handleCardClick(member)}
            >
              <ProfileImage src={member.img} alt={member.name} />
              <Name>{member.name}</Name>
              <Title>{member.title}</Title>
            </Card>
          ))}
        </TeamContainer>

        <Modal isOpen={isModalOpen} onClick={closeModal}>
          <ModalContent 
            isOpen={isModalOpen}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            {selectedMember && (
              <>
                <ModalImage 
                  src={selectedMember.img} 
                  alt={selectedMember.name}
                />
                <ModalName>{selectedMember.name}</ModalName>
                <ModalTitle>{selectedMember.title}</ModalTitle>
              </>
            )}
          </ModalContent>
        </Modal>
      </PageWrapper>
      <Footer />
    </>
  );
}

export default Team;
