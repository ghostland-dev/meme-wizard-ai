import { Zap, Target, TrendingUp, Sparkles, Bot, Clock, Globe, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Bot,
    title: "IA Ultra-Performante",
    description: "Algorithme entraîné sur 100K+ memes viraux pour générer du contenu qui cartonne",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "Génération Express",
    description: "50+ memes personnalisés en moins de 30 secondes. Fini les heures de création !",
    color: "text-secondary"
  },
  {
    icon: Target,
    title: "Ciblage Précis",
    description: "IA qui analyse votre audience et adapte l'humour à vos segments spécifiques",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    title: "Performance Garantie", 
    description: "ROI moyen de +437% d'engagement vs posts classiques. Promesse tenue !",
    color: "text-success"
  },
  {
    icon: Globe,
    title: "Multi-Plateformes",
    description: "Auto-posting intelligent sur TikTok, Instagram, Twitter, LinkedIn & Reddit",
    color: "text-primary"
  },
  {
    icon: BarChart3,
    title: "Analytics Temps Réel",
    description: "Dashboard live avec métriques virales, A/B testing automatique inclus",
    color: "text-secondary"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-neon text-white">
            ⚡ Fonctionnalités Révolutionnaires
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pourquoi Nous Sommes{" "}
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              #1 en France
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            La seule plateforme qui transforme vos visuels en memes viraux automatiquement. 
            <span className="text-accent font-bold"> 500+ marques nous font confiance</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={feature.title}
                className={`
                  p-8 transition-all duration-500 hover:scale-105 hover:shadow-glow-primary
                  border-border/50 bg-card/50 backdrop-blur-sm
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`
                    p-3 rounded-full bg-gradient-viral/10 
                    transition-all duration-300 hover:scale-110
                  `}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to action in features */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-electric rounded-full text-white font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Offre Limitée: 50% de Réduction</span>
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-sm text-muted-foreground">
            Les 100 premiers clients économisent 240€/an • Plus que 23 places
          </p>
        </div>
      </div>
    </section>
  );
}