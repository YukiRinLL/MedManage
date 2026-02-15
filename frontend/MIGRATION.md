# 从Capacitor迁移到uni-app说明

## 重要提示

### Capacitor功能已完全移除

**Capacitor的功能现在不能使用了**，因为：

1. **框架完全不同**
   - Capacitor：Web应用 + 原生容器
   - uni-app：基于Vue的统一跨平台框架

2. **API不兼容**
   - Capacitor的原生插件（如 `@capacitor/push-notifications`）无法使用
   - 需要使用uni-app的对应API

3. **配置文件不同**
   - 已删除：`capacitor.config.json`、`vite.config.js`、`index.html`
   - 已删除：`android/`、`ios/`、`src/`、`public/` 目录
   - 已删除：Capacitor相关依赖包

## 推送通知替代方案

### 原Capacitor推送代码
```javascript
// Capacitor方式（已废弃）
import { PushNotifications } from '@capacitor/push-notifications'

PushNotifications.register()
```

### 新uni-app推送代码
```javascript
// uni-app方式（使用uni-push）
// 1. 在manifest.json中配置推送服务
// 2. 使用uni.getProvider获取推送服务
uni.getProvider({
  service: 'push'
}, (res) => {
  console.log(res.provider)
  // 初始化推送
  uni.subscribePush({
    provider: res.provider,
    success: (res) => {
      console.log('订阅推送成功', res)
    }
  })
})

// 3. 监听推送消息
uni.onPushMessage((res) => {
  console.log('收到推送消息', res)
})
```

### uni-push配置步骤

1. **在manifest.json中添加推送配置**
```json
{
  "app-plus": {
    "distribute": {
      "sdkConfigs": {
        "push": {
          "unipush": {
            "offline": false,
            "version": "2"
          }
        }
      }
    }
  }
}
```

2. **在DCloud后台申请推送服务**
   - 登录 [DCloud开发者中心](https://dev.dcloud.net.cn/)
   - 创建应用并获取AppID
   - 配置推送服务

3. **后端集成**
   - 使用DCloud推送服务API
   - 或集成第三方推送服务（如个推、极光推送）

## 已清理的文件和目录

### 删除的文件
- `vite.config.js` - Vite配置（与uni-app冲突）
- `capacitor.config.json` - Capacitor配置
- `index.html` - 原HTML入口
- `package.json` 中的Capacitor依赖
- `README.md` - 原README
- `.vscode/` - VSCode配置

### 删除的目录
- `android/` - Android原生代码
- `ios/` - iOS原生代码
- `src/` - 原Vue源代码
- `public/` - 原静态资源

### 保留的文件
- `pages/` - uni-app页面
- `static/` - 静态资源
- `utils/` - 工具类
- `App.vue` - 应用入口
- `main.js` - 主文件
- `pages.json` - 页面配置
- `manifest.json` - 应用配置
- `package.json` - 依赖配置（已更新为uni-app）

## 功能对照表

| 功能 | Capacitor | uni-app |
|------|-----------|---------|
| 路由 | vue-router | pages.json |
| 导航栏 | 自定义组件 | pages.json配置 |
| 底部导航 | 自定义组件 | tabBar配置 |
| 网络请求 | axios | uni.request |
| 存储 | localStorage | uni.setStorageSync |
| 推送通知 | @capacitor/push-notifications | uni-push |
| 相机 | @capacitor/camera | uni.chooseImage |
| 地理位置 | @capacitor/geolocation | uni.getLocation |
| 设备信息 | @capacitor/device | uni.getSystemInfo |

## 后续开发建议

1. **使用HBuilderX开发**
   - 代码提示更友好
   - 实时预览
   - 一键打包

2. **遵循uni-app规范**
   - 使用uni-app组件
   - 使用uni-app API
   - 注意平台差异

3. **测试多平台**
   - 微信小程序
   - H5
   - App（Android/iOS）

4. **推送通知迁移**
   - 配置uni-push服务
   - 修改前端推送代码
   - 修改后端推送接口

## 常见问题

### Q: 还能使用原来的Capacitor代码吗？
A: 不能。需要完全重写为uni-app格式。

### Q: 推送通知如何迁移？
A: 需要使用uni-push，参考上面的代码示例和配置步骤。

### Q: 原有的Android/iOS原生代码还能用吗？
A: 不能。uni-app会自动生成原生代码，不需要手动编写。

### Q: 如何在HBuilderX中运行项目？
A: 
1. 打开HBuilderX
2. 文件 → 打开目录 → 选择frontend文件夹
3. 运行 → 选择目标平台

## 总结

✅ **已完成**：
- 迁移到uni-app框架
- 删除所有Capacitor相关文件
- 清理冲突的配置文件
- 更新依赖包

⚠️ **需要注意**：
- Capacitor功能完全不可用
- 推送通知需要重新配置
- 需要使用HBuilderX开发

📚 **参考文档**：
- [uni-app官方文档](https://uniapp.dcloud.net.cn/)
- [uni-push文档](https://docs.dcloud.net.cn/uniCloud/uni-clientdb/uni-push.html)
- [HBuilderX使用指南](https://hx.dcloud.net.cn/)