# F8 Education Clone

Nền tảng học trực tuyến gồm giao diện học viên, trang quản trị và backend theo
mô hình microservices. Project được tổ chức như một monorepo để các team có thể
cài đặt, phát triển và kiểm tra từng ứng dụng độc lập hoặc chạy toàn bộ hệ thống
từ thư mục gốc.

## Tính năng chính

- Đăng ký, đăng nhập và xác thực bằng JWT.
- Quản lý người dùng.
- Quản lý khóa học, chapter và lesson.
- Đăng ký khóa học và theo dõi việc học.
- Blog và learning path.
- Admin dashboard cho vận hành nội dung.
- API Gateway làm entry point chung cho frontend và admin.

## Kiến trúc

```text
                    +------------------+
                    |  Frontend :5173  |
                    +--------+---------+
                             |
                    +--------v---------+
                    | API Gateway :5175|
                    +--------+---------+
                             |
        +--------------------+--------------------+
        |                    |                    |
  Auth :5176           User :5177           Course :5178
  Blog :5179        Enrollment :5180      Learning Path :5181
                             |
                    +--------v---------+
                    | MongoDB :27017   |
                    +------------------+

                    +------------------+
                    |  Admin :5174     |
                    +------------------+
```

## Công nghệ

- Frontend: React, Vite, Tailwind CSS, React Router, Axios.
- Backend: Node.js, Express, MongoDB, Mongoose, JWT.
- Service communication: API Gateway và HTTP proxy.
- Local infrastructure: Docker Compose cho MongoDB.

## Tài liệu kỹ thuật

Xem [thư mục docs](./docs/) để đọc tài liệu về [kiến trúc](./docs/architecture.md),
[chạy local](./docs/local-development.md) và [API Gateway](./docs/api.md).

## Yêu cầu môi trường

- Node.js `20.19+` hoặc `22.12+`.
- npm `10+`.
- GNU Make nếu muốn dùng các lệnh `make`.
- Docker Desktop nếu muốn chạy MongoDB bằng Docker.

## Bắt đầu nhanh

### 1. Cài dependencies

```bash
make install
```

Nếu máy chưa có Make, chạy tương đương:

```bash
npm --prefix frontend ci
npm --prefix admin ci
npm --prefix backend ci
npm --prefix backend/src/shared ci
npm --prefix backend/src/api-gateway ci
npm --prefix backend/src/services/auth-service ci
npm --prefix backend/src/services/user-service ci
npm --prefix backend/src/services/course-service ci
npm --prefix backend/src/services/blog-service ci
npm --prefix backend/src/services/enrollment-service ci
npm --prefix backend/src/services/learning-path-service ci
```

### 2. Cấu hình biến môi trường

Tạo file `.env` từ mẫu:

```bash
cp .env.example backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example admin/.env
```

Các service có cơ chế đọc `.env` ở thư mục service. Khi cần cấu hình riêng cho
một service, copy mẫu vào thư mục tương ứng, ví dụ:

```bash
cp .env.example backend/src/api-gateway/.env
cp .env.example backend/src/services/auth-service/.env
```

Trên PowerShell dùng `Copy-Item .env.example backend\.env`.

Project có giá trị mặc định cho môi trường local, vì vậy có thể khởi động mà
không cần thay đổi toàn bộ biến môi trường. Tuy nhiên, luôn thay `JWT_SECRET`
khi chạy ngoài môi trường local.

### 3. Khởi động MongoDB

```bash
make docker-up
```

Hoặc chạy MongoDB local trực tiếp tại `mongodb://localhost:27017`.

### 4. Chạy toàn bộ hệ thống

```bash
make dev
```

Lệnh này khởi động learner frontend, admin dashboard và toàn bộ backend
microservices. Có thể chạy riêng từng phần:

```bash
make dev-frontend
make dev-admin
make dev-backend
```

## Các lệnh thường dùng

| Lệnh | Mục đích |
| --- | --- |
| `make install` | Cài dependencies cho toàn bộ workspace |
| `make dev` | Chạy frontend, admin và backend |
| `make dev-frontend` | Chạy learner frontend |
| `make dev-admin` | Chạy admin dashboard |
| `make dev-backend` | Chạy gateway và các microservices |
| `make lint` | Kiểm tra ESLint cho frontend và admin |
| `make build` | Build frontend và admin |
| `make check` | Chạy lint và build |
| `make docker-up` | Khởi động MongoDB |
| `make docker-down` | Dừng các container local |
| `make docker-logs` | Xem log MongoDB |

## Cổng mặc định

| Thành phần | URL |
| --- | --- |
| Learner frontend | `http://localhost:5173` |
| Admin dashboard | `http://localhost:5174` |
| API Gateway | `http://localhost:5175` |
| Auth service | `http://localhost:5176` |
| User service | `http://localhost:5177` |
| Course service | `http://localhost:5178` |
| Blog service | `http://localhost:5179` |
| Enrollment service | `http://localhost:5180` |
| Learning path service | `http://localhost:5181` |
| MongoDB | `mongodb://localhost:27017` |

Health check API Gateway:

```text
GET http://localhost:5175/api/health
```

## API Gateway routes

| Prefix | Service |
| --- | --- |
| `/api/auth` | Auth service |
| `/api/users` | User service |
| `/api/courses` | Course service |
| `/api/chapters` | Course service |
| `/api/lessons` | Course service |
| `/api/blogs` | Blog service |
| `/api/enrollments` | Enrollment service |
| `/api/learning-paths` | Learning path service |

## Cấu trúc thư mục

```text
.
├── admin/                         # React admin dashboard
├── backend/
│   ├── src/api-gateway/           # Entry point cho client applications
│   ├── src/services/              # Các backend microservices
│   └── src/shared/                # Config, middleware và utility dùng chung
├── frontend/                      # React learner application
├── compose.yaml                   # MongoDB cho local development
├── Makefile                       # Lệnh setup, development và quality checks
└── .env.example                   # Mẫu biến môi trường
```

## Quy ước phát triển

1. Tạo branch từ `main` cho mỗi feature hoặc bug fix.
2. Chạy `make check` trước khi tạo pull request.
3. Không commit `.env`, secret, token hoặc dữ liệu MongoDB.
4. Giữ thay đổi tập trung trong đúng app/service liên quan.
5. Cập nhật README hoặc tài liệu API khi thay đổi cách chạy hoặc endpoint.

## Troubleshooting

### Port đã được sử dụng

Kiểm tra process đang chiếm port và dừng process đó, hoặc đặt biến port tương
ứng trong `.env`, ví dụ `COURSE_PORT=5280`.

### Không kết nối được MongoDB

Kiểm tra container và log:

```bash
docker compose ps
make docker-logs
```

Đảm bảo `MONGODB_URI` trỏ tới đúng địa chỉ MongoDB.

### Frontend không gọi được API

Kiểm tra API Gateway đang chạy ở port `5175` và `VITE_API_URL` trỏ tới gateway.
Frontend mặc định dùng `http://localhost:5175`; admin mặc định dùng
`http://localhost:5175/api`.

## License

Project phục vụ mục đích học tập và phát triển nội bộ. Bổ sung license phù hợp
trước khi phân phối công khai.
