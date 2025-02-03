import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

interface ProposalScreenProps {
  onAccept: () => void;
  showCountdown: boolean;
}

const Container = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(45deg, #ff1b6b, #45caff);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
    z-index: 1;
  }
`;

const BackgroundAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
`;

const FloatingObject = styled(motion.div)<{ $size: number; $type: 'heart' | 'star' | 'moon' }>`
  position: absolute;
  font-size: ${props => props.$size}px;
  color: rgba(255, 255, 255, ${props => props.$type === 'heart' ? '0.4' : '0.3'});
  pointer-events: none;
  user-select: none;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  z-index: ${props => props.$type === 'heart' ? 1 : 0};
`;

const Content = styled(motion.div)`
  z-index: 2;
  text-align: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
`;

const Title = styled(motion.div)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  margin-bottom: 2rem;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .main-text {
    background: linear-gradient(45deg, #fff, #ffd6e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
  }

  .sub-text {
    font-size: 1.5rem;
    background: linear-gradient(45deg, #ffd6e0, #fff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    opacity: 0.8;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  position: relative;
`;

const Button = styled(motion.button)<{ variant: 'yes' | 'no' }>`
  padding: 1.2rem 3.5rem;
  font-size: 1.5rem;
  border-radius: 50px;
  background: ${({ variant }) => 
    variant === 'yes' 
      ? 'linear-gradient(45deg, #ff6b6b, #ff4b8d)'
      : 'linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'};
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: ${({ variant }) => variant === 'no' ? 'absolute' : 'relative'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.8);
  }
`;

const CountdownContainer = styled(motion.div)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  border-radius: 20px;
  color: #ff4b8d;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const FloatingHearts = styled(motion.div)`
  position: absolute;
  font-size: 2rem;
  pointer-events: none;
  z-index: 1;
`;

const ProposalScreen: React.FC<ProposalScreenProps> = ({ onAccept, showCountdown }) => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [countdown, setCountdown] = useState('');
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [backgroundObjects, setBackgroundObjects] = useState<Array<{ id: string; x: number; y: number; size: number; type: string; speed: number }>>([]);
  const navigate = useNavigate();

  // Create background animation with more elements
  useEffect(() => {
    const objects = [
      // Hearts (40% of objects)
      ...Array.from({ length: 40 }, (_, i) => ({
        id: `heart-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 15,
        type: 'heart' as const,
        speed: 1 + Math.random() * 2
      })),
      // Stars (40% of objects)
      ...Array.from({ length: 40 }, (_, i) => ({
        id: `star-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 15 + 10,
        type: 'star' as const,
        speed: 0.5 + Math.random() * 1.5
      })),
      // Moons (20% of objects)
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `moon-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 20,
        type: 'moon' as const,
        speed: 0.3 + Math.random()
      }))
    ];
    setBackgroundObjects(objects);
  }, []);

  const getEmoji = (type: string) => {
    switch (type) {
      case 'heart':
        return '❤️';
      case 'star':
        return '⭐';
      case 'moon':
        return '🌙';
      default:
        return '❤️';
    }
  };

  const handleYesClick = useCallback(() => {
    // Multiple confetti bursts
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    onAccept();
    setTimeout(() => navigate('/our-story'), 2000);
  }, [onAccept, navigate]);

  const moveNoButton = useCallback(() => {
    const maxWidth = window.innerWidth - 200;
    const maxHeight = window.innerHeight - 100;
    const x = Math.random() * maxWidth - maxWidth / 2;
    const y = Math.random() * maxHeight - maxHeight / 2;
    setNoButtonPosition({ x, y });
    
    // Add floating heart
    const heartId = Date.now();
    setHearts(prev => [...prev, { id: heartId, x, y }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(heart => heart.id !== heartId));
    }, 1000);
  }, []);

  useEffect(() => {
    if (showCountdown) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const valentinesDay = new Date('2024-02-14').getTime();
        const distance = valentinesDay - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown(`${days}d ${hours}h ${minutes}m until Valentine's Day! 💝`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showCountdown]);

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackgroundAnimation>
        {backgroundObjects.map((obj) => (
          <FloatingObject
            key={obj.id}
            $size={obj.size}
            $type={obj.type}
            initial={{ x: `${obj.x}vw`, y: `${obj.y}vh` }}
            animate={{
              y: [`${obj.y}vh`, `${-20}vh`],
              x: [`${obj.x}vw`, `${obj.x + (Math.random() - 0.5) * 20}vw`],
              rotate: [0, obj.type === 'heart' ? 360 : -360],
            }}
            transition={{
              duration: 20 / obj.speed,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            {getEmoji(obj.type)}
          </FloatingObject>
        ))}
      </BackgroundAnimation>

      <Content
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <Title>
          <motion.div
            className="main-text"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          >
            Will You Be My Valentine?
          </motion.div>
          <motion.div
            className="sub-text"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            My heart beats for you... ❤️
          </motion.div>
        </Title>
        <ButtonContainer>
          <Button
            variant="yes"
            onClick={handleYesClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            YES! 💝
          </Button>
          <Button
            variant="no"
            style={{ 
              position: 'fixed',
              left: `${noButtonPosition.x + window.innerWidth / 2}px`,
              top: `${noButtonPosition.y + window.innerHeight / 2}px`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={moveNoButton}
            onMouseEnter={moveNoButton}
            whileHover={{ scale: 1.1 }}
            animate={{ 
              x: noButtonPosition.x,
              y: noButtonPosition.y,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            initial={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.6 }}
          >
            NO 🙈
          </Button>
        </ButtonContainer>
      </Content>

      <AnimatePresence>
        {hearts.map(heart => (
          <FloatingHearts
            key={heart.id}
            initial={{ opacity: 1, scale: 0 }}
            animate={{ 
              opacity: 0,
              scale: 2,
              y: -100,
              x: Math.random() * 100 - 50
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ left: heart.x, top: heart.y }}
          >
            💖
          </FloatingHearts>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showCountdown && countdown && (
          <CountdownContainer
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {countdown}
          </CountdownContainer>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProposalScreen; 