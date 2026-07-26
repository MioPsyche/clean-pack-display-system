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
- `/admin` 支持查看、搜索、筛选、刷新、单条删除、清空和导出 CSV。
- 后台展示模拟设备状态，支持启动、停止、开启警示、关闭警示。
- 每次模拟设备操作写入操作日志，并记录操作人用户名。
- 仅在后端不可达（网络错误）时才回退本地演示模式；后端返回的业务错误会在页面提示原因并保留当前数据。
- 登录态（JWT）过期后访问 `/admin` 会自动跳转回登录页。
- 表单提交被后端校验拒绝时会提示具体原因，不写入本地演示数据；仅后端不可达时才降级保存到 `localStorage` 并以黄色提示区分。
- 时间戳统一以 UTC 存储、接口返回 ISO-8601 格式，前端按本地时区渲染。

## 重要边界

- 设备控制为模拟控制，只修改 SQLite 中的模拟状态，不接真实硬件。
- 当前不包含真实支付。
- 当前不包含真实硬件通信、串口通信、PLC 控制或远程设备控制。
- 当前不包含生产级权限系统：注册接口面向本地演示开放，注册成功即可使用后台管理和模拟设备控制，不区分细分角色权限。
- `demo_bookings.status` 与 `inquiries.status` 为预留字段，当前版本不提供修改入口。
- 当前仍是比赛展示和本地演示系统，不是生产客户系统。
- 未确认或未实测的数据继续使用“待实测”或 `TODO` 标注。

## 项目结构

```text
.
├── server              # Express + TypeScript + SQLite 后端
├── src
│   ├── api             # 前端 API 请求封装
│   ├── app             # 应用入口与路由
│   ├── components      # 通用组件、表单、后台、登录保护和布局组件
│   ├── data            # 项目静态展示数据
│   ├── pages           # 页面级组件
│   ├── sections/home   # 首页展示区块
│   ├── styles          # 全局样式
│   ├── types           # TypeScript 类型定义
│   └── utils           # localStorage、CSV、时间格式化、校验等工具函数
└── public              # 静态资源
```

前端构建产物输出到 `dist/`，后端构建产物输出到 `server/dist/`，均不提交到仓库。

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

前端类型检查与本地预览：

```bash
npm run typecheck
npm run preview
```

代码检查与自动化测试（ESLint 覆盖前后端源码；前端单元测试基于 Vitest + happy-dom）：

```bash
npm run lint
npm test
```

后端构建：

```bash
cd server
npm run build
```

后端类型检查与接口测试（Vitest + supertest，测试使用独立的临时数据库）：

```bash
cd server
npm run typecheck
npm test
```

后端构建后运行：

```bash
cd server
npm start
```

## 演示后台说明

访问 `/admin` 前需要先登录或注册本地演示账号。登录成功后，前端会携带 JWT 请求后端接口。

后台优先读取后端 SQLite 数据，包括预约演示、询价意向、模拟设备状态和操作日志。只有在后端不可达（网络错误、超时）时，后台才会回退到浏览器 `localStorage` 并显示“当前使用本地演示模式”；后端返回的业务错误会以红色提示展示并保留当前数据。使用登录页的“本地演示模式”按钮进入时，后台不会请求后端接口。

本地演示模式下的数据只存在于当前浏览器。更换浏览器、清理浏览器数据或更换设备后，数据不会自动同步。

## 主要 API

| 接口 | 鉴权 | 说明 |
| --- | --- | --- |
| `GET /api/health` | 公开 | 健康检查 |
| `POST /api/auth/register` | 公开 | 注册本地演示账号 |
| `POST /api/auth/login` | 公开 | 登录并获取 JWT |
| `GET /api/bookings` | 需要 JWT | 预约演示列表 |
| `POST /api/bookings` | 公开 | 提交预约演示 |
| `DELETE /api/bookings` | 需要 JWT | 清空预约演示记录 |
| `DELETE /api/bookings/:id` | 需要 JWT | 删除单条预约记录 |
| `GET /api/inquiries` | 需要 JWT | 询价意向列表 |
| `POST /api/inquiries` | 公开 | 提交询价意向 |
| `DELETE /api/inquiries` | 需要 JWT | 清空询价意向记录 |
| `DELETE /api/inquiries/:id` | 需要 JWT | 删除单条询价记录 |
| `GET /api/devices` | 公开 | 模拟设备列表 |
| `POST /api/devices/:id/action` | 需要 JWT | 执行模拟设备操作 |
| `GET /api/operation-logs` | 需要 JWT | 操作日志列表 |

所有接口统一返回 `{ success, data }` 或 `{ success: false, message }` 格式；错误提示为中文。

模拟设备 action 支持：

- `start`
- `stop`
- `warning_on`
- `warning_off`

字段说明：前端询价表单的“预算范围”提交到后端 `inquiries.quantity` 字段（历史字段名，映射见 `src/api/inquiries.ts`）。

## 部署说明

仓库已包含用于 Vercel 的 SPA 配置（`vercel.json`），可直接部署前端静态站点。注意：

- 后端不随前端部署。若只部署前端，线上环境无法访问后端接口，页面会以“本地演示模式”运行（表单数据仅保存在访问者浏览器中）。
- 若后端已单独部署，需在 Vercel 项目中配置环境变量 `VITE_API_BASE_URL=https://<后端地址>`（不要以 `/api` 结尾），前端才能连接后端。
- 未配置 `VITE_API_BASE_URL` 时，构建产物默认指向 `http://localhost:3001`，HTTPS 页面会直接判定后端不可达并进入本地演示模式。

## 后续扩展方向

- 增加更完整的浏览器端到端验收流程。
- 扩充自动化测试覆盖范围（当前覆盖前端工具函数与后端 API 主路径）。
- 项目功能稳定后，持续同步软件设计说明书、用户使用手册、版本说明和材料清单。
