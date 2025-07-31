import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const faqs = [
  {
    question: "Comment l'IA génère-t-elle des memes si pertinents ?",
    answer: "Notre IA est entraînée sur plus de 100K memes viraux analysés selon 47 critères (timing, ton, audience, format, etc.). Elle comprend votre marque, votre audience et les tendances actuelles pour créer du contenu ultra-ciblé qui performe."
  },
  {
    question: "Garantissez-vous vraiment +300% d'engagement ?",
    answer: "Nos stats sont basées sur 500+ clients réels sur 18 mois. 94% de nos clients voient une amélioration dès la première semaine. Si vous n'obtenez pas de résultats en 30 jours, nous remboursons intégralement."
  },
  {
    question: "Mes memes risquent-ils d'être offensants ou inappropriés ?",
    answer: "Triple sécurité : IA entraînée sur des datasets 'brand-safe', filtre automatique anti-controverse, et validation optionnelle avant publication. Zéro scandale en 18 mois d'existence."
  },
  {
    question: "Comment ça marche techniquement ? C'est complexe ?",
    answer: "Ultra-simple ! 1) Uploadez vos visuels 2) L'IA analyse votre marque et génère 50+ variants 3) Sélectionnez vos favoris 4) Auto-posting programmé. Interface 100% no-code, résultats en 30 secondes."
  },
  {
    question: "Puis-je annuler à tout moment ?",
    answer: "Oui, annulation en 1 clic dans votre dashboard. Pas d'engagement, pas de frais cachés. Vous gardez l'accès jusqu'à la fin de votre période facturée."
  },
  {
    question: "Ça marche pour tous les secteurs d'activité ?",
    answer: "Nos clients vont du e-commerce à la finance en passant par le SaaS, resto, fitness, gaming... L'IA s'adapte automatiquement au ton et aux codes de votre secteur. 47 industries testées avec succès."
  },
  {
    question: "Que se passe-t-il si un meme ne performe pas ?",
    answer: "L'IA apprend en continu de vos performances. Plus vous utilisez la plateforme, plus elle s'améliore. Dashboard analytics pour identifier ce qui marche et optimiser en temps réel."
  },
  {
    question: "Puis-je personnaliser les memes avant publication ?",
    answer: "Totalement ! Éditeur intégré pour modifier texte, couleurs, timing. Templates personnalisables, A/B testing automatique, et suggestions d'optimisation en temps réel."
  }
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-muted/10 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-viral text-white">
            ❓ Questions Fréquentes
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Toutes Vos{" "}
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            On répond à tout ce que vous vous demandez sur l'IA qui révolutionne le marketing
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-glow-primary/30">
              <Collapsible 
                open={openItems.includes(index)}
                onOpenChange={() => toggleItem(index)}
              >
                <CollapsibleTrigger className="w-full p-6 text-left hover:bg-muted/5 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-6 pb-6">
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Encore des questions ? Notre équipe vous répond en moins de 2h
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Support 7j/7
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Réponse &lt; 2h
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Français natif
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}