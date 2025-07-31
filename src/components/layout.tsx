import { useState } from 'react';
import { Header } from '@/components/header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header onMenuToggle={toggleMobileMenu} />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
          
          {/* Footer */}
          <footer className="border-t bg-muted/50 py-6 mt-auto">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Meme Wizard AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Créez des memes viraux avec l'IA en quelques secondes.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Produit</h4>
                  <div className="space-y-2 text-sm">
                    <a href="/#upload" className="block text-muted-foreground hover:text-foreground">
                      Créer un meme
                    </a>
                    <a href="/gallery" className="block text-muted-foreground hover:text-foreground">
                      Galerie
                    </a>
                    <a href="/pricing" className="block text-muted-foreground hover:text-foreground">
                      Tarifs
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Ressources</h4>
                  <div className="space-y-2 text-sm">
                    <a href="/analytics" className="block text-muted-foreground hover:text-foreground">
                      Analytics
                    </a>
                    <a href="/health" className="block text-muted-foreground hover:text-foreground">
                      État du système
                    </a>
                    <a href="/help" className="block text-muted-foreground hover:text-foreground">
                      Aide
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Légal</h4>
                  <div className="space-y-2 text-sm">
                    <a href="/privacy" className="block text-muted-foreground hover:text-foreground">
                      Confidentialité
                    </a>
                    <a href="/terms" className="block text-muted-foreground hover:text-foreground">
                      Conditions d'utilisation
                    </a>
                    <a href="/contact" className="block text-muted-foreground hover:text-foreground">
                      Contact
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="border-t mt-6 pt-6 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 Meme Wizard AI. Tous droits réservés.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}