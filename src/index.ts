import { Namespace, Datapack } from "@throw-out-error/minecraft-datapack";
import { McFunction, Command } from "@throw-out-error/minecraft-mcfunction";
import os from "os";
import pth from "path";
import * as funs from "./mcfunctions";

function getMinecraftPath(): string {
  switch (os.platform()) {
    case "win32":
      return pth.join(os.homedir(), "AppData/Roaming/.minecraft");
    case "darwin":
      return pth.join(os.homedir(), "Library/Application Support/minecraft");
    case "linux":
    default:
      return pth.join(os.homedir(), ".minecraft");
  }
}

class SingleCommand extends Command {
  constructor(cmd: string) {
    const [name, ...args] = cmd.split(" ");
    super(name as any, args);
  }
}

type TimeoutCb = Parameters<typeof setTimeout>[0];

async function timeout(cb: TimeoutCb, ms: number): Promise<void> {
  return new Promise((res, rej) => {
    setTimeout(async () => {
      try {
        await cb();
      } catch (e) {
        rej(e);
      }
      res();
    }, ms);
  });
}

export class McLink {
  private workerPack: Datapack;
  private workerNamespace: Namespace;
  private voidFunction = new McFunction("run", [new SingleCommand("")]);

  private pack: Datapack;

  private datapackFolder: string;

  public ready: Promise<void>;

  constructor(world: string) {
    this.datapackFolder = pth.resolve(
      getMinecraftPath(),
      "saves",
      world,
      "datapacks"
    );
    this.workerPack = new Datapack("mc-link-worker", "./");
    this.workerNamespace = this.workerPack.createNamespace("mc-link");

    this.pack = new Datapack("mc-link", ".");
    const ns = this.pack.createNamespace("mc-link");
    ns.addFunction(funs.tick);
    ns.addFunction(funs.reload);
    ns.addFunction(funs.load);
    this.pack.minecraft.createTag("load", "function", ["mc-link:load"]);
    this.pack.minecraft.createTag("tick", "function", ["mc-link:tick"]);
    this.pack.compile(this.datapackFolder);

    this.ready = this.workerPack.compile(this.datapackFolder);
  }

  async run(fun: McFunction | string) {
    if (typeof fun === "string") {
      fun = new McFunction("run", [new SingleCommand(fun)]);
    }

    this.workerNamespace.functions.run = fun;
    await this.workerPack.compile(this.datapackFolder);
    await timeout(async () => {
      this.workerNamespace.functions.run = this.voidFunction;
      await this.workerPack.compile(this.datapackFolder);
    }, 2000);
  }
}
