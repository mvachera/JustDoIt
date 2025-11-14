import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import AIAnalysisModal from '../components/AIAnalysisModal';
import HeroSection from '../components/home/HeroSection';
import MissionSection from '../components/home/MissionSection';
import FeatureCards from '../components/home/FeatureCards';
import BenefitsSection from '../components/home/BenefitsSection';
import AISection from '../components/home/AISection';
import CTASection from '../components/home/CTASection';

export default function Home() {
  const [name, setName] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  const { analysis, isLoading, error, remainingTime, analyzeHabits } = useAIAnalysis();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <HeroSection name={name} />
        <MissionSection />
        <FeatureCards />
        <BenefitsSection />
        <AISection onOpenModal={() => setIsAIModalOpen(true)} />
        <CTASection />
      </main>

      <AIAnalysisModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        analysis={analysis}
        isLoading={isLoading}
        error={error}
        remainingTime={remainingTime}
        onAnalyze={analyzeHabits}
      />
    </div>
  );
}