import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
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
        <p>Không thấy khách sạn này.</p>
        <Link to="/kham-pha" className="mt-4 inline-flex h-12 items-center text-brand">
          Về khám phá
        </Link>
      </Shell>
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  const nightly = roomPrice(hotel.price, ROOMS[room]?.factor ?? 1);
  const total = nights > 0 ? stayTotal(nightly, nights) : 0;

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
      <img src={hotel.image} alt="" className="h-52 w-full rounded-card object-cover" />
      <p className="mt-4 text-sm text-muted">{hotel.city} · {hotel.stars} sao · {hotel.score}</p>
      <h1 className="display text-4xl leading-tight">{hotel.name}</h1>
      <p className="mt-2 text-sm text-muted">Giá mẫu. Tổng đã trừ 10%, làm tròn hạng phòng tới 10.000đ.</p>

      <div className="mt-4 grid gap-3">
        {ROOMS.map((item, index) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setRoom(index)}
            className={`flex items-center justify-between rounded-card border px-4 py-3 text-left ${
              room === index ? "border-brand bg-surface" : "border-line bg-surface"
            }`}
          >
            <span className="font-medium">{item.name}</span>
            <span>{formatVnd(roomPrice(hotel.price, item.factor))}/đêm</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-sm">
          Nhận phòng
          <input type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-3" />
        </label>
        <label className="text-sm">
          Trả phòng
          <input type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-3" />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-medium">Số khách</span>
        <div className="flex items-center gap-2">
          <button type="button" className="h-12 w-12 rounded-full border border-line" onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
          <span className="w-8 text-center text-lg font-semibold">{guests}</span>
          <button type="button" className="h-12 w-12 rounded-full bg-brand text-on-brand" onClick={() => setGuests(guests + 1)}>+</button>
        </div>
      </div>

      <label className="mt-4 block text-sm">
        Tên
        <input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-3" />
      </label>
      <label className="mt-3 block text-sm">
        Số điện thoại
        <input inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-3" />
      </label>
      {error ? <p className="mt-3 text-sm font-medium text-brand">{error}</p> : null}
      <p className="mt-4 text-lg font-semibold">{nights > 0 ? `${nights} đêm · ${formatVnd(total)}` : "Chọn ngày trả sau ngày nhận"}</p>
      <button type="button" onClick={hold} className="mt-3 h-12 w-full rounded-full bg-brand font-semibold text-on-brand">
        Giữ phòng trên máy này
      </button>
    </Shell>
  );
}
