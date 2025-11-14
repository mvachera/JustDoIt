import { Bell } from 'lucide-react';

interface NotificationButtonProps {
  onClick: () => void;
}

export default function NotificationButton({ onClick }: NotificationButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      aria-label="Gérer les notifications"
    >
      <Bell className="w-6 h-6" />
    </button>
  );
}