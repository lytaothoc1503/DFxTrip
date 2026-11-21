import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type ServiceBookingInput = {
  serviceType: "hotel" | "tour" | "show";
  productId: string;
  roomTier?: number;
  nights?: number;
  guests?: number;
  adults?: number;
  children?: number;
  tableId?: string;
  showDate?: string;
  basePrice?: number;
  guestName?: string;
  guestPhone?: string;
};

export type SavedBooking = {
  code: string;
  total: number;
  service_type: string;
};

export type AccountBooking = {
  code: string;
  service_type: string;
  product_id: string;
  total: number;
  status: string;
  created_at: string;
};

export const recordServiceBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: ServiceBookingInput) => data)
  .handler(async ({ data, context }): Promise<SavedBooking | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<SavedBooking>`
      select code, total, service_type
      from create_service_booking(
        ${data.serviceType},
        ${data.productId},
        ${data.roomTier ?? 0},
        ${data.nights ?? 1},
        ${data.guests ?? 2},
        ${data.adults ?? null},
        ${data.children ?? 0},
        ${data.tableId ?? "none"},
        ${data.showDate ?? null}::date,
        ${data.basePrice ?? null},
        ${data.guestName ?? null},
        ${data.guestPhone ?? null},
        ${context.userId}
      )
    `;
    return rows[0] ?? null;
  });

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AccountBooking[]> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    return sql<AccountBooking>`
      select code, service_type, product_id, total, status, created_at::text as created_at
      from service_bookings
      where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
  });
