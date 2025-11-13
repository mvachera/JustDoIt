import { X, Sparkles, TrendingUp, RefreshCw, Heart } from 'lucide-react';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: {
    improve: {
      habit: string;
      reason: string;
      suggestion: string;
    };
    replace: {
      habit: string;
      reason: string;
      newHabit: string;
      category: string;
    };
    motivation: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  onAnalyze: () => void;
}

export default function AIAnalysisModal({
  isOpen,
  onClose,
  analysis,
  isLoading,
  error,
  onAnalyze
}: AIAnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 rounded-full p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Analyse IA de vos habitudes
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-400">Analyse en cours... 🤖</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Pas encore d'analyse */}
        {!analysis && !isLoading && !error && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-6">
              Obtenez des conseils personnalisés basés sur vos habitudes
            </p>
            <button
              onClick={onAnalyze}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition"
            >
              Analyser mes habitudes
            </button>
          </div>
        )}

        {/* Résultats */}
        {analysis && !isLoading && (
          <div className="space-y-6">
            {/* Améliorer */}
            <div className="bg-gray-700/50 rounded-lg p-5 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">À améliorer</h3>
              </div>
              <p className="text-purple-300 font-semibold mb-2">
                {analysis.improve.habit}
              </p>
              <p className="text-gray-400 text-sm mb-3">
                {analysis.improve.reason}
              </p>
              <div className="bg-blue-500/10 rounded p-3 border-l-4 border-blue-500">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Conseil :</strong> {analysis.improve.suggestion}
                </p>
              </div>
            </div>

            {/* Remplacer */}
            <div className="bg-gray-700/50 rounded-lg p-5 border border-orange-500/30">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold text-white">Suggestion de remplacement</h3>
              </div>
              <p className="text-purple-300 font-semibold mb-2">
                {analysis.replace.habit}
              </p>
              <p className="text-gray-400 text-sm mb-3">
                {analysis.replace.reason}
              </p>
              <div className="bg-orange-500/10 rounded p-3 border-l-4 border-orange-500">
                <p className="text-orange-300 text-sm">
                  ✨ <strong>Nouvelle habitude suggérée :</strong> {analysis.replace.newHabit}
                  <span className="text-gray-400"> ({analysis.replace.category})</span>
                </p>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-5 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-bold text-white">Message motivant</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {analysis.motivation}
              </p>
            </div>

            {/* Bouton nouvelle analyse */}
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition disabled:opacity-50"
            >
              🔄 Nouvelle analyse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}