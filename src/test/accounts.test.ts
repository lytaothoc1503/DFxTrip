import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BRAND } from "../lib/brand.ts";
import {
  HOTELS,
  ROOM_TIER_MULTIPLIERS,
  SAMPLE_BOOKINGS,
  TOURS,
  bookingTotal,
  getHotel,
  roomPrice,
  tourTotal,
} from "../lib/hotels.ts";
import { adultPrice, kidPrice, quote } from "../lib/services.ts";

describe("VinaStay pricing accounts", () => {
  it("keeps Deluxe ×1, Superior ×1.28, Suite ×1.8", () => {
    assert.deepEqual([...ROOM_TIER_MULTIPLIERS], [1, 1.28, 1.8]);
  });

  it("prices Superior at ×1.28 and Suite at ×1.8 of the base, rounded to 10.000đ", () => {
    assert.equal(roomPrice(1_290_000, 0), 1_290_000);
    assert.equal(roomPrice(1_290_000, 1), 1_650_000);
    assert.equal(roomPrice(2_450_000, 2), 4_410_000);
  });

  it("applies the 10% brand discount on stay totals", () => {
    assert.equal(BRAND.discountRate, 0.1);
    assert.equal(bookingTotal(1_250_000, 3), 3_375_000);
    assert.equal(bookingTotal(4_410_000, 2), 7_938_000);
  });

  it("matches sample booking totals from the DFxTrip data sheet", () => {
    for (const sample of SAMPLE_BOOKINGS) {
      const hotel = getHotel(sample.hotelId);
      assert.ok(hotel, sample.hotelId);
      const tier = sample.roomName.includes("Superior")
        ? 1
        : sample.roomName.includes("Suite")
          ? 2
          : 0;
      assert.equal(
        bookingTotal(roomPrice(hotel!.price, tier), sample.nights),
        sample.total,
        sample.code,
      );
    }
  });

  it("resolves legacy hotel aliases to canonical ids", () => {
    assert.equal(getHotel("azurea")?.id, "azurea-cam-ranh");
    assert.equal(getHotel("banla")?.id, "banla-sapa");
    assert.equal(getHotel("emerald")?.id, "metropole-hanoi");
    assert.equal(HOTELS.length, 6);
  });

  it("prices tour children at 75% rounded to 1.000đ", () => {
    const tour = TOURS.find((item) => item.id === "ninh-binh-trang-an");
    assert.ok(tour);
    assert.equal(tourTotal(tour!.price, 2, 1), 890_000 * 2 + 668_000);
  });

  it("prices Symphony adults/kids and table fees by day", () => {
    assert.equal(adultPrice("2026-11-19"), 1_200_000); // Thursday
    assert.equal(adultPrice("2026-11-20"), 1_300_000); // Friday
    assert.equal(kidPrice("2026-11-20"), 910_000);
    const q = quote({
      date: "2026-11-21",
      adults: 2,
      kids: 1,
      infants: 0,
      tableId: "4",
    });
    assert.equal(q.adult, 1_300_000);
    assert.equal(q.fee, 800_000);
    assert.equal(q.total, 2 * 1_300_000 + 910_000 + 800_000);
  });
});
