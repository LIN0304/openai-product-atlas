import { spawnSync } from "node:child_process";

const mode = process.argv[2];
const godot = process.env.GODOT_BIN || "godot";
const commands = {
  check: ["--headless", "--path", "godot", "--editor", "--quit"],
  runcheck: ["--headless", "--path", "godot", "--quit-after", "3"],
  export: ["--headless", "--path", "godot", "--export-release", "Web", "../public/godot/index.html"],
};

if (!commands[mode]) {
  console.error("Usage: node scripts/run-godot.mjs <check|runcheck|export>");
  process.exit(2);
}

const result = spawnSync(godot, commands[mode], { cwd: process.cwd(), stdio: "inherit" });
if (result.error) {
  console.error(`Unable to run Godot at '${godot}'. Put Godot on PATH or set GODOT_BIN to the executable path.`);
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
