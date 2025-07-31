import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Download, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      processPayment(sessionId);
    } else {
      setLoading(false);
      toast.error("Session de paiement introuvable");
    }
  }, [searchParams]);

  const processPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { session_id: sessionId }
      });

      if (error) {
        throw error;
      }

      setPaymentData(data);
      toast.success(`${data.credits_added} crédits ajoutés à votre compte !`);
      
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast.error(error.message || "Erreur lors du traitement du paiement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Traitement du paiement...</h3>
          <p className="text-muted-foreground">Veuillez patienter quelques instants</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-600">
              Paiement Réussi ! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              Vos crédits ont été ajoutés à votre compte
            </CardDescription>
          </CardHeader>
          
          {paymentData && (
            <CardContent className="space-y-6">
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Détails de votre achat</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Crédits achetés:</span>
                    <span className="font-bold text-primary">+{paymentData.credits_added}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total crédits:</span>
                    <span className="font-bold">{paymentData.total_credits}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Que faire maintenant ?</h4>
                
                <div className="grid gap-4">
                  <Button 
                    onClick={() => navigate('/#upload')}
                    size="lg"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Créer des memes maintenant
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/gallery')}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Voir ma galerie
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button 
                  onClick={() => navigate('/')}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Tips Section */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">💡 Conseils pour maximiser vos crédits</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="bg-card p-4 rounded-lg">
              <strong>Descriptions détaillées</strong>
              <p>Plus votre description est précise, meilleur sera le résultat</p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <strong>Explorez les styles</strong>
              <p>Testez différents styles pour varier vos créations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}