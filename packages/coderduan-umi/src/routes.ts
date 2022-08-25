import path from "path";
import { existsSync, readdirSync, statSync } from "fs";
import type { AppData } from "./appData";
import { DEFAULT_GLOBAL_LAYOUTS } from "./constants";

// 获取所有tsx文件
const getFiles = (root: string): string[] => {
  if (!existsSync(root)) return [];
  return readdirSync(root).filter((file) => {
    const absFile = path.join(root, file);
    const fileStat = statSync(absFile);
    const isFile = fileStat.isFile();
    if (isFile) {
      if (!/\.tsx?$/.test(file)) return false;
    }
    return true;
  });
};

// 文件转路由配置
const filesToRoutes = (files: string[], pagesPath: string): IRoute[] => {
  return files.map((i) => {
    let pagePath = path.basename(i, path.extname(i));
    const element = path.resolve(pagesPath, pagePath);
    // TODO:后续改为默认index和支持用户配置
    if (pagePath === "home") pagePath = "";
    return {
      path: `${pagePath}`,
      element,
    };
  });
};

export interface IRoute {
  element: string;
  path: string;
  routes?: IRoute[];
}

// 获取路由配置
export const getRoutes = ({ appData }: { appData: AppData }) => {
  return new Promise((resolve: (value: IRoute[]) => void) => {
    const files = getFiles(appData.paths.absPagesPath);
    const routes = filesToRoutes(files, appData.paths.absPagesPath);
    const layoutPtah = path.resolve(
      appData.paths.absSrcPath,
      DEFAULT_GLOBAL_LAYOUTS
    );

    if (!existsSync(layoutPtah)) {
      resolve(routes);
    } else {
      resolve([
        {
          path: "/",
          element: layoutPtah.replace(path.extname(layoutPtah), ""),
          routes: routes,
        },
      ]);
    }
  });
};
