import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, TrendingUp } from "lucide-react";

const memeExamples = [
  {
    id: 1,
    template: "Drake Pointing",
    category: "E-commerce", 
    setup: "Chercher des clients manuellement",
    punchline: "Utiliser AI Meme Factory pour +300% d'engagement",
    metrics: { likes: "12.4K", comments: "892", shares: "3.2K", engagement: "+445%" },
    brand: "TechStartup"
  },
  {
    id: 2,
    template: "Distracted Boyfriend",
    category: "SaaS",
    setup: "Moi: 'Je vais faire mes memes moi-même'",
    punchline: "Aussi moi: *Découvre AI Meme Factory*",
    metrics: { likes: "8.7K", comments: "567", shares: "2.1K", engagement: "+312%" },
    brand: "DevAgency"
  },
  {
    id: 3,
    template: "Woman Yelling at Cat",
    category: "Restauration",
    setup: "Mes concurrents qui postent encore des photos de plats basiques",
    punchline: "Moi avec mes memes qui font le buzz sur TikTok",
    metrics: { likes: "15.2K", comments: "1.2K", shares: "4.8K", engagement: "+623%" },
    brand: "BrasserieParis"
  }
];

export function MemeExamples() {
  const [selectedMeme, setSelectedMeme] = useState(0);

  return (
    <section className="py-24 px-4 bg-gradient-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-electric text-white">
            🔥 Memes qui Cartonnent
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Exemples de{" "}
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              Succès Clients
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez comment nos clients explosent leurs métriques avec des memes ultra-ciblés
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {memeExamples.map((meme, index) => (
            <Card 
              key={meme.id}
              className={`
                p-6 cursor-pointer transition-all duration-300 hover:scale-105
                border-2 backdrop-blur-sm bg-card/10
                ${selectedMeme === index 
                  ? 'border-primary shadow-glow-primary' 
                  : 'border-border/20 hover:border-primary/50'
                }
              `}
              onClick={() => setSelectedMeme(index)}
            >
              {/* Meme Preview */}
              <div className="relative mb-6">
                <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg p-6 flex flex-col justify-center items-center text-center border border-border/30">
                  <div className="space-y-4">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {meme.template}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm opacity-75 line-through">
                        {meme.setup}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {meme.punchline}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Badge className="absolute -top-2 left-2 bg-gradient-viral text-white text-xs">
                  {meme.category}
                </Badge>
              </div>

              {/* Brand & Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-accent">
                    @{meme.brand}
                  </span>
                  <span className="text-xs text-success font-bold">
                    {meme.metrics.engagement}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Heart className="h-4 w-4 text-destructive" />
                    <span className="text-xs font-semibold">{meme.metrics.likes}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold">{meme.metrics.comments}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Share2 className="h-4 w-4 text-accent" />
                    <span className="text-xs font-semibold">{meme.metrics.shares}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 p-6 bg-gradient-viral rounded-2xl text-white mb-6">
            <TrendingUp className="h-6 w-6" />
            <div className="text-left">
              <p className="font-bold">ROI Moyen de nos Clients</p>
              <p className="text-2xl font-bold">+437% d'Engagement</p>
            </div>
          </div>
          
          <Button variant="electric" size="lg" className="text-lg px-8 py-6">
            Créer Mes Premiers Memes Viraux
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            💎 Première semaine gratuite • Aucun engagement
          </p>
        </div>
      </div>
    </section>
  );
}