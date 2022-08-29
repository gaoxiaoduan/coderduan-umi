import express from "express";
import { build } from "esbuild";
import path from "path";
import fs from "fs";
import portfinder from "portfinder";
import { createServer } from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createWebSocketServer } from "./server";
import { style } from "./styles";
import {
  DEFAULT_OUTDIR,
  DEFAULT_PLATFORM,
  DEFAULT_HOST,
  DEFAULT_PORT,
} from "./constants";
import { getAppData } from "./appData";
import type { AppData } from "./appData";
import { getRoutes } from "./routes";
import { generateEntry } from "./entry";
import { generateHtml } from "./html";
import { getUserConfig } from "./config";
import { getMockConfig } from "./mock";

export const dev = async () => {
  const cwd = process.cwd();
  const app = express();
  const port = await portfinder.getPortPromise({ port: DEFAULT_PORT });
  const output = path.resolve(cwd, DEFAULT_OUTDIR);

  app.get("/", (req, res, next) => {
    res.set("Content-Type", "text/html");
    const htmlPath = path.join(output, "index.html");
    if (fs.existsSync(htmlPath)) {
      fs.createReadStream(htmlPath).on("error", next).pipe(res);
    } else {
      next();
    }
  });

  app.use(`/${DEFAULT_OUTDIR}`, express.static(output));
  app.use("/coderduan-umi", express.static(path.resolve(__dirname, "client")));

  const coderduanUmiServer = createServer(app);
  const ws = createWebSocketServer(coderduanUmiServer);

  function sendMessage(type: string, data?: any) {
    ws.send(JSON.stringify({ type, data }));
  }

  const buildMain = async ({ appData }: { appData: AppData }) => {
    // 获取用户数据
    const userConfig = await getUserConfig({ appData, coderduanUmiServer });
    const mockConfig = await getMockConfig({ appData, coderduanUmiServer });

    app.use((req, res, next) => {
      const result = mockConfig?.[req.method]?.[req.url];
      const resultType = Object.prototype.toString.call(result);
      if (
        resultType === "[object String]" ||
        resultType === "[object Array]" ||
        resultType === "[object Object]"
      ) {
        res.json(result);
      } else if (resultType === "[object Function]") {
        result(req, res);
      } else {
        next();
      }
    });

    // 获取 routes 配置
    const routes = await getRoutes({ appData });
    // 生成项目主入口
    await generateEntry({ appData, routes, userConfig });
    // 生成html
    await generateHtml({ appData, userConfig });

    if (userConfig.proxy) {
      Object.keys(userConfig.proxy).forEach((key) => {
        const proxyConfig = userConfig.proxy![key];
        const target = proxyConfig.target;
        if (target) {
          app.use(key, createProxyMiddleware(key, userConfig.proxy![key]));
        }
      });
    }
  };

  coderduanUmiServer.on("REBUILD", async ({ appData }) => {
    await buildMain({ appData });
    sendMessage("reload");
  });

  coderduanUmiServer.listen(port, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${port}`);
    try {
      // 生命周期

      // 获取项目元信息
      const appData = await getAppData({ cwd, port });

      buildMain({ appData });

      // 执行构建;
      await build({
        format: "iife",
        logLevel: "error",
        outdir: appData.paths.absOutputPath,
        platform: DEFAULT_PLATFORM,
        bundle: true,
        define: {
          // React 在项目中使用到了 process.env.NODE_ENV 环境变量，使用 esbuild 的 define 定义将它替换成真实的值
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        entryPoints: [appData.paths.absEntryPath],
        external: ["esbuild"],
        plugins: [style()],
        watch: {
          onRebuild(error, result) {
            if (error) {
              return console.error(JSON.stringify(error));
            }
            sendMessage("reload");
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
