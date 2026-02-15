# TabBar 图标说明

## 问题说明

uni-app的tabBar需要PNG格式的图标文件，当前缺少这些图标文件，所以底部导航栏无法正常显示。

## 解决方案

### 方法一：使用在线图标生成工具（推荐）

1. 访问图标生成网站：
   - https://www.iconfont.cn/（阿里巴巴矢量图标库）
   - https://www.flaticon.com/

2. 下载以下图标（建议尺寸：81x81px）：
   - **首页图标**：房子图标
   - **健康图标**：医疗十字或心形图标
   - **用药图标**：药丸图标
   - **通知图标**：铃铛图标
   - **个人中心图标**：用户头像图标

3. 每个图标需要两个版本：
   - 未选中状态（灰色 #666666）
   - 选中状态（蓝色 #007AFF）

4. 将图标文件放到 `static/tabbar/` 目录下：
   ```
   static/tabbar/
   ├── home.png              (首页 - 未选中)
   ├── home-active.png       (首页 - 选中)
   ├── health.png            (健康 - 未选中)
   ├── health-active.png     (健康 - 选中)
   ├── medication.png        (用药 - 未选中)
   ├── medication-active.png (用药 - 选中)
   ├── notification.png       (通知 - 未选中)
   ├── notification-active.png(通知 - 选中)
   ├── profile.png           (我的 - 未选中)
   └── profile-active.png    (我的 - 选中)
   ```

### 方法二：使用uni-app内置图标（临时方案）

如果你暂时不想准备图标，可以修改 `pages.json`，移除图标配置，只使用文字导航：

```json
"tabBar": {
  "color": "#666666",
  "selectedColor": "#007AFF",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/home/home",
      "text": "首页"
    },
    {
      "pagePath": "pages/health-record/health-record",
      "text": "健康"
    },
    {
      "pagePath": "pages/medication/medication",
      "text": "用药"
    },
    {
      "pagePath": "pages/notification/notification",
      "text": "通知"
    },
    {
      "pagePath": "pages/profile/profile",
      "text": "我的"
    }
  ]
}
```

### 方法三：使用HBuilderX内置图标工具

HBuilderX提供了图标生成工具：

1. 在HBuilderX中右键点击 `static/tabbar` 目录
2. 选择 "新建" → "图标"
3. 按照提示选择或绘制图标
4. 生成PNG格式图标

## 图标要求

- **格式**：PNG
- **尺寸**：建议 81x81 像素（uni-app推荐）
- **背景**：透明背景
- **颜色**：
  - 未选中：#666666（灰色）
  - 选中：#007AFF（蓝色）
- **大小**：单个文件建议小于 40KB

## 快速测试

如果你只是想快速测试应用，可以使用方法二（移除图标配置），这样tabBar会只显示文字，可以正常使用。

## 当前状态

- ✅ tabBar 配置已添加到 pages.json
- ❌ 图标文件缺失（需要手动添加）

## 下一步

请选择上述方法之一添加图标文件，然后重新运行HBuilderX，底部导航栏就会正常显示了。