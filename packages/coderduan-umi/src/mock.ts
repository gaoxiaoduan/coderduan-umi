import path from "path";
import { build } from "esbuild";
import glob from "../compiled/glob";
import type { AppData } from "./appData";
import type { Server } from "http";

function clearRequireCache(absMockPath: string) {
  Object.keys(require.cache).forEach((file) => {
    if (file.indexOf(absMockPath) > -1) {
      delete require.cache[file];
    }
  });
}

function normalizeConfig(config: any) {
  return Object.keys(config).reduce((memo: any, key) => {
    const handler = config[key];
    const type = typeof handler;
    if (type !== "function" && type !== "object") {
      return memo;
    }
    const req = key.split(" ");
    const method = req[0];
    const url = req[1];
    if (!memo[method]) memo[method] = {};
    memo[method][url] = handler;
    return memo;
  }, {});
}

export const getMockConfig = ({
  appData,
  coderduanUmiServer,
}: {
  appData: AppData;
  coderduanUmiServer: Server;
}) => {
  return new Promise(async (resolve: (value: any) => void, reject) => {
    let config = {};
    const mockDir = path.resolve(appData.paths.cwd, "mock");
    const mockFiles = glob.sync("**/*.ts", { cwd: mockDir });
    const ret = mockFiles.map((memo) => {
      return path.join(mockDir, memo);
    });
    const mockOutDir = path.resolve(appData.paths.absTmpPath, "mock");
    await build({
      format: "cjs",
      logLevel: "error",
      outdir: mockOutDir,
      bundle: true,
      define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      entryPoints: ret,
      external: ["esbuild"],
      watch: {
        onRebuild(error, result) {
          if (error) {
            return console.error(JSON.stringify(error));
          }
          coderduanUmiServer.emit("REBUILD", { appData });
        },
      },
    });

    try {
      const outMockFiles = glob.sync("**/*.js", { cwd: mockOutDir });
      clearRequireCache(mockOutDir);
      config = outMockFiles.reduce((memo, mockFile) => {
        memo = {
          ...memo,
          ...require(path.resolve(mockOutDir, mockFile)).default,
        };
        return memo;
      }, {});
    } catch (error) {
      console.log("getMockConfig error", error);
      reject(error);
    }
    resolve(normalizeConfig(config));
  });
};
