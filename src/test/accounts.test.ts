import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HOTELS, ROOM_TIER_MULTIPLIERS, bookingTotal, roomPrice } from "../lib/hotels.ts";
import { adultPrice, kidPrice, priceDays, quote } from "../lib/services.ts";
import { symphonyEventJsonLd } from "../lib/event-schema.ts";
import { paymentMemo, vietQrUrl } from "../lib/payment.ts";

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

  it("lists the next show days with Friday and Saturday at the higher adult price", () => {
    const days = priceDays("2026-11-19", 4);
    assert.deepEqual(
      days.map((day) => [day.weekday, day.adult]),
      [
        ["T5", 1_200_000],
        ["T6", 1_300_000],
        ["T7", 1_300_000],
        ["CN", 1_200_000],
      ],
    );
  });

  it("publishes an Event schema using the same ticket prices", () => {
    const data = symphonyEventJsonLd(new Date("2026-11-19T12:00:00+07:00"));
    assert.equal(data["@type"], "Event");
    assert.equal(data.startDate, "2026-11-19T19:40:00+07:00");
    assert.equal(data.endDate, "2026-11-19T20:10:00+07:00");
    assert.equal(data.doorTime, "2026-11-19T16:30:00+07:00");
    const prices = data.offers.map((offer) => offer.price);
    assert.deepEqual(prices.slice(0, 4), [1_200_000, 1_300_000, 840_000, 910_000]);
    assert.deepEqual(prices.slice(4), [800_000, 1_200_000, 1_600_000]);
    assert.equal(data.offers.some((offer) => "availability" in offer), false);
  });

  it("builds a VietQR url only when the receiving account is complete", () => {
    assert.equal(paymentMemo("pay-12"), "DFXPAY12");
    assert.equal(
      vietQrUrl({ bank: "mb", account: "0123 456 789", name: "Nguyễn A" }, 1_200_000, "DFXPAY12"),
      "https://img.vietqr.io/image/MB-0123456789-compact2.png?amount=1200000&addInfo=DFXPAY12&accountName=Nguyen+A",
    );
    assert.equal(vietQrUrl({ bank: "MB", account: "", name: "A" }, 1000, "DFX"), "");
  });

  it("keeps hotel catalog prices aligned with server hotel_rates seed", () => {
    const expected = {
      "dalat-wonder": 1_250_000,
      "swiss-belresort": 1_450_000,
      "azurea-cam-ranh": 2_450_000,
      "banla-sapa": 1_290_000,
      "lava-dalat": 1_150_000,
      "metropole-hanoi": 1_890_000,
    };
    for (const [id, price] of Object.entries(expected)) {
      const hotel = HOTELS.find((row) => row.id === id);
      assert.ok(hotel, id);
      assert.equal(hotel.price, price);
    }
  });
});
