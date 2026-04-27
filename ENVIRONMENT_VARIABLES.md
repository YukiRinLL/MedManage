# 环境变量配置指南

本文档描述了MedManage项目在Zeabur平台上的环境变量配置方法。

## 服务列表

- **backend** - 后端服务
- **frontend** - 前端服务
- **admin-web** - 管理后台服务

## 后端服务（backend）环境变量配置

### 必要的环境变量

| 环境变量名 | 说明 | 示例值 |
|---------|------|-------|
| `DB_URL` | 数据库连接URL | `jdbc:mysql://your-db-host:3306/medmanage?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai` |
| `DB_USERNAME` | 数据库用户名 | `your-db-username` |
| `DB_PASSWORD` | 数据库密码 | `your-db-password` |
| `REDIS_HOST` | Redis主机地址 | `your-redis-host` |
| `REDIS_PORT` | Redis端口 | `6379` |
| `REDIS_PASSWORD` | Redis密码 | `your-redis-password` |
| `REDIS_DATABASE` | Redis数据库编号 | `0` |
| `SERVER_PORT` | 服务器端口 | `8080` |
| `JWT_SECRET` | JWT密钥 | `your-jwt-secret-key` |
| `JWT_EXPIRATION` | JWT过期时间（毫秒） | `86400000` |

### 配置步骤

1. 在Zeabur平台上创建后端服务
2. 进入服务的"环境变量"设置页面
3. 逐一添加上述环境变量，填入对应的值
4. 部署后端服务，获取服务的访问URL（例如：`https://your-backend.zeabur.app`）

## 前端服务（frontend）环境变量配置

### 必要的环境变量

| 环境变量名 | 说明 | 示例值 |
|---------|------|-------|
| `VITE_API_BASE_URL` | API基础URL，指向后端服务 | `https://your-backend.zeabur.app/api` |

### 配置步骤

1. 在Zeabur平台上创建前端服务
2. 进入服务的"环境变量"设置页面
3. 添加 `VITE_API_BASE_URL` 环境变量，值为后端服务的URL加上 `/api` 路径
4. 部署前端服务

## Admin-Web服务（admin-web）环境变量配置

### 必要的环境变量

| 环境变量名 | 说明 | 示例值 |
|---------|------|-------|
| `VITE_API_BASE_URL` | API基础URL，指向后端服务 | `https://your-backend.zeabur.app/api` |

### 配置步骤

1. 在Zeabur平台上创建admin-web服务
2. 进入服务的"环境变量"设置页面
3. 添加 `VITE_API_BASE_URL` 环境变量，值为后端服务的URL加上 `/api` 路径
4. 部署admin-web服务

## 注意事项

1. **后端服务URL**：部署后端服务后，需要获取其访问URL，并将其用于前端和admin-web的环境变量配置
2. **环境变量命名**：前端服务的环境变量需要使用 `VITE_` 前缀，这是Vite要求的命名规范
3. **敏感信息**：数据库密码、JWT密钥等敏感信息应通过环境变量管理，不要硬编码在代码中
4. **跨域配置**：如果前端和后端部署在不同的域名下，需要确保后端服务配置了正确的跨域策略
5. **部署顺序**：建议先部署后端服务，获取其URL后再部署前端和admin-web服务

## 本地开发环境配置

### 后端服务

在 `backend` 目录下创建 `.env` 文件，填入本地开发环境的配置：

```
# 数据库配置
DB_URL=jdbc:mysql://localhost:3306/medmanage?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
DB_USERNAME=root
DB_PASSWORD=your-local-db-password

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DATABASE=0

# 服务器配置
SERVER_PORT=8080

# JWT配置
JWT_SECRET=your-local-jwt-secret
JWT_EXPIRATION=86400000
```

### 前端服务

在 `frontend` 目录下创建 `.env.development` 文件，填入本地开发环境的配置：

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Admin-Web服务

在 `admin-web` 目录下创建 `.env.development` 文件，填入本地开发环境的配置：

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## 版本控制

建议在 `.gitignore` 文件中添加以下内容，避免将包含敏感信息的配置文件提交到版本库：

```
# 环境变量配置文件
.env
.env.local
.env.*.local

# 构建产物
dist/
build/

# 依赖包
node_modules/
```