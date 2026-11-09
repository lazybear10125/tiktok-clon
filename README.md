# 🎵 TikTok Web UI Clone – Figma Design System

Dự án Frontend xây dựng giao diện TikTok Web Clone với độ hoàn thiện cao, tuân thủ chặt chẽ triết lý thiết kế UI/UX theo phong cách Figma (Auto Layout, Component-based Design, Spacing đồng nhất, Bảng màu chuẩn TikTok Light/Dark mode).

---

## 🌟 Tính Năng Nổi Bật

### 1. 📱 Home Feed & Video Player (9:16)
- **Tỉ lệ chuẩn 9:16**: Trải nghiệm xem video dọc chuẩn TikTok.
- **Tự động phát thông minh**: Sử dụng `IntersectionObserver` tự động play video đang hiển thị ở trung tâm và pause các video ngoài màn hình.
- **Tương tác trực quan**:
  - Click vào video để Play / Pause (kèm animation indicator to ở giữa màn hình).
  - **Double-click để Like**: Thả tim nảy lên tại chính tọa độ click chuột trên video.
  - Hover thanh âm lượng để điều chỉnh slider hoặc click nút Mute/Unmute.
  - Progress bar tùy biến có thể click tua nhanh thời gian (seek).
  - Đĩa than quay tròn (`animate-disc-rotate`) đồng bộ theo nhạc nền.
  - Phím tắt bàn phím: `W` / `↑` (Video trước), `S` / `↓` (Video tiếp theo), `L` (Thả tim), `M` (Bật/Tắt tiếng).

### 2. 💬 Bình Luận Phân Cấp (Comments Drawer)
- Mở drawer bình luận trượt mượt mà từ bên phải.
- Hiển thị danh sách bình luận kèm danh sách **Trả lời (Replies)** lồng nhau.
- Thả tim trực tiếp cho từng bình luận.
- Ô nhập bình luận có hỗ trợ emoji và gắn thẻ người đang được trả lời.
- Toàn bộ dữ liệu bình luận được lưu trữ bền vững trong `localStorage`.

### 3. 🔍 Tìm Kiếm Thông Minh (Smart SearchBar)
- Tự động gợi ý từ khóa (Autocomplete) khi nhập.
- Lưu trữ lịch sử tìm kiếm (`Search History`) trong `localStorage`, cho phép xóa từng mục hoặc xóa tất cả.
- Bảng từ khóa thịnh hành (`Trending Searches`) xếp hạng #1 đến #10.
- Trang kết quả tìm kiếm (`/search?q=...`) chia tab: **Hàng đầu**, **Tài khoản**, **Video**.

### 4. 👥 Trang Following (Đang Follow)
- Lọc hiển thị chỉ những video từ các tài khoản bạn đã bấm theo dõi.
- Trạng thái `Empty State` kèm lưới các nhà sáng tạo nội dung gợi ý hàng đầu để Follow ngay lập tức.

### 5. 🧭 Khám Phá (Explore) & 📻 Trực Tiếp (LIVE)
- **Explore**: Lưới video phân loại theo chủ đề (*Âm nhạc, Nhảy, Thể thao, Hài kịch, Công nghệ, Thời trang...*).
- **LIVE**: Giao diện phát sóng trực tiếp, phòng chat trực tiếp thời gian thực, nút gửi quà tặng hoa hồng & thả tim bùng nổ hiệu ứng confetti pháo hoa.

### 6. 👤 Trang Cá Nhân (Profile Page)
- Xem thông tin tài khoản, avatar viền, tích xanh xác thực, thống kê *Followers / Following / Likes*.
- Các tab: **Video** (đã đăng), **Yêu thích** (Favorites bookmark), **Đã thích** (Liked videos).
- Bấm vào video trong Profile để mở popup phát trực tiếp.

### 7. 📤 Đăng Tải Video (Upload Studio)
- Kéo thả hoặc chọn file video từ máy tính (hoặc bấm chọn video mẫu có sẵn).
- Khung xem trước dọc, đếm ký tự caption (0/2200), gắn `#Hashtag` và `@Mention`.
- Chọn ảnh bìa video, cài đặt quyền riêng tư (*Công khai, Bạn bè, Riêng tư*) và các tùy chọn Duet/Stitch/Comment.
- Sau khi bấm **Đăng video**, video sẽ lập tức xuất hiện trong feed và trang cá nhân!

### 8. 🌓 Dark Mode & Light Mode
- Hỗ trợ chuyển đổi giao diện Sáng / Tối tức thì bằng nút trên Header.
- Bảng màu chuẩn Figma:
  - Background: `#FFFFFF` (Light) / `#121212` (Dark)
  - Primary Red: `#FE2C55`
  - Secondary Cyan: `#25F4EE`
  - Text chính: `#161823` / `#F1F1F2`
  - Text phụ: `#8A8B91` / `#A7A9AC`
  - Border: `#E8E8E8` / `#2F2F2F`

---

## 🛠️ Cấu Trúc Dự Án

```
tiktok-clon/
├── public/
│   └── avatars/             # 70+ avatar nghệ sĩ, creator chuẩn TikTok
├── src/
│   ├── components/
│   │   ├── AuthModal/       # Popup đăng nhập / đăng ký
│   │   ├── BottomNav/       # Navigation bar trên Mobile
│   │   ├── CommentPanel/    # Drawer bình luận phân cấp
│   │   ├── Header/          # Header logo, search, icons, profile dropdown
│   │   ├── NotificationItem/# Item thông báo tương tác
│   │   ├── ProfileHeader/   # Header thông tin cá nhân & tab chuyển đổi
│   │   ├── SearchBar/       # Thanh tìm kiếm, lịch sử, gợi ý
│   │   ├── Sidebar/         # Sidebar điều hướng, gợi ý tài khoản, hashtag
│   │   ├── Toast/           # Thông báo nổi (Copy link, Like, Follow...)
│   │   └── VideoCard/       # Trình phát video 9:16 và cụm action buttons
│   ├── context/
│   │   └── AppContext.jsx   # State toàn cục (Theme, Likes, Follows, Auth...)
│   ├── data/
│   │   └── mockData.js      # 20 tài khoản, 20+ video dọc chất lượng cao
│   ├── layouts/
│   │   ├── MainLayout/      # Layout chuẩn (Header + Sidebar + Content)
│   │   └── HeaderOnlyLayout/# Layout tối giản cho Upload
│   ├── pages/
│   │   ├── Home/            # Feed "Dành cho bạn"
│   │   ├── Following/       # Feed "Đang Follow"
│   │   ├── Explore/         # Khám phá xu hướng
│   │   ├── Live/            # Trực tiếp TikTok LIVE
│   │   ├── Notifications/   # Hộp thư thông báo
│   │   ├── Profile/         # Hồ sơ cá nhân
│   │   ├── Search/          # Kết quả tìm kiếm
│   │   └── Upload/          # Đăng tải video mới
│   ├── styles/
│   │   ├── animations.css   # Keyframe animations (pop, float, shimmer, rotate)
│   │   ├── global.css       # Reset, layout utilities, scrollbar
│   │   └── variables.css    # Design System token (Light/Dark variables)
│   ├── utils/
│   │   └── formatters.js    # Định dạng số (1.2M, 54K), thời gian (2h ago)
│   ├── App.jsx              # React Router v7 routes
│   └── main.jsx             # React 19 root
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Hướng Dẫn Chạy Dự Án

1. **Cài đặt thư viện** (nếu chưa cài):
   ```bash
   npm install
   ```

2. **Chạy server phát triển (Development)**:
   ```bash
   npm run dev
   ```
   Truy cập: `http://localhost:5173`

3. **Đóng gói dự án (Production Build)**:
   ```bash
   npm run build
   ```
