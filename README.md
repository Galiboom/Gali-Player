# Gali-Player

音乐播放器。Gali-Player 是一个适合作品集展示的现代网页音乐播放器，采用暗黑风格、毛玻璃界面、动态光效和顺滑动效，重点展示前端 UI 审美、交互细节、账号登录状态和基础音乐播放能力。

## 技术栈

- React
- Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Modern CSS

## 功能亮点

- 账号登录弹窗和演示账号一键登录
- 登录状态本地保存，登录后显示用户头像、昵称和邮箱
- 退出登录
- HTML Audio API 播放与暂停
- 上一首、下一首、随机播放
- 歌曲结束后自动切歌
- 按歌曲、歌手、专辑或心情搜索
- 当前歌曲高亮
- 收藏 / 取消收藏歌曲
- 播放进度条与拖动跳转
- 当前时间与总时长显示
- 音量调节
- 黑胶唱片旋转动画
- 音乐波形动画
- 播放队列与当前歌曲信息面板
- 响应式 Sidebar 和移动端播放器布局
- 暗黑毛玻璃界面与动态氛围光

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 项目结构

```txt
gali-player/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    └── data/
        └── tracks.js
```

## 部署

推荐部署平台：Vercel。

在线演示地址：

```txt
gali-player.vercel.app
```

## 备注

当前账号登录是前端演示版本，登录信息保存在浏览器本地，适合作品集展示。正式上线真实用户系统时，需要接入后端接口、数据库、密码加密和安全会话管理。

当前示例歌曲使用公开 MP3 示例文件。正式发布前，建议将 `src/data/tracks.js` 里的 `src` 替换为你拥有授权的音乐文件。
