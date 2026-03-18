# 第一阶段：构建阶段
FROM node:16-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json .

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建 H5 版本
RUN npm run build:h5

# 第二阶段：运行阶段
FROM nginx:alpine

# 复制构建产物到 nginx 静态目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]