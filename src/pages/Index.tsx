import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { MemeUpload } from "@/components/meme-upload";
import { MemeExamples } from "@/components/meme-examples";
import { NavigationSection } from "@/components/navigation-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FAQSection } from "@/components/faq-section";
import { PricingSection } from "@/components/pricing-section";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <FeaturesSection />
      
      <Separator className="opacity-20" />
      
      <section className="py-24 px-4" id="upload">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Uploadez & <span className="bg-gradient-viral bg-clip-text text-transparent">Viralisez</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Glissez vos images, notre IA génère des memes qui cartonnent
            </p>
          </div>
          <MemeUpload />
        </div>
      </section>
      
      <MemeExamples />
      
      <NavigationSection />
      
      <TestimonialsSection />
      
      <HowItWorksSection />
      
      <FAQSection />
      
      <Separator className="opacity-20" />
      
      <PricingSection />
      
      <Footer />
    </div>
  );
};

export default Index;
