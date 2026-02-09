# 医院患者管理APP

## 项目概述

本项目是一个基于医院管理患者的移动应用，主要用于患者信息采集和通知推送。应用采用前后端分离架构，后端使用Spring Boot+MySQL+Redis实现，前端使用Vue+UniApp实现，可跨安卓/iOS平台。

## 技术栈

### 后端
- Spring Boot 2.7.15
- MySQL 8.0+
- Redis 6.0+
- Maven 3.6+
- Log4j2

### 前端
- Vue 2.6+
- UniApp
- Axios

## 项目结构

### 后端结构
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── medmanage/
│   │   │           ├── config/         # 配置类
│   │   │           ├── controller/      # 控制器
│   │   │           ├── entity/          # 实体类
│   │   │           ├── interceptor/     # 拦截器
│   │   │           ├── repository/      # 数据访问层
│   │   │           ├── service/         # 服务层
│   │   │           ├── util/            # 工具类
│   │   │           └── MedManageApplication.java  # 应用主类
│   │   └── resources/
│   │       ├── application.yml          # 应用配置
│   │       └── log4j2.xml               # 日志配置
│   └── pom.xml                          # Maven配置
```

### 前端结构
```
frontend/
├── pages/                               # 页面
│   ├── login/                           # 登录页
│   ├── register/                        # 注册页
│   ├── index/                           # 首页
│   ├── health-record/                   # 健康档案
│   ├── vital-sign/                      # 生命体征
│   ├── medication/                      # 用药记录
│   ├── notification/                    # 通知中心
│   └── profile/                         # 个人中心
├── App.vue                              # 根组件
├── main.js                              # 入口文件
├── manifest.json                        # 应用配置
├── pages.json                           # 页面配置
└── .gitignore                           # Git忽略文件
```

## 数据库设计

### 1. users表
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

### 2. health_records表
- id: 主键，自增
- user_id: 用户ID，外键
- past_medical_history: 既往病史
- allergic_history: 过敏史
- family_medical_history: 家族病史
- blood_type: 血型
- other_info: 其他信息
- created_at: 创建时间
- updated_at: 更新时间

### 3. vital_signs表
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

### 4. medication_records表
- id: 主键，自增
- user_id: 用户ID，外键
- medication_name: 药品名称
- dosage: 剂量
- frequency: 频率
- taken: 是否服用
- notes: 备注
- medication_time: 服药时间
- created_at: 创建时间

### 5. notifications表
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
   - 创建数据库：`CREATE DATABASE medmanage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   - 配置数据库连接信息，修改`backend/src/main/resources/application.yml`中的数据库连接参数

3. **Redis配置**
   - 启动Redis服务
   - 配置Redis连接信息，修改`backend/src/main/resources/application.yml`中的Redis连接参数

4. **项目构建**
   - 进入backend目录
   - 执行`mvn clean package`

5. **项目启动**
   - 执行`java -jar target/backend-1.0-SNAPSHOT.jar`

### 前端部署
1. **环境准备**
   - 安装Node.js 12.0+
   - 安装HBuilderX（UniApp开发工具）

2. **项目配置**
   - 修改`frontend/main.js`中的API基础地址，确保与后端服务地址一致

3. **项目构建**
   - 使用HBuilderX打开frontend目录
   - 选择发布平台（Android/iOS/Web）
   - 执行构建操作

4. **应用安装**
   - Android：安装生成的APK文件
   - iOS：通过Xcode打包并安装
   - Web：部署到Web服务器

## 核心功能

### 1. 用户认证
- 手机号注册
- 手机号+密码登录
- 登录状态管理（Redis）

### 2. 健康档案
- 既往病史管理
- 过敏史管理
- 家族病史管理
- 血型管理
- 其他健康信息管理

### 3. 生命体征
- 体温记录
- 血压记录
- 血糖记录
- 心率记录
- 历史数据查看

### 4. 用药记录
- 药品信息记录
- 剂量管理
- 服药时间管理
- 服药状态跟踪
- 历史记录查看

### 5. 通知中心
- 就诊提醒
- 用药提醒
- 检查通知
- 随访提醒
- 复诊提醒
- 通知状态管理

### 6. 个人中心
- 个人信息管理
- 紧急联系人管理
- 退出登录

## API接口

### 用户相关
- POST /api/user/register - 用户注册
- POST /api/user/login - 用户登录
- POST /api/user/logout - 用户登出
- GET /api/user/info - 获取用户信息
- PUT /api/user/update - 更新用户信息

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

## 注意事项

1. **数据库配置**：确保MySQL和Redis服务正常运行，且连接信息正确
2. **API地址配置**：确保前端配置的API地址与后端服务地址一致
3. **权限管理**：系统使用JWT进行身份认证，确保请求头中包含正确的Authorization token
4. **数据安全**：密码使用MD5加密存储，敏感信息传输使用HTTPS
5. **推送功能**：通知推送功能需要后端定时任务支持，可根据实际需求扩展

## 后续扩展

1. 集成第三方医疗设备，实现生命体征自动采集
2. 添加在线咨询功能，支持患者与医生实时沟通
3. 扩展通知推送方式，支持短信、邮件等多渠道通知
4. 添加数据分析功能，提供健康趋势分析
5. 集成医院HIS系统，实现数据互通

## 许可证

本项目采用MIT许可证，详见LICENSE文件。
