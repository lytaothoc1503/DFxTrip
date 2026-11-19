/** Thương hiệu & liên hệ VinaStay — không hardcode số trong component. */

export const BRAND = {
  name: "VinaStay",
  shortName: "V",
  tagline: "Khám phá. Đặt chỗ. Trải nghiệm.",
  discountLabel: "Ưu đãi VinaStay 10%",
  /** Giảm 10% trên tổng tiền phòng (khớp DFxTrip / tài liệu). */
  discountRate: 0.1,
  phoneDisplay: "0909 686 868",
  phoneTel: "0909686868",
  zaloUrl: "https://zalo.me/0909686868",
  address: "Phú Quốc, Kiên Giang, Việt Nam",
  supportNote: "Hỗ trợ 24/7 qua Zalo hoặc điện thoại. Giữ chỗ trên máy chưa phải xác nhận chính thức.",
} as const;

export function phoneHref() {
  return `tel:${BRAND.phoneTel}`;
}
