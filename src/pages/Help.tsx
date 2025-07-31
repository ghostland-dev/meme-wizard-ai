import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  ExternalLink,
  Zap,
  Upload,
  Images,
  BarChart3,
  Search
} from 'lucide-react';

const faqItems = [
  {
    question: "Comment créer mon premier meme ?",
    answer: "Cliquez sur 'Créer un meme' dans le menu, décrivez votre idée, choisissez un style et laissez l'IA faire le reste !",
    category: "Création"
  },
  {
    question: "Combien coûte la génération d'un meme ?",
    answer: "Chaque meme coûte 1 crédit. Vous recevez 3 crédits gratuits à l'inscription, puis vous pouvez en acheter plus.",
    category: "Crédits"
  },
  {
    question: "Puis-je utiliser mes memes commercialement ?",
    answer: "Oui, tous les memes que vous créez vous appartiennent et peuvent être utilisés à des fins commerciales.",
    category: "Licence"
  },
  {
    question: "Quels formats d'image sont supportés ?",
    answer: "Nous supportons JPG, PNG et WebP jusqu'à 10MB. Les images sont optimisées automatiquement.",
    category: "Technique"
  },
  {
    question: "Comment télécharger mes memes ?",
    answer: "Cliquez sur le bouton de téléchargement dans votre galerie ou directement après la génération.",
    category: "Utilisation"
  },
  {
    question: "Puis-je modifier un meme après création ?",
    answer: "Actuellement, vous ne pouvez pas modifier un meme existant, mais vous pouvez en créer une nouvelle version.",
    category: "Édition"
  }
];

const tutorialSteps = [
  {
    title: "1. Créer un compte",
    description: "Inscrivez-vous gratuitement et recevez 3 crédits de bienvenue",
    icon: Upload
  },
  {
    title: "2. Décrire votre meme",
    description: "Expliquez votre idée en quelques mots, soyez créatif !",
    icon: MessageCircle
  },
  {
    title: "3. Choisir un style",
    description: "Sélectionnez parmi nos styles: viral, drôle, classique, etc.",
    icon: Images
  },
  {
    title: "4. Partager et télécharger",
    description: "Votre meme est prêt ! Partagez-le ou téléchargez-le",
    icon: BarChart3
  }
];

export default function Help() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Centre d'<span className="bg-gradient-viral bg-clip-text text-transparent">Aide</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Trouvez toutes les réponses à vos questions sur Meme Wizard AI
          </p>
          
          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => scrollToSection('getting-started')}>
              <Book className="h-4 w-4 mr-2" />
              Guide de démarrage
            </Button>
            <Button variant="outline" onClick={() => scrollToSection('faq')}>
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Button>
            <Button variant="outline" onClick={() => scrollToSection('contact')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-6 w-6" />
                Guide de démarrage rapide
              </CardTitle>
              <CardDescription>
                Apprenez à créer votre premier meme en 4 étapes simples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tutorialSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="text-center p-4 rounded-lg border border-dashed border-primary/30">
                      <Icon className="h-12 w-12 mx-auto text-primary mb-4" />
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 text-center">
                <Button asChild className="mr-4">
                  <a href="/#upload">
                    <Zap className="h-4 w-4 mr-2" />
                    Créer mon premier meme
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/gallery">
                    <Images className="h-4 w-4 mr-2" />
                    Voir des exemples
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6" />
                Questions fréquentes
              </CardTitle>
              <CardDescription>
                Les réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{item.question}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Video Tutorials */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-6 w-6" />
                Tutoriels vidéo
              </CardTitle>
              <CardDescription>
                Apprenez en regardant nos tutoriels step-by-step
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg border text-center">
                  <div className="h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Créer votre premier meme</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Guide complet pour débuter avec Meme Wizard AI
                  </p>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Regarder (5 min)
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg border text-center">
                  <div className="h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Optimiser vos prompts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Techniques pour obtenir les meilleurs résultats
                  </p>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Regarder (8 min)
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg border text-center">
                  <div className="h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Video className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Partager et monétiser</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comment faire connaître vos créations
                  </p>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Regarder (6 min)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section id="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Besoin d'aide supplémentaire ?
              </CardTitle>
              <CardDescription>
                Notre équipe est là pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg border">
                  <MessageCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Chat en direct</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Réponse immédiate du lundi au vendredi
                  </p>
                  <Button className="w-full">
                    Ouvrir le chat
                  </Button>
                </div>
                
                <div className="text-center p-6 rounded-lg border">
                  <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Centre d'aide</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Documentation complète et guides détaillés
                  </p>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visiter
                  </Button>
                </div>
                
                <div className="text-center p-6 rounded-lg border">
                  <Search className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Base de connaissances</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Articles détaillés et résolution de problèmes
                  </p>
                  <Button variant="outline" className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Vous ne trouvez pas ce que vous cherchez ? 
                  <a href="mailto:support@memewizard.ai" className="text-primary hover:underline ml-1">
                    Contactez-nous directement
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}