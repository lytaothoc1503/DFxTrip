import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolvePageScene } from "./page-scene.ts";

describe("resolvePageScene", () => {
  it("maps main category paths to distinct atmospheres", () => {
    assert.equal(resolvePageScene("/"), "home");
    assert.equal(resolvePageScene("/khach-san"), "hotels");
    assert.equal(resolvePageScene("/khach-san/dalat-wonder"), "hotels");
    assert.equal(resolvePageScene("/tour"), "tours");
    assert.equal(resolvePageScene("/tour/tour-ha-giang-o-to"), "tours");
    assert.equal(resolvePageScene("/ve"), "tickets");
    assert.equal(resolvePageScene("/dat-cho"), "holds");
    assert.equal(resolvePageScene("/yeu-thich"), "favorites");
    assert.equal(resolvePageScene("/thanh-toan"), "pay");
    assert.equal(resolvePageScene("/thanh-toan/ABC"), "pay");
    assert.equal(resolvePageScene("/tai-khoan"), "account");
  });
});
