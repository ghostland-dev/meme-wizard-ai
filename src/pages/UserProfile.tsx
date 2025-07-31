import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Download, 
  Share2, 
  Trash2,
  Camera,
  Zap,
  Crown,
  Star,
  Eye
} from 'lucide-react';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    defaultStyle: 'viral',
    quality: 'standard',
    watermark: false
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Profil mis à jour avec succès!');
      loadUserData();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const savePreferences = () => {
    // Save to localStorage for demo
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    toast.success('Préférences sauvegardées!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const membershipLevel = profile?.credits > 100 ? 'premium' : profile?.credits > 50 ? 'plus' : 'basic';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Mon <span className="bg-gradient-viral bg-clip-text text-transparent">Profil</span>
          </h1>
          <p className="text-muted-foreground">
            Gérez votre compte et personnalisez votre expérience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 relative">
                  <div className="w-20 h-20 bg-gradient-viral rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle>{profile?.display_name || 'Utilisateur'}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge 
                    variant={membershipLevel === 'premium' ? 'default' : 'secondary'}
                    className={membershipLevel === 'premium' ? 'bg-gradient-viral' : ''}
                  >
                    {membershipLevel === 'premium' && <Crown className="h-3 w-3 mr-1" />}
                    {membershipLevel === 'plus' && <Star className="h-3 w-3 mr-1" />}
                    {membershipLevel === 'premium' ? 'Premium' : membershipLevel === 'plus' ? 'Plus' : 'Basic'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{profile?.credits || 0} crédits</span>
                  </div>
                  {profile?.credits < 10 && (
                    <Button asChild size="sm" className="w-full">
                      <a href="/pricing">Recharger</a>
                    </Button>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Membre depuis</span>
                    <span>{new Date(profile?.created_at || '').toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dernière visite</span>
                    <span>Aujourd'hui</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mes statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Memes créés</span>
                  </div>
                  <Badge variant="outline">42</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Vues totales</span>
                  </div>
                  <Badge variant="outline">12.3K</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Partages</span>
                  </div>
                  <Badge variant="outline">1.2K</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nom d'affichage</Label>
                    <Input
                      id="displayName"
                      defaultValue={profile?.display_name || ''}
                      onBlur={(e) => updateProfile({ display_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generation Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Préférences de génération
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Style par défaut</Label>
                    <Select 
                      value={preferences.defaultStyle} 
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, defaultStyle: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viral">🔥 Viral</SelectItem>
                        <SelectItem value="funny">😂 Drôle</SelectItem>
                        <SelectItem value="classic">📱 Classique</SelectItem>
                        <SelectItem value="tech">💻 Tech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Qualité par défaut</Label>
                    <Select 
                      value={preferences.quality} 
                      onValueChange={(value) => setPreferences(prev => ({ ...prev, quality: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="high">Haute qualité</SelectItem>
                        <SelectItem value="ultra">Ultra HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoSave">Sauvegarde automatique</Label>
                      <p className="text-xs text-muted-foreground">Sauvegarder automatiquement vos memes</p>
                    </div>
                    <Switch
                      id="autoSave"
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="watermark">Filigrane</Label>
                      <p className="text-xs text-muted-foreground">Ajouter un filigrane à vos créations</p>
                    </div>
                    <Switch
                      id="watermark"
                      checked={preferences.watermark}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, watermark: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotif">Notifications email</Label>
                    <p className="text-xs text-muted-foreground">Recevoir les nouveautés par email</p>
                  </div>
                  <Switch
                    id="emailNotif"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotif">Notifications push</Label>
                    <p className="text-xs text-muted-foreground">Alertes dans le navigateur</p>
                  </div>
                  <Switch
                    id="pushNotif"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={savePreferences} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Sauvegarder les préférences
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter mes données
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Partager mon profil
                  </Button>
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Supprimer le compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}