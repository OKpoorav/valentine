import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Import images
const memoryImages = {
  memory1: '/images/first day.jpeg',
  memory2: '/images/first date.jpeg',
  memory3: '/images/adventures.jpeg',
  memory4: '/images/you the best.jpeg',
  memory5: '/images/future.jpeg',
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #45caff 0%, #ff1b6b 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30C30 46.5685 16.5685 60 0 60C-16.5685 60 -30 46.5685 -30 30C-30 13.4315 -16.5685 0 0 0C16.5685 0 30 13.4315 30 30Z' fill='rgba(255, 255, 255, 0.05)'/%3E%3C/svg%3E");
    opacity: 0.5;
    z-index: 0;
    animation: floatBackground 20s linear infinite;
  }

  @keyframes floatBackground {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100px 100px;
    }
  }
`;

const Timeline = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  padding: 2rem 0;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, 
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.1)
    );
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const TimelineItem = styled(motion.div)`
  margin: 6rem 0;
  position: relative;
  width: 50%;
  padding: 0 3rem;

  &:nth-of-type(odd) {
    margin-left: auto;
    padding-left: 4rem;

    &::before {
      left: -0.5rem;
    }

    .memory-image {
      left: -100%;
      right: auto;
    }
  }

  &:nth-of-type(even) {
    padding-right: 4rem;
    text-align: right;

    &::before {
      right: -0.5rem;
    }

    .memory-image {
      right: -100%;
      left: auto;
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 1rem;
    height: 1rem;
    background: white;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }
`;

const TimelineContent = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 1.5rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #fff, #ffd6e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  small {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    font-size: 0.9rem;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`;

const LoveSlider = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  margin: 6rem auto;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #fff, #ffd6e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const HeartEmoji = styled(motion.div)`
  position: fixed;
  font-size: 24px;
  pointer-events: none;
  z-index: 1000;
  user-select: none;
`;

const LoveOverflow = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeartShape = styled(motion.div)`
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #ff4b8d);
  position: relative;
  transform: rotate(-45deg);
  box-shadow: 0 0 50px rgba(255, 75, 141, 0.5);

  &::before,
  &::after {
    content: '';
    width: 200px;
    height: 200px;
    background: inherit;
    border-radius: 50%;
    position: absolute;
  }

  &::before {
    top: -100px;
    left: 0;
  }

  &::after {
    top: 0;
    right: -100px;
  }
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  position: relative;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff6b6b, #ff4b8d);
    cursor: pointer;
    box-shadow: 0 0 20px rgba(255, 75, 141, 0.5);
    border: 2px solid white;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 0 30px rgba(255, 75, 141, 0.8);
    }
  }
`;

const SliderMessage = styled(motion.div)`
  margin-top: 2rem;
  font-size: 1.4rem;
  min-height: 2rem;
  padding: 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
`;

const SecretButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.3;
  z-index: 10;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
  }
`;

const LoveLetter = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 3rem;
  border-radius: 30px;
  color: #ff4b8d;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 100;
  text-align: center;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #ff6b6b, #ff4b8d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.2rem;
    line-height: 1.8;
    margin-bottom: 2rem;
    color: #666;
  }

  button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 30px;
    background: linear-gradient(45deg, #ff6b6b, #ff4b8d);
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(255, 75, 141, 0.3);
    }
  }
`;

const FloatingImage = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 10;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: scale(1.1);
    transition: transform 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 107, 107, 0.2), rgba(255, 75, 141, 0.2));
    pointer-events: none;
    mix-blend-mode: overlay;
  }
`;

const LoveMessage = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #ff6b6b, #ff4b8d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.2rem;
    color: #666;
    line-height: 1.6;
  }
`;

const ImageModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;

  img {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
`;

const MemoryImage = styled(motion.div)`
  position: absolute;
  top: 0;
  width: calc(100% - 1rem);
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: none;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    &[alt="Our First Date"] {
      object-position: center center;
    }

    &[alt="Adventures Together"] {
      object-position: top center;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(255, 75, 141, 0.1));
    pointer-events: none;
  }
`;

const memories = [
  {
    title: 'How We Met',
    content: 'That magical moment when our paths crossed...',
    date: 'The Beginning',
    image: '/images/first day.jpeg'
  },
  {
    title: 'Our First Date',
    content: 'Remember that nervous excitement?',
    date: 'A Special Day',
    image: '/images/first date.jpeg'
  },
  {
    title: 'Adventures Together',
    content: 'Every moment with you is an adventure...',
    date: 'Ongoing',
    image: '/images/adventures.jpeg'
  },
  {
    title: 'Why You\'re the Best',
    content: 'Your smile, your eyes, your personality, your everything...',
    date: 'Always',
    image: '/images/you the best.jpeg'
  },
  {
    title: 'Our Future Together',
    content: 'The best is yet to come...',
    date: 'Forever',
    image: '/images/future.jpeg'
  }
];

const preloadImages = () => {
  Object.values(memoryImages).forEach((src, index) => {
    const img = new Image();
    img.src = src;
    console.log(`Preloading image ${index + 1}:`, src);
    img.onload = () => console.log(`Successfully preloaded image ${index + 1}`);
    img.onerror = (e) => console.error(`Failed to preload image ${index + 1}:`, e);
  });
};

const MemoryLane = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderMessage, setSliderMessage] = useState('');
  const [secretClicks, setSecretClicks] = useState(0);
  const [showLoveLetter, setShowLoveLetter] = useState(false);
  const [showMaxLoveAnimation, setShowMaxLoveAnimation] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number }>>([]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    preloadImages();
  }, []);

  const getSliderMessage = (value: number) => {
    if (value < 30) return "Hmm... not enough! 🥺";
    if (value < 70) return "Getting warmer! 😍";
    if (value === 100) return "That's more like it! Love you too! ❤️";
    return "Almost there! 💕";
  };

  const showHearts = () => {
    // Clear existing hearts
    setHearts([]);
    
    // Create 30 hearts with different positions
    const newHearts = Array.from({ length: 30 }, (_, index) => ({
      id: Date.now() + index,
      left: Math.random() * window.innerWidth
    }));
    
    setHearts(newHearts);

    // Remove hearts after animation
    setTimeout(() => {
      setHearts([]);
    }, 3000);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setSliderMessage(getSliderMessage(value));

    if (value === 100) {
      showHearts();
      setShowMaxLoveAnimation(true);
      setTimeout(() => {
        setShowMaxLoveAnimation(false);
      }, 3000);
    }
  };

  const handleSecretClick = () => {
    setSecretClicks(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        const hearts = Array(20).fill('💖');
        const message = hearts.join(' ');
        alert(`You found the secret button!\n${message}\nThis means we're soulmates! 💖`);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <Container>
      <Timeline>
        {memories.map((memory, index) => {
          const [ref, inView] = useInView({
            threshold: 0.3,
            triggerOnce: true
          });

          return (
            <TimelineItem
              key={index}
              ref={ref}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50, y: 20 }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              <MemoryImage
                className="memory-image"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                onClick={() => setSelectedImage(memory.image)}
              >
                <img src={memory.image} alt={memory.title} loading="lazy" />
              </MemoryImage>
              <TimelineContent>
                <h2>{memory.title}</h2>
                <p>{memory.content}</p>
                <small>{memory.date}</small>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>

      <LoveSlider
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2>How much do you love me?</h2>
        <Slider
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
        />
        <SliderMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={sliderMessage}
          transition={{ duration: 0.3 }}
        >
          {sliderMessage}
        </SliderMessage>
      </LoveSlider>

      <AnimatePresence>
        {hearts.map((heart) => (
          <HeartEmoji
            key={heart.id}
            initial={{ 
              y: window.innerHeight,
              x: heart.left,
              opacity: 0,
              scale: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 1],
              x: heart.left + (Math.random() * 100 - 50)
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              ease: "easeOut",
              opacity: { duration: 3, times: [0, 0.2, 1] },
              scale: { duration: 3, times: [0, 0.2, 1] }
            }}
          >
            💖
          </HeartEmoji>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showMaxLoveAnimation && (
          <LoveOverflow
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeartShape
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: 1,
                rotate: [-45, -45],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                times: [0, 0.8, 1],
                ease: "easeOut"
              }}
            />
          </LoveOverflow>
        )}
      </AnimatePresence>

      <SecretButton
        onClick={handleSecretClick}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        ❤️
      </SecretButton>

      <AnimatePresence>
        {showLoveLetter && (
          <LoveLetter
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <h2>My Dearest Valentine</h2>
            <p>
              Every moment with you feels like a dream come true. You make my heart skip
              a beat, my world brighter, and my life complete. I love you more than
              words can express... You're not just my Valentine, you're my everything! 💝
            </p>
            <button onClick={() => setShowLoveLetter(false)}>Close with Love ❤️</button>
          </LoveLetter>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt="Full size memory"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", duration: 0.5 }}
            />
          </ImageModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default MemoryLane; 