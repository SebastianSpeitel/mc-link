import {
  scoreboard,
  execute,
  Selector,
  run_function
} from "@throw-out-error/minecraft-mcfunction";

const Cooldown = ("mc-link:countup" as unknown) as Selector;
const Vars = "vars";

export function reload() {
  //datapack("disable", "mc-link-worker");
  //datapack("enable", "mc-link-worker");
  run_function("mc-link:run");
  scoreboard("players", "set", Cooldown, Vars, 0);
}

export function tick() {
  scoreboard("players", "add", Cooldown, Vars, 1);

  const reload = run_function("mc-link:reload");

  execute(reload).if("score", Cooldown, Vars, "matches", [40, undefined]);
}

export function load() {
  scoreboard("objectives", "add", Vars, "dummy", '"Variables"');
}
