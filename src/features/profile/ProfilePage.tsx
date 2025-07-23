import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useTheme, Theme, themes } from '@/providers/theme-provider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sun, Moon, Droplets, Feather } from 'lucide-react';

export function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [isSerif, setIsSerif] = useState(false);
  const [isCoachEnabled, setIsCoachEnabled] = useState(false);

  useEffect(() => {
    setIsSerif(document.body.classList.contains('font-serif'));
    setIsCoachEnabled(localStorage.getItem('aiCoachEnabled') === 'true');
  }, []);

  const handleFontToggle = (checked: boolean) => {
    setIsSerif(checked);
    document.body.classList.toggle('font-serif', checked);
  };

  const handleCoachToggle = (checked: boolean) => {
    setIsCoachEnabled(checked);
    localStorage.setItem('aiCoachEnabled', String(checked));
  };

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    beige: <Feather className="h-4 w-4" />,
    brown: <Droplets className="h-4 w-4" />,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Settings & Profile</h2>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2 block">Theme</Label>
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={(newTheme: Theme) => {
                if (newTheme) setTheme(newTheme);
              }}
              className="justify-start flex-wrap"
            >
              {themes.filter(t => t !== 'system').map(t => (
                <ToggleGroupItem key={t} value={t} className="capitalize flex gap-2">
                  {themeIcons[t as keyof typeof themeIcons]}
                  {t}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="font-toggle">Serif Font</Label>
            <Switch id="font-toggle" checked={isSerif} onCheckedChange={handleFontToggle} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="biometric-toggle">Enable Biometric Lock</Label>
            <Switch id="biometric-toggle" disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="coach-toggle">Enable AI Coach</Label>
            <Switch id="coach-toggle" checked={isCoachEnabled} onCheckedChange={handleCoachToggle} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" disabled>Export as PDF</Button>
          <Button variant="outline" className="w-full" disabled>Export as Markdown</Button>
        </CardContent>
      </Card>
    </div>
  );
}
