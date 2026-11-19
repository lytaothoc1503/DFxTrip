import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HOTELS, ROOM_TIER_MULTIPLIERS, bookingTotal, roomPrice } from "../lib/hotels.ts";
import { adultPrice, kidPrice, quote } from "../lib/services.ts";

describe("DFxTrip pricing", () => {
  it("keeps Deluxe ×1, Superior ×1.28, Suite ×1.8", () => {
    assert.deepEqual([...ROOM_TIER_MULTIPLIERS], [1, 1.28, 1.8]);
  });

  it("rounds room tiers to 10.000đ and takes 10% off the stay", () => {
    assert.equal(roomPrice(1_290_000, 1), 1_650_000);
    assert.equal(bookingTotal(1_250_000, 3), 3_375_000);
    assert.equal(HOTELS.length, 6);
  });

  it("prices Symphony adults, children and a table fee", () => {
    assert.equal(adultPrice("2026-11-19"), 1_200_000);
    assert.equal(adultPrice("2026-11-20"), 1_300_000);
    assert.equal(kidPrice("2026-11-20"), 910_000);
    const priced = quote({ date: "2026-11-21", adults: 2, kids: 0, infants: 0, tableId: "4" });
    assert.equal(priced.fee, 800_000);
    assert.equal(priced.total, 1_300_000 * 2 + 800_000);
  });
});
