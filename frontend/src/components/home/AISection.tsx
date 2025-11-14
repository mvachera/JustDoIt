import { Zap } from 'lucide-react';

interface AISectionProps {
  onOpenModal: () => void;
}

export default function AISection({ onOpenModal }: AISectionProps) {
  return (
    <div 
      onClick={onOpenModal}
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
  );
}