import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, TrendingUp, Eye, Heart, Share2, Calendar, Target, Crown, Users } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AnalyticsData {
  totalMemes: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  avgPerformance: number;
  topMeme: any;
  recentActivity: any[];
  performanceData: any[];
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [userCredits, setUserCredits] = useState(0);

  useEffect(() => {
    fetchAnalytics();
    fetchUserCredits();
  }, [timeRange]);

  const fetchUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('credits')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setUserCredits(data.credits);
        }
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
      startDate.setDate(endDate.getDate() - days);

      // Fetch user's memes
      const { data: memes, error } = await supabase
        .from('memes')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!memes || memes.length === 0) {
        setAnalytics({
          totalMemes: 0,
          totalViews: 0,
          totalLikes: 0,
          totalShares: 0,
          avgPerformance: 0,
          topMeme: null,
          recentActivity: [],
          performanceData: []
        });
        setLoading(false);
        return;
      }

      // Calculate totals
      const totalViews = memes.reduce((sum, meme) => sum + meme.views, 0);
      const totalLikes = memes.reduce((sum, meme) => sum + meme.likes, 0);
      const totalShares = memes.reduce((sum, meme) => sum + meme.shares, 0);
      
      // Find top performing meme
      const topMeme = memes.reduce((top, meme) => {
        const memeScore = meme.views + (meme.likes * 2) + (meme.shares * 3);
        const topScore = top ? top.views + (top.likes * 2) + (top.shares * 3) : 0;
        return memeScore > topScore ? meme : top;
      }, null);

      // Generate performance data for chart
      const performanceData = memes.slice(0, 10).map(meme => ({
        name: meme.title.substring(0, 20) + "...",
        views: meme.views,
        likes: meme.likes,
        shares: meme.shares,
        score: meme.views + (meme.likes * 2) + (meme.shares * 3)
      }));

      // Recent activity (last 5 memes)
      const recentActivity = memes.slice(0, 5).map(meme => ({
        ...meme,
        timeAgo: getTimeAgo(meme.created_at)
      }));

      setAnalytics({
        totalMemes: memes.length,
        totalViews,
        totalLikes,
        totalShares,
        avgPerformance: memes.length > 0 ? Math.round((totalViews + totalLikes + totalShares) / memes.length) : 0,
        topMeme,
        recentActivity,
        performanceData
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getStyleEmoji = (style: string) => {
    switch (style) {
      case 'viral': return '🔥';
      case 'funny': return '😂';
      case 'classic': return '📱';
      case 'dark': return '🖤';
      default: return '✨';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <BarChart className="inline-block mr-3 h-8 w-8 text-primary" />
              Analytics <span className="bg-gradient-viral bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Suivez les performances de vos memes et découvrez les tendances
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              <span className="font-semibold">{userCredits} crédits</span>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">90 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Memes"
            value={analytics?.totalMemes.toString() || "0"}
            change={{
              value: "+12%",
              trend: "up"
            }}
            className="hover:shadow-glow-primary"
          />
          <StatsCard
            title="Vues Totales"
            value={analytics?.totalViews.toLocaleString() || "0"}
            change={{
              value: "+28%",
              trend: "up"
            }}
            className="hover:shadow-glow-primary"
          />
          <StatsCard
            title="Likes Totaux"
            value={analytics?.totalLikes.toLocaleString() || "0"}
            change={{
              value: "+15%",
              trend: "up"
            }}
            className="hover:shadow-glow-primary"
          />
          <StatsCard
            title="Partages Totaux"
            value={analytics?.totalShares.toLocaleString() || "0"}
            change={{
              value: "+22%",
              trend: "up"
            }}
            className="hover:shadow-glow-primary"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="hover:shadow-glow-primary transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance des Memes
              </CardTitle>
              <CardDescription>
                Score de performance de vos derniers memes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.performanceData && analytics.performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={analytics.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune donnée disponible</p>
                    <p className="text-sm">Créez vos premiers memes pour voir les stats !</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Meme */}
          <Card className="hover:shadow-glow-primary transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Meme Star du Moment
              </CardTitle>
              <CardDescription>
                Votre meme le plus performant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.topMeme ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={analytics.topMeme.generated_image_url}
                      alt={analytics.topMeme.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Badge className="absolute top-2 right-2 bg-gradient-viral">
                      {getStyleEmoji(analytics.topMeme.style)} {analytics.topMeme.style}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">{analytics.topMeme.title}</h4>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {analytics.topMeme.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {analytics.topMeme.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {analytics.topMeme.shares}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun meme disponible</p>
                  <Button asChild className="mt-4">
                    <a href="/#upload">Créer votre premier meme</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="hover:shadow-glow-primary transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Vos dernières créations et leurs performances
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentActivity.map((meme) => (
                  <div key={meme.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <img
                      src={meme.generated_image_url}
                      alt={meme.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{meme.title}</h4>
                        <Badge variant="outline">
                          {getStyleEmoji(meme.style)} {meme.style}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{meme.timeAgo}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {meme.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {meme.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {meme.shares}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Aucune activité récente</p>
                <Button asChild>
                  <a href="/#upload">Commencer à créer</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}