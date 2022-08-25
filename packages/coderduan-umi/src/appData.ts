import path from "path";
import {
  DEFAULT_ENTRY_POINT,
  DEFAULT_OUTDIR,
  DEFAULT_TEMPLATE,
} from "./constants";

interface Options {
  cwd: string;
}

// app元数据类型
export interface AppData {
  paths: {
    cwd: string; // 当前路径
    absSrcPath: string; // src 目录 绝对路径
    absPagesPath: string; // pages目录 绝对路径
    absTmpPath: string; // 临时目录 绝对路径
    absOutputPath: string; // 输出目录 绝对路径
    absEntryPath: string; // 输入目录 绝对路径
    absNodeModulesPath: string; // node_modules 绝对路径
  };
  pkg: any; // package.json 信息
}

export const getAppData = ({ cwd }: Options) => {
  return new Promise((resolve: (value: AppData) => void, reject) => {
    const absSrcPath = path.resolve(cwd, "src");
    const absPagesPath = path.resolve(absSrcPath, "pages");
    const absNodeModulesPath = path.resolve(cwd, "node_modules");
    const absTmpPath = path.resolve(absNodeModulesPath, DEFAULT_TEMPLATE);
    const absEntryPath = path.resolve(absTmpPath, DEFAULT_ENTRY_POINT);
    const absOutputPath = path.resolve(cwd, DEFAULT_OUTDIR);
    const paths = {
      cwd,
      absSrcPath,
      absPagesPath,
      absTmpPath,
      absOutputPath,
      absEntryPath,
      absNodeModulesPath,
    };
    const pkg = require(path.resolve(cwd, "package.json"));
    resolve({ paths, pkg });
  });
};
