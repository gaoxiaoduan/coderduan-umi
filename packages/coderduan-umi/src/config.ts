import path from "path";
import { existsSync } from "fs";
import { build } from "esbuild";
import { DEFAULT_CONFIG_FILE } from "./constants";
import type { AppData } from "./appData";

export interface UserConfig {
  title: string;
  keepalive: any[];
}

export const getUserConfig = ({
  appData,
  sendMessage,
}: {
  appData: AppData;
  sendMessage: (type: string, data?: any) => void;
}) => {
  return new Promise(async (resolve: (value: UserConfig) => void, reject) => {
    let config = {};
    const configFile = path.resolve(appData.paths.cwd, DEFAULT_CONFIG_FILE);

    if (existsSync(configFile)) {
      await build({
        format: "cjs",
        logLevel: "error",
        outdir: appData.paths.absOutputPath,
        bundle: true,
        define: {
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        entryPoints: [configFile],
        external: ["esbuild"],
        watch: {
          onRebuild(error, result) {
            if (error) {
              return console.error(JSON.stringify(error));
            }
            sendMessage?.("reload");
          },
        },
      });

      try {
        config = require(path.resolve(
          appData.paths.absOutputPath,
          "coderduan-umi.config.js"
        )).default;
      } catch (error) {
        console.error("getUserConfig error", error);
        reject(error);
      }
    }

    resolve(config);
  });
};
