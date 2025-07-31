import { Check, Zap, Crown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Starter",
    price: "49",
    period: "/mois",
    description: "Parfait pour tester la viralité",
    features: [
      "20 memes/mois",
      "1 réseau social",
      "Templates de base",
      "Analytics basiques",
      "Support email"
    ],
    cta: "Commencer",
    variant: "outline" as const,
    icon: Zap
  },
  {
    name: "Pro",
    price: "149",
    period: "/mois",
    description: "Pour les marques qui veulent dominer",
    features: [
      "100 memes/mois",
      "Multi-réseaux sociaux",
      "IA stratégie virale",
      "A/B testing",
      "Analytics avancées",
      "Support prioritaire"
    ],
    cta: "Devenir Viral",
    variant: "viral" as const,
    popular: true,
    icon: Crown
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    description: "Solution sur-mesure pour agences",
    features: [
      "Memes illimités",
      "Marque blanche",
      "API complète",
      "Manager dédié",
      "Formation équipe",
      "SLA garantie"
    ],
    cta: "Nous Contacter",
    variant: "neon" as const,
    icon: Rocket
  }
];

export function PricingSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-electric text-white">
            Pricing Transparent
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choisissez Votre Niveau de{" "}
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              Viralité
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            De la startup au Fortune 500, nous avons le plan qui vous fera exploser sur les réseaux
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`
                  relative p-8 transition-all duration-300 hover:scale-105
                  ${plan.popular ? 'ring-2 ring-primary shadow-glow-primary border-primary/50' : ''}
                `}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-viral text-white">
                    ⚡ Le Plus Populaire
                  </Badge>
                )}
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-viral mb-4">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold bg-gradient-viral bg-clip-text text-transparent">
                      {plan.price === "Custom" ? plan.price : `${plan.price}€`}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.variant}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>

                {plan.name === "Pro" && (
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    💎 ROI moyen: +300% d'engagement
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            🎯 Garantie satisfait ou remboursé 30 jours
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span>✅ Pas d'engagement</span>
            <span>✅ Annulation 1-clic</span>
            <span>✅ Support 7j/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}