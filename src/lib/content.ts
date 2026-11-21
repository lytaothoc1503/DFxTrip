/** Đánh giá & blog mẫu — đồng bộ từ DFxTrip. */

export type Review = {
  id: string;
  hotelId: string;
  name: string;
  from: string;
  date: string;
  score: number;
  trip: string;
  text: string;
};

const R = (
  hotelId: string,
  n: number,
  name: string,
  from: string,
  date: string,
  score: number,
  trip: string,
  text: string,
): Review => ({ id: `${hotelId}-${n}`, hotelId, name, from, date, score, trip, text });

export const REVIEWS: Review[] = [
  R("dalat-wonder", 1, "Minh Anh", "TP. Hồ Chí Minh", "10/2026", 9.6, "Cặp đôi", "View hồ Tuyền Lâm buổi sáng đẹp mê. Phòng sạch, spa rất thư giãn, nhân viên dễ thương."),
  R("dalat-wonder", 2, "Quốc Huy", "Hà Nội", "09/2026", 9.0, "Gia đình", "Khuôn viên rộng cho trẻ con chạy nhảy, bữa sáng phong phú. Đường lên hơi dốc nên nên đi taxi."),
  R("dalat-wonder", 3, "Thảo Vy", "Đà Nẵng", "08/2026", 9.4, "Bạn bè", "Hồ bơi nước ấm giữa trời lạnh Đà Lạt là điểm cộng lớn. Sẽ quay lại."),
  R("swiss-belresort", 1, "Hoàng Long", "Cần Thơ", "10/2026", 8.8, "Công tác", "Yên tĩnh, có sân golf và rừng thông. WiFi ổn định để làm việc."),
  R("swiss-belresort", 2, "Lan Chi", "TP. Hồ Chí Minh", "09/2026", 9.1, "Cặp đôi", "Phòng rộng, ban công nhìn ra hồ. Nhà hàng nấu món Âu ngon."),
  R("azurea-cam-ranh", 1, "Bảo Ngọc", "Hà Nội", "10/2026", 9.5, "Gia đình", "Bãi biển riêng cực đẹp, nước trong. Kids club giúp bố mẹ được nghỉ ngơi thật sự."),
  R("azurea-cam-ranh", 2, "Đức Trí", "Huế", "08/2026", 9.2, "Cặp đôi", "Villa có hồ bơi riêng, hoàng hôn đẹp. Đưa đón sân bay rất nhanh."),
  R("azurea-cam-ranh", 3, "Mai Phương", "Hải Phòng", "07/2026", 8.9, "Bạn bè", "Đồ ăn ngon, giá trong resort hơi cao nhưng xứng đáng."),
  R("banla-sapa", 1, "Tuấn Kiệt", "TP. Hồ Chí Minh", "10/2026", 9.3, "Cặp đôi", "Mở rèm là thấy ruộng bậc thang và mây. Lò sưởi trong phòng ấm cúng."),
  R("banla-sapa", 2, "Hà My", "Hà Nội", "09/2026", 8.7, "Bạn bè", "Gần trung tâm, đi bộ ra nhà thờ đá được. Nhân viên nhiệt tình chỉ đường trekking."),
  R("lava-dalat", 1, "Gia Bảo", "Biên Hòa", "10/2026", 8.6, "Bạn bè", "Thiết kế đẹp, check-in sống ảo khắp nơi. Giá hợp lý cho trung tâm Đà Lạt."),
  R("lava-dalat", 2, "Khánh Linh", "Vũng Tàu", "09/2026", 9.0, "Cặp đôi", "Phòng thơm, giường êm, gần chợ đêm. Rất đáng tiền."),
  R("metropole-hanoi", 1, "Thanh Hương", "TP. Hồ Chí Minh", "10/2026", 9.7, "Kỷ niệm", "Đẳng cấp và lịch sử. Trà chiều ở sảnh là trải nghiệm phải thử."),
  R("metropole-hanoi", 2, "Việt Hoàng", "Đà Nẵng", "08/2026", 9.4, "Công tác", "Ngay trung tâm, đi bộ ra Hồ Gươm. Dịch vụ chuẩn 5 sao, chu đáo từng chi tiết."),
];

export function reviewsFor(hotelId: string) {
  return REVIEWS.filter((r) => r.hotelId === hotelId);
}

/** Nhận xét kèm ảnh, cùng kiểu thẻ trên Wetripx: ảnh khách, tên, lời. */
export type GuestReview = {
  id: string;
  name: string;
  text: string;
  image: string;
  imageAlt: string;
  slugs: string[];
};

export const GUEST_REVIEWS: GuestReview[] = [
  {
    id: "minh-thao",
    name: "Minh Thảo",
    text: "Lần đầu lên Mù Cang Chải, đặt tour được lo từ A đến Z, hướng dẫn viên lại nhiệt tình. Đi đúng mùa lúa nên cảnh đẹp không tả nổi.",
    image: "/reviews/minh-thao.webp",
    imageAlt: "Minh Thảo trên ruộng bậc thang mùa lúa chín",
    slugs: ["tour-mu-cang-chai-2n1d", "tour-mu-cang-chai-3n2d"],
  },
  {
    id: "my-nguyen",
    name: "My Nguyễn",
    text: "Trước từng tự đi Mù Cang Chải, mệt vì lo ăn ở. Năm nay đi tour nhàn hơn hẳn, chỉ việc xách balo lên.",
    image: "/reviews/my-nguyen.webp",
    imageAlt: "My Nguyễn đứng giữa ruộng lúa vàng",
    slugs: ["tour-mu-cang-chai-2n1d", "tour-mu-cang-chai-3n2d"],
  },
  {
    id: "quynh-duong",
    name: "Quỳnh Dương",
    text: "Sợ nhất là đường đèo Hà Giang, mưa trơn dễ ngã. May có lái xe bản địa, tài xế quen đường, cảm giác đi yên tâm hẳn.",
    image: "/reviews/quynh-duong.webp",
    imageAlt: "Quỳnh Dương trên điểm dừng đường đèo",
    slugs: ["tour-ha-giang-3n2d-xe-may", "tour-ha-giang-o-to"],
  },
  {
    id: "an-nguyen",
    name: "An Nguyễn",
    text: "Vịnh Lan Hạ thật sự rất đẹp, nước trong xanh và bãi biển hoang sơ. Mình rất hài lòng với dịch vụ.",
    image: "/tours/tour-ha-long.webp",
    imageAlt: "Ảnh vịnh dùng kèm lời An Nguyễn, không phải ảnh chân dung",
    slugs: ["tour-cat-ba-2n1d"],
  },
  {
    id: "alice-nguyen",
    name: "Alice Nguyen",
    text: "Dịch vụ chu đáo, tư vấn kỹ càng, hướng dẫn viên nhiệt tình. Chuyến đi Mù Cang Chải thật sự đáng nhớ.",
    image: "/reviews/alice-nguyen.webp",
    imageAlt: "Alice Nguyen ngồi trên ruộng bậc thang lúc hoàng hôn",
    slugs: ["tour-mu-cang-chai-2n1d", "tour-mu-cang-chai-3n2d"],
  },
];

export function reviewsForTour(slug: string) {
  return GUEST_REVIEWS.filter((review) => review.slugs.includes(slug));
}


export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMin: number;
  image: string;
  author: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "kinh-nghiem-ha-giang-mua-hoa-tam-giac-mach",
    title: "Kinh nghiệm phượt Hà Giang mùa hoa tam giác mạch",
    excerpt: "Lịch trình 4 ngày 3 đêm, cung đường Mã Pí Lèng và những lưu ý an toàn khi đi xe máy.",
    category: "Kinh nghiệm",
    date: "02/11/2026",
    readMin: 7,
    image: "/tours/tour-ha-giang.webp",
    author: "VinaStay Team",
    body: [
      "Tháng 10 đến tháng 11 là mùa đẹp nhất của Hà Giang, khi hoa tam giác mạch nở hồng khắp các sườn đồi Đồng Văn, Mèo Vạc.",
      "Ngày 1 đi Hà Nội – Hà Giang, ngày 2 qua Quản Bạ – Yên Minh – Đồng Văn, ngày 3 chinh phục đèo Mã Pí Lèng và đi thuyền sông Nho Quế, ngày 4 quay về.",
      "Nên thuê xe số có phanh tốt, mang áo ấm, áo mưa và luôn đi chậm ở các khúc cua. Nếu không tự lái, hãy chọn tour có xe ôm bản địa.",
    ],
  },
  {
    slug: "ha-long-hay-lan-ha-chon-du-thuyen",
    title: "Hạ Long hay Lan Hạ: chọn du thuyền nào cho chuyến đi đầu tiên?",
    excerpt: "So sánh cảnh quan, mật độ tàu, hoạt động chèo kayak và mức giá để bạn chọn đúng.",
    category: "Cẩm nang",
    date: "28/10/2026",
    readMin: 5,
    image: "/tours/tour-ha-long.webp",
    author: "Ngọc Hân",
    body: [
      "Vịnh Hạ Long nổi tiếng với hang Sửng Sốt, đảo Ti Tốp, thuận tiện từ Hà Nội. Vịnh Lan Hạ yên tĩnh hơn, nước xanh hơn, ít tàu hơn.",
      "Nếu đi lần đầu và muốn thấy các điểm biểu tượng, hãy chọn Hạ Long. Nếu thích chèo kayak, tắm biển và không gian riêng, Lan Hạ là lựa chọn tốt.",
      "Du thuyền 2 ngày 1 đêm là đủ để ngắm hoàng hôn, câu mực đêm và tập thái cực quyền buổi sáng trên boong.",
    ],
  },
  {
    slug: "ninh-binh-1-ngay",
    title: "Ninh Bình 1 ngày: Tràng An, Hang Múa và ẩm thực dê núi",
    excerpt: "Lịch trình gọn cho người bận rộn, đi về trong ngày từ Hà Nội.",
    category: "Lịch trình",
    date: "20/10/2026",
    readMin: 4,
    image: "/tours/tour-ninh-binh.webp",
    author: "Minh Quân",
    body: [
      "Xuất phát sớm từ Hà Nội, khoảng 2 tiếng là tới Tràng An. Đi thuyền qua các hang động mất khoảng 2–3 tiếng.",
      "Buổi chiều leo 500 bậc Hang Múa để ngắm toàn cảnh Tam Cốc, đẹp nhất khi lúa chín vàng tháng 5–6.",
      "Đừng quên thử dê núi và cơm cháy – hai đặc sản nổi tiếng của vùng đất cố đô.",
    ],
  },
  {
    slug: "san-deal-khach-san-da-lat",
    title: "5 mẹo săn deal khách sạn Đà Lạt giá tốt",
    excerpt: "Đặt sớm, tránh cuối tuần và tận dụng ưu đãi thành viên để tiết kiệm đến 30%.",
    category: "Mẹo hay",
    date: "15/10/2026",
    readMin: 3,
    image: "/photos/hotel-1.webp",
    author: "VinaStay Team",
    body: [
      "Đặt trước 3–4 tuần thường có giá tốt hơn đặt sát ngày, đặc biệt dịp lễ.",
      "Ngày thường từ thứ 2 đến thứ 5 giá phòng thấp hơn cuối tuần 20–40%.",
      "Đăng nhập tài khoản VinaStay để nhận giảm thêm 10% và lưu khách sạn yêu thích.",
    ],
  },
  {
    slug: "sapa-mua-may",
    title: "Săn mây Sapa: thời điểm và địa điểm đẹp nhất",
    excerpt: "Fansipan, Ô Quy Hồ hay bản Cát Cát — đâu là nơi ngắm biển mây ấn tượng nhất?",
    category: "Cảm hứng",
    date: "08/10/2026",
    readMin: 5,
    image: "/photos/hotel-4.webp",
    author: "Thu Trang",
    body: [
      "Mùa săn mây Sapa kéo dài từ tháng 10 đến tháng 3 năm sau, đẹp nhất sau những ngày mưa.",
      "Đỉnh Fansipan bằng cáp treo cho biển mây ngoạn mục, còn đèo Ô Quy Hồ thích hợp ngắm hoàng hôn.",
      "Mang áo khoác dày, giày chống trượt và kiểm tra dự báo thời tiết trước khi đi.",
    ],
  },
  {
    slug: "han-quoc-mua-thu",
    title: "Hàn Quốc mùa thu: cẩm nang xin visa và lịch trình 5 ngày",
    excerpt: "Seoul – Nami – Everland, chuẩn bị hồ sơ visa và chi phí tham khảo.",
    category: "Quốc tế",
    date: "01/10/2026",
    readMin: 8,
    image: "/tours/tour-han-quoc.webp",
    author: "Ngọc Hân",
    body: [
      "Lá đỏ Hàn Quốc đẹp nhất từ giữa tháng 10 đến đầu tháng 11, trong đó đảo Nami và núi Seorak là điểm nổi bật.",
      "Hồ sơ visa cần hộ chiếu, ảnh, sao kê ngân hàng và giấy xác nhận công việc. Nên nộp trước 3–4 tuần.",
      "Lịch trình gợi ý: 2 ngày Seoul, 1 ngày Nami – Petite France, 1 ngày Everland, 1 ngày mua sắm Myeongdong.",
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
