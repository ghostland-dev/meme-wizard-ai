import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    const updatedImages = [...uploadedImages, ...newImages];
    setUploadedImages(updatedImages);
    onImagesChange?.(updatedImages);
    
    toast({
      title: "Images uploadées ! 🚀",
      description: `${acceptedFiles.length} image(s) prête(s) pour la génération de memes`,
    });
  }, [uploadedImages, onImagesChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 10
  });

  const removeImage = (id: string) => {
    const updatedImages = uploadedImages.filter(img => img.id !== id);
    setUploadedImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const generateMemes = () => {
    if (uploadedImages.length === 0) {
      toast({
        title: "Aucune image !",
        description: "Uploadez au moins une image pour générer des memes",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Génération en cours... ⚡",
      description: "L'IA crée vos memes viraux, patience !",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-300 hover:scale-105
            ${isDragActive 
              ? 'border-primary bg-primary/5 shadow-glow-primary' 
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-viral rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">
                {isDragActive ? "Déposez vos images ici !" : "Glissez vos images ou cliquez pour sélectionner"}
              </p>
              <p className="text-sm text-muted-foreground">
                Logos, produits, équipe... jusqu'à 10 images (JPG, PNG, WebP)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Images uploadées ({uploadedImages.length})</h3>
            <Button 
              onClick={generateMemes}
              variant="viral"
              size="lg"
              className="min-w-[200px]"
            >
              <Sparkles className="h-4 w-4" />
              Générer 50+ Memes
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image) => (
              <Card key={image.id} className="relative group overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.preview}
                    alt="Uploaded"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                  >
                    <X className="h-3 w-3 text-destructive-foreground" />
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {image.file.name}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}