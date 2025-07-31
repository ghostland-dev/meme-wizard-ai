import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, X, Sparkles, Zap, Loader2, Download, Share2 } from "lucide-react";
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
    <div className="space-y-6">
      {/* Credits Display */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Crédits disponibles</h3>
          <p className="text-muted-foreground">Chaque génération coûte 1 crédit</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {userCredits} crédits
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <Card className="hover:scale-105 transition-all duration-300 hover:shadow-glow-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Image Source (Optionnel)
            </CardTitle>
            <CardDescription>
              Uploadez une image ou laissez l'IA créer from scratch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              `}
            >
              <input {...getInputProps()} />
              {uploadedImages.length > 0 ? (
                <div className="space-y-4">
                  <Image className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <p className="font-semibold">{uploadedImages[0].file.name}</p>
                    <Badge variant="secondary" className="mt-2">
                      Image prête
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold">
                      {isDragActive ? "Déposez votre image ici" : "Glissez une image ou cliquez"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG, WebP jusqu'à 10MB (optionnel)
                    </p>
                  </div>
                </div>
              )}
            </div>
            {uploadedImages.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="relative">
                  <img
                    src={uploadedImages[0].preview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(uploadedImages[0].id)}
                    className="absolute top-2 right-2 p-1 bg-destructive rounded-full hover:scale-110 transition-transform"
                  >
                    <X className="h-3 w-3 text-destructive-foreground" />
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setUploadedImages([])}
                  className="w-full"
                >
                  Supprimer l'image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Generation */}
        <Card className="hover:scale-105 transition-all duration-300 hover:shadow-glow-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Générateur IA
            </CardTitle>
            <CardDescription>
              Décrivez votre meme et choisissez le style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Description du meme</Label>
              <Textarea
                id="prompt"
                placeholder="Ex: Un chat qui porte des lunettes de soleil avec le texte 'Deal with it'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viral">🔥 Viral</SelectItem>
                  <SelectItem value="funny">😂 Drôle</SelectItem>
                  <SelectItem value="classic">📱 Classic</SelectItem>
                  <SelectItem value="dark">🖤 Dark Humor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={generateMeme}
              disabled={isGenerating || userCredits <= 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Générer un Meme Viral
                </>
              )}
            </Button>

            {userCredits <= 0 && (
              <p className="text-sm text-destructive text-center">
                Crédits insuffisants. Rechargez votre compte !
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Meme Display */}
      {generatedMeme && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Votre Meme Généré
            </CardTitle>
            <CardDescription>
              Téléchargez ou partagez votre création
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img 
                src={generatedMeme.generated_image_url} 
                alt="Generated meme"
                className="max-w-full h-auto rounded-lg border shadow-lg mx-auto"
                style={{ maxHeight: "500px" }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={downloadMeme} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
              <Button onClick={() => shareToSocial('twitter')} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button onClick={() => shareToSocial('facebook')} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button onClick={() => shareToSocial('reddit')} variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Reddit
              </Button>
            </div>
            
            <div className="text-center">
              <Badge variant="secondary">
                Style: {style} • Crédits restants: {userCredits}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}