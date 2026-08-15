# API Gateway

Base URL local:

```text
http://localhost:5175
```

Health check:

```http
GET /api/health
```

## Route prefixes

| Prefix | Service | Ví dụ endpoint |
| --- | --- | --- |
| `/api/auth` | Auth | `POST /api/auth/login` |
| `/api/users` | User | `GET /api/users/:id` |
| `/api/courses` | Course | `GET /api/courses` |
| `/api/chapters` | Course | `GET /api/chapters/course/:courseId` |
| `/api/lessons` | Course | `GET /api/lessons/chapter/:chapterId` |
| `/api/blogs` | Blog | `GET /api/blogs` |
| `/api/enrollments` | Enrollment | `GET /api/enrollments` |
| `/api/learning-paths` | Learning path | `GET /api/learning-paths` |

## Auth endpoints

| Method | Endpoint | Auth |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Không |
| `POST` | `/api/auth/login` | Không |
| `GET` | `/api/auth/me` | Có |
| `PUT` | `/api/auth/me` | Có |
| `POST` | `/api/auth/logout` | Có |
| `POST` | `/api/auth/change-password` | Có |

## Blog endpoints

| Method | Endpoint | Auth |
| --- | --- | --- |
| `GET` | `/api/blogs` | Không |
| `GET` | `/api/blogs/popular` | Không |
| `GET` | `/api/blogs/vip` | Không |
| `GET` | `/api/blogs/search` | Không |
| `GET` | `/api/blogs/slug/:slug` | Không |
| `GET` | `/api/blogs/:id` | Không |
| `POST` | `/api/blogs` | Có |
| `PUT` | `/api/blogs/:id` | Instructor |
| `DELETE` | `/api/blogs/:id` | Instructor |
| `POST` | `/api/blogs/:id/like` | Có |
| `POST` | `/api/blogs/:id/comment` | Có |

## Request conventions

- JSON request body dùng `Content-Type: application/json`.
- Endpoint cần xác thực nhận JWT qua header:

  ```http
  Authorization: Bearer <token>
  ```

- Response thành công và lỗi nên giữ format JSON nhất quán với service hiện tại.
- Khi thêm route mới, cần cập nhật route file của service và bảng này.
