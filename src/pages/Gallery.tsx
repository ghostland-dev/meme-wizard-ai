import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Share2, Eye, Heart, MoreHorizontal, Search, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Meme {
  id: string;
  title: string;
  description: string;
  generated_image_url: string;
  style: string;
  views: number;
  likes: number;
  shares: number;
  created_at: string;
  status: string;
}

export default function Gallery() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStyle, setFilterStyle] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('memes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMemes(data || []);
    } catch (error) {
      console.error('Error fetching memes:', error);
      toast.error("Erreur lors du chargement des memes");
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedMemes = memes
    .filter(meme => {
      const matchesSearch = meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meme.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle = filterStyle === "all" || meme.style === filterStyle;
      return matchesSearch && matchesStyle;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'most_viewed':
          return b.views - a.views;
        case 'most_liked':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  const downloadMeme = (meme: Meme) => {
    const link = document.createElement('a');
    link.href = meme.generated_image_url;
    link.download = `meme-${meme.id}.png`;
    link.click();
    toast.success("Téléchargement démarré");
  };

  const shareToSocial = (meme: Meme, platform: string) => {
    const text = `Regardez ce meme génial : ${meme.title} 🔥`;
    const url = meme.generated_image_url;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'reddit':
        window.open(`https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
    
    // Increment shares count
    incrementMemeStats(meme.id, 'shares');
  };

  const incrementMemeStats = async (memeId: string, field: 'views' | 'likes' | 'shares') => {
    try {
      // Simple increment using raw SQL
      const currentMeme = memes.find(m => m.id === memeId);
      if (!currentMeme) return;

      const newValue = currentMeme[field] + 1;
      const { error } = await supabase
        .from('memes')
        .update({ 
          [field]: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', memeId);

      if (error) {
        console.error('Error incrementing stat:', error);
      } else {
        // Update local state
        setMemes(prevMemes => 
          prevMemes.map(meme => 
            meme.id === memeId 
              ? { ...meme, [field]: newValue }
              : meme
          )
        );
      }
    } catch (error) {
      console.error('Error incrementing stat:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
          <p className="text-muted-foreground">Chargement de vos memes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Ma <span className="bg-gradient-viral bg-clip-text text-transparent">Galerie</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez tous vos memes créés avec l'IA ({memes.length} créations)
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher vos memes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStyle} onValueChange={setFilterStyle}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les styles</SelectItem>
              <SelectItem value="viral">🔥 Viral</SelectItem>
              <SelectItem value="funny">😂 Drôle</SelectItem>
              <SelectItem value="classic">📱 Classic</SelectItem>
              <SelectItem value="dark">🖤 Dark Humor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
              <SelectItem value="most_viewed">Plus vus</SelectItem>
              <SelectItem value="most_liked">Plus aimés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Memes Grid */}
        {filteredAndSortedMemes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-semibold mb-2">Aucun meme trouvé</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterStyle !== "all" 
                ? "Essayez de modifier vos filtres de recherche"
                : "Commencez par créer votre premier meme !"
              }
            </p>
            <Button onClick={() => window.location.href = "#upload"}>
              Créer un meme
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMemes.map((meme) => (
              <Card key={meme.id} className="group hover:scale-105 transition-all duration-300 hover:shadow-glow-primary overflow-hidden">
                <div className="relative">
                  <img
                    src={meme.generated_image_url}
                    alt={meme.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => downloadMeme(meme)}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareToSocial(meme, 'twitter')}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager sur Twitter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareToSocial(meme, 'facebook')}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager sur Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => shareToSocial(meme, 'reddit')}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager sur Reddit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                      {getStyleEmoji(meme.style)} {meme.style}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{meme.title}</h3>
                  {meme.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {meme.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{formatDate(meme.created_at)}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {meme.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {meme.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {meme.shares}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => downloadMeme(meme)}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Télécharger
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => shareToSocial(meme, 'twitter')}
                      className="flex-1"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Partager
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}