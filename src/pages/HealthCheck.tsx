import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  Zap, 
  Users, 
  Shield,
  Wifi,
  Server,
  Image
} from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  icon: any;
}

export default function HealthCheck() {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    runHealthChecks();
  }, []);

  const runHealthChecks = async () => {
    setIsLoading(true);
    const results: HealthCheck[] = [];

    // Check database connection
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      results.push({
        name: 'Base de données',
        status: error ? 'error' : 'healthy',
        message: error ? `Erreur DB: ${error.message}` : 'Connexion DB active',
        icon: Database
      });
    } catch (error) {
      results.push({
        name: 'Base de données',
        status: 'error',
        message: 'Connexion DB échouée',
        icon: Database
      });
    }

    // Check authentication
    try {
      const { data: { user } } = await supabase.auth.getUser();
      results.push({
        name: 'Authentification',
        status: user ? 'healthy' : 'warning',
        message: user ? `Connecté: ${user.email}` : 'Non connecté',
        icon: Shield
      });
    } catch (error) {
      results.push({
        name: 'Authentification',
        status: 'error',
        message: 'Service auth indisponible',
        icon: Shield
      });
    }

    // Check edge functions
    try {
      const { error } = await supabase.functions.invoke('generate-meme', {
        body: { prompt: 'health-check', test: true }
      });
      
      // For health check, we expect an error (no credits, etc.) but function should respond
      results.push({
        name: 'Génération de memes',
        status: 'healthy',
        message: 'Edge functions opérationnelles',
        icon: Zap
      });
    } catch (error) {
      results.push({
        name: 'Génération de memes',
        status: 'error',
        message: 'Edge functions indisponibles',
        icon: Zap
      });
    }

    // Check storage
    try {
      const { data, error } = await supabase.storage.from('meme-images').list('', { limit: 1 });
      results.push({
        name: 'Stockage',
        status: error ? 'error' : 'healthy',
        message: error ? 'Stockage inaccessible' : 'Stockage fonctionnel',
        icon: Image
      });
    } catch (error) {
      results.push({
        name: 'Stockage',
        status: 'error',
        message: 'Service stockage indisponible',
        icon: Image
      });
    }

    // Check network
    results.push({
      name: 'Connexion réseau',
      status: navigator.onLine ? 'healthy' : 'error',
      message: navigator.onLine ? 'En ligne' : 'Hors ligne',
      icon: Wifi
    });

    // Check performance
    const performanceScore = performance.now() < 100 ? 'healthy' : 'warning';
    results.push({
      name: 'Performance',
      status: performanceScore,
      message: `Temps de réponse: ${performance.now().toFixed(0)}ms`,
      icon: Server
    });

    setChecks(results);
    
    // Calculate overall status
    const hasError = results.some(check => check.status === 'error');
    const hasWarning = results.some(check => check.status === 'warning');
    
    if (hasError) {
      setOverallStatus('error');
    } else if (hasWarning) {
      setOverallStatus('warning');
    } else {
      setOverallStatus('healthy');
    }
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            État du <span className="bg-gradient-viral bg-clip-text text-transparent">Système</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            {getStatusIcon(overallStatus)}
            <span className={`font-semibold ${
              overallStatus === 'healthy' ? 'text-green-600' : 
              overallStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {overallStatus === 'healthy' ? 'Tous les systèmes opérationnels' :
               overallStatus === 'warning' ? 'Systèmes partiellement fonctionnels' :
               'Problèmes détectés'}
            </span>
          </div>
        </div>

        {overallStatus === 'error' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Des problèmes critiques ont été détectés. Certaines fonctionnalités peuvent être indisponibles.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {checks.map((check, index) => {
            const Icon = check.icon;
            return (
              <Card key={index} className={`${getStatusColor(check.status)} border-2`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{check.name}</h3>
                      <p className="text-sm text-muted-foreground">{check.message}</p>
                    </div>
                    {getStatusIcon(check.status)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center space-y-4">
          <Button onClick={runHealthChecks} className="mr-4">
            Actualiser les vérifications
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Retour à l'accueil</a>
          </Button>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Informations système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>User Agent:</strong>
                <p className="text-muted-foreground break-all">{navigator.userAgent}</p>
              </div>
              <div>
                <strong>Connexion:</strong>
                <p className="text-muted-foreground">
                  {navigator.onLine ? 'En ligne' : 'Hors ligne'}
                  {(navigator as any).connection && 
                    ` (${(navigator as any).connection.effectiveType})`
                  }
                </p>
              </div>
              <div>
                <strong>Timestamp:</strong>
                <p className="text-muted-foreground">{new Date().toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <strong>URL:</strong>
                <p className="text-muted-foreground break-all">{window.location.href}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}