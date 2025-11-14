import { Zap, TrendingUp, CheckCircle2, LucideIcon } from 'lucide-react';

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function BenefitsSection() {
  const benefits: Benefit[] = [
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
  );
}