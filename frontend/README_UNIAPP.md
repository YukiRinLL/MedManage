# MedManage - 医院患者管理系统 (uni-app版本)

这是一个使用uni-app框架开发的医院患者管理系统，可以使用HBuilderX进行打包。

## 项目结构

```
frontend/
├── pages/              # 页面目录
│   ├── login/         # 登录页
│   ├── register/      # 注册页
│   ├── home/          # 首页
│   ├── health-record/ # 健康档案
│   ├── vital-sign/    # 生命体征
│   ├── medication/    # 用药记录
│   ├── notification/  # 通知中心
│   ├── profile/       # 个人信息
│   ├── admin-login/   # 管理员登录
│   ├── admin-dashboard/# 管理后台
│   └── admin-users/   # 用户管理
├── static/            # 静态资源
│   └── tabbar/        # 底部导航图标
├── utils/             # 工具类
│   └── request.js     # 网络请求封装
├── App.vue            # 应用入口
├── main.js            # 主文件
├── pages.json         # 页面配置
├── manifest.json      # 应用配置
└── package.json       # 依赖配置
```

## 使用HBuilderX打包

### 前置要求

1. 下载并安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. 安装相应的插件（根据需要打包的平台）

### 打包步骤

1. **打开项目**
   - 启动HBuilderX
   - 文件 -> 打开目录 -> 选择 `frontend` 文件夹

2. **配置应用信息**
   - 打开 `manifest.json` 文件
   - 修改 `appid` 为你的应用ID
   - 配置应用名称、版本号等信息

3. **添加TabBar图标（可选）**
   - 在 `static/tabbar/` 目录下放置图标文件
   - 图标尺寸建议：81x81px
   - 图标格式：PNG
   - 参考 `static/tabbar/README.md` 获取详细说明

4. **运行到不同平台**

   **运行到微信小程序：**
   - 运行 -> 运行到小程序模拟器 -> 微信开发者工具
   - 需要先安装微信开发者工具

   **运行到H5：**
   - 运行 -> 运行到浏览器 -> Chrome

   **运行到App：**
   - 运行 -> 运行到手机或模拟器 -> 选择设备

5. **打包发布**

   **打包微信小程序：**
   - 发行 -> 小程序-微信
   - 在微信开发者工具中上传

   **打包H5：**
   - 发行 -> 网站-H5手机版
   - 生成的文件在 `unpackage/dist/build/h5` 目录

   **打包App：**
   - 发行 -> 原生App-云打包
   - 或使用本地打包

## 后端API配置

修改 `utils/request.js` 中的 `BASE_URL` 为你的后端服务地址：

```javascript
const BASE_URL = 'http://your-backend-ip:8080/api'
```

## 功能说明

### 用户端功能
- 用户注册/登录
- 健康档案管理
- 生命体征记录
- 用药记录管理
- 通知中心
- 个人信息管理

### 管理员功能
- 管理员登录
- 用户管理
- 数据统计
- 通知管理

## 注意事项

1. **网络请求**
   - 确保后端服务已启动
   - 检查API地址配置是否正确
   - 注意跨域问题（H5开发时）

2. **TabBar图标**
   - 如果没有图标文件，可以在 `pages.json` 中注释掉 `tabBar` 配置
   - 或者使用纯文字导航

3. **权限配置**
   - 在 `manifest.json` 中配置所需权限
   - 如：网络权限、存储权限等

4. **推送通知**
   - 需要在 `manifest.json` 中配置推送服务
   - 参考uni-app官方文档配置uni-push

## 常见问题

### Q: 提示缺少manifest.json文件
A: 项目已包含manifest.json文件，确保使用HBuilderX打开的是 `frontend` 目录

### Q: TabBar不显示
A: 检查 `static/tabbar/` 目录下是否有图标文件，或在 `pages.json` 中注释掉tabBar配置

### Q: 网络请求失败
A: 检查 `utils/request.js` 中的BASE_URL配置，确保后端服务可访问

### Q: 小程序运行报错
A: 确保微信开发者工具已安装并正确配置，检查小程序AppID

## 技术栈

- 框架：uni-app (Vue 3)
- UI：原生组件
- 状态管理：Vue 3 Composition API
- 网络请求：uni.request

## 开发建议

1. 使用HBuilderX的代码提示功能
2. 遵循uni-app开发规范
3. 注意不同平台的兼容性
4. 使用真机调试测试实际效果

## 更新日志

### v1.0.0 (2026-02-15)
- 初始版本
- 完成基础功能迁移
- 支持多端打包