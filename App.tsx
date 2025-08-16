
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import FlirtyTextGenerator from './components/FlirtyTextGenerator';
import GatedFeatureModal from './components/PremiumModal';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [isGatedModalOpen, setIsGatedModalOpen] = useState<boolean>(false);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(false);

  const handleWatchAd = useCallback(() => {
    setIsPremiumUnlocked(true);
    setIsGatedModalOpen(false);
  }, []);

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header onOpenGatedModal={() => setIsGatedModalOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        {showLanding ? (
          <LandingPage onGetStarted={handleGetStarted} />
        ) : (
          <FlirtyTextGenerator 
            onOpenPremiumModal={() => setIsGatedModalOpen(true)}
            isPremiumUnlocked={isPremiumUnlocked} 
          />
        )}
      </main>
      <Footer />
      <GatedFeatureModal 
        isOpen={isGatedModalOpen} 
        onClose={() => setIsGatedModalOpen(false)}
        onWatchAd={handleWatchAd}
      />
    </div>
  );
};

export default App;