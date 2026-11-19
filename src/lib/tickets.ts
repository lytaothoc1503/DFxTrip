/** @deprecated Dùng `@/lib/services` — giữ re-export để không gãy import cũ. */
export {
  TABLES,
  type TableId,
  type Hold,
  SHOW_SCHEDULE,
  isWeekend,
  adultPrice,
  kidPrice,
  ticketTotal,
  tableById,
  quote,
  formatVnd,
  loadHolds,
  saveHold,
  removeHold,
} from "./services.ts";
