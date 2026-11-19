import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { BRAND } from "../lib/brand.ts";
import { BLOG_POSTS } from "../lib/content.ts";
import { TOURS } from "../lib/hotels.ts";
import { SHOW_SCHEDULE } from "../lib/services.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const routesDir = join(root, "src/routes");
const routeTree = readFileSync(join(root, "src/routeTree.gen.ts"), "utf8");

describe("app routing and content wiring", () => {
  it("registers hotel, tour, blog, show and hold routes", () => {
    const files = readdirSync(routesDir);
    for (const needed of [
      "index.tsx",
      "kham-pha.tsx",
      "khach-san.$id.tsx",
      "ve.tsx",
      "dat-cho.tsx",
      "yeu-thich.tsx",
      "tour.index.tsx",
      "tour.$id.tsx",
      "blog.index.tsx",
      "blog.$slug.tsx",
    ]) {
      assert.ok(files.includes(needed), needed);
    }

    for (const path of ["/", "/ve", "/dat-cho", "/tour/", "/blog/", "/khach-san/$id", "/tour/$id", "/blog/$slug"]) {
      assert.ok(routeTree.includes(`'${path}'`) || routeTree.includes(`"${path}"`), path);
    }
  });

  it("keeps VinaStay brand contact for FAB links", () => {
    assert.equal(BRAND.name, "VinaStay");
    assert.equal(BRAND.phoneTel, "0909686868");
    assert.ok(BRAND.zaloUrl.includes("0909686868"));
    const shell = readFileSync(join(root, "src/components/shell.tsx"), "utf8");
    assert.ok(shell.includes("BRAND.zaloUrl"));
    assert.ok(shell.includes("phoneHref"));
  });

  it("ships show schedule and catalogue content", () => {
    assert.equal(SHOW_SCHEDULE.length, 5);
    assert.equal(SHOW_SCHEDULE[0]?.time, "16:00");
    assert.equal(SHOW_SCHEDULE[3]?.time, "19:40");
    assert.ok(TOURS.length >= 6);
    assert.ok(BLOG_POSTS.length >= 6);
  });

  it("exposes create_service_booking SQL migration", () => {
    const sql = readFileSync(join(root, "drizzle/migrations/0001_create_service_booking.sql"), "utf8");
    assert.ok(sql.includes("create_service_booking"));
    assert.ok(sql.includes("1.28"));
    assert.ok(sql.includes("0.9"));
    assert.ok(sql.includes("1300000"));
    assert.ok(sql.includes("800000"));
  });
});
