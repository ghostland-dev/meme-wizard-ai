import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, Shield, Users, Trophy, TrendingUp } from "lucide-react";

const trustMetrics = [
  { icon: Users, value: "500+", label: "Marques Clientes", color: "text-primary" },
  { icon: TrendingUp, value: "+437%", label: "ROI Moyen", color: "text-success" },
  { icon: Star, value: "4.9/5", label: "Note Moyenne", color: "text-accent" },
  { icon: Trophy, value: "#1", label: "En France", color: "text-secondary" },
];

const certifications = [
  { name: "ISO 27001", description: "Sécurité des données" },
  { name: "RGPD", description: "Conformité européenne" },
  { name: "SOC 2", description: "Audit sécurité" },
  { name: "99.9%", description: "Uptime garanti" },
];

export function TrustSection() {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Trust metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {trustMetrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <Card key={metric.label} className="p-6 text-center bg-background/80 border-border/50">
                <div className="flex flex-col items-center space-y-2">
                  <IconComponent className={`h-6 w-6 ${metric.color}`} />
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="text-center">
          <Badge className="mb-6 bg-gradient-neon text-white">
            <Shield className="h-3 w-3 mr-1" />
            Sécurité & Conformité
          </Badge>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex flex-col items-center space-y-1">
                <div className="text-lg font-bold text-foreground">{cert.name}</div>
                <div className="text-xs text-muted-foreground">{cert.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}