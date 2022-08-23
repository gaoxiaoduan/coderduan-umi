#!/usr/bin/env node
const { program } = require("commander");
program
  .version(require("../package.json").version, "-v, -V", "输出框架版本")
  .description("手写前端框架")
  .usage("<command> [options]");

program
  .command("help")
  .alias("-h")
  .description("帮助命令")
  .action(function (name, options) {
    console.log(`
    这是coderduan-umi框架

    支持的命令:
    version:-v, -V 输出当前框架版本
    help,-h 输出帮助程序

    Example call:
        $ coderduan-umi <command> --help
    `);
  });

program
  .command("dev")
  .description("框架开发命令")
  .action(function () {
    const { dev } = require("../lib/dev");
    dev();
  });

program.parse(process.argv);
