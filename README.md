English | [简体中文](./README.zh-CN.md)

## Prerequisites

- You need to first add site monitors on [UptimeRobot](https://uptimerobot.com/dashboard) and get the `Read-Only API Key` from the `My Settings` or [API Management](https://dashboard.uptimerobot.com/integrations) page (Do not use the `Main API key`).
- You can also use `Monitor-specific API keys` for individual monitors.

## Deployment

This project is a React + Vite + MUI application. The frontend build is generated into the `dist` folder, and the monitoring API is exposed through a platform-native route at `/api/getMonitors`.

### Local Development

- Install dependencies with `npm install`
- Start the dev server with `npm run dev`
- Build for production with `npm run build`
- Preview the production build with `npm run preview`

### Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Add the API function route at `api/getMonitors.ts`
- Configure the following environment variables in Cloudflare Pages > Settings > Environment Variables:
  - `API_KEY` (required)
  - `API_URL` (optional, defaults to `https://api.uptimerobot.com/v2/`)
  - `COUNT_DAYS` (optional, defaults to `60`)
  - `SHOW_LINK` (optional, defaults to `true`)
  - `SITE_PASSWORD` and `SITE_SECRET_KEY` (optional, for site encryption)

### Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Add the API route at `api/getMonitors.ts`
- Configure the same environment variables in Vercel Project Settings > Environment Variables
- Deploy the project normally; the route will be available at `/api/getMonitors`

### Notes

- The frontend calls `/api/getMonitors` directly, so the platform must expose that route in production.
- If you also want to run the API server locally, use `npm run start`.

## Q & A

### How to Enable Site Encryption

Add the following environment variables: `SITE_PASSWORD` and `SITE_SECRET_KEY`. Both are required. The `SITE_PASSWORD` is the site password, and the `SITE_SECRET_KEY` is the encryption key, which you can choose freely.

## Thanks

- [uptime-status](https://github.com/yb/uptime-status) inspired this project
