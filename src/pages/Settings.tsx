import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const clearAllData = () => {
    if (confirm('Barcha ma\'lumotlarni o\'chirishni xohlaysizmi? Bu amalni qaytarib bo\'lmaydi.')) {
      localStorage.clear();
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Barcha ma\'lumotlar o\'chirildi. Sahifa yangilanmoqda...',
      });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sozlamalar</h1>
        <p className="text-muted-foreground">Admin panel sozlamalarini boshqaring</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ko'rinish</CardTitle>
            <CardDescription>Admin panel ko'rinishini sozlang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tungi rejim</Label>
                <p className="text-sm text-muted-foreground">
                  Qorong'u ranglar palitasidan foydalaning
                </p>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ma'lumotlar</CardTitle>
            <CardDescription>Ma'lumotlarni boshqaring va tozalang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Barcha ma'lumotlarni o'chirish</Label>
              <p className="text-sm text-muted-foreground">
                Bu barcha mahsulotlar, kategoriyalar, buyurtmalar va xabarlarni o'chiradi.
                Bu amalni qaytarib bo'lmaydi.
              </p>
              <Button variant="destructive" onClick={clearAllData}>
                <Trash2 className="mr-2 h-4 w-4" />
                Barcha ma'lumotlarni o'chirish
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tizim haqida</CardTitle>
            <CardDescription>Admin panel versiyasi va ma'lumotlari</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Versiya:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Til:</span>
              <span className="font-medium">O'zbek</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
