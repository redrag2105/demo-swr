# Hệ thống Authentication với localStorage

Đã triển khai hệ thống đăng nhập mẫu với localStorage/sessionStorage cho ứng dụng HealthCare+.

## 🔐 Tài khoản mẫu

- **Email:** `user@healthcare.vn`
- **Mật khẩu:** `123456`
- **Tên:** Nguyễn Văn A
- **Điện thoại:** 0123456789
- **Vai trò:** Bệnh nhân

## 🚀 Tính năng đã triển khai

### 1. Trang đăng nhập (`/login`)
- Form đăng nhập với validation
- Tùy chọn "Ghi nhớ đăng nhập"
- Nút tự động điền thông tin mẫu
- Hỗ trợ đăng nhập với tài khoản đã đăng ký
- Toast notifications cho phản hồi người dùng

### 2. Trang đăng ký (`/register`)
- Form đăng ký hoàn chỉnh với validation
- Kiểm tra email trùng lặp
- Tự động đăng nhập sau khi đăng ký thành công
- Nút điền thông tin mẫu để test
- Lưu vào localStorage với key `healthcare_registered_users`

### 3. Context quản lý Authentication
- **File:** `client/contexts/AuthContext.tsx`
- Quản lý trạng thái đăng nhập toàn cục
- Tự động kiểm tra session khi khởi động app
- Hỗ trợ đăng nhập/đăng xuất

### 4. Utilities xử lý Storage
- **File:** `client/utils/auth.ts`
- Functions tiện ích cho localStorage/sessionStorage
- Validation session với thời gian hết hạn
- Xử lý lỗi và data corruption

### 5. Navigation có điều kiện
- Hiển thị thông tin user khi đã đăng nhập
- Dropdown menu với các tùy chọn
- Responsive design cho mobile

### 6. Trang Profile (`/profile`)
- Hiển thị thông tin chi tiết người dùng
- Thông tin session và storage
- Nút đăng xuất

### 7. **Protected Pages - Yêu cầu đăng nhập**
Các trang sau chỉ cho phép người dùng đã đăng nhập truy cập:

#### 📋 TestingBooking (`/services/testing/book`)
- Kiểm tra authentication khi load
- Tự động redirect về `/login` nếu chưa đăng nhập
- Loại bỏ form nhập thông tin cá nhân (họ tên, email, số điện thoại)
- Tự động lấy thông tin từ user context
- Hiển thị thông tin user trong phần "Thông tin cá nhân"
- Form chỉ cần nhập: địa điểm, ngày/giờ khám, ghi chú

#### 💬 Consultation (`/consultation`)
- Kiểm tra authentication khi load
- Tự động redirect về `/login` nếu chưa đăng nhập
- Loại bỏ form nhập thông tin cá nhân
- Hiển thị thông tin user đã đăng ký
- Chỉ cần chọn bác sĩ, ngày/giờ, lý do tư vấn, triệu chứng

#### 🩺 CycleTracking (`/cycle-tracking`)
- Kiểm tra authentication khi load
- Trang theo dõi chu kỳ sinh sản cá nhân
- Yêu cầu đăng nhập để lưu dữ liệu cá nhân

#### ❓ QAPage (`/qa`)
- Kiểm tra authentication khi load
- Loại bỏ form nhập thông tin liên hệ
- Hiển thị thông tin user đã đăng ký
- Tùy chọn gửi câu hỏi ẩn danh (không hiển thị thông tin cho bác sĩ)
- Trường tuổi tùy chọn để tư vấn chính xác hơn

### 6. Storage Demo (`/storage-demo`)
- Kiểm tra dữ liệu trong localStorage/sessionStorage
- Hiển thị trạng thái session
- Công cụ debug và testing

## 📁 Cấu trúc thư mục

```
client/
├── contexts/
│   └── AuthContext.tsx        # Context quản lý auth state
├── utils/
│   └── auth.ts               # Utilities cho localStorage/sessionStorage
├── pages/
│   ├── Login.tsx             # Trang đăng nhập (đã cập nhật)
│   ├── Register.tsx          # Trang đăng ký (mới)
│   ├── Profile.tsx           # Trang thông tin cá nhân
│   ├── StorageDemo.tsx       # Demo localStorage
│   ├── UserManagement.tsx    # Quản lý người dùng (mới)
│   ├── TestingBooking.tsx    # 🔒 Đặt lịch xét nghiệm (Protected)
│   ├── Consultation.tsx      # 🔒 Tư vấn trực tuyến (Protected)
│   ├── CycleTracking.tsx     # 🔒 Theo dõi chu kỳ (Protected)
│   └── QAPage.tsx           # 🔒 Hỏi đáp chuyên gia (Protected)
└── components/
    └── Navigation.tsx        # Navigation với auth (đã cập nhật)
```

> **🔒 Protected Pages:** Chỉ người dùng đã đăng nhập mới có thể truy cập

## 🔧 Cách hoạt động

### localStorage vs sessionStorage

1. **Khi chọn "Ghi nhớ đăng nhập":**
   - Dữ liệu lưu trong `localStorage`
   - Tồn tại lâu dài (không mất khi đóng browser)
   - Session expires sau 24 giờ

2. **Khi không chọn "Ghi nhớ":**
   - Dữ liệu lưu trong `sessionStorage`
   - Chỉ tồn tại trong phiên (mất khi đóng tab)
   - Session expires sau 8 giờ

### Dữ liệu được lưu

**Tài khoản mẫu:**
```json
{
  "email": "user@healthcare.vn",
  "name": "Nguyễn Văn A",
  "phone": "0123456789",
  "role": "patient",
  "loginTime": "2025-07-03T10:30:00.000Z",
  "sessionId": "abc123xyz789"
}
```

**Người dùng đăng ký:**
```json
{
  "email": "demo@healthcare.vn",
  "name": "Nguyễn Thị B",
  "phone": "0987654321",
  "role": "patient",
  "password": "123456789",
  "profile": {
    "firstName": "Nguyễn",
    "lastName": "Thị B",
    "birthDate": "1995-05-15",
    "age": 29,
    "gender": "Nữ",
    "registeredAt": "2025-07-03T10:30:00.000Z"
  },
  "loginTime": "2025-07-03T10:30:00.000Z",
  "sessionId": "xyz789abc123"
}
```

### Storage Keys

- `healthcare_user`: Dữ liệu người dùng hiện tại
- `healthcare_remember`: Flag ghi nhớ đăng nhập  
- `healthcare_registered_users`: Danh sách người dùng đã đăng ký

## 🎯 Cách sử dụng

### 1. Đăng ký tài khoản mới
1. Truy cập `/register`
2. Nhấn "Điền thông tin mẫu" hoặc nhập thủ công
3. Kiểm tra validation các trường
4. Nhấn "Đăng ký" → Tự động đăng nhập

### 2. Đăng nhập
1. Truy cập `/login`
2. Nhấn "Điền thông tin mẫu" hoặc nhập thủ công
3. Có thể dùng tài khoản mẫu hoặc tài khoản đã đăng ký
4. Chọn "Ghi nhớ đăng nhập" nếu muốn
5. Nhấn "Đăng nhập"

### 3. Kiểm tra thông tin
- **Profile:** `/profile` - Xem thông tin cá nhân
- **Storage Demo:** `/storage-demo` - Kiểm tra dữ liệu storage
- **User Management:** `/user-management` - Quản lý người dùng

### 4. Đặt lịch với thông tin tự động
1. **Đặt lịch xét nghiệm:** `/services/testing/book`
   - Thông tin cá nhân tự động điền từ tài khoản
   - Chỉ cần chọn: địa điểm, ngày/giờ khám, ghi chú
   - Không cần nhập lại họ tên, email, số điện thoại

2. **Đặt lịch tư vấn:** `/consultation`
   - Thông tin liên hệ tự động điền
   - Chọn bác sĩ, ngày/giờ, lý do tư vấn, triệu chứng
   - Hiển thị thông tin user trong summary

3. **Theo dõi chu kỳ:** `/cycle-tracking`
   - Dữ liệu cá nhân được bảo vệ
   - Chỉ người đã đăng nhập mới truy cập được

4. **Hỏi đáp:** `/qa`
   - Thông tin liên hệ tự động điền
   - Tùy chọn gửi câu hỏi ẩn danh
   - Chỉ cần nhập: tuổi (tùy chọn), danh mục, câu hỏi

### 5. Sử dụng trong component

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Vui lòng đăng nhập</div>;
  }
  
  return <div>Xin chào {user?.name}!</div>;
}
```

## 🛡️ Protected Routes Pattern

Tất cả các trang cần authentication đều sử dụng pattern sau:

```tsx
function ProtectedPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để truy cập trang này",
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Guard clause
  if (!isAuthenticated) {
    return null;
  }

  // Main content
  return <div>Protected content</div>;
}
```

### 4. Truy cập trực tiếp localStorage

```typescript
import { getUserFromStorage, clearUserFromStorage } from '@/utils/auth';

// Lấy user data
const user = getUserFromStorage();

// Xóa user data
clearUserFromStorage();
```

## 🔒 Bảo mật

- Session có thời gian hết hạn
- Tự động validate session khi load app
- Xử lý lỗi và corrupted data
- Clear storage khi logout

## 🚀 Các route mới

- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký
- `/profile` - Thông tin cá nhân (cần đăng nhập)
- `/storage-demo` - Demo localStorage (cần đăng nhập)
- `/user-management` - Quản lý người dùng (cần đăng nhập)

## 📝 Notes

- Đây là demo system, trong production cần:
  - API thật cho authentication
  - JWT tokens thay vì plain data
  - Encryption cho sensitive data
  - Server-side session validation
