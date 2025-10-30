import { X } from 'lucide-react';
import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES, HabitCategory } from '../types/habits';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function HabitForm({ isOpen, onClose, onSuccess }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sport' as HabitCategory,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetchWithAuth('/api/habits', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Habitude créée !",
          description: `${formData.name} a été ajoutée à vos habitudes.`,
        });
        setFormData({ name: '', description: '', category: 'Sport' });
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        toast({
          title: "Erreur",
          description: error.error || 'Erreur lors de la création',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nouvelle habitude</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom de l'habitude
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Méditation, Sport..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600
			  	rounded-lg text-white placeholder-gray-400 focus:outline-none
				focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: 10 minutes par jour"
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600
			  	rounded-lg text-white placeholder-gray-400 focus:outline-none
				focus:border-purple-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Catégorie
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.name })}
                  className={`p-3 rounded-lg border-2 transition ${
                    formData.category === cat.name
                      ? 'border-purple-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${cat.color} mx-auto mb-1`} />
                  <span className="text-xs text-white">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600
			  	    text-white rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700
			  	    text-white rounded-lg transition disabled:opacity-50
				        disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}