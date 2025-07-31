import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Calendar, Users, Star, Trophy, TrendingUp } from "lucide-react";

const trendingMemes = [
  {
    id: 1,
    title: "Chat avec lunettes de soleil",
    creator: "MemeCreator123",
    views: 15420,
    style: "viral",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Réaction quand il pleut",
    creator: "FunnyGuy88",
    views: 12834,
    style: "funny",
    image: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Lundi matin mood",
    creator: "WorkLifeMemes",
    views: 9876,
    style: "classic",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop"
  }
];

const globalStats = [
  {
    label: "Memes créés aujourd'hui",
    value: "2,847",
    icon: BarChart,
    trend: "+12%"
  },
  {
    label: "Créateurs actifs",
    value: "1,234",
    icon: Users,
    trend: "+8%"
  },
  {
    label: "Partages totaux",
    value: "45.6K",
    icon: TrendingUp,
    trend: "+24%"
  }
];

export function CommunitySection() {
  const getStyleEmoji = (style: string) => {
    switch (style) {
      case 'viral': return '🔥';
      case 'funny': return '😂';
      case 'classic': return '📱';
      case 'dark': return '🖤';
      default: return '✨';
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <Trophy className="inline-block mr-3 h-8 w-8 text-primary" />
            Communauté <span className="bg-gradient-viral bg-clip-text text-transparent">Créative</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les memes les plus populaires de notre communauté et suivez les tendances en temps réel
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:scale-105 transition-all duration-300 hover:shadow-glow-primary">
                <CardHeader className="pb-4">
                  <div className="mx-auto mb-2 p-3 bg-primary/10 rounded-full w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                  <CardDescription>
                    <span>{stat.label}</span>
                    <Badge variant="secondary" className="text-green-600 ml-2">
                      {stat.trend}
                    </Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Trending Memes */}
        <Card className="hover:shadow-glow-primary transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              Memes Tendance
            </CardTitle>
            <CardDescription>
              Les créations les plus populaires de la semaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {trendingMemes.map((meme, index) => (
                <div key={meme.id} className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img
                      src={meme.image}
                      alt={meme.title}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      <Badge className="bg-gradient-viral">
                        #{index + 1}
                      </Badge>
                      <Badge variant="secondary">
                        {getStyleEmoji(meme.style)} {meme.style}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{meme.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>par @{meme.creator}</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {meme.views.toLocaleString()} vues
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <a href="/analytics">
                  <BarChart className="mr-2 h-4 w-4" />
                  Voir plus de statistiques
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Actions */}
        <div className="mt-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-semibold">Rejoignez 25,000+ créateurs de memes !</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/#upload">
                <Star className="mr-2 h-4 w-4" />
                Créer mon premier meme
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/gallery">
                <Calendar className="mr-2 h-4 w-4" />
                Explorer la galerie
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}