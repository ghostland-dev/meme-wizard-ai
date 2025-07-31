import { useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";

const Index = () => {
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