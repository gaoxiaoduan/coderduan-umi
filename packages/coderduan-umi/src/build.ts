import { build as esbuild } from "esbuild";
import { style } from "./styles";
import {
    DEFAULT_PLATFORM
} from "./constants";
import { getAppData } from "./appData";
import { getRoutes } from "./routes";
import { generateEntry } from "./entry";
import { generateHtml } from "./html";
import { getUserConfig } from "./config";

export const build = async () => {
    const cwd = process.cwd();

    // 生命周期

    // 获取项目元信息
    const appData = await getAppData({ cwd });

    // 获取用户数据
    const userConfig = await getUserConfig({ appData, isProduction: true });

    // 获取 routes 配置
    const routes = await getRoutes({ appData });
    // 生成项目主入口
    await generateEntry({ appData, routes, userConfig });
    // 生成html
    await generateHtml({ appData, userConfig, isProduction: true });

    // 执行构建;
    await esbuild({
        format: "iife",
        logLevel: "error",
        outdir: appData.paths.absOutputPath,
        platform: DEFAULT_PLATFORM,
        bundle: true,
        minify: true,
        define: {
            // React 在项目中使用到了 process.env.NODE_ENV 环境变量，使用 esbuild 的 define 定义将它替换成真实的值
            "process.env.NODE_ENV": JSON.stringify("production"),
        },
        entryPoints: [appData.paths.absEntryPath],
        external: ["esbuild"],
        plugins: [style()],
    });
};
