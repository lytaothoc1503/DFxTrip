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
    for (const needed of ["index.tsx", "khach-san.index.tsx", "khach-san.$id.tsx", "yeu-thich.tsx", "dat-cho.tsx", "tai-khoan.tsx", "ve.tsx"]) {
      assert.ok(files.includes(needed), needed);
    }
  });

  it("keeps the show schedule from the poster", () => {
    assert.equal(SHOW_SCHEDULE[0]?.time, "16:00");
    assert.equal(SHOW_SCHEDULE[3]?.time, "19:40");
    assert.equal(SHOW_SCHEDULE.at(-1)?.time, "20:10");
  });
});
