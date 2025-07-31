import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Gift, Zap, TrendingUp, Users, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WelcomeFlowProps {
  user: any;
  onComplete: () => void;
}

export function WelcomeFlow({ user, onComplete }: WelcomeFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
    }
  };

  const completeWelcome = async () => {
    setLoading(true);
    
    // Mark user as welcomed (you could add a welcomed flag to profiles)
    const { error } = await supabase
      .from('profiles')
      .update({ 
        display_name: user.email.split('@')[0] // Set a default display name
      })
      .eq('user_id', user.id);

    if (!error) {
      toast.success("Bienvenue dans AI Meme Factory ! 🎉");
      onComplete();
    }
    
    setLoading(false);
  };

  const steps = [
    {
      title: "Bienvenue dans AI Meme Factory ! 🚀",
      description: "Prêt à créer des memes viraux avec l'IA ?",
      content: (
        <div className="space-y-6 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-viral rounded-full flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Félicitations ! 🎉</h3>
            <p className="text-muted-foreground">
              Vous venez de rejoindre la plateforme #1 de création de memes viraux en France
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Vos crédits gratuits 💎",
      description: "Commencez à créer immédiatement",
      content: (
        <div className="space-y-6 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-electric rounded-full flex items-center justify-center">
            <Gift className="h-10 w-10 text-white" />
          </div>
          <div>
            <Badge className="text-2xl px-6 py-3 bg-gradient-viral text-white mb-4">
              {profile?.credits || 5} crédits gratuits
            </Badge>
            <p className="text-muted-foreground">
              Chaque crédit = 1 meme généré par IA. Parfait pour tester notre technologie !
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Comment ça marche ? ⚡",
      description: "Simple et rapide",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
            <div>
              <p className="font-semibold">Décrivez votre idée</p>
              <p className="text-sm text-muted-foreground">Plus c'est détaillé, mieux c'est !</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-lg">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
            <div>
              <p className="font-semibold">Notre IA crée votre meme</p>
              <p className="text-sm text-muted-foreground">En moins de 30 secondes</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
            <div>
              <p className="font-semibold">Partagez et dominez</p>
              <p className="text-sm text-muted-foreground">+300% d'engagement garanti</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step - 1];
  const progress = (step / steps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Progress value={progress} className="w-64" />
          </div>
          <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
          <CardDescription>{currentStep.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {currentStep.content}
          
          <div className="flex justify-between">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
              >
                Précédent
              </Button>
            )}
            
            {step < steps.length ? (
              <Button 
                onClick={() => setStep(step + 1)}
                className="ml-auto"
                variant="viral"
              >
                Suivant
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={completeWelcome}
                disabled={loading}
                className="ml-auto"
                variant="viral"
                size="lg"
              >
                {loading ? "Préparation..." : "Commencer à créer ! 🚀"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}