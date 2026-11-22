import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HERO_BG_3D, isHeroInteractiveTarget } from "./hero-bg-3d.ts";

describe("HERO_BG_3D tunables", () => {
  it("keeps motion bounds in a safe decorative range", () => {
    assert.ok(HERO_BG_3D.baseScale > 1.05);
    assert.ok(HERO_BG_3D.maxTiltX <= 10);
    assert.ok(HERO_BG_3D.maxTiltY <= 12);
    assert.ok(HERO_BG_3D.followLag > 0 && HERO_BG_3D.followLag < 1);
    assert.ok(HERO_BG_3D.throwFriction > 0.5 && HERO_BG_3D.throwFriction < 1);
  });
});

describe("isHeroInteractiveTarget", () => {
  it("treats null as non-interactive", () => {
    assert.equal(isHeroInteractiveTarget(null), false);
  });

  it("detects buttons and inputs when DOM is available", () => {
    if (typeof document === "undefined") return;
    const btn = document.createElement("button");
    btn.textContent = "Tìm";
    document.body.appendChild(btn);
    assert.equal(isHeroInteractiveTarget(btn), true);
    const span = document.createElement("span");
    document.body.appendChild(span);
    assert.equal(isHeroInteractiveTarget(span), false);
    btn.remove();
    span.remove();
  });
});
