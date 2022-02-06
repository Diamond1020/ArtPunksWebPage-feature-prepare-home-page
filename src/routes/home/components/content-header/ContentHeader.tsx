import styled from 'styled-components';
import { ContentBox } from '../../../../components/content-box';
import { theme } from '../../../../theme';
import backgroundImage from './../../background.jpg';
import {
  MintingCountdown,
} from '../../components';

const Container = styled.div`
background: url(${backgroundImage});
background-repeat: no-repeat;
background-size: cover;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 5rem;
  padding-bottom: 3rem;

  @media (min-width: 1024px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 300;
  line-height: 1.14;
  letter-spacing: 0.9px;
  color: ${theme.colors.white};
`;

const Description = styled.span`
  font-family: Muli, sans-serif;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5rem;
  color: gray;
`;

export const ContentHeader = () => (
  <Container>
    <ContentBox>
      <Content>
        <Title>NFTs by Picasso...</Title>
        <Description>
          ArtPunks is a collection of 10,000 NFTs created by neural networks
          (AI), through a combination of famous paintings with CryptoPunks.
        </Description>
      </Content>
      <Content>
      <MintingCountdown />
      </Content>
    </ContentBox>
  </Container>
);
