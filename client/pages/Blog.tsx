import { FileText, Calendar, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    title: "Hướng dẫn theo dõi chu kỳ kinh nguyệt",
    excerpt:
      "Tìm hiểu cách theo dõi chu kỳ kinh nguyệt một cách khoa học và chính xác để hiểu rõ hơn về cơ thể.",
    author: "BS. Nguyễn Thị An",
    date: "15/01/2024",
    category: "Chu kỳ sinh sản",
    readTime: "5 phút đọc",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Phòng ngừa các bệnh lây truyền qua đường tình dục",
    excerpt:
      "Kiến thức cơ bản về các biện pháp phòng ngừa STIs hiệu quả và an toàn.",
    author: "BS. Trần Văn Minh",
    date: "12/01/2024",
    category: "Phòng ngừa",
    readTime: "7 phút đọc",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Tầm quan trọng của việc tư vấn sức khỏe sinh sản",
    excerpt:
      "Tại sao việc tư vấn và thăm khám định kỳ lại quan trọng đối với sức khỏe sinh sản.",
    author: "BS. Lê Thị Hoa",
    date: "10/01/2024",
    category: "Tư vấn",
    readTime: "4 phút đọc",
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Các phương pháp tránh thai hiện đại và hiệu quả",
    excerpt:
      "Tổng quan về các phương pháp tránh thai phổ biến, ưu nhược điểm và mức độ hiệu quả của từng loại.",
    author: "BS. Phạm Thị Lan",
    date: "08/01/2024",
    category: "Tránh thai",
    readTime: "8 phút đọc",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Dinh dưỡng và lối sống lành mạnh cho phụ nữ",
    excerpt:
      "Hướng dẫn chế độ ăn uống và sinh hoạt hợp lý để duy trì sức khỏe sinh sản tốt nhất.",
    author: "Dinh dưỡng viên Mai Anh",
    date: "05/01/2024",
    category: "Dinh dưỡng",
    readTime: "6 phút đọc",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Hiểu về giai đoạn mãn kinh và cách ứng phó",
    excerpt:
      "Những thay đổi trong giai đoạn mãn kinh và cách quản lý các triệu chứng một cách hiệu quả.",
    author: "BS. Võ Thị Bình",
    date: "03/01/2024",
    category: "Mãn kinh",
    readTime: "9 phút đọc",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Vệ sinh cá nhân và phòng ngừa nhiễm trùng",
    excerpt:
      "Hướng dẫn chi tiết về vệ sinh vùng kín và các biện pháp phòng ngừa nhiễm trùng hiệu quả.",
    author: "BS. Hoàng Minh Tuấn",
    date: "01/01/2024",
    category: "Vệ sinh",
    readTime: "5 phút đọc",
    image:
      "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Stress và ảnh hưởng đến chu kỳ kinh nguyệt",
    excerpt:
      "Tác động của căng thẳng tâm lý đến hormone và chu kỳ sinh sản, cùng với các giải pháp quản lý stress.",
    author: "Th.S Tâm lý Nguyễn Thu",
    date: "28/12/2023",
    category: "Tâm lý",
    readTime: "7 phút đọc",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Kế hoạch hóa gia đình và tư vấn sinh sản",
    excerpt:
      "Hướng dẫn lập kế hoạch gia đình hợp lý và các y���u tố cần cân nhắc khi muốn có con.",
    author: "BS. Lê Văn Đức",
    date: "25/12/2023",
    category: "Kế hoạch gia đình",
    readTime: "10 phút đọc",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="mx-auto h-16 w-16 text-medical-500" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Blog giáo dục sức khỏe
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Ki��n thức và kinh nghiệm về chăm sóc sức khỏe sinh sản từ các
              chuyên gia
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-4 w-4" />
                    {post.date}
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="text-medical-600 font-medium">
                    {post.readTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder message */}
        <div className="mt-16 text-center">
          <div className="rounded-lg bg-medical-50 p-8">
            <FileText className="mx-auto h-12 w-12 text-medical-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Trang blog đang được phát triển
            </h3>
            <p className="mt-2 text-gray-600">
              Chúng tôi đang chuẩn bị thêm nhiều bài viết hữu ích về sức khỏe
              sinh sản.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
