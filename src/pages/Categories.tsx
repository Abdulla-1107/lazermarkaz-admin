import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryDialog } from "@/components/CategoryDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/admin";
import { useCategory } from "@/hooks/useCategory";

export default function Categories() {
  const { toast } = useToast();
  const { getCategory, deleteCategory } = useCategory();

  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // useCategory dan data olish
  useEffect(() => {
    if (getCategory.data) {
      setCategoriesData(getCategory.data);
    }
  }, [getCategory.data]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingCategory) {
      try {
        await deleteCategory.mutateAsync(deletingCategory.id);
        toast({
          title: "Muvaffaqiyatli",
          description: "Kategoriya o'chirildi",
        });
        setCategoriesData((prev) =>
          prev.filter((c) => c.id !== deletingCategory.id)
        );
        setDeleteDialogOpen(false);
        setDeletingCategory(null);
      } catch (error) {
        toast({
          title: "Xato",
          description:
            error instanceof Error
              ? error.message
              : "Kategoriyani o'chirib bo'lmadi",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kategoriyalar</h1>
          <p className="text-muted-foreground">
            Mahsulot kategoriyalarini boshqaring
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Kategoriya qo'shish
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categoriesData.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name_uz}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">EN:</span> {category.name_en}
                </p>
                <p className="text-sm">
                  <span className="font-medium">RU:</span> {category.name_ru}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Tahrirlash
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categoriesData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Kategoriyalar yo'q</p>
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Kategoriyani o'chirish"
        description="Bu kategoriyani o'chirishni xohlaysizmi?"
      />
    </div>
  );
}
