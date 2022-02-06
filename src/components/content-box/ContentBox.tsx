import styled from 'styled-components';

export const ContentBox = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 992px) {
    width: 1024px;
    padding: 0;
  }

  @media (min-width: 1024px) {
    width: 992px;
  }
`;