import { useState, useEffect, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/admin";
import { useUpload } from "@/hooks/useUpload";
import { useProduct } from "@/hooks/useProduct";
import { Upload } from "lucide-react";
import { useCategory } from "@/hooks/useCategory";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export const ProductDialog = ({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) => {
  const { categories } = useAdmin();
  const { toast } = useToast();
  const { upload, isLoading: uploading, error: uploadError } = useUpload();
  const { createProduct } = useProduct();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { getCategory } = useCategory();

  const { data } = getCategory;
  console.log(data);

  const [formData, setFormData] = useState({
    name_uz: "",
    name_en: "",
    name_ru: "",
    description_uz: "",
    description_en: "",
    description_ru: "",
    price: "",
    size: "",
    categoryId: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name_uz: product.name_uz,
        name_en: product.name_en,
        name_ru: product.name_ru,
        description_uz: product.description_uz,
        description_en: product.description_en,
        description_ru: product.description_ru,
        price: product.price.toString(),
        size: product.size || "",
        categoryId: product.categoryId || "",
        image: product.image || "",
      });
    } else {
      setFormData({
        name_uz: "",
        name_en: "",
        name_ru: "",
        description_uz: "",
        description_en: "",
        description_ru: "",
        price: "",
        size: "",
        categoryId: "",
        image: "",
      });
    }
  }, [product, open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await upload(file); // compressed URL qaytadi
    if (url) {
      setFormData((prev) => ({ ...prev, image: url }));
      toast({
        title: "Rasm yuklandi",
        description: "Rasm muvaffaqiyatli yuklandi",
      });
    } else if (uploadError) {
      toast({
        title: "Xato",
        description: uploadError,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(formData.price);
    if (!formData.name_uz || isNaN(price)) {
      toast({
        title: "Xato",
        description: "Mahsulot nomi va narx majburiy",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      name_uz: formData.name_uz,
      name_en: formData.name_en || undefined,
      name_ru: formData.name_ru || undefined,
      description_uz: formData.description_uz || undefined,
      description_en: formData.description_en || undefined,
      description_ru: formData.description_ru || undefined,
      price: price,
      size: formData.size || undefined,
      categoryId: formData.categoryId || undefined,
      image: formData.image || undefined,
    };

    try {
      await createProduct.mutateAsync(productData);
      toast({
        title: "Muvaffaqiyatli",
        description: "Mahsulot qo'shildi",
      });
      onOpenChange(false);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Kategoriya */}
            <div className="space-y-2">
              <Label>Kategoriya</Label>
              <Select
                value={formData.categoryId || "none"}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    categoryId: v === "none" ? "" : v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategoriya tanlang (ixtiyoriy)" />
                </SelectTrigger>

                <SelectContent>
                  {data?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name_uz}
                    </SelectItem>
                  ))}

                  {/* ❗️ Endi bu allowed */}
                  <SelectItem value="none">Tanlanmagan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Narx */}
            <div className="space-y-2">
              <Label>Narx (so'm) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Narxni kiriting"
              />
            </div>

            {/* O'lcham */}
            <div className="space-y-2">
              <Label>O'lcham</Label>
              <Input
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                placeholder="Masalan: Sm, Metr"
              />
            </div>

            {/* Rasm upload */}
            {/* Rasm upload */}
            <div className="space-y-2">
              <Label>Rasm</Label>

              <div
                className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-8 h-3 mb-2 opacity-70" />
                <p className="text-sm text-muted-foreground">
                  Rasm yuklash uchun bosing yoki tortib tashlang
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {uploading && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Yuklanmoqda...
                </p>
              )}

              {formData.image && (
                <div className="relative mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-48 w-full object-cover rounded-lg shadow-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Til variantlari */}
          <Tabs defaultValue="uz" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="uz">O'zbekcha</TabsTrigger>
              <TabsTrigger value="en">Inglizcha</TabsTrigger>
              <TabsTrigger value="ru">Ruscha</TabsTrigger>
            </TabsList>

            <TabsContent value="uz" className="space-y-4">
              <Label>Nomi *</Label>
              <Input
                value={formData.name_uz}
                onChange={(e) =>
                  setFormData({ ...formData, name_uz: e.target.value })
                }
                placeholder="Mahsulot nomi"
              />
              <Label>Tavsif</Label>
              <Textarea
                value={formData.description_uz}
                onChange={(e) =>
                  setFormData({ ...formData, description_uz: e.target.value })
                }
                placeholder="Mahsulot haqida ma'lumot"
                rows={4}
              />
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
              <Label>Name</Label>
              <Input
                value={formData.name_en}
                onChange={(e) =>
                  setFormData({ ...formData, name_en: e.target.value })
                }
                placeholder="Product name"
              />
              <Label>Description</Label>
              <Textarea
                value={formData.description_en}
                onChange={(e) =>
                  setFormData({ ...formData, description_en: e.target.value })
                }
                placeholder="Product description"
                rows={4}
              />
            </TabsContent>

            <TabsContent value="ru" className="space-y-4">
              <Label>Название</Label>
              <Input
                value={formData.name_ru}
                onChange={(e) =>
                  setFormData({ ...formData, name_ru: e.target.value })
                }
                placeholder="Название товара"
              />
              <Label>Описание</Label>
              <Textarea
                value={formData.description_ru}
                onChange={(e) =>
                  setFormData({ ...formData, description_ru: e.target.value })
                }
                placeholder="Описание товара"
                rows={4}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit">Qo'shish</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
