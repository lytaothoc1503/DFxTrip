-- Đồng bộ giá đặt phòng với frontend (src/lib/hotels.ts + brand.discountRate 10%).
-- Chạy trên Supabase/Postgres khi bật booking server-side.
-- Giữ chỗ trên máy khách vẫn dùng localStorage; RPC này sẵn sàng khi nối cloud.

CREATE TABLE IF NOT EXISTS public.service_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  code text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('hotel', 'tour', 'show')),
  product_id text NOT NULL,
  room_name text,
  check_in date,
  check_out date,
  nights integer,
  guests integer NOT NULL DEFAULT 1,
  adults integer,
  children integer,
  table_id text,
  total bigint NOT NULL,
  status text NOT NULL DEFAULT 'hold',
  guest_name text,
  guest_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_bookings_user_idx
  ON public.service_bookings (user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.create_service_booking(
  p_service_type text,
  p_product_id text,
  p_room_tier integer DEFAULT 0,
  p_nights integer DEFAULT 1,
  p_guests integer DEFAULT 2,
  p_adults integer DEFAULT NULL,
  p_children integer DEFAULT 0,
  p_table_id text DEFAULT 'none',
  p_show_date date DEFAULT NULL,
  p_base_price bigint DEFAULT NULL,
  p_guest_name text DEFAULT NULL,
  p_guest_phone text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS public.service_bookings
LANGUAGE plpgsql
AS $$
DECLARE
  v_tier_mult numeric;
  v_nightly bigint;
  v_total bigint;
  v_code text;
  v_row public.service_bookings;
  v_table_fee bigint := 0;
  v_adult_price bigint;
  v_kid_price bigint;
BEGIN
  IF p_service_type = 'hotel' THEN
    IF p_base_price IS NULL OR p_base_price <= 0 THEN
      RAISE EXCEPTION 'hotel booking requires p_base_price';
    END IF;
    IF p_nights IS NULL OR p_nights < 1 THEN
      RAISE EXCEPTION 'hotel booking requires nights >= 1';
    END IF;
    v_tier_mult := CASE p_room_tier
      WHEN 0 THEN 1
      WHEN 1 THEN 1.28
      WHEN 2 THEN 1.8
      ELSE 1
    END;
    -- Làm tròn hạng phòng tới 10.000đ
    v_nightly := (ROUND((p_base_price * v_tier_mult) / 10000.0) * 10000)::bigint;
    -- Tổng trừ 10% ưu đãi VinaStay
    v_total := ROUND(v_nightly * p_nights * 0.9)::bigint;
    v_code := 'P-' || RIGHT(EXTRACT(EPOCH FROM now())::bigint::text, 6);

    INSERT INTO public.service_bookings (
      user_id, code, service_type, product_id, room_name, nights, guests, total, status, guest_name, guest_phone
    ) VALUES (
      p_user_id,
      v_code,
      'hotel',
      p_product_id,
      CASE p_room_tier WHEN 1 THEN 'Superior Room' WHEN 2 THEN 'Signature Suite' ELSE 'Deluxe Room' END,
      p_nights,
      COALESCE(p_guests, 2),
      v_total,
      'hold',
      p_guest_name,
      p_guest_phone
    )
    RETURNING * INTO v_row;
    RETURN v_row;

  ELSIF p_service_type = 'tour' THEN
    IF p_base_price IS NULL OR p_base_price <= 0 THEN
      RAISE EXCEPTION 'tour booking requires p_base_price';
    END IF;
    -- Trẻ = 75% giá NL, làm tròn 1.000đ
    v_kid_price := (ROUND((p_base_price * 0.75) / 1000.0) * 1000)::bigint;
    v_total := (p_base_price * COALESCE(p_adults, 1) + v_kid_price * COALESCE(p_children, 0))::bigint;
    v_code := 'T-' || RIGHT(EXTRACT(EPOCH FROM now())::bigint::text, 6);

    INSERT INTO public.service_bookings (
      user_id, code, service_type, product_id, guests, adults, children, total, status, guest_name, guest_phone
    ) VALUES (
      p_user_id, v_code, 'tour', p_product_id,
      COALESCE(p_adults, 1) + COALESCE(p_children, 0),
      COALESCE(p_adults, 1), COALESCE(p_children, 0),
      v_total, 'hold', p_guest_name, p_guest_phone
    )
    RETURNING * INTO v_row;
    RETURN v_row;

  ELSIF p_service_type = 'show' THEN
    IF p_show_date IS NULL THEN
      RAISE EXCEPTION 'show booking requires p_show_date';
    END IF;
    -- CN–T5: 1.200.000; T6–T7: 1.300.000. Trẻ 70%.
    IF EXTRACT(DOW FROM p_show_date) IN (5, 6) THEN
      v_adult_price := 1300000;
    ELSE
      v_adult_price := 1200000;
    END IF;
    v_kid_price := ROUND(v_adult_price * 0.7)::bigint;
    v_table_fee := CASE p_table_id
      WHEN '4' THEN 800000
      WHEN '6' THEN 1200000
      WHEN '8' THEN 1600000
      ELSE 0
    END;
    v_total := (v_adult_price * COALESCE(p_adults, 0) + v_kid_price * COALESCE(p_children, 0) + v_table_fee)::bigint;
    v_code := 'SB-' || RIGHT(EXTRACT(EPOCH FROM now())::bigint::text, 6);

    INSERT INTO public.service_bookings (
      user_id, code, service_type, product_id, check_in, guests, adults, children, table_id, total, status, guest_name, guest_phone
    ) VALUES (
      p_user_id, v_code, 'show', COALESCE(p_product_id, 'symphony-of-the-sea'),
      p_show_date,
      COALESCE(p_adults, 0) + COALESCE(p_children, 0),
      COALESCE(p_adults, 0), COALESCE(p_children, 0),
      COALESCE(p_table_id, 'none'),
      v_total, 'hold', p_guest_name, p_guest_phone
    )
    RETURNING * INTO v_row;
    RETURN v_row;

  ELSE
    RAISE EXCEPTION 'unsupported service_type: %', p_service_type;
  END IF;
END;
$$;
