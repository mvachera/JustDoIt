import { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, BarChart3, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import AIAnalysisModal from '../components/AIAnalysisModal';


export default function Home() {
  const [name, setName] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const { analysis, isLoading, error, analyzeHabits } = useAIAnalysis();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Gestion des habitudes',
      description: 'Créez jusqu\'à 5 habitudes personnalisées avec catégories et niveaux de difficulté.',
      link: '/habits',
      color: 'from-purple-600 to-purple-700'
    },
    {
      icon: BarChart3,
      title: 'Statistiques détaillées',
      description: 'Suivez vos progrès avec des métriques complètes : streaks, taux de réussite et analyses hebdomadaires.',
      link: '/stats',
      color: 'from-blue-600 to-blue-700'
    },
    {
      icon: Calendar,
      title: 'Calendrier visuel',
      description: 'Vue mensuelle style GitHub pour visualiser votre constance et identifier vos patterns.',
      link: '/calendar',
      color: 'from-green-600 to-green-700'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Simple et efficace',
      description: 'Interface intuitive pour un suivi quotidien sans friction'
    },
    {
      icon: TrendingUp,
      title: 'Progression visible',
      description: 'Visualisez votre évolution avec des graphiques motivants'
    },
    {
      icon: CheckCircle2,
      title: 'Motivation constante',
      description: 'Maintenez votre streak et célébrez chaque victoire'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Bonjour {name} ! 👋
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
          <div className="mt-8 inline-block">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-1">
              <div className="bg-black rounded-xl px-6 py-3">
                <p className="text-gray-300 text-lg">
                  Prêt à construire de meilleures habitudes ? 🚀
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-16 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            L'objectif : Transformer vos intentions en actions
          </h2>
          <p className="text-gray-300 text-lg text-center max-w-3xl mx-auto leading-relaxed">
            JustDoIt est votre compagnon quotidien pour développer des habitudes durables. 
            Suivez vos progrès, restez motivé avec des statistiques visuelles, et construisez 
            la meilleure version de vous-même, un jour à la fois.
          </p>
        </div>

        {/* Features Cards */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Vos outils pour réussir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-105"
                >
                  <div className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                    {feature.title}
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Pourquoi JustDoIt fonctionne
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section IA */}
        <div 
          onClick={() => setIsAIModalOpen(true)}
          className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-600 rounded-full p-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Assistant IA personnalisé
            </h2>
          </div>
          <p className="text-gray-300 text-center max-w-2xl mx-auto leading-relaxed">
            Obtenez une analyse personnalisée de vos habitudes et des conseils pour vous améliorer ! 🤖✨
          </p>
          <p className="text-purple-400 text-center mt-4 font-semibold">
            Cliquez pour analyser vos habitudes →
          </p>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link
            to="/habits"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/50"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Aucune carte de crédit requise • 100% gratuit
          </p>
        </div>
      </main>

      {/* Modal IA */}
      <AIAnalysisModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        analysis={analysis}
        isLoading={isLoading}
        error={error}
        onAnalyze={analyzeHabits}
      />
    </div>
  );
}