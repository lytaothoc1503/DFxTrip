import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getHotel } from "@/lib/hotels";

const serviceBookingSchema = z
  .object({
    serviceType: z.enum(["hotel", "tour", "show"]),
    productId: z.string().trim().min(1).max(80),
    roomTier: z.number().int().min(0).max(2).optional(),
    nights: z.number().int().min(1).max(30).optional(),
    guests: z.number().int().min(1).max(20).optional(),
    adults: z.number().int().min(0).max(20).optional(),
    children: z.number().int().min(0).max(20).optional(),
    tableId: z.enum(["none", "4", "6", "8"]).optional(),
    showDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    checkIn: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    checkOut: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),
    guestName: z.string().trim().max(120).optional(),
    guestPhone: z.string().trim().max(40).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.serviceType === "hotel") {
      if (!getHotel(data.productId)) {
        ctx.addIssue({
          code: "custom",
          message: "Unknown hotel",
          path: ["productId"],
        });
      }
      if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
        ctx.addIssue({
          code: "custom",
          message: "checkOut must be after checkIn",
          path: ["checkOut"],
        });
      }
    }
    if (data.serviceType === "tour") {
      const adults = data.adults ?? 1;
      if (adults < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Tour requires at least one adult",
          path: ["adults"],
        });
      }
    }
    if (data.serviceType === "show") {
      const adults = data.adults ?? 0;
      const children = data.children ?? 0;
      if (adults + children < 1) {
        ctx.addIssue({
          code: "custom",
          message: "Show requires at least one guest",
          path: ["adults"],
        });
      }
      const seats =
        data.tableId && data.tableId !== "none" ? Number(data.tableId) : null;
      if (seats !== null && adults + children > seats) {
        ctx.addIssue({
          code: "custom",
          message: "Table capacity exceeded",
          path: ["tableId"],
        });
      }
    }
  });

export type ServiceBookingInput = z.infer<typeof serviceBookingSchema>;

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
  .validator((data: unknown) => serviceBookingSchema.parse(data))
  .handler(async ({ data, context }): Promise<SavedBooking | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    // Hotel unit price is resolved inside create_service_booking from hotel_rates.
    // Never forward a client-supplied basePrice.
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
        ${null}::bigint,
        ${data.guestName ?? null},
        ${data.guestPhone ?? null},
        ${context.userId},
        ${data.checkIn ?? null}::date,
        ${data.checkOut ?? null}::date
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
