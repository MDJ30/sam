// Article.js
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import ArticlePic from "../article.png";

const ArticleWrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  font-family: "Georgia", serif;
  color: #222;
  line-height: 1.7;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #111;
`;

const Meta = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 2rem;

  span {
    font-weight: 500;
    color: #444;
  }
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
`;

const ImageContainer = styled.div`
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ArticleContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

function Article() {
  return (
    <>
      <Header />
      <ArticleWrapper>
        <ImageContainer>
          <ArticleImage
            src={ArticlePic}
            alt="Lakbay Laum Journey in Our Lady of Guadalupe Parish"
          />
        </ImageContainer>
        <ArticleContent>
          <Title>Lakbay Laum Journey in Our Lady of Guadalupe Parish</Title>
          <Meta>
            Posted on <span>September 14, 2025</span> in{" "}
            <span>Ronda Parokya, Youth Corner</span> by{" "}
            <span>Davao Catholic Herald</span> • 0 Comments
          </Meta>

          <Paragraph>
            Last August 30, 2025, Our Lady of Guadalupe Parish was filled with
            joy, faith, and youthful energy as we celebrated the Parish
            Culmination of Lakbay Laum. It was more than just an event, it was a
            true journey of hope, a day where the youth came together not only
            to celebrate but also to deepen their love for God and for His
            Church.
          </Paragraph>

          <Paragraph>
            The celebration opened with an uplifting message from our Parish
            Priest, Rev. Fr. Maximo R. Bahinting, DCD, who reminded everyone of
            the indispensable role of the youth in the life and mission of the
            Church. His words set the tone for a day of faith, fellowship, and
            renewal. The atmosphere was filled with laughter and excitement
            during the animations and group activities, creating bonds of
            friendship and memories to treasure. At the same time, moments of
            silence and reflection during the plenaries allowed the young people
            to encounter God more personally.
          </Paragraph>

          <Paragraph>
            Our beloved Spiritual Director, Rev. Fr. Ritzchild John S.
            Cariaga, DCD, poured his heart into reminding the youth of Christ’s
            unfailing love for His Church as drawn from Lumen Gentium. With great
            conviction, he called on every young person with this powerful
            invitation: “Dear Young People of Our Lady of Guadalupe Parish
            Love, …”
          </Paragraph>
        </ArticleContent>
      </ArticleWrapper>
    </>
  );
}

export default Article;
