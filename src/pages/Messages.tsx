import { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageDetailsDialog } from '@/components/MessageDetailsDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { ContactMessage } from '@/types/admin';
import { Eye, Trash2, Mail, MailOpen } from 'lucide-react';

export default function Messages() {
  const { messages, markMessageAsRead, deleteMessage } = useAdmin();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);

  const handleViewMessage = (message: ContactMessage) => {
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }
    setSelectedMessage(message);
    setDetailsDialogOpen(true);
  };

  const handleDelete = (message: ContactMessage) => {
    setDeletingMessage(message);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingMessage) {
      deleteMessage(deletingMessage.id);
      toast({
        title: 'Muvaffaqiyatli',
        description: 'Xabar o\'chirildi',
      });
      setDeleteDialogOpen(false);
      setDeletingMessage(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Xabarlar</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} ta o'qilmagan xabar` : 'Barcha xabarlar o\'qilgan'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={!message.isRead ? 'border-blue-500' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {message.isRead ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-blue-500" />
                    )}
                    <h3 className="font-semibold">{message.name}</h3>
                    {!message.isRead && (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                        Yangi
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                  {message.phone && (
                    <p className="text-sm text-muted-foreground">{message.phone}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewMessage(message)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ko'rish
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(message)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Xabarlar yo'q</p>
        </div>
      )}

      {selectedMessage && (
        <MessageDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          message={selectedMessage}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Xabarni o'chirish"
        description="Bu xabarni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi."
      />
    </div>
  );
}
