English | [简体中文](./README.zh-CN.md)

## Prerequisites

- You need to first add site monitors on [UptimeRobot](https://uptimerobot.com/dashboard) and get the `Read-Only API Key` from the `My Settings` or [API Management](https://dashboard.uptimerobot.com/integrations) page (Do not use the `Main API key`).
- You can also use `Monitor-specific API keys` for individual monitors.

## Deployment

This project is a React + Vite + MUI application. The frontend is built from the files in the `src` directory, and the production build is generated into the `dist` folder.

### Local Development

- Install dependencies with `npm install`
- Start the dev server with `npm run dev`
- Build for production with `npm run build`
- Preview the production build with `npm run preview`

### Hosting

- Configure the required environment variables before deployment, especially `API_KEY`
- Deploy the generated `dist` directory to [Cloudflare Pages](https://pages.cloudflare.com/), [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or another static hosting platform
- If you also want to run the API server locally, use `npm run start`

## Q & A

### How to Enable Site Encryption

Add the following environment variables: `SITE_PASSWORD` and `SITE_SECRET_KEY`. Both are required. The `SITE_PASSWORD` is the site password, and the `SITE_SECRET_KEY` is the encryption key, which you can choose freely.

## Thanks

- [uptime-status](https://github.com/yb/uptime-status) inspired this project
