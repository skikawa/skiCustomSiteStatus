import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app } from "./src/server";

// Serve static assets in production
app.use("/*", serveStatic({ root: "./dist" }));

const port = Number(process.env.PORT || "8566");
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
