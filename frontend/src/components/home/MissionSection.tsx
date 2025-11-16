export default function MissionSection() {
  return (
    <div className="relative group mb-6">
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
      <div className="relative bg-gradient-to-br from-pink-900/40 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          L'objectif : Transformer vos intentions en actions
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          JustDoIt est votre compagnon quotidien pour développer des habitudes durables. 
          Suivez vos progrès, restez motivé avec des statistiques visuelles, et construisez 
          la meilleure version de vous-même, un jour à la fois.
        </p>
      </div>
    </div>
  );
}