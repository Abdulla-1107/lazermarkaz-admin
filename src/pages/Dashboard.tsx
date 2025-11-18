import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, MessageSquare, Calendar } from "lucide-react";
import { useProduct } from "@/hooks/useProduct";

export default function Dashboard() {
  const { products, orders, messages } = useAdmin();

  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const { getProduct } = useProduct();
  const { data } = getProduct;
  console.log(data);
  const ProductCount = data?.total

  const unreadMessages = messages.filter((m) => !m.isRead);

  const stats = [
    {
      title: "Jami mahsulotlar",
      value: ProductCount,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Jami buyurtmalar",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Bugungi buyurtmalar",
      value: todayOrders.length,
      icon: Calendar,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Yangi xabarlar",
      value: unreadMessages.length,
      icon: MessageSquare,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Admin panelga xush kelibsiz</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>So'nggi buyurtmalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{order.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {order.totalPrice.toLocaleString()} so'm
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-muted-foreground">
                  Buyurtmalar yo'q
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>So'nggi xabarlar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.slice(0, 5).map((message) => (
                <div
                  key={message.id}
                  className="border-b border-border pb-2 last:border-0"
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium">{message.name}</p>
                    {!message.isRead && (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                        Yangi
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground">
                  Xabarlar yo'q
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
