import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, X, Sparkles, Zap, Loader2, Download, Share2, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface MemeUploadProps {
  onImagesChange?: (images: UploadedImage[]) => void;
}

export function MemeUpload({ onImagesChange }: MemeUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("viral");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeme, setGeneratedMeme] = useState<any>(null);
  const [userCredits, setUserCredits] = useState<number>(0);

  useEffect(() => {
    fetchUserCredits();
  }, []);

  const fetchUserCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Force a fresh query by adding cache-busting parameter
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching credits:', error);
          return;
        }
        
        if (data) {
          setUserCredits(data.credits);
        } else {
          // Profile doesn't exist yet, show default credits
          setUserCredits(3);
        }
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    const updatedImages = [...uploadedImages, ...newImages];
    setUploadedImages(updatedImages);
    onImagesChange?.(updatedImages);
    
    toast.success(`${acceptedFiles.length} image(s) uploadée(s) !`);
  }, [uploadedImages, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const removeImage = (id: string) => {
    const updatedImages = uploadedImages.filter(img => img.id !== id);
    setUploadedImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const generateMeme = async () => {
    if (!prompt.trim()) {
      toast.error("Veuillez décrire votre meme");
      return;
    }

    if (userCredits <= 0) {
      toast.error("Crédits insuffisants", {
        action: {
          label: "Acheter des crédits",
          onClick: () => window.location.href = "/pricing"
        }
      });
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-meme', {
        body: {
          prompt: prompt.trim(),
          imageUrl: uploadedImages[0] ? uploadedImages[0].preview : null,
          style
        }
      });

      if (error) {
        console.error('Generation error:', error);
        
        // More specific error messages
        if (error.message.includes('non-2xx status code')) {
          toast.error("Erreur de génération. Veuillez réessayer dans quelques instants.");
        } else if (error.message.includes('timeout')) {
          toast.error("La génération prend plus de temps que prévu. Veuillez réessayer.");
        } else if (error.message.includes('insufficient') || error.message.includes('Crédits insuffisants')) {
          toast.error("Crédits insuffisants pour cette opération.");
        } else {
          toast.error("Erreur lors de la génération du meme. Veuillez réessayer.");
        }
        return;
      }

      const generationTime = Date.now() - startTime;
      console.log(`Meme generated in ${generationTime}ms`);

      setGeneratedMeme(data.meme);
      setUserCredits(data.creditsRemaining);
      
      toast.success("Meme généré avec succès!", {
        description: `Généré en ${(generationTime / 1000).toFixed(1)}s`
      });
      
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMeme = () => {
    if (generatedMeme?.generated_image_url) {
      const link = document.createElement('a');
      link.href = generatedMeme.generated_image_url;
      link.download = `meme-${generatedMeme.id}.png`;
      link.click();
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Regardez ce meme génial créé avec AI Meme Factory ! 🔥`;
    const url = generatedMeme?.generated_image_url;
    
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
  };

  return (
    <div className="space-y-8">
      {/* Enhanced credits display */}
      <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Crédits disponibles
              </h3>
              <p className="text-muted-foreground">Chaque génération coûte 1 crédit</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="text-2xl px-6 py-3 bg-gradient-viral text-white">
                {userCredits} crédits
              </Badge>
              {userCredits <= 3 && (
                <p className="text-xs text-destructive mt-1">Presque épuisé !</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enhanced upload zone */}
        <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-glow-primary border-2 border-dashed border-primary/30 hover:border-primary/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Image Source (Optionnel)
            </CardTitle>
            <CardDescription>
              Uploadez une image pour personnaliser ou laissez l'IA créer from scratch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                ${isDragActive 
                  ? 'border-primary bg-primary/10 scale-105' 
                  : 'border-muted-foreground/25 hover:border-primary/60 hover:bg-primary/5'
                }
              `}
            >
              <input {...getInputProps()} />
              {uploadedImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <img
                      src={uploadedImages[0].preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <Badge className="bg-gradient-viral text-white">
                        <Image className="h-3 w-3 mr-1" />
                        Image prête
                      </Badge>
                    </div>
                    <button
                      onClick={() => removeImage(uploadedImages[0].id)}
                      className="absolute top-2 right-2 p-2 bg-destructive/90 rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-primary">{uploadedImages[0].file.name}</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setUploadedImages([])}
                      className="mt-3 hover:bg-destructive/10 hover:border-destructive"
                      size="sm"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Supprimer l'image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <Upload className={`h-16 w-16 mx-auto transition-all duration-300 ${
                      isDragActive ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-primary'
                    }`} />
                    {isDragActive && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    )}
                  </div>
                  <div>
                    <p className="text-xl font-semibold">
                      {isDragActive ? "Déposez votre image ici !" : "Glissez une image ou cliquez"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG, WebP jusqu'à 10MB • Recommandé: 1024x1024px
                    </p>
                    <Badge variant="outline" className="mt-3">
                      Complètement optionnel
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced AI generation */}
        <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-glow-accent border-2 border-accent/30 hover:border-accent/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              Générateur IA Avancé
            </CardTitle>
            <CardDescription>
              Décrivez votre vision et notre IA créera le meme parfait
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Description détaillée du meme
              </Label>
              <Textarea
                id="prompt"
                placeholder="Ex: Un chat qui porte des lunettes de soleil avec le texte 'Deal with it' en style viral TikTok"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="resize-none text-base transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`px-2 py-1 rounded ${prompt.length > 10 ? 'bg-success/20 text-success' : 'bg-muted'}`}>
                  {prompt.length} caractères
                </span>
                <span>Plus c'est détaillé, meilleur sera le résultat !</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="style" className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                Style de meme
              </Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viral">🔥 Viral - Tendance & Shareable</SelectItem>
                  <SelectItem value="funny">😂 Drôle - Humour Classique</SelectItem>
                  <SelectItem value="classic">📱 Classic - Meme Traditionnel</SelectItem>
                  <SelectItem value="dark">🖤 Dark Humor - Humour Noir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full text-lg py-6" 
              size="lg"
              onClick={generateMeme}
              disabled={isGenerating || userCredits <= 0 || !prompt.trim()}
              variant={isGenerating ? "secondary" : "viral"}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Génération en cours... ✨
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Générer un Meme Viral 🚀
                </>
              )}
            </Button>

            {userCredits <= 0 && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="pt-4">
                  <p className="text-sm text-destructive text-center font-semibold">
                    ⚠️ Crédits insuffisants. Rechargez votre compte pour continuer !
                  </p>
                  <Button asChild className="w-full mt-3" size="sm">
                    <a href="/pricing">Acheter des crédits</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {!prompt.trim() && (
              <p className="text-xs text-muted-foreground text-center">
                💡 Astuce: Plus votre description est détaillée, plus le meme sera précis !
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced generated meme display */}
      {generatedMeme && (
        <Card className="mt-8 bg-gradient-to-br from-success/5 via-background to-primary/5 border-success/30 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Image className="h-6 w-6 text-success" />
              🎉 Votre Meme Viral est Prêt !
            </CardTitle>
            <CardDescription>
              Téléchargez, partagez et faites exploser vos métriques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="relative group inline-block">
                <img 
                  src={generatedMeme.generated_image_url} 
                  alt="Generated meme"
                  className="max-w-full h-auto rounded-xl border-2 border-success/30 shadow-2xl mx-auto transition-transform duration-300 group-hover:scale-105"
                  style={{ maxHeight: "600px" }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
              </div>
            </div>
            
            {/* Enhanced action buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button onClick={downloadMeme} variant="outline" className="hover:bg-success/10 hover:border-success">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button onClick={() => shareToSocial('twitter')} variant="outline" className="hover:bg-blue-500/10 hover:border-blue-500">
                <Share2 className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button onClick={() => shareToSocial('facebook')} variant="outline" className="hover:bg-blue-600/10 hover:border-blue-600">
                <Share2 className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button onClick={() => shareToSocial('reddit')} variant="outline" className="hover:bg-orange-500/10 hover:border-orange-500">
                <Share2 className="mr-2 h-4 w-4" />
                Reddit
              </Button>
            </div>
            
            {/* Meme info */}
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-gradient-viral text-white">
                Style: {style}
              </Badge>
              <Badge variant="outline" className="border-success text-success">
                <Zap className="h-3 w-3 mr-1" />
                {userCredits} crédits restants
              </Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                Généré à l'instant
              </Badge>
            </div>

            {/* Quick tips */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <p className="text-sm text-center">
                  <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
                  <strong>Pro tip:</strong> Les memes performent mieux quand postés entre 18h-20h sur les réseaux sociaux !
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}