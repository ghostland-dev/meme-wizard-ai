import { useState } from "react";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import heroImage from "@/assets/hero-meme-factory.jpg";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with hero image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage}
          alt="AI Meme Factory"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-dark opacity-90"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-24 text-center">
        {/* Badge */}
        <Badge className="mb-6 bg-gradient-viral text-white text-sm px-4 py-2 animate-bounce">
          🚀 #1 Plateforme de Memes Viraux en France
        </Badge>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="block text-white mb-2">AI Meme Factory</span>
          <span className="bg-gradient-viral bg-clip-text text-transparent">
            L'Usine à Viralité
          </span>
          <span className="block text-white text-3xl md:text-4xl mt-4">
            Automatisée
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12">
          Générez <span className="text-accent font-bold">50+ memes personnalisés</span> en 1 clic, 
          avec analyse de performance en temps réel. 
          <span className="text-success font-bold"> +300% d'engagement garantis</span> 🔥
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <StatsCard
            title="Engagement Moyen"
            value="+437%"
            change={{ value: "+127%", trend: "up" }}
          />
          <StatsCard
            title="Memes Générés"
            value="127K+"
            change={{ value: "+2.4K", trend: "up" }}
          />
          <StatsCard
            title="Clients Satisfaits"
            value="98.7%"
            change={{ value: "+1.2%", trend: "up" }}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            variant="viral"
            size="lg"
            className="text-lg px-8 py-6 min-w-[250px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Sparkles className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`} />
            Générer 5 Memes GRATIS
            <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10"
          >
            <TrendingUp className="h-5 w-5" />
            Voir la Demo Live
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <span>Utilisé par 500+ marques</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span>4.9/5 sur ProductHunt</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🏆</span>
            <span>Élu Startup de l'Année 2024</span>
          </div>
        </div>

        {/* Special offer */}
        <div className="mt-12 p-6 bg-gradient-neon rounded-xl max-w-2xl mx-auto text-white">
          <p className="text-lg font-bold mb-2">🎯 Offre de Lancement Limitée</p>
          <p className="text-sm opacity-90">
            Les 100 premiers clients payent seulement <span className="font-bold">29€/mois</span> 
            au lieu de 49€ (économisez 240€/an)
          </p>
        </div>
      </div>
    </section>
  );
}