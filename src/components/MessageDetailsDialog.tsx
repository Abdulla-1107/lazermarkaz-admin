import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContactMessage } from '@/types/admin';
import { Label } from '@/components/ui/label';

interface MessageDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: ContactMessage;
}

export const MessageDetailsDialog = ({ open, onOpenChange, message }: MessageDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xabar tafsilotlari</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Ism</Label>
            <p className="font-medium">{message.name}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Email</Label>
            <p className="font-medium">{message.email}</p>
          </div>

          {message.phone && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Telefon</Label>
              <p className="font-medium">{message.phone}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-muted-foreground">Xabar</Label>
            <p className="whitespace-pre-wrap rounded-lg border border-border bg-muted p-4">
              {message.message}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Sana</Label>
            <p className="font-medium">
              {new Date(message.createdAt).toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Holat</Label>
            <p className="font-medium">{message.isRead ? 'O\'qilgan' : 'O\'qilmagan'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
