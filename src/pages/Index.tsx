import { HeroSection } from "@/components/hero-section";
import { MemeUpload } from "@/components/meme-upload";
import { PricingSection } from "@/components/pricing-section";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
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
      
      <Separator className="opacity-20" />
      
      <PricingSection />
    </div>
  );
};

export default Index;
