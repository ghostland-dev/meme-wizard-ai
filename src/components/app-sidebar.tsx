import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Upload,
  Images,
  BarChart3,
  CreditCard,
  User,
  Shield,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Palette,
  Calendar
} from 'lucide-react';

const mainNavItems = [
  {
    title: 'Accueil',
    url: '/',
    icon: Home,
    badge: null
  },
  {
    title: 'Créer un meme',
    url: '/#upload',
    icon: Upload,
    badge: 'Popular'
  },
  {
    title: 'Ma galerie',
    url: '/gallery',
    icon: Images,
    badge: null
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
    badge: null
  }
];

const accountItems = [
  {
    title: 'Mon profil',
    url: '/profile',
    icon: User,
    badge: null
  },
  {
    title: 'Acheter des crédits',
    url: '/pricing',
    icon: CreditCard,
    badge: 'Promo'
  }
];

const systemItems = [
  {
    title: 'État du système',
    url: '/health',
    icon: Shield,
    badge: null
  },
  {
    title: 'Aide',
    url: '/help',
    icon: HelpCircle,
    badge: null
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (url: string) => {
    if (url === '/') return currentPath === '/';
    if (url.includes('#')) return false; // Handle anchor links separately
    return currentPath.startsWith(url);
  };

  const getNavClassName = (url: string) => {
    const active = isActive(url);
    return cn(
      'w-full justify-start gap-2 h-10',
      active 
        ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
    );
  };

  return (
    <Sidebar className={cn('border-r', collapsed ? 'w-16' : 'w-64')}>
      <SidebarContent>
        <ScrollArea className="flex-1">
          {/* Branding */}
          {!collapsed && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-viral rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Meme Wizard AI</p>
                  <p className="text-xs text-muted-foreground">IA Creative Suite</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
              Navigation principale
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Account Section */}
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
              Mon compte
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {item.badge && (
                              <Badge variant="outline" className="text-xs border-primary text-primary">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* System Section */}
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
              Système
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {systemItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavClassName(item.url)}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="flex-1">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Stats (when expanded) */}
          {!collapsed && (
            <div className="p-4 mt-auto border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Memes créés</span>
                  <Badge variant="outline">42</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Vues totales</span>
                  <Badge variant="outline">12.3K</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Rang</span>
                  <Badge className="bg-gradient-viral text-white">Pro</Badge>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}