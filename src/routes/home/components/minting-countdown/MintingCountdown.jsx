import { useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import styled from 'styled-components';

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

const TimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: monospace;
`;

const renderTime = (dimension, time) => {
  return (
    <TimeWrapper>
      <div
        className="time"
        style={{
          fontSize: '2.5rem',
          lineHeight: 1,
          marginBottom: '0.125rem',
        }}
      >
        {time}
      </div>
      <div>{dimension}</div>
    </TimeWrapper>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

const progressColor = '#092f40';

const mintingStartDate = new Date(1632607200000);

const Countdowns = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  & > * {
    padding: 1rem;
  }
`;

const MintingCountdown = () => {
  const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = mintingStartDate.getTime() / 1000; // use UNIX timestamp in seconds

  const remainingTime = endTime - startTime;

  const [isVisible, setIsVisible] = useState(remainingTime > 0);

  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  return isVisible ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          fontSize: '2rem',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
        }}
      >
        TIME TO MINTING LAUNCH
      </div>

      <Countdowns>
        <div>
          <CountdownCircleTimer
            {...timerProps}
            colors={progressColor}
            duration={daysDuration}
            initialRemainingTime={remainingTime}
          >
            {({ elapsedTime }) =>
              renderTime('days', getTimeDays(daysDuration - elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
        <div>
          <CountdownCircleTimer
            {...timerProps}
            colors={progressColor}
            duration={daySeconds}
            initialRemainingTime={remainingTime % daySeconds}
            onComplete={(totalElapsedTime) => [
              remainingTime - totalElapsedTime > hourSeconds,
              0,
            ]}
          >
            {({ elapsedTime }) =>
              renderTime('hours', getTimeHours(daySeconds - elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
        <div>
          <CountdownCircleTimer
            {...timerProps}
            colors={progressColor}
            duration={hourSeconds}
            initialRemainingTime={remainingTime % hourSeconds}
            onComplete={(totalElapsedTime) => [
              remainingTime - totalElapsedTime > minuteSeconds,
              0,
            ]}
          >
            {({ elapsedTime }) =>
              renderTime('minutes', getTimeMinutes(hourSeconds - elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
        <div>
          <CountdownCircleTimer
            {...timerProps}
            colors={progressColor}
            duration={minuteSeconds}
            initialRemainingTime={remainingTime % minuteSeconds}
            onComplete={(totalElapsedTime) => {
              if (remainingTime < 0) {
                return setIsVisible(false);
              }

              return [remainingTime - totalElapsedTime > 0, 0];
            }}
          >
            {({ elapsedTime }) =>
              renderTime('seconds', getTimeSeconds(elapsedTime))
            }
          </CountdownCircleTimer>
        </div>
      </Countdowns>
    </div>
  ) : null;
};

export { MintingCountdown };
