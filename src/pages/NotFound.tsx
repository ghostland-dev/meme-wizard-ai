import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  Home, 
  Search, 
  HelpCircle,
  ArrowLeft,
  Lightbulb,
  MessageCircle
} from 'lucide-react';

export default function NotFound() {
  const suggestions = [
    { text: "Créer un meme", url: "/#upload", icon: Lightbulb },
    { text: "Voir la galerie", url: "/gallery", icon: Search },
    { text: "Obtenir de l'aide", url: "/help", icon: HelpCircle },
    { text: "Contacter le support", url: "/help#contact", icon: MessageCircle }
  ];

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    // Dans une vraie app, on enverrait le rapport à un service
    alert('Merci pour votre rapport ! Notre équipe va examiner le problème.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header avec animation */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mx-auto mb-6 p-4 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-muted-foreground mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Oops ! Page <span className="bg-gradient-viral bg-clip-text text-transparent">introuvable</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La page que vous recherchez n'existe pas ou a été déplacée. 
            Pas de panique, nous allons vous aider à retrouver votre chemin !
          </p>
        </div>

        {/* Actions principales */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Retour rapide */}
          <Card className="hover:shadow-glow-primary transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Retour à l'accueil
              </CardTitle>
              <CardDescription>
                Retournez à la page principale de Meme Wizard AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Aller à l'accueil
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="hover:shadow-glow-primary transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Suggestions
              </CardTitle>
              <CardDescription>
                Voici quelques pages populaires qui pourraient vous intéresser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    asChild
                    className="w-full justify-start"
                  >
                    <a href={suggestion.url}>
                      <Icon className="h-4 w-4 mr-2" />
                      {suggestion.text}
                    </a>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Information sur l'erreur */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations sur l'erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>URL demandée:</strong>
                <p className="text-muted-foreground break-all">{window.location.href}</p>
              </div>
              <div>
                <strong>Code d'erreur:</strong>
                <Badge variant="destructive" className="ml-2">HTTP 404</Badge>
              </div>
              <div>
                <strong>Timestamp:</strong>
                <p className="text-muted-foreground">{new Date().toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <strong>User Agent:</strong>
                <p className="text-muted-foreground truncate" title={navigator.userAgent}>
                  {navigator.userAgent.slice(0, 50)}...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message d'encouragement */}
        <Alert className="mt-8 border-primary/20 bg-primary/5">
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Le saviez-vous ?</strong> Même les erreurs 404 peuvent inspirer des memes créatifs ! 
            Pourquoi ne pas créer un meme sur cette expérience ? 😄
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}