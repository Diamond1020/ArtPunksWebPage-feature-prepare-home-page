import { Button, CircularProgress, Snackbar } from '@material-ui/core';
import styled from 'styled-components';
import { ContentBox } from '../../../../components/content-box';
import mintGif from './mint_gif_2.gif';
import * as anchor from '@project-serum/anchor';

import { FC, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import Alert from '@material-ui/lab/Alert';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from '../../../../candy-machine';

const ArtPunkIconContainer = styled.div`
  max-width: 400px;
  max-height: 400px;
  width: 100%;
  padding: 24px;

  @media (min-width: 768px) {
    width: 500px;
    height: 500px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`;

const MintContainer1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    grid-row: 3 / 3;
    grid-column: 2;
  }
`;

// const MintContainer2 = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;

//   @media (min-width: 768px) {
//     grid-row: 1 / 3;
//     grid-column: 2;
//   }
// `;

// const Summary = styled.div`
//   @media (min-width: 768px) {
//     margin-bottom: 1rem;
//     grid-row: 2;
//     grid-column: 3;
//   }
// `;

// const ItemsRemainingNumber = styled.span`
//   font-weight: 700;
// `;

// const Footer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
//   margin-top: 1rem;

//   & > *:not(:last-child) {
//     margin-right: 2rem;
//   }
// `;

const ArtPunkIconImage = styled.img`
  width: 100%;
`;

// const modalContentStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   width: '80%',

//   '@media (min-width: 768px)': {
//     width: 600,
//   },
// };

const ConnectButton = styled(WalletDialogButton)``;

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

const InfoButtonsBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin-top: 6rem;
`;

// const renderLargeButton = (
//   children: React.ReactNode,
//   handleClick: () => void,
// ) => (
//   <Button
//     color="primary"
//     variant="contained"
//     style={{
//       borderRadius: '20px',
//       padding: '1rem 2rem',
//       textTransform: 'none',
//       fontSize: '1.25rem',
//       fontWeight: 'bold',
//     }}
//     onClick={handleClick}
//   >
//     {children}
//   </Button>
// );

// const renderLargeMintButton = (
//   children: React.ReactNode,
//   handleClick: () => void,
//   isSoldOut: boolean,
//   isMinting: boolean,
//   isActive: boolean,
// ) => (
//   <Button
//     color="primary"
//     variant="contained"
//     disabled={isSoldOut || isMinting || !isActive}
//     style={{
//       borderRadius: '20px',
//       padding: '1rem 2rem',
//       textTransform: 'none',
//       fontSize: '1.25rem',
//       fontWeight: 'bold',
//     }}
//     onClick={handleClick}
//   >
//     {children}
//   </Button>
// );

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

export interface MintingProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

export const Minting: FC<MintingProps> = (props) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const handleModalOpen = () => setIsModalOpen(true);
  // const handleModalClose = () => setIsModalOpen(false);

  const [balance, setBalance] = useState<number>();
  const [itemsRemaining, setItemsRemaining] = useState<number>(0);
  // const [itemsToMint, setItemsToMint] = useState<number>(0);
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const onMint = async (numberOfItemsToMint: number) => {
    try {
      setIsMinting(true);
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury,
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          'singleGossip',
          false,
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });
          let items = itemsRemaining - 1;

          setItemsRemaining(items);
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error',
      });
    } finally {
      if (wallet?.publicKey) {
        try {
          const balance = await props.connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error(error);
          console.error('Could not get the balance.');
        }
      }
      setIsMinting(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        try {
          const balance = await props.connection.getBalance(wallet.publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error(error);
          console.error('Could not get the balance.');
        }
      }
    })();
  }, [wallet, props.connection]);

  useEffect(() => {
    (async () => {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !wallet.signTransaction
      ) {
        return;
      }

      const anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
      } as anchor.Wallet;

      const {
        candyMachine,
        goLiveDate,
        itemsRemaining,
      } = await getCandyMachineState(
        anchorWallet,
        props.candyMachineId,
        props.connection,
      );
      setItemsRemaining(itemsRemaining);
      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  }, [wallet, props.candyMachineId, props.connection]);

  const renderMinting = () => (
    <>
      {wallet.connected && (
        <p>Address: {shortenAddress(wallet.publicKey?.toBase58() || '')}</p>
      )}
      {wallet.connected && (
        <p>Balance: {(balance || 0).toLocaleString()} SOL</p>
      )}
      {/* {<p>{itemsRemaining}/10000 remaining</p>} */}

      <MintContainer
        style={{
          display: 'flex',
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
        }}
      >
        {!wallet.connected ? (
          <ConnectButton
            color="primary"
            variant="contained"
            style={{
              borderRadius: '20px',
              padding: '1rem 2rem',
              textTransform: 'none',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Connect Wallet
          </ConnectButton>
        ) : (
          <MintButton
            disabled={isSoldOut || isMinting || !isActive}
            onClick={() => onMint(1)}
            variant="contained"
            color="primary"
            style={{
              borderRadius: '20px',
              padding: '1rem 2rem',
              textTransform: 'none',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            {isSoldOut ? (
              'SOLD OUT'
            ) : isActive ? (
              isMinting ? (
                <CircularProgress />
              ) : (
                'MINT'
              )
            ) : (
              <Countdown
                date={balance}
                onMount={({ completed }) => completed && setIsActive(true)}
                onComplete={() => setIsActive(true)}
                daysInHours={true}
                renderer={renderCounter}
              />
            )}
          </MintButton>
        )}
      </MintContainer>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </>
  );

  return (
    <ContentBox>
      {/* {renderMinting()} */}
      <Container>
        <MintContainer1>
          <ArtPunkIconContainer>
            <ArtPunkIconImage
              src={mintGif}
              alt="ArtPunk"
              style={{
                width: '100%',
              }}
            />
          </ArtPunkIconContainer>
          {renderMinting()}
          {/* {!wallet.connected
            ? renderLargeButton('Connect Wallet', handleSingleItemMintClick)
            : renderLargeMintButton(
                'Mint 1 Artpunk',
                handleSingleItemMintClick,
                isSoldOut,
                isMinting,
                isActive,
              )} */}
        </MintContainer1>

        <InfoButtonsBox>
          <Button
            variant="contained"
            color="primary"
            style={{
              padding: '1rem 2rem',
            }}
            href="https://artpunks.fun/"
            target="_blank"
          >
            Learn more about ArtPunks
          </Button>

          <Button
            variant="contained"
            color="primary"
            style={{
              padding: '1rem 2rem',
            }}
            href="https://artpunks.fun/rarity/"
            target="_blank"
          >
            Check out rarity table
          </Button>
        </InfoButtonsBox>

        {/* 
        <Summary>
          <span>Artpunks remaining: </span>
          <ItemsRemainingNumber>1235</ItemsRemainingNumber>
        </Summary> */}
      </Container>
    </ContentBox>
  );
};
