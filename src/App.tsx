import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence } from 'framer-motion';
import ProposalScreen from './components/ProposalScreen';
import MemoryLane from './components/MemoryLane';
import { GlobalStyles } from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
`;

function App() {
  const [accepted, setAccepted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const valentinesDay = new Date('2024-02-14').getTime();
    const now = new Date().getTime();
    setShowCountdown(now < valentinesDay);
  }, []);

  return (
    <Router>
      <GlobalStyles />
      <AppContainer>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProposalScreen 
                  onAccept={() => setAccepted(true)} 
                  showCountdown={showCountdown}
                />
              } 
            />
            <Route 
              path="/our-story" 
              element={<MemoryLane />} 
            />
          </Routes>
        </AnimatePresence>
      </AppContainer>
    </Router>
  );
}

export default App;
