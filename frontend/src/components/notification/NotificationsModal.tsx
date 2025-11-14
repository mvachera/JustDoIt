import { X, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyReminder: boolean;
  weeklyStats: boolean;
  monthlyStats: boolean;
  onToggle: (type: 'daily' | 'weekly' | 'monthly', value: boolean) => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  dailyReminder,
  weeklyStats,
  monthlyStats,
  onToggle
}: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 rounded-full p-2">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Notifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-400 text-sm mb-4">
            Gérez vos préférences de notifications par email
          </p>

          {/* Rappel quotidien */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div>
              <Label htmlFor="daily-notif" className="text-white font-medium cursor-pointer">
                📧 Rappel quotidien
              </Label>
              <p className="text-gray-400 text-sm mt-1">
                Chaque jour à 10h
              </p>
            </div>
            <Switch
              id="daily-notif"
              checked={dailyReminder}
              onCheckedChange={(checked: boolean) => onToggle('daily', checked)}
            />
          </div>

          {/* Stats hebdo */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div>
              <Label htmlFor="weekly-notif" className="text-white font-medium cursor-pointer">
                📊 Stats hebdomadaires
              </Label>
              <p className="text-gray-400 text-sm mt-1">
                Lundis à 10h
              </p>
            </div>
            <Switch
              id="weekly-notif"
              checked={weeklyStats}
              onCheckedChange={(checked: boolean) => onToggle('weekly', checked)}
            />
          </div>

          {/* Stats mensuelles */}
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <div>
              <Label htmlFor="monthly-notif" className="text-white font-medium cursor-pointer">
                📅 Stats mensuelles
              </Label>
              <p className="text-gray-400 text-sm mt-1">
                1er du mois à 11h
              </p>
            </div>
            <Switch
              id="monthly-notif"
              checked={monthlyStats}
              onCheckedChange={(checked: boolean) => onToggle('monthly', checked)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}