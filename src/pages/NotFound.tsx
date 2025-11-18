import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Sahifa topilmadi</h2>
      <p className="mb-8 text-muted-foreground">
        Kechirasiz, siz qidirayotgan sahifa mavjud emas.
      </p>
      <Button asChild>
        <Link to="/">
          <Home className="mr-2 h-4 w-4" />
          Bosh sahifaga qaytish
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
