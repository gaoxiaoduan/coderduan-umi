import express from "express";
import { build } from "esbuild";
import path from "path";
import portfinder from "portfinder";
import { createServer } from "http";
import { createWebSocketServer } from "./server";
import { style } from "./styles";
import {
  DEFAULT_OUTDIR,
  DEFAULT_ENTRY_POINT,
  DEFAULT_PLATFORM,
  DEFAULT_HOST,
  DEFAULT_PORT,
} from "./constants";

export const dev = async () => {
  const cwd = process.cwd();
  const app = express();
  const port = await portfinder.getPortPromise({ port: DEFAULT_PORT });
  const esbuildOutput = path.resolve(cwd, DEFAULT_OUTDIR);

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
          <script src="/${DEFAULT_OUTDIR}/index.js"></script>
          <script src="/coderduan-umi/client.js"></script>
        </body>
      </html>
    `);
  });

  app.use(`/${DEFAULT_OUTDIR}`, express.static(esbuildOutput));
  app.use("/coderduan-umi", express.static(path.resolve(__dirname, "client")));

  const coderduanUmiServer = createServer(app);
  const ws = createWebSocketServer(coderduanUmiServer);

  function senMessage(type: string, data?: any) {
    ws.send(JSON.stringify({ type, data }));
  }

  coderduanUmiServer.listen(port, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${port}`);
    try {
      await build({
        format: "iife",
        logLevel: "error",
        outdir: esbuildOutput,
        platform: DEFAULT_PLATFORM,
        bundle: true,
        define: {
          // React 在项目中使用到了 process.env.NODE_ENV 环境变量，使用 esbuild 的 define 定义将它替换成真实的值
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
        external: ["esbuild"],
        plugins: [style()],
        watch: {
          onRebuild(error, result) {
            if (error) {
              return console.error(JSON.stringify(error));
            }
            senMessage("reload");
          },
        },
      });
      // [Issues](https://github.com/evanw/esbuild/issues/805)
      // esbuild serve 不能响应 onRebuild
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  });
};
