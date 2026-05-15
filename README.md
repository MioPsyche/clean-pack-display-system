# 智能叶菜洁净化包装设备项目展示与询价管理系统 V1.1

面向大学生创新创业训练计划比赛展示的前后端分离演示系统，用于介绍智能叶菜洁净化包装设备方案，并提供预约演示、询价意向、后台管理、模拟设备状态和操作日志等本地演示能力。

当前版本包含前端和后端。前端负责项目展示、表单提交和后台界面；后端提供本地 API、登录注册、JWT 鉴权和 SQLite 数据存储。设备控制仅为模拟控制，不接真实硬件。

## 项目定位

- 比赛展示：集中展示项目背景、设备方案、结构说明、技术参数、应用场景和团队信息。
- 本地演示：通过表单、登录后台和模拟设备操作展示完整交互流程。
- 阶段原型：为后续完善文档、部署和扩展真实业务能力保留清晰结构。

## 技术栈

### 前端

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Browser localStorage fallback

### 后端

- Node.js
- Express
- TypeScript
- SQLite
- JWT
- bcrypt

## 当前实现

- 首页项目展示，包括 Hero、痛点分析、方案说明、设备结构、样机图片、创新点、技术参数、应用场景、成果和团队信息。
- 登录和注册，登录成功后前端保存 JWT。
- `/admin` 访问前需要登录。
- 预约演示表单优先提交到后端 API，后端不可用时回退到 `localStorage`。
- 询价意向表单优先提交到后端 API，后端不可用时回退到 `localStorage`。
- `/admin` 优先从后端读取预约演示和询价意向数据。
- `/admin` 支持查看、搜索、筛选、刷新、清空和导出 CSV。
- 后台展示模拟设备状态，支持启动、停止、开启警示、关闭警示。
- 每次模拟设备操作写入操作日志。
- 后端不可用时，前端可显示“当前使用本地演示模式”，并继续读取本地演示数据。

## 重要边界

- 设备控制为模拟控制，只修改 SQLite 中的模拟状态，不接真实硬件。
- 当前不包含真实支付。
- 当前不包含真实硬件通信、串口通信、PLC 控制或远程设备控制。
- 当前不包含生产级权限系统。
- 当前仍是比赛展示和本地演示系统，不是生产客户系统。
- 未确认或未实测的数据继续使用“待实测”或 `TODO` 标注。

## 项目结构

```text
.
├── server              # Express + TypeScript + SQLite 后端
├── src
│   ├── api             # 前端 API 请求封装
│   ├── app             # 应用入口与路由
│   ├── components      # 通用组件、表单组件、后台组件和布局组件
│   ├── data            # 项目静态展示数据
│   ├── pages           # 页面级组件
│   ├── sections/home   # 首页展示区块
│   ├── styles          # 全局样式
│   ├── types           # TypeScript 类型定义
│   └── utils           # localStorage、CSV、校验等工具函数
├── public              # 静态资源
└── dist                # 前端构建产物
```

## 环境变量

前端 API 基础地址通过环境变量配置：

```env
VITE_API_BASE_URL=http://localhost:3001
```

本地开发可复制前端环境变量示例：

```bash
cp .env.example .env.local
```

后端环境变量示例位于：

```text
server/.env.example
```

## SQLite 数据库

SQLite 数据库默认位置：

```text
server/data/app.sqlite
```

后端启动时会自动创建数据库目录并初始化以下数据表：

- `users`
- `demo_bookings`
- `inquiries`
- `devices`
- `operation_logs`

`server/data/` 和 SQLite 数据库文件已被 `.gitignore` 忽略，不应提交到仓库。

## 演示数据初始化

后端提供本地演示数据 seed 脚本，可生成默认管理员账号、预约演示记录、询价意向记录、模拟设备和操作日志：

```bash
cd server
npm run seed
```

默认本地演示账号：

```text
用户名：admin
密码：admin123456
```

该账号仅用于本地演示和接口验收，不应作为生产账号使用。seed 数据使用演示联系人和演示联系方式，不包含真实手机号、身份证号或其他真实隐私信息。

## 前端运行方式

安装依赖：

```bash
npm install
```

启动前端开发服务：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:5173/
```

登录入口：

```text
http://localhost:5173/login
```

后台入口：

```text
http://localhost:5173/admin
```

## 后端运行方式

进入后端目录：

```bash
cd server
```

安装依赖：

```bash
npm install
```

复制环境变量：

```bash
cp .env.example .env
```

初始化演示数据：

```bash
npm run seed
```

启动后端开发服务：

```bash
npm run dev
```

默认后端地址：

```text
http://localhost:3001
```

健康检查：

```text
http://localhost:3001/api/health
```

## 构建

前端构建：

```bash
npm run build
```

后端构建：

```bash
cd server
npm run build
```

后端构建后运行：

```bash
cd server
npm start
```

## 演示后台说明

访问 `/admin` 前需要先登录或注册本地演示账号。登录成功后，前端会携带 JWT 请求后端接口。

后台优先读取后端 SQLite 数据，包括预约演示、询价意向、模拟设备状态和操作日志。如果后端服务不可用，后台会回退到浏览器 `localStorage`，并显示“当前使用本地演示模式”。

本地演示模式下的数据只存在于当前浏览器。更换浏览器、清理浏览器数据或更换设备后，数据不会自动同步。

## 主要 API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`
- `GET /api/bookings`
- `POST /api/bookings`
- `DELETE /api/bookings`
- `GET /api/inquiries`
- `POST /api/inquiries`
- `DELETE /api/inquiries`
- `GET /api/devices`
- `POST /api/devices/:id/action`
- `GET /api/operation-logs`

模拟设备 action 支持：

- `start`
- `stop`
- `warning_on`
- `warning_off`

## 后续扩展方向

- 将前端 `/admin` 的状态管理继续拆分为更细的 hooks 或工具函数。
- 完善接口错误提示和表单提交状态。
- 增加更完整的浏览器验收流程。
- 项目功能稳定后，再整理软件设计说明书、用户使用手册、版本说明和材料清单。
- 根据需要再考虑部署到 Vercel、GitHub Pages 或其他平台。
