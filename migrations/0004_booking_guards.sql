-- Server-side hotel rates + booking input guards.
-- Hotel totals must come from this catalog (not client p_base_price).
-- Guest/nights bounds, show capacity, and stronger booking codes.

create table if not exists public.hotel_rates (
  id text primary key,
  base_price bigint not null check (base_price > 0)
);

insert into public.hotel_rates (id, base_price) values
  ('dalat-wonder', 1250000),
  ('swiss-belresort', 1450000),
  ('azurea-cam-ranh', 2450000),
  ('banla-sapa', 1290000),
  ('lava-dalat', 1150000),
  ('metropole-hanoi', 1890000)
on conflict (id) do update set base_price = excluded.base_price;

drop function if exists public.create_service_booking(
  text, text, integer, integer, integer, integer, integer, text, date, bigint, text, text, text
);

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
  p_user_id text default null,
  p_check_in date default null,
  p_check_out date default null
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
  v_hotel_price bigint;
  v_adults integer;
  v_children integer;
  v_guests integer;
  v_table_seats integer;
begin
  if p_service_type = 'hotel' then
    select base_price into v_hotel_price
    from public.hotel_rates
    where id = p_product_id
    limit 1;
    if v_hotel_price is null then
      raise exception 'unknown hotel %', p_product_id;
    end if;
    if p_nights is null or p_nights < 1 or p_nights > 30 then
      raise exception 'hotel booking requires nights between 1 and 30';
    end if;
    v_guests := coalesce(p_guests, 2);
    if v_guests < 1 or v_guests > 20 then
      raise exception 'hotel booking requires guests between 1 and 20';
    end if;
    if p_room_tier is null or p_room_tier < 0 or p_room_tier > 2 then
      raise exception 'hotel booking requires room_tier 0..2';
    end if;
    if p_check_in is not null and p_check_out is not null and p_check_out <= p_check_in then
      raise exception 'hotel check_out must be after check_in';
    end if;
    if p_check_in is not null and p_check_out is not null
       and (p_check_out - p_check_in) <> p_nights then
      raise exception 'hotel nights must match check_in/check_out range';
    end if;
    v_tier_mult := case p_room_tier
      when 0 then 1
      when 1 then 1.28
      when 2 then 1.8
      else 1
    end;
    v_nightly := (round((v_hotel_price * v_tier_mult) / 10000.0) * 10000)::bigint;
    v_total := round(v_nightly * p_nights * 0.9)::bigint;
    v_code := 'P-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);

    insert into public.service_bookings (
      user_id, code, service_type, product_id, room_name, check_in, check_out,
      nights, guests, total, status, guest_name, guest_phone
    ) values (
      p_user_id,
      v_code,
      'hotel',
      p_product_id,
      case p_room_tier when 1 then 'Superior Room' when 2 then 'Signature Suite' else 'Deluxe Room' end,
      p_check_in,
      p_check_out,
      p_nights,
      v_guests,
      v_total,
      'hold',
      p_guest_name,
      p_guest_phone
    )
    returning * into v_row;
    return v_row;

  elsif p_service_type = 'tour' then
    v_adults := coalesce(p_adults, 1);
    v_children := coalesce(p_children, 0);
    if v_adults < 1 or v_adults > 20 then
      raise exception 'tour booking requires adults between 1 and 20';
    end if;
    if v_children < 0 or v_children > 20 then
      raise exception 'tour booking requires children between 0 and 20';
    end if;
    select price::bigint into v_adult_price
    from public.tours
    where code = p_product_id
    limit 1;
    if v_adult_price is null or v_adult_price <= 0 then
      raise exception 'unknown tour %', p_product_id;
    end if;
    v_total := (v_adult_price * (v_adults + v_children))::bigint;
    v_code := 'T-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);

    insert into public.service_bookings (
      user_id, code, service_type, product_id, guests, adults, children, total, status, guest_name, guest_phone
    ) values (
      p_user_id, v_code, 'tour', p_product_id,
      v_adults + v_children,
      v_adults, v_children,
      v_total, 'hold', p_guest_name, p_guest_phone
    )
    returning * into v_row;
    return v_row;

  elsif p_service_type = 'show' then
    if p_show_date is null then
      raise exception 'show booking requires p_show_date';
    end if;
    v_adults := coalesce(p_adults, 0);
    v_children := coalesce(p_children, 0);
    if v_adults < 0 or v_adults > 20 or v_children < 0 or v_children > 20 then
      raise exception 'show booking guest counts must be between 0 and 20';
    end if;
    if v_adults + v_children < 1 then
      raise exception 'show booking requires at least one guest';
    end if;
    v_table_seats := case coalesce(p_table_id, 'none')
      when '4' then 4
      when '6' then 6
      when '8' then 8
      when 'none' then null
      else -1
    end;
    if v_table_seats = -1 then
      raise exception 'invalid table_id %', p_table_id;
    end if;
    if v_table_seats is not null and v_adults + v_children > v_table_seats then
      raise exception 'table capacity exceeded';
    end if;
    if extract(dow from p_show_date) in (5, 6) then
      v_adult_price := 1300000;
    else
      v_adult_price := 1200000;
    end if;
    v_kid_price := round(v_adult_price * 0.7)::bigint;
    v_table_fee := case coalesce(p_table_id, 'none')
      when '4' then 800000
      when '6' then 1200000
      when '8' then 1600000
      else 0
    end;
    v_total := (v_adult_price * v_adults + v_kid_price * v_children + v_table_fee)::bigint;
    v_code := 'SB-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);

    insert into public.service_bookings (
      user_id, code, service_type, product_id, check_in, guests, adults, children, table_id, total, status, guest_name, guest_phone
    ) values (
      p_user_id, v_code, 'show', coalesce(p_product_id, 'symphony-of-the-sea'),
      p_show_date,
      v_adults + v_children,
      v_adults, v_children,
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
