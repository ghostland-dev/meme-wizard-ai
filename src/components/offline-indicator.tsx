import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connexion rétablie!');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Connexion perdue. Certaines fonctionnalités peuvent être limitées.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <Card className="fixed bottom-4 left-4 z-50 border-destructive">
      <CardContent className="flex items-center gap-2 p-3">
        <WifiOff className="h-4 w-4 text-destructive" />
        <span className="text-sm font-medium">Mode hors ligne</span>
      </CardContent>
    </Card>
  );
}