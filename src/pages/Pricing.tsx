import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, Star, Crown, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Pricing() {
  const [userCredits, setUserCredits] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserCredits();
  }, []);

  const fetchUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('credits')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserCredits(data.credits);
        }
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handlePurchase = async (packageType: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { package: packageType }
      });

      if (error) {
        throw error;
      }

      // Redirect to Stripe Checkout
      window.open(data.url, '_blank');
      
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error(error.message || "Erreur lors de l'achat");
    } finally {
      setLoading(false);
    }
  };

  const packages = [
    {
      id: "10-credits",
      name: "Starter",
      credits: 10,
      price: "2,99€",
      description: "Parfait pour tester",
      features: [
        "10 générations de memes",
        "Tous les styles disponibles",
        "Téléchargement illimité",
        "Partage sur réseaux sociaux"
      ],
      icon: Zap,
      popular: false
    },
    {
      id: "50-credits", 
      name: "Pro",
      credits: 50,
      price: "9,99€",
      originalPrice: "14,95€",
      description: "Le plus populaire",
      features: [
        "50 générations de memes",
        "Tous les styles disponibles", 
        "Téléchargement illimité",
        "Partage sur réseaux sociaux",
        "Support prioritaire"
      ],
      icon: Star,
      popular: true
    },
    {
      id: "100-credits",
      name: "Premium",
      credits: 100,
      price: "14,99€", 
      originalPrice: "29,90€",
      description: "Maximum d'économies",
      features: [
        "100 générations de memes",
        "Tous les styles disponibles",
        "Téléchargement illimité", 
        "Partage sur réseaux sociaux",
        "Support prioritaire",
        "Accès aux nouvelles IA"
      ],
      icon: Crown,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choisissez votre <span className="bg-gradient-viral bg-clip-text text-transparent">Pack</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Obtenez plus de crédits pour créer des memes illimités
          </p>
          
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-8">
            <CreditCard className="h-4 w-4 text-primary" />
            <span className="font-semibold">Vous avez actuellement {userCredits} crédits</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card 
                key={pkg.id} 
                className={`relative hover:scale-105 transition-all duration-300 ${
                  pkg.popular 
                    ? 'border-primary shadow-glow-primary' 
                    : 'hover:shadow-glow-primary'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-viral">
                      ⭐ Plus populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold">{pkg.price}</span>
                      {pkg.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-lg font-semibold">
                      {pkg.credits} crédits
                    </CardDescription>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    {pkg.originalPrice && (
                      <Badge variant="secondary" className="mt-2">
                        Économisez {Math.round((1 - parseFloat(pkg.price.replace('€', '').replace(',', '.')) / parseFloat(pkg.originalPrice.replace('€', '').replace(',', '.'))) * 100)}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirection...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Acheter maintenant
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="text-center space-y-8">
          <h2 className="text-2xl font-bold">Pourquoi acheter plus de crédits ?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Génération illimitée</h3>
              <p className="text-sm text-muted-foreground">
                Créez autant de memes que vous voulez avec vos crédits
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Qualité premium</h3>
              <p className="text-sm text-muted-foreground">
                Accès aux derniers modèles d'IA et styles exclusifs
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Support prioritaire</h3>
              <p className="text-sm text-muted-foreground">
                Aide rapide et accès aux nouvelles fonctionnalités en avant-première
              </p>
            </div>
          </div>
        </div>

        {/* Security & Payment Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Paiement sécurisé par Stripe • Facturation instantanée • Support 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}