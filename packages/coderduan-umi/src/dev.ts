import express from "express";
import { serve, build } from "esbuild";
import type { ServeOnRequestArgs } from "esbuild";
import path from "path";
import {
  DEFAULT_OUTDIR,
  DEFAULT_ENTRY_POINT,
  DEFAULT_FRAMEWORK_NAME,
  DEFAULT_PLATFORM,
  DEFAULT_HOST,
  DEFAULT_PORT,
  DEFAULT_BUILD_PORT,
} from "./constants";

export const dev = async () => {
  const cwd = process.cwd();
  const app = express();

  app.get("/", (req, res) => {
    res.set("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>coderduan-umi</title>
        </head>

        <body>
          <div id="root">
            <span>loading...</span>
          </div>
          <script src="http://${DEFAULT_HOST}:${DEFAULT_BUILD_PORT}/index.js"></script>
        </body>
      </html>
    `);
  });

  app.listen(DEFAULT_PORT, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${DEFAULT_PORT}`);
    try {
      const devServe = await serve(
        {
          port: DEFAULT_BUILD_PORT,
          host: DEFAULT_HOST,
          servedir: DEFAULT_OUTDIR,
          onRequest(args: ServeOnRequestArgs) {
            if (args.timeInMS) {
              console.log(`${args.method}:${args.path} ${args.timeInMS} ms`);
            }
          },
        },
        {
          format: "iife",
          logLevel: "error",
          outdir: DEFAULT_OUTDIR,
          platform: DEFAULT_PLATFORM,
          bundle: true,
          define: {
            // React 在项目中使用到了 process.env.NODE_ENV 环境变量，使用 esbuild 的 define 定义将它替换成真实的值
            "process.env.NODE_ENV": JSON.stringify("development"),
          },
          entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
        }
      );

      // 脚本退出时中止服务
      process.on("SIGINT", () => {
        devServe.stop();
        process.exit(0);
      });

      process.on("SIGTERM", () => {
        devServe.stop();
        process.exit(1);
      });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });
};
