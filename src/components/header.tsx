import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { 
  Menu, 
  Zap, 
  User, 
  Settings, 
  LogOut, 
  CreditCard,
  HelpCircle,
  Shield
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!error && data) {
          setCredits(data.credits || 0);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-viral rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">Meme Wizard AI</span>
          </div>
        </div>

        {/* Center - Quick Actions (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="/#upload" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Créer un meme
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/gallery">Galerie</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/analytics">Analytics</a>
          </Button>
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center gap-3">
          {/* Credits Badge */}
          {user && (
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              {credits} crédits
            </Badge>
          )}

          {/* User Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 bg-gradient-viral rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.email}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      Membre depuis {new Date().toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <a href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Mon profil
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <a href="/pricing" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Acheter des crédits
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <a href="/health" className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    État du système
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <a href="/auth">Se connecter</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}