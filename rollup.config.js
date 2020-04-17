import ts from "rollup-plugin-typescript2";

function makeConfig() {
  return {
    input: "src/index.ts",
    output: {
      format: "cjs",
      dir: "legacy",
      exports: "named",
      hoistTransitiveImports: false,
      banner: "#!/usr/bin/env node"
    },
    preserveModules: true,
    context: "this",
    plugins: [ts()],
    external: [
      "fs",
      "os",
      "path",
      "readline",
      "@throw-out-error/minecraft-datapack",
      "@throw-out-error/minecraft-mcfunction"
    ]
  };
}

const cjsConfig = makeConfig();
cjsConfig.input = [cjsConfig.input, "src/cli.ts"].flat();
const esmConfig = makeConfig();
esmConfig.output.format = "esm";
esmConfig.output.dir = "dist";

export default [cjsConfig, esmConfig];
