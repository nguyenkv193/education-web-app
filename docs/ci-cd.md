# CI/CD

Project sử dụng GitHub Actions tại `.github/workflows/ci-cd.yml`.

## CI

CI tự chạy khi có pull request vào `main` hoặc push vào `main`/release tag.
Pipeline thực hiện:

- Cài dependencies bằng `npm ci` cho `frontend`, `admin` và toàn bộ backend packages.
- Chạy ESLint và build cho frontend/admin.
- Kiểm tra syntax của các file JavaScript backend.
- Validate `compose.yaml`.
- Build thử 7 backend Docker images, bao gồm cả `backend/src/shared` mà các
  microservice dùng chung.

## CD

CD chạy sau khi tất cả job CI của release thành công. Tạo và push tag theo
Semantic Versioning:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Các image backend được publish lên GitHub Container Registry với dạng:

```text
ghcr.io/<github-owner>/f8-education-<service>:v1.0.0
```

CD hiện publish images lên registry; bước chạy production vẫn cần chọn hạ tầng
cụ thể (VPS + Docker Compose, Kubernetes, Render, Railway, v.v.). Khi đã chọn
hạ tầng, bổ sung deploy job và secrets tương ứng thay vì đưa secret vào repository.

## Quyền GitHub cần kiểm tra

Workflow dùng `GITHUB_TOKEN` để push package. Trong repository, vào
`Settings -> Actions -> General` và đảm bảo workflow được phép ghi package nếu
repository policy đang giới hạn quyền mặc định.

## Chạy kiểm tra tương đương ở local

```bash
npm --prefix frontend ci
npm --prefix frontend run lint
npm --prefix frontend run build
npm --prefix admin ci
npm --prefix admin run lint
npm --prefix admin run build
docker compose -f compose.yaml config --quiet
```
