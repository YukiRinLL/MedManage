# 医院患者管理系统

## 项目概述

本项目是一个基于医院管理患者的双端系统，主要用于患者信息采集和通知推送。系统采用前后端分离架构，后端使用Spring Boot+MySQL+Redis实现，前端分为两个独立项目：

1. **患者端（UniApp）**：供普通用户（患者）使用，支持安卓/iOS/Web平台
2. **管理端（Vue3 + Element Plus）**：供管理员（医生/医院管理人员）和超级管理员（IT运维）使用，支持PC浏览器访问

## 品牌与配色方案

### 公司名称
**重庆圣通尚诺医疗管理™**

### 设计风格
整体采用白色简洁风格，符合医疗行业专业、严肃的形象。以白色和浅灰色为主要背景色，主题色作为强调色点缀。

### 配色标准

| 颜色名称 | 色值 | 用途说明 |
|---------|------|----------|
| 主色调（Primary） | `#009D85` | 主按钮、TabBar选中态、强调元素 |
| 辅助色（Secondary） | `#ABCD07` | 辅助图标、标签、次要强调 |
| 主色调深 | `#007D6B` | 按钮点击态 |
| 背景色 | `#F5F7FA` | 页面背景 |
| 卡片背景 | `#FFFFFF` | 卡片、输入框背景 |
| 主要文字 | `#303133` | 标题、重要内容 |
| 次要文字 | `#606266` | 正文内容 |
| 辅助文字 | `#909399` | 提示文字、次要信息 |
| 边框颜色 | `#EBEEF5` / `#DCDFE6` | 分割线、边框 |

### 应用原则

- **背景为主**：页面背景统一使用 `#F5F7FA`，营造清爽干净的视觉效果
- **卡片突出**：内容卡片使用白色背景 `#FFFFFF`，配合轻微阴影形成层次感
- **主题点缀**：按钮、TabBar选中、重要操作使用主色调 `#009D85` 作为强调
- **避免渐变**：不使用大面积渐变色，保持整体简洁专业的风格

## 技术栈

### 后端
- Spring Boot 2.7.15
- MySQL 8.0+
- Redis 6.0+
- Maven 3.6+
- Log4j2

### 患者端（UniApp）
- Vue 3.3+
- UniApp
- Vite 4.4+
- TypeScript 5.0+

### 管理端（Vue3 + Element Plus）
- Vue 3.3+
- Element Plus 2.3+
- Vue Router 4.2+
- Pinia 2.1+
- Axios 1.5+
- Vite 4.4+

## 项目结构

```
MedManage/
├── backend/                             # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── medmanage/
│   │   │   │           ├── config/         # 配置类
│   │   │   │           ├── controller/      # 控制器
│   │   │   │           ├── entity/          # 实体类
│   │   │   │           ├── interceptor/     # 拦截器
│   │   │   │           ├── repository/      # 数据访问层
│   │   │   │           ├── service/         # 服务层
│   │   │   │           ├── util/            # 工具类
│   │   │   │           └── MedManageApplication.java  # 应用主类
│   │   │   └── resources/
│   │   │       ├── db/                      # 数据库脚本
│   │   │       │   ├── schema.sql          # 数据库表结构
│   │   │       │   └── init_super_admin.sql # 超级管理员初始化
│   │   │       ├── application.yml          # 应用配置
│   │   │       └── log4j2.xml               # 日志配置
│   │   └── test/
│   │       └── java/
│   └── pom.xml                              # Maven配置
│
├── frontend/                             # 患者端项目（UniApp）
│   ├── pages/                             # 页面
│   │   ├── login/                          # 登录页
│   │   ├── register/                       # 注册页
│   │   ├── home/                           # 首页
│   │   ├── health-record/                  # 健康档案
│   │   ├── vital-sign/                     # 生命体征
│   │   ├── medication/                     # 用药记录
│   │   ├── notification/                   # 通知中心
│   │   └── profile/                        # 个人中心
│   ├── utils/                             # 工具类
│   │   └── request.js                     # 请求封装
│   ├── static/                            # 静态资源
│   │   └── tabbar/                        # 底部导航图标
│   ├── App.vue                            # 根组件
│   ├── main.js                            # 入口文件
│   ├── manifest.json                      # 应用配置
│   ├── pages.json                         # 页面配置
│   ├── vite.config.js                     # Vite配置
│   └── package.json                       # 依赖配置
│
├── admin-web/                            # 管理端项目（Vue3 + Element Plus）
│   ├── src/
│   │   ├── router/                        # 路由配置
│   │   │   └── index.js                  # 路由定义
│   │   ├── store/                         # 状态管理
│   │   │   └── user.js                    # 用户状态
│   │   ├── utils/                         # 工具类
│   │   │   └── request.js                # 请求封装
│   │   ├── views/                         # 页面
│   │   │   ├── Login.vue                  # 登录页
│   │   │   ├── Layout.vue                 # 布局页
│   │   │   ├── dashboard/                 # 仪表盘
│   │   │   │   └── Index.vue
│   │   │   ├── users/                     # 用户管理
│   │   │   │   ├── Index.vue
│   │   │   │   └── Detail.vue
│   │   │   ├── health/                    # 健康档案
│   │   │   │   ├── Index.vue
│   │   │   │   └── Detail.vue
│   │   │   ├── medication/                # 用药记录
│   │   │   │   └── Index.vue
│   │   │   └── notification/              # 通知管理
│   │   │       └── Index.vue
│   │   ├── App.vue                        # 根组件
│   │   └── main.js                        # 入口文件
│   ├── index.html                        # HTML模板
│   ├── vite.config.js                     # Vite配置
│   └── package.json                      # 依赖配置
│
├── 功能清单.md                           # 功能需求文档
└── README.md                             # 项目说明文档
```

## 系统架构

### 双端设计说明

本系统采用双端分离设计，针对不同用户角色提供不同的访问方式：

#### 1. 患者端（UniApp）
- **目标用户**：普通用户（患者）
- **使用场景**：随时随地查看健康数据、记录生命体征、查看用药提醒
- **支持平台**：Android、iOS、Web
- **主要功能**：
  - 用户注册和登录
  - 健康档案管理
  - 生命体征记录
  - 用药记录管理
  - 通知中心
  - 个人中心

#### 2. 管理端（Vue3 + Element Plus）
- **目标用户**：管理员（医生/医院管理人员）、超级管理员（IT运维）
- **使用场景**：医院办公室电脑，进行数据管理和系统维护
- **支持平台**：PC浏览器
- **主要功能**：
  - 管理员登录
  - 数据仪表盘
  - 用户管理（查看、创建、修改角色、删除）
  - 健康档案管理
  - 用药记录管理
  - 通知管理

### 角色权限

| 角色 | 患者端 | 管理端 | 主要职责 |
|------|--------|--------|----------|
| 普通用户 | ✓ | ✗ | 查看和管理个人健康数据 |
| 管理员 | ✗ | ✓ | 查看用户数据、健康档案、用药记录 |
| 超级管理员 | ✗ | ✓ | 用户管理、角色分配、系统维护 |

## 数据库设计

### 数据库信息
- **数据库名称**: yukirinllmedmanage
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci

### 1. users表（用户表）
- id: 主键，自增
- phone: 手机号，唯一
- password: 密码（MD5加密）
- name: 姓名
- gender: 性别（0:女, 1:男）
- age: 年龄
- id_card: 身份证号
- emergency_contact: 紧急联系人
- emergency_phone: 紧急联系电话
- created_at: 创建时间
- updated_at: 更新时间

### 2. admins表（管理员表）
- id: 主键，自增
- phone: 手机号，唯一
- password: 密码（MD5加密）
- name: 姓名
- role: 角色（1:管理员, 2:超级管理员）
- created_at: 创建时间
- updated_at: 更新时间

### 3. health_records表（健康档案表）
- id: 主键，自增
- user_id: 用户ID，外键
- past_medical_history: 既往病史
- allergic_history: 过敏史
- family_medical_history: 家族病史
- blood_type: 血型
- other_info: 其他信息
- created_at: 创建时间
- updated_at: 更新时间

### 4. vital_signs表（生命体征表）
- id: 主键，自增
- user_id: 用户ID，外键
- temperature: 体温
- systolic_pressure: 收缩压
- diastolic_pressure: 舒张压
- blood_sugar: 血糖
- heart_rate: 心率
- notes: 备注
- record_time: 记录时间
- created_at: 创建时间

### 5. medication_records表（用药记录表）
- id: 主键，自增
- user_id: 用户ID，外键
- medication_name: 药品名称
- dosage: 剂量
- frequency: 频率
- taken: 是否服用
- notes: 备注
- medication_time: 服药时间
- created_at: 创建时间

### 6. notifications表（通知表）
- id: 主键，自增
- user_id: 用户ID，外键
- type: 类型（1:就诊提醒, 2:用药提醒, 3:检查通知, 4:随访提醒, 5:复诊提醒）
- title: 标题
- content: 内容
- read: 是否已读
- notify_time: 通知时间
- created_at: 创建时间

## 部署步骤

### 后端部署
1. **环境准备**
   - 安装JDK 1.8+
   - 安装MySQL 8.0+
   - 安装Redis 6.0+
   - 安装Maven 3.6+

2. **数据库配置**
   - 创建数据库：`CREATE DATABASE yukirinllmedmanage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
   - 执行表结构脚本：`source backend/src/main/resources/db/schema.sql;`
   - 执行超级管理员初始化脚本：`source backend/src/main/resources/db/init_super_admin.sql;`
   - 配置数据库连接信息，修改`backend/src/main/resources/application.yml`中的数据库连接参数

3. **Redis配置**
   - 启动Redis服务
   - 配置Redis连接信息，修改`backend/src/main/resources/application.yml`中的Redis连接参数

4. **项目构建**
   - 进入backend目录
   - 执行`mvn clean package`

5. **项目启动**
   - 开发模式：`mvn spring-boot:run`
   - 生产模式：`java -jar target/backend-1.0-SNAPSHOT.jar`

### 患者端部署（UniApp）
1. **环境准备**
   - 安装Node.js 16.0+
   - 安装HBuilderX（UniApp开发工具）

2. **项目配置**
   - 修改`frontend/utils/request.js`中的API基础地址，确保与后端服务地址一致

3. **安装依赖**
   - 进入frontend目录
   - 执行`npm install`

4. **开发模式启动**
   - 执行`npm run dev`
   - 访问 http://localhost:5173/

5. **应用构建**
   - 使用HBuilderX打开frontend目录
   - 选择发布平台（Android/iOS/Web）
   - 执行构建操作

6. **应用安装**
   - Android：安装生成的APK文件
   - iOS：通过Xcode打包并安装
   - Web：部署到Web服务器

### 管理端部署（Vue3 + Element Plus）
1. **环境准备**
   - 安装Node.js 16.0+

2. **项目配置**
   - 修改`admin-web/src/utils/request.js`中的API基础地址，确保与后端服务地址一致

3. **安装依赖**
   - 进入admin-web目录
   - 执行`npm install`

4. **开发模式启动**
   - 执行`npm run dev`
   - 访问 http://localhost:3000

5. **生产构建**
   - 执行`npm run build`
   - 将dist目录部署到Web服务器（如Nginx）

## 核心功能

### 患者端功能（UniApp）

#### 1. 用户认证
- 手机号注册
- 手机号+密码登录
- 登录状态管理（Redis）

#### 2. 健康档案
- 既往病史管理
- 过敏史管理
- 家族病史管理
- 血型管理
- 其他健康信息管理

#### 3. 生命体征
- 体温记录
- 血压记录
- 血糖记录
- 心率记录
- 历史数据查看

#### 4. 用药记录
- 药品信息记录
- 剂量管理
- 服药时间管理
- 服药状态跟踪
- 历史记录查看

#### 5. 通知中心
- 就诊提醒
- 用药提醒
- 检查通知
- 随访提醒
- 复诊提醒
- 通知状态管理

#### 6. 个人中心
- 个人信息管理
- 紧急联系人管理
- 退出登录

### 管理端功能（Vue3 + Element Plus）

#### 1. 管理员认证
- 管理员登录（仅管理员和超级管理员）
- 登录状态管理
- 权限验证

#### 2. 数据仪表盘
- 系统数据统计
- 用户数量统计
- 健康档案统计
- 用药记录统计
- 最近活动记录

#### 3. 用户管理
- 用户列表查看
- 用户搜索和筛选
- 用户详情查看
- 创建用户（超级管理员）
- 修改用户角色（超级管理员）
- 删除用户（超级管理员）

#### 4. 健康档案管理
- 健康档案列表
- 档案搜索和筛选
- 档案详情查看

#### 5. 用药记录管理
- 用药记录列表
- 记录搜索和筛选
- 服药状态更新

#### 6. 通知管理
- 通知列表查看
- 创建通知
- 通知详情查看
- 删除通知

## API接口

### 用户相关
- POST /api/user/register - 用户注册
- POST /api/user/login - 用户登录
- POST /api/user/logout - 用户登出
- GET /api/user/info - 获取用户信息
- PUT /api/user/update - 更新用户信息

### 管理员相关
- POST /api/admin/login - 管理员登录
- GET /api/admin/dashboard - 获取仪表盘数据
- GET /api/admin/admins - 获取管理员列表
- POST /api/admin/create-admin - 创建管理员（超级管理员）
- PUT /api/admin/update-admin/{adminId} - 更新管理员信息（超级管理员）
- DELETE /api/admin/admins/{adminId} - 删除管理员（超级管理员）

### 健康档案相关
- GET /api/health-record/info - 获取健康档案
- POST /api/health-record/save - 保存健康档案

### 生命体征相关
- POST /api/vital-sign/save - 保存生命体征
- GET /api/vital-sign/list - 获取生命体征列表

### 用药记录相关
- POST /api/medication/save - 保存用药记录
- GET /api/medication/list - 获取用药记录列表
- PUT /api/medication/update-taken/{id} - 更新服药状态

### 通知相关
- GET /api/notification/list - 获取通知列表
- GET /api/notification/unread - 获取未读通知
- PUT /api/notification/mark-read/{id} - 标记通知为已读
- PUT /api/notification/mark-all-read - 标记所有通知为已读

## 默认账号

### 超级管理员
- 手机号：18888888888
- 密码：admin123
- 权限：完整的系统管理权限

### 普通用户
- 需要通过注册功能创建
- 默认角色：普通用户

## 注意事项

1. **数据库配置**：确保MySQL和Redis服务正常运行，且连接信息正确
2. **API地址配置**：确保前端配置的API地址与后端服务地址一致
3. **权限管理**：系统使用JWT进行身份认证，确保请求头中包含正确的Authorization token
4. **数据安全**：密码使用MD5加密存储，敏感信息传输使用HTTPS
5. **推送功能**：通知推送功能需要后端定时任务支持，可根据实际需求扩展
6. **角色管理**：
   - 系统初始状态下已预置超级管理员账号（18888888888/admin）
   - 普通用户注册时默认角色为普通用户
   - 只有超级管理员可以创建管理员并分配角色
   - 只有超级管理员可以修改管理员角色和删除管理员
   - 管理员和超级管理员都可以访问管理后台

## 开发指南

### 后端开发
1. 使用Maven进行依赖管理
2. 使用Spring Boot进行快速开发
3. 使用JPA进行数据库操作
4. 使用Log4j2进行日志记录
5. 使用Redis进行缓存和会话管理

### 患者端开发（UniApp）
1. 使用Vue 3进行组件开发
2. 使用UniApp进行跨平台开发
3. 使用Vite进行构建和热更新
4. 遵循UniApp开发规范

### 管理端开发（Vue3 + Element Plus）
1. 使用Vue 3进行组件开发
2. 使用Element Plus UI组件库
3. 使用Vue Router进行路由管理
4. 使用Pinia进行状态管理
5. 使用Vite进行构建和热更新

## 后续扩展

1. 集成第三方医疗设备，实现生命体征自动采集
2. 添加在线咨询功能，支持患者与医生实时沟通
3. 扩展通知推送方式，支持短信、邮件等多渠道通知
4. 添加数据分析功能，提供健康趋势分析
5. 集成医院HIS系统，实现数据互通
6. 添加数据可视化图表，提供更直观的数据展示
7. 实现多语言支持，方便国际化部署

## 许可证

本项目采用MIT许可证，详见LICENSE文件。