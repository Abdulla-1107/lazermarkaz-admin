import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductDialog } from "@/components/ProductDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProduct } from "@/hooks/useProduct";

export default function Products() {
  const { categories } = useAdmin();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price" | "date">("date");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // 🔥 React Query dan mahsulotlarni olish
  const { getProduct, deleteProduct } = useProduct();
  const { data: productsData, isLoading } = getProduct;
  const products = productsData?.items || [];

  const filteredProducts = products
    .filter((p) => {
      const s = search.toLowerCase();

      const matchesSearch =
        p.name_uz.toLowerCase().includes(s) ||
        p.name_en.toLowerCase().includes(s) ||
        p.name_ru.toLowerCase().includes(s);

      const matchesCategory =
        categoryFilter === "all" || p.categoryId === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingProduct) {
      deleteProduct.mutate(deletingProduct.id, {
        onSuccess: () => {
          toast({
            title: "Muvaffaqiyatli",
            description: "Mahsulot o'chirildi",
          });
          setDeleteDialogOpen(false);
          setDeletingProduct(null);
        },
        onError: () => {
          toast({
            title: "Xato",
            description: "Mahsulotni o'chirishda xatolik yuz berdi",
          });
        },
      });
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name_uz || "Noma'lum";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mahsulotlar</h1>
          <p className="text-muted-foreground">
            Barcha mahsulotlarni boshqaring
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Mahsulot qo'shish
        </Button>
      </div>

      {/* 🔍 QIDIRUV / FILTER / SORT */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Mahsulot qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Kategoriya" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha kategoriyalar</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name_uz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as "price" | "date")}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Saralash" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sana bo'yicha</SelectItem>
            <SelectItem value="price">Narx bo'yicha</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📦 MAHSULOT KARTALARI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name_uz}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}

              <div className="space-y-2">
                <h3 className="font-semibold">{product.name_uz}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description_uz}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {product.price.toLocaleString()} so'm
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getCategoryName(product.categoryId)}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Tahrirlash
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!filteredProducts.length && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Mahsulotlar topilmadi</p>
        </div>
      )}

      {/* 📝 DIALOG — CREATE / EDIT */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
      />

      {/* 🗑 DELETE DIALOG */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Mahsulotni o'chirish"
        description="Bu amalni qaytarib bo'lmaydi. O'chirishni tasdiqlaysizmi?"
      />
    </div>
  );
}
