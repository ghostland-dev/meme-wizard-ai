import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Clock, Gift, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function CTASection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="max-w-4xl mx-auto text-center">
        {/* Urgency badge */}
        <Badge className="mb-6 bg-gradient-electric text-white animate-pulse">
          <Clock className="h-3 w-3 mr-1" />
          Offre Limitée - Plus que 23 places
        </Badge>

        {/* Main CTA */}
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Prêt à{" "}
          <span className="bg-gradient-viral bg-clip-text text-transparent">
            Exploser
          </span>{" "}
          Vos Métriques ?
        </h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Rejoignez les 500+ marques qui dominent les réseaux sociaux grâce à l'IA. 
          <span className="text-success font-bold"> Première semaine gratuite</span>, 
          aucun engagement.
        </p>

        {/* Offer cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-2 border-primary/20 bg-background/80">
            <div className="space-y-4">
              <Badge className="bg-gradient-viral text-white">
                <Gift className="h-3 w-3 mr-1" />
                Gratuit
              </Badge>
              <h3 className="text-2xl font-bold">Pack Découverte</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✅ 5 memes gratuits</li>
                <li>✅ Templates premium</li>
                <li>✅ Analytics de base</li>
                <li>✅ Support 24/7</li>
              </ul>
              <Button variant="outline" className="w-full" size="lg">
                Commencer Gratuitement
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-2 border-accent bg-gradient-to-br from-accent/5 to-primary/5 relative overflow-hidden">
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-neon text-white">
              🔥 Plus Populaire
            </Badge>
            <div className="space-y-4 pt-4">
              <h3 className="text-2xl font-bold">Pack Pro</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">29€</span>
                <span className="text-lg line-through text-muted-foreground">49€</span>
                <span className="text-sm text-success">/mois</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✅ 200 memes/mois</li>
                <li>✅ Auto-posting</li>
                <li>✅ Analytics avancés</li>
                <li>✅ A/B testing</li>
                <li>✅ API intégration</li>
              </ul>
              <Button variant="viral" className="w-full" size="lg">
                <Sparkles className="h-4 w-4" />
                Démarrer Maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Money back guarantee */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-success" />
            <span>Garantie 30 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Activation immédiate</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-accent" />
            <span>Sans engagement</span>
          </div>
        </div>
      </div>
    </section>
  );
}