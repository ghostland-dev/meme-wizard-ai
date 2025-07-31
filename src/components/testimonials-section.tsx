import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Marie Dubois",
    role: "CMO",
    company: "TechFlow",
    avatar: "MD",
    rating: 5,
    text: "Résultats FOUS ! En 3 semaines, nos memes ont généré +280% d'engagement vs nos posts habituels. L'IA comprend parfaitement notre ton et notre audience. ROI exceptionnel !",
    metrics: "+280% engagement",
    verified: true
  },
  {
    name: "Thomas Laurent", 
    role: "Fondateur",
    company: "BrasserieModerne",
    avatar: "TL",
    rating: 5,
    text: "Avant, créer du contenu viral était un mystère. Maintenant, 20 memes/semaine générés automatiquement et notre TikTok explose ! +40K followers en 2 mois.",
    metrics: "+40K followers",
    verified: true
  },
  {
    name: "Sophie Chen",
    role: "Social Media Manager", 
    company: "FitnessPro",
    avatar: "SC",
    rating: 5,
    text: "Game changer total ! Mes clients adorent, les algos aussi. Je gagne 15h/semaine et mes campagnes performent 4x mieux. Impossible de revenir en arrière !",
    metrics: "15h économisées/semaine",
    verified: true
  },
  {
    name: "Lucas Martin",
    role: "CEO",
    company: "StartupLab",
    avatar: "LM", 
    rating: 5,
    text: "L'investissement le plus rentable de l'année ! 149€/mois pour +500% de reach organique. Nos memes B2B cartonnent sur LinkedIn, incroyable !",
    metrics: "+500% reach",
    verified: true
  },
  {
    name: "Emma Rousseau",
    role: "Marketing Director",
    company: "EcoShop",
    avatar: "ER",
    rating: 5,
    text: "Sceptique au début, convaincue maintenant ! L'IA capture parfaitement notre esprit éco-responsable avec de l'humour intelligent. Nos ventes ont explosé !",
    metrics: "+65% conversions",
    verified: true
  },
  {
    name: "Alexandre Petit",
    role: "Community Manager",
    company: "GameZone",
    avatar: "AP",
    rating: 5,
    text: "Révolution pour notre secteur gaming ! Les memes générés parlent parfaitement à notre communauté. +1M de vues en 1 mois, du jamais vu !",
    metrics: "+1M vues/mois",
    verified: true
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-neon text-white">
            ⭐ 4.9/5 sur ProductHunt
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            500+ Marques{" "}
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              Nous Font Confiance
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez pourquoi les plus grandes marques choisissent AI Meme Factory 
            pour dominer les réseaux sociaux
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className={`
                p-6 transition-all duration-500 hover:scale-105 hover:shadow-glow-primary
                border-border/50 bg-card/50 backdrop-blur-sm relative
                animate-fade-in
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/30" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
                "{testimonial.text}"
              </p>

              {/* Metrics badge */}
              <Badge className="mb-4 bg-gradient-electric text-white text-xs">
                📊 {testimonial.metrics}
              </Badge>

              {/* Author info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-viral text-white text-sm font-bold">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    {testimonial.verified && (
                      <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} chez {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Rejoignez ces marques qui explosent leurs métriques :</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-bold">TechFlow</div>
            <div className="text-lg font-bold">BrasserieModerne</div>
            <div className="text-lg font-bold">FitnessPro</div>
            <div className="text-lg font-bold">StartupLab</div>
            <div className="text-lg font-bold">EcoShop</div>
            <div className="text-lg font-bold">GameZone</div>
          </div>
        </div>
      </div>
    </section>
  );
}