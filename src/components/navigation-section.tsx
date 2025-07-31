import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gallery, Zap, TrendingUp, Users, Star } from "lucide-react";

export function NavigationSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-background/90 to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explorez vos <span className="bg-gradient-viral bg-clip-text text-transparent">Créations</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez votre galerie personnelle, suivez vos statistiques et partagez vos memes les plus viraux
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:scale-105 transition-all duration-300 hover:shadow-glow-primary text-center">
            <CardHeader>
              <Gallery className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Ma Galerie</CardTitle>
              <CardDescription>
                Tous vos memes créés en un seul endroit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/gallery">
                  <Gallery className="mr-2 h-4 w-4" />
                  Voir la galerie
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300 hover:shadow-glow-primary text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Statistiques</CardTitle>
              <CardDescription>
                Suivez les performances de vos memes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Vues totales:</span>
                  <Badge variant="secondary">2.5K</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Partages:</span>
                  <Badge variant="secondary">156</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Likes:</span>
                  <Badge variant="secondary">89</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300 hover:shadow-glow-primary text-center">
            <CardHeader>
              <Zap className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Génération Rapide</CardTitle>
              <CardDescription>
                Créez un nouveau meme en quelques secondes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="viral" className="w-full">
                <a href="#upload">
                  <Zap className="mr-2 h-4 w-4" />
                  Créer maintenant
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300 hover:shadow-glow-primary text-center">
            <CardHeader>
              <Star className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Memes Populaires</CardTitle>
              <CardDescription>
                Découvrez les créations qui font le buzz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href="/gallery?sort=most_viewed">
                  <Star className="mr-2 h-4 w-4" />
                  Voir le top
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Plus de 10,000 memes créés cette semaine !</span>
          </div>
        </div>
      </div>
    </section>
  );
}