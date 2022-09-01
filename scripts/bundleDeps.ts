// 将构建入口找到 node_modules 下的某个包指定的 main 入口，然后将它编译到我们指定的路径中
import minimist from "minimist";
import path from "path";
import resolve from "resolve";
import fs from "fs-extra";
import ncc from "@vercel/ncc";
import { Package } from "dts-packer";

const argv = minimist(process.argv.slice(2));
const cwd = process.cwd();

// 找到nodeModulesPath
const nodeModulesPath = path.join(cwd, "node_modules");

// 某个包（eg:express）
const pkg = argv._[0];

// 包的入口文件
const entry = require.resolve(pkg, {
  paths: [nodeModulesPath],
});

// 指定的路径中
const target = `compiled/${pkg}`;

const build = async () => {
  // 将这个包编译
  //@ts-ignore
  const { code } = await ncc(entry, {
    minify: true,
    target: "es5",
    assetBuilds: false,
  });

  // 编译到 写入到目标文件
  fs.ensureDirSync(target);
  fs.writeFileSync(path.join(target, "index.js"), code, "utf-8");

  const pkgRoot = path.dirname(
    resolve.sync(`${pkg}/package.json`, {
      basedir: cwd,
    })
  );
  if (fs.existsSync(path.join(pkgRoot, "LICENSE"))) {
    fs.copyFileSync(
      path.join(pkgRoot, "LICENSE"),
      path.join(target, "LICENSE")
    );
  }
  fs.copyFileSync(
    path.join(pkgRoot, "package.json"),
    path.join(target, "package.json")
  );

  new Package({
    cwd: cwd,
    name: pkg,
    typesRoot: target,
  });
};

build();
