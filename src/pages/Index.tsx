import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { MemeUpload } from "@/components/meme-upload";
import { MemeExamples } from "@/components/meme-examples";
import { CommunitySection } from "@/components/community-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FAQSection } from "@/components/faq-section";
import { PricingSection } from "@/components/pricing-section";
import { TrustSection } from "@/components/landing/trust-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { CTASection } from "@/components/landing/cta-section";
import { Dashboard } from "@/components/dashboard";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  // Scroll to upload section if hash is present
  useEffect(() => {
    if (window.location.hash === '#upload') {
      setTimeout(() => {
        document.getElementById('upload')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show dashboard-style content for logged-in users
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Quick access hero for logged-in users */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Bon retour, créateur ! 👋
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Prêt à créer d'autres memes viraux aujourd'hui ?
            </p>
            <Dashboard />
          </div>
        </section>

        <Separator className="opacity-20" />
        
        <section className="py-24 px-4 bg-muted/50" id="upload">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Créez votre <span className="bg-gradient-viral bg-clip-text text-transparent">Meme</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Décrivez votre idée et laissez notre IA créer le meme parfait pour vous. 
                Générez des memes viraux en quelques secondes avec notre technologie avancée.
              </p>
            </div>
            <MemeUpload />
          </div>
        </section>
        
        <MemeExamples />
        <CommunitySection />
      </div>
    );
  }

  // Show marketing landing page for non-logged-in users

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Trust indicators */}
      <TrustSection />
      
      <div className="border-t border-border/20"></div>
      
      <FeaturesSection />
      
      {/* Social proof with live metrics */}
      <SocialProofSection />
      
      <Separator className="opacity-20" />
      
      <section className="py-24 px-4 bg-muted/50" id="upload">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Créez votre <span className="bg-gradient-viral bg-clip-text text-transparent">Meme</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Décrivez votre idée et laissez notre IA créer le meme parfait pour vous. 
              Générez des memes viraux en quelques secondes avec notre technologie avancée.
            </p>
          </div>
          <MemeUpload />
        </div>
      </section>
      
      <MemeExamples />
      
      <div className="bg-gradient-to-b from-background to-muted/30">
        <CommunitySection />
        
        <TestimonialsSection />
      </div>
      
      <HowItWorksSection />
      
      {/* Enhanced CTA section */}
      <CTASection />
      
      <FAQSection />
      
      <Separator className="opacity-20" />
      
      <PricingSection />
    </div>
  );
};

export default Index;