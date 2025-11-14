import { Target, BarChart3, Calendar, ArrowRight, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  color: string;
}

export default function FeatureCards() {
  const features: Feature[] = [
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

  return (
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
  );
}