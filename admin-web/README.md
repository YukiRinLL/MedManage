# 医院患者管理系统 - PC端管理后台

## 项目简介

PC端管理后台是医院患者管理系统的管理界面，专为管理员（医生/医院管理人员）和超级管理员（IT运维）设计。基于Vue3 + Element Plus构建，提供完善的数据管理和系统维护功能。

## 技术栈

- **框架**：Vue 3.3+
- **UI组件库**：Element Plus 2.3+
- **路由**：Vue Router 4.2+
- **状态管理**：Pinia 2.1+
- **HTTP客户端**：Axios 1.5+
- **构建工具**：Vite 4.4+

## 功能特性

### 1. 管理员认证
- 安全的登录系统
- 基于JWT的身份验证
- 角色权限控制

### 2. 数据仪表盘
- 实时数据统计
- 用户数量统计
- 健康档案统计
- 用药记录统计
- 系统活动记录

### 3. 用户管理
- 用户列表查看
- 多条件搜索和筛选
- 用户详情查看
- 创建新用户（超级管理员）
- 修改用户角色（超级管理员）
- 删除用户（超级管理员）

### 4. 健康档案管理
- 健康档案列表
- 档案搜索和筛选
- 档案详情查看

### 5. 用药记录管理
- 用药记录列表
- 记录搜索和筛选
- 服药状态更新

### 6. 通知管理
- 通知列表查看
- 创建新通知
- 通知详情查看
- 删除通知

## 快速开始

### 环境要求

- Node.js 16.0+
- npm 或 yarn

### 安装依赖

```bash
cd admin-web
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

构建产物位于 `dist` 目录，可部署到任何静态文件服务器。

## 项目结构

```
admin-web/
├── src/
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   ├── router/              # 路由配置
│   │   └── index.js        # 路由定义
│   ├── store/               # 状态管理
│   │   └── user.js         # 用户状态
│   ├── utils/               # 工具类
│   │   └── request.js      # 请求封装
│   ├── views/               # 页面组件
│   │   ├── Login.vue       # 登录页
│   │   ├── Layout.vue      # 布局页
│   │   ├── dashboard/      # 仪表盘
│   │   ├── users/         # 用户管理
│   │   ├── health/        # 健康档案
│   │   ├── medication/    # 用药记录
│   │   └── notification/  # 通知管理
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── public/                # 公共资源
├── index.html             # HTML模板
├── vite.config.js         # Vite配置
└── package.json           # 依赖配置
```

## 配置说明

### API地址配置

修改 `src/utils/request.js` 中的 `baseURL`：

```javascript
const request = axios.create({
  baseURL: '/api',  // 开发环境使用代理
  // baseURL: 'http://your-backend-server.com/api',  // 生产环境
  timeout: 10000
})
```

### 代理配置

开发环境在 `vite.config.js` 中配置代理：

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## 角色权限

### 管理员（ADMIN）
- 访问管理后台
- 查看仪表盘数据
- 查看用户列表
- 查看用户详情
- 查看健康档案
- 查看用药记录
- 管理通知

### 超级管理员（SUPER_ADMIN）
- 拥有管理员的所有权限
- 创建新用户
- 修改用户角色
- 删除用户

## 登录说明

### 默认账号

系统初始状态下没有管理员账号，需要通过数据库创建第一个超级管理员：

```sql
-- 方法1：更新现有用户为超级管理员
UPDATE users SET role = 2 WHERE phone = '你的手机号';

-- 方法2：插入新的超级管理员
INSERT INTO users (phone, password, name, gender, age, role, created_at, updated_at)
VALUES ('13800138000', 'e10adc3949ba59abbe56e057f20f883e', '超级管理员', 1, 30, 2, NOW(), NOW());
```

默认密码：`123456`

### 登录步骤

1. 打开浏览器访问 http://localhost:3000
2. 输入管理员手机号和密码
3. 点击"登录"按钮
4. 登录成功后进入管理后台

## 常见问题

### 1. 登录失败

- 检查后端服务是否正常运行
- 检查API地址配置是否正确
- 检查用户角色是否为管理员或超级管理员

### 2. 页面空白

- 检查浏览器控制台是否有错误
- 检查依赖是否完整安装
- 尝试清除浏览器缓存

### 3. API请求失败

- 检查后端服务是否正常运行
- 检查代理配置是否正确
- 检查网络连接

## 开发建议

### 代码规范

- 使用 Vue 3 Composition API
- 使用 `<script setup>` 语法
- 遵循 ESLint 规则
- 使用语义化的组件命名

### 组件开发

- 将可复用的逻辑提取为组合式函数
- 使用 props 和 emits 进行组件通信
- 合理使用 v-model 进行双向绑定

### 样式开发

- 使用 scoped 样式避免样式污染
- 遵循 Element Plus 设计规范
- 使用响应式设计适配不同屏幕

## 浏览器支持

- Chrome (推荐)
- Firefox
- Edge
- Safari

## 许可证

MIT License
