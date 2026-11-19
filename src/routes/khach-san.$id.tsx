import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { BRAND } from "@/lib/brand";
import { reviewsFor } from "@/lib/content";
import {
  ROOMS,
  formatVnd,
  getHotel,
  nightsBetween,
  roomPrice,
  saveStay,
  stayTotal,
} from "@/lib/hotels";

export const Route = createFileRoute("/khach-san/$id")({ component: HotelPage });

function HotelPage() {
  const { id } = useParams({ from: "/khach-san/$id" });
  const navigate = useNavigate();
  const hotel = getHotel(id);
  const [room, setRoom] = useState(0);
  const [checkIn, setCheckIn] = useState("2026-11-20");
  const [checkOut, setCheckOut] = useState("2026-11-22");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!hotel) {
    return (
      <Shell>
        <p className="text-lg">Không thấy khách sạn này.</p>
        <Link
          to="/kham-pha"
          className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-brand text-lg font-semibold text-on-brand"
        >
          Về khám phá
        </Link>
      </Shell>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const nightly = roomPrice(hotel.price, room);
  const total = nights > 0 ? stayTotal(nightly, nights) : 0;
  const reviews = reviewsFor(hotel.id);

  function hold() {
    if (nights < 1) {
      setError("Ngày trả phòng phải sau ngày nhận.");
      return;
    }
    if (name.trim().length < 2 || phone.trim().length < 8) {
      setError("Cần tên và số điện thoại để giữ chỗ trên máy này.");
      return;
    }
    saveStay({
      id: `P-${Date.now().toString().slice(-6)}`,
      hotelId: hotel!.id,
      room: ROOMS[room]?.name ?? "Deluxe Room",
      checkIn,
      checkOut,
      nights,
      guests,
      name: name.trim(),
      phone: phone.trim(),
      total,
    });
    navigate({ to: "/dat-cho" });
  }

  return (
    <Shell>
      <img src={hotel.image} alt="" className="h-56 w-full rounded-card object-cover" />
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {hotel.gallery.map((src) => (
          <img key={src} src={src} alt="" className="h-20 w-28 shrink-0 rounded-2xl object-cover" />
        ))}
      </div>
      <p className="mt-4 text-base text-muted">
        {hotel.city} · {hotel.stars} sao · {hotel.score} ({hotel.reviews.toLocaleString("vi-VN")} đánh giá)
      </p>
      <h1 className="display text-4xl leading-tight">{hotel.name}</h1>
      <p className="mt-2 text-base text-muted">{hotel.address}</p>
      <p className="mt-3 text-base">{hotel.description}</p>
      <p className="mt-2 text-base text-muted">
        Giá mẫu. {BRAND.discountLabel}. Làm tròn hạng phòng tới 10.000đ.
      </p>

      <div className="mt-5 grid gap-3">
        {ROOMS.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setRoom(index)}
            className={`flex min-h-14 items-center justify-between rounded-card border px-4 py-4 text-left text-lg ${
              room === index ? "border-brand bg-surface" : "border-line bg-surface"
            }`}
          >
            <span className="font-medium">{item.name}</span>
            <span className="font-semibold">{formatVnd(roomPrice(hotel.price, index))}/đêm</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <label className="text-base font-medium">
          Nhận phòng
          <input
            type="date"
            value={checkIn}
            onChange={(event) => setCheckIn(event.target.value)}
            className="mt-2 h-14 w-full rounded-2xl border border-line bg-surface px-4 text-lg"
          />
        </label>
        <label className="text-base font-medium">
          Trả phòng
          <input
            type="date"
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className="mt-2 h-14 w-full rounded-2xl border border-line bg-surface px-4 text-lg"
          />
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-lg font-medium">Số khách</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-14 w-14 rounded-full border border-line text-2xl"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            aria-label="Giảm số khách"
          >
            −
          </button>
          <span className="w-10 text-center text-2xl font-semibold">{guests}</span>
          <button
            type="button"
            className="h-14 w-14 rounded-full bg-brand text-2xl text-on-brand"
            onClick={() => setGuests(guests + 1)}
            aria-label="Tăng số khách"
          >
            +
          </button>
        </div>
      </div>

      <label className="mt-5 block text-base font-medium">
        Tên
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 h-14 w-full rounded-2xl border border-line bg-surface px-4 text-lg"
        />
      </label>
      <label className="mt-4 block text-base font-medium">
        Số điện thoại
        <input
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-2 h-14 w-full rounded-2xl border border-line bg-surface px-4 text-lg"
        />
      </label>
      {error ? <p className="mt-4 text-base font-medium text-brand">{error}</p> : null}
      <p className="mt-5 text-2xl font-semibold">
        {nights > 0 ? `${nights} đêm · ${formatVnd(total)}` : "Chọn ngày trả sau ngày nhận"}
      </p>
      <button
        type="button"
        onClick={hold}
        className="mt-4 h-14 w-full rounded-full bg-brand text-lg font-semibold text-on-brand"
      >
        Giữ phòng trên máy này
      </button>
      <p className="mt-3 text-base text-muted">Chưa trừ tiền và chưa phải phòng đã xác nhận.</p>

      {reviews.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Đánh giá mẫu</h2>
          <ul className="mt-4 space-y-3">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-card border border-line bg-surface p-4">
                <p className="font-semibold">
                  {review.name} · {review.score}
                </p>
                <p className="text-sm text-muted">
                  {review.from} · {review.trip} · {review.date}
                </p>
                <p className="mt-2 text-base">{review.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Shell>
  );
}
