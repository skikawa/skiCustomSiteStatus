简体中文 | [English](./README.md)

## 事先准备

- 您需要先到 [UptimeRobot](https://uptimerobot.com/dashboard) 添加站点监控，并在 `My Settings` 页面或者 [API 管理](https://dashboard.uptimerobot.com/integrations) 页面获取类型为 `Read-Only API Key` 的 `API Key`，或者使用用于单独监视器的 `Monitor-specific API keys`（ 不要使用 `Main API key` ）

## 部署

本项目基于 React + Vite + MUI 构建，前端构建输出到 `dist` 目录，监控接口则通过 `/api/getMonitors` 以平台原生方式暴露。

### 本地开发

- 使用 `npm install` 安装依赖
- 使用 `npm run dev` 启动开发服务器
- 使用 `npm run build` 进行生产构建
- 使用 `npm run preview` 预览构建结果

### Cloudflare Pages

- 构建命令：`npm run build`
- 输出目录：`dist`
- 在项目中添加 API 函数文件：`api/getMonitors.ts`
- 在 Cloudflare Pages 的环境变量中配置：
  - `API_KEY`（必填）
  - `API_URL`（可选，默认 `https://api.uptimerobot.com/v2/`）
  - `COUNT_DAYS`（可选，默认 `60`）
  - `SHOW_LINK`（可选，默认 `true`）
  - `SITE_PASSWORD` 和 `SITE_SECRET_KEY`（可选，用于站点加密）

### Vercel

- 构建命令：`npm run build`
- 输出目录：`dist`
- 在项目中添加 API Routes 文件：`api/getMonitors.ts`
- 在 Vercel 项目设置的 Environment Variables 中配置同样的环境变量
- 正常部署后，接口会在 `/api/getMonitors` 提供服务

### 说明

- 前端会直接访问 `/api/getMonitors`，因此部署平台必须在生产环境中正确暴露该接口。
- 如需本地运行接口服务，可使用 `npm run start`。

## Q & A

### 如何开启站点加密

在环境变量中添加 `SITE_PASSWORD` 和 `SITE_SECRE_KEY`，都必须填写，缺一不可，其中 `SITE_PASSWORD`是站点密码，`SITE_SECRE_KEY` 是加密密钥，可随意填写

## 鸣谢

- [uptime-status](https://github.com/yb/uptime-status) 受此项目启发
