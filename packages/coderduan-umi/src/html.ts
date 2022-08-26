import path from "path";
import { mkdir, writeFileSync } from "fs";
import type { AppData } from "./appData";
import { DEFAULT_OUTDIR, DEFAULT_FRAMEWORK_NAME } from "./constants";

export const generateHtml = ({ appData }: { appData: AppData }) => {
  return new Promise((resolve, reject) => {
    const content = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${appData.pkg.name ?? "coderduan-umi"}</title>
        </head>

        <body>
          <div id="root">
            <span>loading...</span>
          </div>
          <script src="/${DEFAULT_OUTDIR}/${DEFAULT_FRAMEWORK_NAME}.js"></script>
          <script src="/coderduan-umi/client.js"></script>
        </body>
      </html>
    `;

    try {
      const htmlPath = path.resolve(appData.paths.absOutputPath, "index.html");
      mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
        if (err) reject(err);
        writeFileSync(htmlPath, content, "utf-8");
        resolve({});
      });
    } catch (error) {
      reject(error);
    }
  });
};
