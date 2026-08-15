# Chạy project local

## Yêu cầu

- Node.js `20.19+` hoặc `22.12+`.
- npm `10+`.
- Docker Desktop nếu chạy MongoDB bằng container.
- GNU Make là tùy chọn; có thể chạy npm trực tiếp trên Windows.

## Cài đặt

Từ thư mục root:

```powershell
make install
```

Nếu chưa có Make trên Windows PowerShell:

```powershell
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

PowerShell 5.1 không hỗ trợ toán tử `&&`; hãy đặt mỗi lệnh trên một dòng riêng.

## Biến môi trường

Tạo các file `.env` local từ file mẫu:

```powershell
Copy-Item .env.example backend/.env
Copy-Item .env.example backend/src/api-gateway/.env
Copy-Item .env.example backend/src/services/auth-service/.env
Copy-Item frontend/.env.example frontend/.env
Copy-Item admin/.env.example admin/.env
```

Không commit các file `.env` chứa secret thật. Đặc biệt, thay `JWT_SECRET` trước
khi chia sẻ môi trường hoặc deploy.

## MongoDB

Khởi động MongoDB:

```powershell
docker compose up -d mongodb
docker compose ps
```

Dừng container:

```powershell
docker compose down
```

## Chạy ứng dụng

Chạy toàn bộ hệ thống bằng Make:

```powershell
make dev
```

Hoặc mở các terminal riêng:

```powershell
npm --prefix frontend run dev
npm --prefix admin run dev
npm --prefix backend run dev:microservices
```

Kiểm tra gateway tại:

```text
http://localhost:5175/api/health
```

## Kiểm tra trước khi commit

```powershell
make lint
make build
```

Nếu không có Make, chạy tương đương:

```powershell
npm --prefix frontend run lint
npm --prefix admin run lint
npm --prefix frontend run build
npm --prefix admin run build
```
