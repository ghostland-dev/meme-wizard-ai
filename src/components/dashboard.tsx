import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, Image, Users, Calendar, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function Dashboard() {
  const [stats, setStats] = useState({
    credits: 0,
    memesCreated: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [recentMemes, setRecentMemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile with credits
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch user's memes
      const { data: memes } = await supabase
        .from('memes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (memes) {
        const totalViews = memes.reduce((sum, meme) => sum + (meme.views || 0), 0);
        const totalLikes = memes.reduce((sum, meme) => sum + (meme.likes || 0), 0);
        
        setStats({
          credits: profile?.credits || 0,
          memesCreated: memes.length,
          totalViews,
          totalLikes
        });
        
        setRecentMemes(memes.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:scale-105 transition-transform">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.credits}</p>
                <p className="text-muted-foreground text-sm">Crédits</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.memesCreated}</p>
                <p className="text-muted-foreground text-sm">Memes créés</p>
              </div>
              <Image className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                <p className="text-muted-foreground text-sm">Vues totales</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-105 transition-transform">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</p>
                <p className="text-muted-foreground text-sm">Likes totaux</p>
              </div>
              <Star className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>Que voulez-vous faire aujourd'hui ?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="viral" size="lg" className="h-20">
              <a href="/#upload" className="flex flex-col gap-2">
                <Zap className="h-6 w-6" />
                Créer un Meme
              </a>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="h-20">
              <a href="/gallery" className="flex flex-col gap-2">
                <Image className="h-6 w-6" />
                Voir mes Memes
              </a>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="h-20">
              <a href="/pricing" className="flex flex-col gap-2">
                <Users className="h-6 w-6" />
                Acheter des Crédits
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Memes */}
      {recentMemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Mes Derniers Memes
            </CardTitle>
            <CardDescription>Vos créations les plus récentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentMemes.map((meme) => (
                <Card key={meme.id} className="hover:scale-105 transition-transform">
                  <CardContent className="pt-4">
                    {meme.generated_image_url && (
                      <img 
                        src={meme.generated_image_url} 
                        alt={meme.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2">{meme.title}</h4>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Style: {meme.style}</span>
                      <span>{meme.views} vues</span>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {new Date(meme.created_at).toLocaleDateString('fr-FR')}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button asChild variant="outline">
                <a href="/gallery">Voir tous mes memes</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credits warning */}
      {stats.credits <= 2 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-destructive">Crédits bientôt épuisés !</p>
                <p className="text-sm text-muted-foreground">
                  Il vous reste {stats.credits} crédit(s). Rechargez pour continuer à créer.
                </p>
              </div>
              <Button asChild>
                <a href="/pricing">Recharger</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}