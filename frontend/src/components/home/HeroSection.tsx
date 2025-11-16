interface HeroSectionProps {
  name: string;
}

export default function HeroSection({ name }: HeroSectionProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
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
      <div className="mt-4 inline-block">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-1">
          <div className="bg-black rounded-xl px-6 py-3">
            <p className="text-gray-300 text-lg">
              Prêt à construire de meilleures habitudes ? 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}