import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

const liveMetrics = [
  { 
    platform: "TikTok", 
    metric: "+2.4M", 
    label: "vues cette semaine",
    icon: Eye,
    change: "+127%"
  },
  { 
    platform: "Instagram", 
    metric: "+847K", 
    label: "likes générés",
    icon: Heart,
    change: "+89%"
  },
  { 
    platform: "LinkedIn", 
    metric: "+234K", 
    label: "partages B2B",
    icon: Share2,
    change: "+456%"
  },
  { 
    platform: "Twitter", 
    metric: "+1.8M", 
    label: "impressions",
    icon: MessageCircle,
    change: "+234%"
  },
];

const recentActivity = [
  "🔥 @TechStartup a généré +12K likes en 2h",
  "📈 @FitnessPro : +40K followers ce mois",
  "🚀 @EcoShop : +65% de conversions",
  "💎 @GameZone : 1M de vues atteintes",
];

export function SocialProofSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-electric text-white animate-bounce">
            📊 Métriques en Temps Réel
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-viral bg-clip-text text-transparent">
              Résultats Live
            </span>{" "}
            de nos Clients
          </h2>
          <p className="text-muted-foreground">
            Performance en direct de la plateforme AI Meme Factory
          </p>
        </div>

        {/* Live metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {liveMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <Card key={metric.platform} className="p-4 bg-background/80 border-border/50 hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <Badge variant="outline" className="text-xs">
                    {metric.platform}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.metric}</p>
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-semibold">{metric.change}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent activity feed */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <h3 className="font-semibold">Activité Récente</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/30"
              >
                <div className="text-sm">{activity}</div>
                <Badge variant="outline" className="text-xs ml-auto">
                  {Math.floor(Math.random() * 60)}min
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}