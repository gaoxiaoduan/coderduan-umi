import esbuild, { Plugin } from "esbuild";
import path from "path";
export function style(): Plugin {
  return {
    name: "style",
    setup({ onResolve, onLoad }) {
      onResolve({ filter: /\.css$/, namespace: "file" }, (args) => {
        const absPath = path.resolve(args.resolveDir, args.path);
        return { path: absPath, namespace: "style-stub" };
      });
      onResolve({ filter: /\.css$/, namespace: "style-stub" }, (args) => {
        return { path: args.path, namespace: "style-content" };
      });
      onResolve(
        { filter: /^__style_helper__$/, namespace: "style-stub" },
        (args) => {
          return {
            path: args.path,
            namespace: "style-helper",
            sideEffects: false,
          };
        }
      );

      onLoad({ filter: /.*/, namespace: "style-helper" }, async () => ({
        contents: `
        export function injectStyle(text) {
            if (typeof document !== 'undefined') {
                var style = document.createElement('style')
                var node = document.createTextNode(text)
                style.appendChild(node)
                document.head.appendChild(style)
            }
        }
        `,
      }));

      onLoad({ filter: /.*/, namespace: "style-stub" }, async (args) => ({
        contents: `
        import { injectStyle } from "__style_helper__"
        import css from ${JSON.stringify(args.path)}
        injectStyle(css)
        `,
      }));
      onLoad({ filter: /.*/, namespace: "style-content" }, async (args) => {
        const { errors, warnings, outputFiles } = await esbuild.build({
          entryPoints: [args.path],
          logLevel: "silent",
          bundle: true,
          write: false,
          charset: "utf8",
          minify: false,
          loader: {
            ".svg": "dataurl",
            ".ttf": "dataurl",
          },
        });

        return {
          errors,
          warnings,
          contents: outputFiles![0].text,
          loader: "text",
        };
      });
    },
  };
}
