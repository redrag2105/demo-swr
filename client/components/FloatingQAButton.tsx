import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function FloatingQAButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        <Link
          to="/qa"
          title="Đặt câu hỏi cho chuyên gia"
          className="flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  );
}
