import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/admin";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrder } from "@/hooks/useOrder";
import { useDeleteOrder } from "@/hooks/deleteOrder";

export default function Orders() {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: ordersData, isLoading, error } = getOrder();
  const { mutate: deleteOrder } = useDeleteOrder();

  // Loading holati
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Buyurtmalar yuklanmoqda...</p>
      </div>
    );
  }

  // Xato holati
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Buyurtmalarni yuklashda xato!</p>
      </div>
    );
  }

  // Filtrlash
  const filteredOrders: Order[] =
    statusFilter === "all"
      ? ordersData || []
      : (ordersData || []).filter((o) => o.status === statusFilter);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleDelete = (order: Order) => {
    setDeletingOrder(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingOrder) {
      deleteOrder(deletingOrder.id, {
        onSuccess: () => {
          toast({
            title: "Muvaffaqiyat",
            description: "Buyurtma muvaffaqiyatli o'chirildi",
          });
          setDeleteDialogOpen(false);
          setDeletingOrder(null);
        },
        onError: () => {
          toast({
            title: "Xatolik",
            description: "Buyurtmani o‘chirishda xato yuz berdi",
            variant: "destructive",
          });
        },
      });
    }
  };

  const formatOrderDate = (date: string) => {
    return new Date(date).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit", // yoki "numeric"
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Yangi":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Jarayonda":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Yakunlangan":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Buyurtmalar</h1>
          <p className="text-muted-foreground">
            Barcha buyurtmalarni ko'ring va boshqaring
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="Yangi">Yangi</SelectItem>
            <SelectItem value="Jarayonda">Jarayonda</SelectItem>
            <SelectItem value="Yakunlangan">Yakunlangan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders?.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{order.fullName}</h3>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-2xl font-bold">{order.totalPrice} so'm</p>
                  <p className="text-sm text-muted-foreground">
                    {order.products?.length || 1} mahsulot
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(order)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Orders */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Buyurtmalar yo‘q</p>
        </div>
      )}

      {/* Dialogs */}
      {selectedOrder && (
        <OrderDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          order={selectedOrder}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Buyurtmani o‘chirish"
        description="Bu amalni qaytarib bo‘lmaydi."
      />
    </div>
  );
}
