import { useAdmin } from '@/contexts/AdminContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Order } from '@/types/admin';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

export const OrderDetailsDialog = ({ open, onOpenChange, order }: OrderDetailsDialogProps) => {
  const { products, updateOrder } = useAdmin();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: string) => {
    updateOrder(order.id, { status: newStatus as Order['status'] });
    toast({
      title: 'Muvaffaqiyatli',
      description: 'Buyurtma holati yangilandi',
    });
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name_uz || 'Noma\'lum mahsulot';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buyurtma tafsilotlari</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Mijoz</Label>
              <p className="font-medium">{order.fullName}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Telefon</Label>
              <p className="font-medium">{order.phone}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Manzil</Label>
              <p className="font-medium">{order.address}</p>
            </div>
            {order.email && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{order.email}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Sana</Label>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yangi">Yangi</SelectItem>
                  <SelectItem value="Jarayonda">Jarayonda</SelectItem>
                  <SelectItem value="Yakunlangan">Yakunlangan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mahsulotlar</Label>
            <div className="rounded-lg border border-border">
              <table className="w-full">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="p-3 text-left font-medium">Mahsulot</th>
                    <th className="p-3 text-right font-medium">Miqdor</th>
                    <th className="p-3 text-right font-medium">Narx</th>
                    <th className="p-3 text-right font-medium">Jami</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-0">
                      <td className="p-3">{getProductName(item.productId)}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">{item.price.toLocaleString()} so'm</td>
                      <td className="p-3 text-right font-medium">
                        {(item.price * item.quantity).toLocaleString()} so'm
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-border bg-muted">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-semibold">
                      Jami:
                    </td>
                    <td className="p-3 text-right text-lg font-bold">
                      {order.totalPrice.toLocaleString()} so'm
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
