import { handleGetMonitors } from "../src/api/getMonitors";

export async function GET(request: Request) {
  return handleGetMonitors({ request, env: process.env });
}

export async function POST(request: Request) {
  return handleGetMonitors({ request, env: process.env });
}
