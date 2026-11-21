import { HOTELS } from "@/lib/hotels";

const TOUR_SLUGS = [
  "tour-nhat-ban-dong-6n5d",
  "tour-nhat-ban-tet-6n5d",
  "tour-ta-xua-2n1d",
  "tour-ha-giang-o-to",
  "tour-sapa-dong-3n2d",
  "tour-da-lat-tet-3n2d",
  "tour-ha-giang-3n2d-xe-may",
  "tour-van-nam-6n5d",
  "combo-sapa-3n2d-cabin",
  "tour-mu-cang-chai-3n2d",
  "tour-mu-cang-chai-2n1d",
  "combo-sapa-ha-khau-3n2d",
  "tour-ha-khau-1-ngay",
  "tour-cat-ba-2n1d",
  "xe-ha-noi-cat-ba-cap-treo",
];

/** Trang được lập chỉ mục. Không gồm tài khoản, yêu thích, giữ chỗ hay thanh toán. */
export const PUBLIC_PATHS = [
  "/",
  "/tour",
  "/khach-san",
  "/ve",
  ...HOTELS.map((hotel) => `/khach-san/${hotel.id}`),
  ...TOUR_SLUGS.map((slug) => `/tour/${slug}`),
];
