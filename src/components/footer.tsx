import { ArrowRight, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-gradient-dark border-t border-border/20">
      {/* Newsletter Section */}
      <div className="border-b border-border/20 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Restez à la Pointe de la{" "}
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              Révolution Meme
            </span>
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Recevez chaque semaine les dernières tendances virales, 
            des templates exclusifs et des tips pour dominer les réseaux
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="votre@email.com"
              className="bg-background/10 border-border/30 text-white placeholder:text-muted-foreground"
            />
            <Button variant="viral" className="whitespace-nowrap">
              <Zap className="h-4 w-4" />
              S'abonner
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            🎁 Bonus: 10 templates premium offerts à l'inscription
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-viral rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI Meme Factory</span>
              </div>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                La première plateforme française de génération automatique de memes viraux. 
                500+ marques nous font confiance pour exploser leurs métriques.
              </p>
              
              <div className="flex items-center gap-4">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Produit</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Intégrations</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Ressources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  contact@aimemefactory.fr
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  +33 1 23 45 67 89
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Paris, France
                </li>
              </ul>
              
              <div className="mt-6">
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                  Centre d'aide
                </Button>
              </div>
            </div>
          </div>

          <Separator className="opacity-20 mb-8" />

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              <span>© 2024 AI Meme Factory. Tous droits réservés.</span>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs">🇫🇷 Fièrement français</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs">Tous systèmes opérationnels</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}