import styled from 'styled-components';
import { ContentBox } from '../../components/content-box';
import {
  Minting,
  MintingCountdown,
  MintingProps,
} from './components';
import backgroundImage from './background.jpg';
import roadmapImage from './roadmap.png';
import shortTermRoadMap from './short_tern_roadmap.jpg';
import { FC } from 'react';

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-top: 1rem;
  padding-bottom: 3rem;

  background: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
`;

const RoadmapImage = styled.img`
  margin-top: 3rem;
  width: 100%;
`;

const RoadmapBox = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 0.5rem;

  @media (min-width: 992px) {
    padding: 0 2rem;
  }

  @media (min-width: 1800px) {
    width: 1600px;
  }
`;

export interface HomeProps {
  minting: MintingProps;
}

export const Home: FC<HomeProps> = ({ minting }) => (
  <>
    <MainContent>
      <ContentBox>
        <MintingCountdown />
      </ContentBox>

      <Minting {...minting} />

      <RoadmapBox>
        <RoadmapImage
          src={shortTermRoadMap}
          alt="Short-term roadmap of the ArtPunks project."
        />
      </RoadmapBox>

      <RoadmapBox>
        <RoadmapImage
          src={roadmapImage}
          alt="Roadmap of the ArtPunks project."
        />
      </RoadmapBox>
    </MainContent>
  </>
);
