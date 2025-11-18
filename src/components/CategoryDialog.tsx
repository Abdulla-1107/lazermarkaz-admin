import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/admin";
import { useCategory } from "@/hooks/useCategory";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export const CategoryDialog = ({
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) => {
  const { toast } = useToast();
  const { createCategory } = useCategory();

  const [formData, setFormData] = useState({
    name_uz: "",
    name_en: "",
    name_ru: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name_uz: category.name_uz,
        name_en: category.name_en,
        name_ru: category.name_ru,
      });
    } else {
      setFormData({
        name_uz: "",
        name_en: "",
        name_ru: "",
      });
    }
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_uz) {
      toast({
        title: "Xato",
        description: "O'zbek nomini kiriting",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCategory.mutateAsync({
        name_uz: formData.name_uz,
        name_en: formData.name_en || undefined,
        name_ru: formData.name_ru || undefined,
      });

      toast({
        title: "Muvaffaqiyatli",
        description: "Kategoriya qo'shildi",
      });

      onOpenChange(false); // dialogni yopish
    } catch (err: any) {
      toast({
        title: "Xato",
        description: err.message || "Noma'lum xato yuz berdi",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>O'zbek nomi *</Label>
            <Input
              value={formData.name_uz}
              onChange={(e) =>
                setFormData({ ...formData, name_uz: e.target.value })
              }
              placeholder="Masalan: Elektronika"
            />
          </div>

          <div className="space-y-2">
            <Label>Ingliz nomi</Label>
            <Input
              value={formData.name_en}
              onChange={(e) =>
                setFormData({ ...formData, name_en: e.target.value })
              }
              placeholder="For example: Electronics"
            />
          </div>

          <div className="space-y-2">
            <Label>Rus nomi</Label>
            <Input
              value={formData.name_ru}
              onChange={(e) =>
                setFormData({ ...formData, name_ru: e.target.value })
              }
              placeholder="Например: Электроника"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit">{category ? "Saqlash" : "Qo'shish"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
