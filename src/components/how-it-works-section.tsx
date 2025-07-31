import { Upload, Bot, Rocket, BarChart3, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Uploadez Vos Visuels",
    description: "Glissez logos, produits, équipe... jusqu'à 10 images. Formats JPG, PNG, WebP acceptés.",
    time: "30 secondes",
    color: "text-primary"
  },
  {
    step: "02", 
    icon: Bot,
    title: "L'IA Génère Vos Memes",
    description: "Notre algorithme analyse votre marque et crée 50+ variants ultra-ciblés automatiquement.",
    time: "2 minutes",
    color: "text-secondary"
  },
  {
    step: "03",
    icon: Rocket,
    title: "Sélectionnez & Publiez",
    description: "Choisissez vos favoris, programmez la diffusion multi-plateformes en 1 clic.",
    time: "1 minute",
    color: "text-accent"
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Analysez & Optimisez",
    description: "Dashboard temps réel avec métriques virales, A/B testing automatique inclus.",
    time: "En continu",
    color: "text-success"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 px-4 bg-gradient-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-electric text-white">
            🛠 Mode d'Emploi
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Comment Devenir{" "}
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              Viral en 4 Étapes
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            De l'upload à la viralité en moins de 5 minutes. 
            <span className="text-accent font-bold"> Aucune compétence technique requise</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card 
                key={step.step}
                className={`
                  relative p-8 text-center transition-all duration-500 hover:scale-105
                  bg-card/10 backdrop-blur-sm border border-border/20
                  animate-fade-in
                `}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-gradient-viral rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-viral/10 rounded-full flex items-center justify-center">
                    <IconComponent className={`h-8 w-8 ${step.color}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Time badge */}
                <Badge className="bg-gradient-neon text-white text-xs">
                  ⏱ {step.time}
                </Badge>

                {/* Arrow to next step */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Result showcase */}
        <Card className="p-8 bg-gradient-viral/10 border border-primary/30 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Résultat Final = 🚀 Explosion Virale Garantie
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-viral bg-clip-text text-transparent mb-2">
                +437%
              </div>
              <p className="text-sm text-muted-foreground">Engagement Moyen</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-viral bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-sm text-muted-foreground">Memes Générés</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-viral bg-clip-text text-transparent mb-2">
                &lt; 5min
              </div>
              <p className="text-sm text-muted-foreground">Temps Total</p>
            </div>
          </div>
          
          <Button variant="electric" size="lg" className="text-lg px-8 py-6">
            Tester Maintenant (5 Memes Gratuits)
          </Button>
        </Card>
      </div>
    </section>
  );
}