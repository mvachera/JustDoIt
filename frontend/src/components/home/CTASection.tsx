import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
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
  );
}