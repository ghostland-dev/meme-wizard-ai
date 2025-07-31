import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WelcomeFlow } from "@/components/welcome-flow";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Check for new signups to show welcome flow
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if this is a new user by checking profile creation time
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('created_at')
                .eq('user_id', session.user.id)
                .maybeSingle();
              
              if (profile) {
                const createdAt = new Date(profile.created_at);
                const now = new Date();
                const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
                
                // Show welcome for users created in the last 5 minutes
                if (diffMinutes < 5) {
                  setShowWelcome(true);
                  setIsNewUser(true);
                }
              }
            } catch (error) {
              console.log('Profile check error:', error);
            }
          }, 1000);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string) => {
    setAuthLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    setAuthLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Compte créé ! Vérifiez votre email pour confirmer.");
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    setAuthLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Connexion réussie !");
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnecté avec succès");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignUp={handleSignUp} onSignIn={handleSignIn} loading={authLoading} />;
  }

  // Show welcome flow for new users
  if (user && showWelcome && isNewUser) {
    return <WelcomeFlow user={user} onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={handleSignOut} variant="outline" size="sm">
          Déconnexion
        </Button>
      </div>
      {children}
    </div>
  );
}

interface AuthFormProps {
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

function AuthForm({ onSignUp, onSignIn, loading }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (type: 'signin' | 'signup', e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (type === 'signup') {
      await onSignUp(email, password);
    } else {
      await onSignIn(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/90 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-viral bg-clip-text text-transparent">
            AI Meme Factory
          </CardTitle>
          <CardDescription>
            Créez des memes viraux avec l'IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={(e) => handleSubmit('signin', e)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Se connecter
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={(e) => handleSubmit('signup', e)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer un compte
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}