简体中文 | [English](./README.md)

## 事先准备

- 您需要先到 [UptimeRobot](https://uptimerobot.com/dashboard) 添加站点监控，并在 `My Settings` 页面或者 [API 管理](https://dashboard.uptimerobot.com/integrations) 页面获取类型为 `Read-Only API Key` 的 `API Key`，或者使用用于单独监视器的 `Monitor-specific API keys`（ 不要使用 `Main API key` ）

## 部署

本项目基于 React + Vite + MUI 构建，前端代码位于 `src` 目录，生产构建输出到 `dist` 目录。

### 本地开发

- 使用 `npm install` 安装依赖
- 使用 `npm run dev` 启动开发服务器
- 使用 `npm run build` 进行生产构建
- 使用 `npm run preview` 预览构建结果

### 部署到托管平台

- 在部署前配置好环境变量，尤其是 `API_KEY`
- 将构建后的 `dist` 目录部署到 [Cloudflare Pages](https://pages.cloudflare.com/)、[Vercel](https://vercel.com/)、[Netlify](https://www.netlify.com/) 或其他静态托管平台
- 如需本地运行接口服务，可使用 `npm run start`

## Q & A

### 如何开启站点加密

在环境变量中添加 `SITE_PASSWORD` 和 `SITE_SECRE_KEY`，都必须填写，缺一不可，其中 `SITE_PASSWORD`是站点密码，`SITE_SECRE_KEY` 是加密密钥，可随意填写

## 鸣谢

- [uptime-status](https://github.com/yb/uptime-status) 受此项目启发
