import styled from 'styled-components';
import { theme } from '../../theme';

const topBarData = [
  {
    text: 'twitter',
    href: 'https://twitter.com/ArtPunksNFT',
    isExternal: true,
  },
  {
    text: 'discord',
    href: 'http://discord.gg/artpunks',
    isExternal: true,
  },
  {
    text: 'telegram',
    href: 'https://t.me/ArtPunksSolana',
    isExternal: true,
  },
  // {
  //   text: 'instagram',
  //   href: '/',
  //   isExternal: true,
  // },
];

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 5%;
  background-color: black;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const MenuElement = styled.a`
  color: gray;
  text-transform: uppercase;
  text-decoration: none;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    color: gray;
  }

  @media (min-width: 768px) {
    margin-right: 2rem;
  }
`;

const Header = styled.header`
  font-size: 1.375rem;
  line-height: 100%;
  font-weight: 600;
  text-transform: uppercase;
  color: ${theme.colors.white};
`;

const ArtText = styled.span``;

const PunksText = styled.span`
  font-weight: 300;
`;

export const Topbar = () => (
  <Container>
    <Header>
      <ArtText>art</ArtText>
      <PunksText>punks</PunksText>
    </Header>

    <MenuList>
      {topBarData.map((element) => (
        <MenuElement
          href={element.href}
          key={element.text}
          target={element.isExternal ? '_blank' : '_self'}
        >
          {element.text}
        </MenuElement>
      ))}
    </MenuList>
  </Container>
);
