-- Đặt phòng, tour và vé show. Giá khớp src/lib/hotels.ts (giảm 10%) và src/lib/services.ts.
-- user_id là text để khớp id của Better Auth, không dùng uuid.

create table if not exists public.service_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id text references "user" ("id") on delete set null,
  code text not null,
  service_type text not null check (service_type in ('hotel', 'tour', 'show')),
  product_id text not null,
  room_name text,
  check_in date,
  check_out date,
  nights integer,
  guests integer not null default 1,
  adults integer,
  children integer,
  table_id text,
  total bigint not null,
  status text not null default 'hold',
  guest_name text,
  guest_phone text,
  created_at timestamptz not null default now()
);

create index if not exists service_bookings_user_idx
  on public.service_bookings (user_id, created_at desc);

create or replace function public.create_service_booking(
  p_service_type text,
  p_product_id text,
  p_room_tier integer default 0,
  p_nights integer default 1,
  p_guests integer default 2,
  p_adults integer default null,
  p_children integer default 0,
  p_table_id text default 'none',
  p_show_date date default null,
  p_base_price bigint default null,
  p_guest_name text default null,
  p_guest_phone text default null,
  p_user_id text default null
)
returns public.service_bookings
language plpgsql
as $$
declare
  v_tier_mult numeric;
  v_nightly bigint;
  v_total bigint;
  v_code text;
  v_row public.service_bookings;
  v_table_fee bigint := 0;
  v_adult_price bigint;
  v_kid_price bigint;
begin
  if p_service_type = 'hotel' then
    if p_base_price is null or p_base_price <= 0 then
      raise exception 'hotel booking requires p_base_price';
    end if;
    if p_nights is null or p_nights < 1 then
      raise exception 'hotel booking requires nights >= 1';
    end if;
    v_tier_mult := case p_room_tier
      when 0 then 1
      when 1 then 1.28
      when 2 then 1.8
      else 1
    end;
    v_nightly := (round((p_base_price * v_tier_mult) / 10000.0) * 10000)::bigint;
    v_total := round(v_nightly * p_nights * 0.9)::bigint;
    v_code := 'P-' || right(extract(epoch from now())::bigint::text, 6);

    insert into public.service_bookings (
      user_id, code, service_type, product_id, room_name, nights, guests, total, status, guest_name, guest_phone
    ) values (
      p_user_id,
      v_code,
      'hotel',
      p_product_id,
      case p_room_tier when 1 then 'Superior Room' when 2 then 'Signature Suite' else 'Deluxe Room' end,
      p_nights,
      coalesce(p_guests, 2),
      v_total,
      'hold',
      p_guest_name,
      p_guest_phone
    )
    returning * into v_row;
    return v_row;

  elsif p_service_type = 'tour' then
    if p_base_price is null or p_base_price <= 0 then
      raise exception 'tour booking requires p_base_price';
    end if;
    v_kid_price := (round((p_base_price * 0.75) / 1000.0) * 1000)::bigint;
    v_total := (p_base_price * coalesce(p_adults, 1) + v_kid_price * coalesce(p_children, 0))::bigint;
    v_code := 'T-' || right(extract(epoch from now())::bigint::text, 6);

    insert into public.service_bookings (
      user_id, code, service_type, product_id, guests, adults, children, total, status, guest_name, guest_phone
    ) values (
      p_user_id, v_code, 'tour', p_product_id,
      coalesce(p_adults, 1) + coalesce(p_children, 0),
      coalesce(p_adults, 1), coalesce(p_children, 0),
      v_total, 'hold', p_guest_name, p_guest_phone
    )
    returning * into v_row;
    return v_row;

  elsif p_service_type = 'show' then
    if p_show_date is null then
      raise exception 'show booking requires p_show_date';
    end if;
    if extract(dow from p_show_date) in (5, 6) then
      v_adult_price := 1300000;
    else
      v_adult_price := 1200000;
    end if;
    v_kid_price := round(v_adult_price * 0.7)::bigint;
    v_table_fee := case p_table_id
      when '4' then 800000
      when '6' then 1200000
      when '8' then 1600000
      else 0
    end;
    v_total := (v_adult_price * coalesce(p_adults, 0) + v_kid_price * coalesce(p_children, 0) + v_table_fee)::bigint;
    v_code := 'SB-' || right(extract(epoch from now())::bigint::text, 6);

    insert into public.service_bookings (
      user_id, code, service_type, product_id, check_in, guests, adults, children, table_id, total, status, guest_name, guest_phone
    ) values (
      p_user_id, v_code, 'show', coalesce(p_product_id, 'symphony-of-the-sea'),
      p_show_date,
      coalesce(p_adults, 0) + coalesce(p_children, 0),
      coalesce(p_adults, 0), coalesce(p_children, 0),
      coalesce(p_table_id, 'none'),
      v_total, 'hold', p_guest_name, p_guest_phone
    )
    returning * into v_row;
    return v_row;

  else
    raise exception 'unsupported service_type: %', p_service_type;
  end if;
end;
$$;
