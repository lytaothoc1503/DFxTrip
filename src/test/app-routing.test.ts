import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SHOW_SCHEDULE } from "../lib/services.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));

describe("DFxTrip routes", () => {
  it("keeps the original screens and the Phú Quốc ticket page", () => {
    const files = readdirSync(join(root, "src/routes"));
    for (const needed of [
      "index.tsx",
      "khach-san.index.tsx",
      "khach-san.$id.tsx",
      "tour.index.tsx",
      "tour.$slug.tsx",
      "thanh-toan.index.tsx",
      "thanh-toan.$code.tsx",
      "yeu-thich.tsx",
      "dat-cho.tsx",
      "tai-khoan.tsx",
      "ve.tsx",
    ]) {
      assert.ok(files.includes(needed), needed);
    }
  });

  it("maps each product path to a dedicated route module", () => {
    const files = new Set(readdirSync(join(root, "src/routes")));
    assert.equal(files.has("khach-san.$id.tsx"), true);
    assert.equal(files.has("tour.$slug.tsx"), true);
    assert.equal(files.has("thanh-toan.$code.tsx"), true);
    assert.equal(files.has("thanh-toan.index.tsx"), true);
  });

  it("keeps the show schedule from the poster", () => {
    assert.equal(SHOW_SCHEDULE[0]?.time, "16:00");
    assert.equal(SHOW_SCHEDULE[3]?.time, "19:40");
    assert.equal(SHOW_SCHEDULE.at(-1)?.time, "20:10");
  });
});
