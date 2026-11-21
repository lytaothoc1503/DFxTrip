-- Danh mục tour công khai. Giá tour khi ghi booking lấy từ bảng này, không tin giá client gửi lên.
-- Không dùng pgcrypto. Không gắn tên hãng đối thủ.

create table if not exists public.tours (
  slug text primary key,
  code text not null unique,
  name text not null,
  short text not null,
  long_parts text[] not null,
  duration text not null,
  transport text not null,
  departure text not null,
  origin text not null,
  destination text not null,
  price integer not null check (price > 0),
  old_price integer not null check (old_price > 0),
  itinerary text[] not null,
  included text not null,
  excluded text not null,
  featured boolean not null default false,
  kind text not null check (kind in ('tour', 'ticket')),
  image text not null,
  image_alt text not null,
  slots text[],
  season text not null default '',
  groups text[] not null default '{}',
  sort_order integer not null
);

create index if not exists tours_sort_idx on public.tours (sort_order);

insert into public.tours (
  slug, code, name, short, long_parts, duration, transport, departure, origin, destination,
  price, old_price, itinerary, included, excluded, featured, kind, image, image_alt, slots, season, groups, sort_order
) values
(
  'tour-nhat-ban-dong-6n5d',
  'JP-DONG',
  'Nhật Bản 6 ngày 5 đêm — Tokyo, Phú Sĩ, Kyoto, Osaka',
  'Lịch đông từ cuối tháng 11/2026 đến giữa tháng 1/2027. Đèn thành phố, không phải mùa hoa anh đào.',
  ARRAY[
    $c$Lịch DFxTrip cho mùa đông, trước Tết Đinh Mùi. Cửa sổ khởi hành dự kiến từ 26/11/2026 đến 15/1/2027. Ngày bay chốt khi giữ chỗ được xác nhận, trang này không giữ chỗ máy bay.$c$,
    $c$Hành trình: Tokyo, khu hồ Kawaguchi nhìn Phú Sĩ nếu trời quang, Kyoto và Osaka. Tháng 12 còn đèn illuminations. Không hứa tuyết ở Tokyo, không hứa nhìn thấy đỉnh Phú Sĩ, và không bán mùa hoa anh đào — hoa thường nở từ cuối tháng 3.$c$,
    $c$Giá niêm yết 35.900.000đ mỗi khách, tham chiếu mặt bằng tour 6 ngày 5 đêm cuối năm 2026, gồm vé máy bay phổ thông khứ hồi từ Hà Nội. Hãng bay và khách sạn 3–4 sao chốt lúc xác nhận. Visa Nhật không gồm và không được bảo đảm. Giữ chỗ chưa phải vé đã xuất.$c$
  ]::text[],
  '6 ngày 5 đêm',
  'Máy bay và xe đoàn',
  'Dự kiến 26/11/2026 – 15/1/2027',
  'Hà Nội',
  'Tokyo, Phú Sĩ, Kyoto, Osaka',
  35900000,
  35900000,
  ARRAY[
    $c$Ngày 1: Bay từ Hà Nội, đến Osaka hoặc Tokyo tùy vé được chốt, nhận phòng.$c$,
    $c$Ngày 2–3: Osaka và Kyoto. Đền, phố mùa đông. Đèn nếu lịch còn chiếu.$c$,
    $c$Ngày 4: Đi khu Kawaguchi. Ngắm Phú Sĩ khi trời mở. Một đêm gần hồ nếu khách sạn còn phòng đúng hạng.$c$,
    $c$Ngày 5: Tokyo. Tự do buổi tối, không có show bắt buộc.$c$,
    $c$Ngày 6: Ra sân bay, bay về Hà Nội.$c$
  ]::text[],
  'Vé máy bay phổ thông khứ hồi từ Hà Nội, khách sạn, xe theo đoàn, một số bữa, hướng dẫn tiếng Việt.',
  'Visa Nhật, tip, chi tiêu riêng, phụ thu phòng đơn, hành lý ký gửi vượt mức, thuế nếu xuất hóa đơn.',
  true,
  'tour',
  '/tours/tour-nhat-ban.webp',
  'Ảnh minh họa phố Nhật về đêm mùa đông',
  null,
  'Đông 2026 – trước Tết',
  ARRAY['world', 'tet']::text[],
  1
),
(
  'tour-nhat-ban-tet-6n5d',
  'JP-TET',
  'Nhật Bản 6 ngày 5 đêm dịp Tết Đinh Mùi',
  'Hai mốc dự kiến: 29/1/2027 trước Tết, hoặc 10/2/2027 sau mùng 3. Mùng 1 Tết là 6/2/2027.',
  ARRAY[
    $c$Đây là lịch đi Tết Việt Nam, không phải lễ năm mới Nhật Bản ngày 1/1. Mùng 1 Tết Đinh Mùi là thứ Bảy 6/2/2027. Mốc đang niêm yết: khởi hành 29/1/2027 hoặc 10/2/2027. Chưa khóa chỗ tàu bay.$c$,
    $c$Cuối tháng 1, nhiều cụm đèn mùa đông đã hạ dần. Tour lấy thành phố mùa đông và không khí năm mới, không hứa hoa anh đào. Đền ngày mùng 1–3 dương lịch rất đông; lịch này không rơi vào những ngày đó.$c$,
    $c$Giá niêm yết 38.900.000đ mỗi khách vì vé bay sát Tết thường cao hơn lịch tháng 12. Gồm vé phổ thông khứ hồi từ Hà Nội, khách sạn, xe đoàn và một số bữa. Visa không gồm. Giữ chỗ trên máy chưa phải xác nhận.$c$
  ]::text[],
  '6 ngày 5 đêm',
  'Máy bay và xe đoàn',
  'Dự kiến 29/1/2027 hoặc 10/2/2027',
  'Hà Nội',
  'Osaka, Kyoto, Nara, Tokyo',
  38900000,
  38900000,
  ARRAY[
    $c$Ngày 1: Bay Hà Nội – Osaka, nhận phòng.$c$,
    $c$Ngày 2: Osaka. Buổi tối tự do.$c$,
    $c$Ngày 3: Kyoto.$c$,
    $c$Ngày 4: Nara trong ngày, tối về Kyoto hoặc đi Tokyo tùy vé.$c$,
    $c$Ngày 5: Tokyo.$c$,
    $c$Ngày 6: Bay về Hà Nội.$c$
  ]::text[],
  'Vé máy bay phổ thông khứ hồi từ Hà Nội, khách sạn, xe theo đoàn, một số bữa, hướng dẫn tiếng Việt.',
  'Visa Nhật, tip, chi tiêu riêng, phụ thu phòng đơn, ship quà, thuế nếu xuất hóa đơn.',
  false,
  'tour',
  '/tours/tour-nhat-ban-tet.webp',
  'Ảnh minh họa sân chùa mùa đông',
  null,
  'Tết Đinh Mùi 2027',
  ARRAY['world', 'tet']::text[],
  2
),
(
  'tour-ta-xua-2n1d',
  'TX07',
  'Tà Xùa 2 ngày 1 đêm',
  'Săn mây sống núi, khởi hành thứ 7 từ Hà Nội. Không hẹn có mây.',
  ARRAY[
    $c$Tour cuối tuần từ Hà Nội lên Tà Xùa. Trang lịch ghi thứ 7 hàng tuần. Đón khoảng 05:45–06:00 tại Nhà hát Lớn, Big C Thăng Long và cổng 1 Trung tâm Hội nghị Quốc gia.$c$,
    $c$Ngày 1 qua đồi chè Thanh Sơn, ăn trưa Bắc Yên, chiều thảo nguyên, Mỏm Cá Heo và Cây cô đơn, tối homestay. Ngày 2 dậy sớm lên Sống lưng khủng long, rồi Đỉnh Gió, về Hà Nội khoảng 18:00–19:00. Mây phụ thuộc trời. Tháng 11 đến Tết rét khoảng 10–24°C.$c$,
    $c$Homestay là phòng tập thể hoặc phòng riêng tùy đoàn, chưa tách phụ thu trên trang này. Tự mang giấy tờ, áo ấm và đồ dùng cá nhân. Giữ chỗ chưa phải xác nhận.$c$
  ]::text[],
  '2 ngày 1 đêm',
  'Ô tô',
  'Thứ 7 hàng tuần',
  'Hà Nội',
  'Tà Xùa',
  1790000,
  2050000,
  ARRAY[
    $c$Ngày 1: Đón Hà Nội, đồi chè Thanh Sơn, trưa Bắc Yên, thảo nguyên Tà Xùa, tối homestay.$c$,
    $c$Ngày 2: Sáng sớm Sống lưng khủng long, Đỉnh Gió, trưa rồi về Hà Nội cuối giờ chiều.$c$
  ]::text[],
  'Xe, một đêm homestay, ba bữa chính, một bữa sáng, vé điểm trong lịch, hướng dẫn, nước trên xe, bảo hiểm.',
  'Đồ uống trong bữa, tip, xe ôm phát sinh, VAT nếu xuất hóa đơn.',
  true,
  'tour',
  '/tours/tour-ta-xua.webp',
  'Ảnh minh họa sống núi trong mây, gợi Tà Xùa',
  null,
  'Mây mùa đông, không cam kết',
  ARRAY['north', 'tet']::text[],
  3
),
(
  'tour-ha-giang-o-to',
  'HGOT',
  'Hà Giang bằng ô tô — Đồng Văn, Mã Pí Lèng',
  'Hai ngày trên cao nguyên. Xe giường nằm Hà Nội – Hà Giang không nằm trong giá.',
  ARRAY[
    $c$Giá 2.380.000đ là vòng Đồng Văn bằng ô tô: Quản Bạ, Lũng Cú, phố cổ Đồng Văn, đèo Mã Pí Lèng, Mèo Vạc. Ngủ một đêm khách sạn khoảng 2 sao ở Đồng Văn, hai người một phòng. Phòng đơn phụ thu 250.000đ một đêm.$c$,
    $c$Xe giường nằm khứ hồi Hà Nội – Hà Giang không gồm. Tự mua, thường khoảng 300.000–400.000đ mỗi chiều, nên lịch thực tế là đêm đi, hai ngày chơi, đêm về. Trang không gọi đây là ba đêm khách sạn.$c$,
    $c$Tam giác mạch thường nở khoảng tháng 11 đến giữa tháng 12, ven đường, không phải vé đã mua. Vé thuyền sông Nho Quế không gồm. Từ giữa tháng 12 đến Tết vẫn đi được, trời rét, hoa không còn đúng mùa.$c$
  ]::text[],
  '2 ngày ở Hà Giang, 2 đêm xe tự túc',
  'Ô tô trên cao nguyên',
  'Hàng ngày',
  'Hà Nội',
  'Hà Giang',
  2380000,
  2690000,
  ARRAY[
    $c$Đêm đi: Tự bắt xe giường nằm Hà Nội – Hà Giang.$c$,
    $c$Ngày 1: Quản Bạ, nhà Pao, nhà Vương, cột cờ Lũng Cú, tối Đồng Văn.$c$,
    $c$Ngày 2: Đèo Mã Pí Lèng, Mèo Vạc, về Hà Giang. Đêm tự bắt xe về Hà Nội.$c$
  ]::text[],
  'Ô tô trên cao nguyên, một đêm khách sạn Đồng Văn, bữa theo lịch, vé cổng một lượt các điểm đã ghi, hướng dẫn, bảo hiểm.',
  'Xe giường nằm khứ hồi, vé thuyền Nho Quế, phụ thu phòng đơn, tip, VAT.',
  true,
  'tour',
  '/tours/tour-ha-giang.webp',
  'Núi đá Hà Giang',
  null,
  'Tam giác mạch khoảng tháng 11–12',
  ARRAY['north', 'tet']::text[],
  4
),
(
  'tour-sapa-dong-3n2d',
  'SAPA-DONG',
  'Sapa 3 ngày 2 đêm mùa đông',
  'Xe cabin, hai đêm khách sạn 3 sao và một lượt cáp Fansipan. Không cam kết có tuyết.',
  ARRAY[
    $c$Lịch DFxTrip cho tháng 12/2026 đến mùng 5 Tết. Từ Hà Nội, xe cabin khứ hồi, hai đêm khách sạn 3 sao trung tâm, ăn sáng, một lượt cáp Fansipan. Tên khách sạn chốt khi xác nhận.$c$,
    $c$Đỉnh Fansipan tháng 12 và tháng 1 đôi khi có băng. Nhiều ngày chỉ rét và sương. Trang không bán tour săn tuyết và không hoàn tiền nếu không có băng.$c$,
    $c$Giá niêm yết 2.890.000đ mỗi khách ở phòng đôi. Không gồm Hà Khẩu, không gồm vé bản Cát Cát, không gồm các bữa trưa tối. Giữ chỗ chưa phải phòng đã giữ.$c$
  ]::text[],
  '3 ngày 2 đêm',
  'Xe cabin',
  'Hàng ngày, tháng 12/2026 – mùng 5 Tết',
  'Hà Nội',
  'Sapa',
  2890000,
  2890000,
  ARRAY[
    $c$Ngày 1: Hà Nội đi Sapa bằng xe cabin, nhận phòng.$c$,
    $c$Ngày 2: Một lượt cáp Fansipan. Phần còn lại của ngày tự do.$c$,
    $c$Ngày 3: Ăn sáng, xe cabin về Hà Nội.$c$
  ]::text[],
  'Xe cabin khứ hồi, hai đêm khách sạn 3 sao, ăn sáng, một lượt cáp Fansipan.',
  'Vé bản, Hà Khẩu, bữa trưa tối, phụ thu phòng đơn, tip.',
  false,
  'tour',
  '/tours/tour-sapa-dong.webp',
  'Ảnh minh họa Sapa mùa sương, không phải ảnh tuyết',
  null,
  'Đông 2026 – Tết 2027',
  ARRAY['north', 'tet']::text[],
  5
),
(
  'tour-da-lat-tet-3n2d',
  'DL-TET',
  'Đà Lạt 3 ngày 2 đêm mùa hoa Tết',
  'Tự tới Đà Lạt. Giá gồm hai đêm và xe trong thành phố. Mai anh đào không hẹn ngày nở.',
  ARRAY[
    $c$Gói cho người đã có cách tới Đà Lạt. Không gồm vé máy bay hay tàu. Hai đêm khách sạn 3 sao, phòng đôi, và xe tham quan trong ngày: hồ, đồi thông, chợ đêm. Tên khách sạn chốt khi xác nhận, không gắn với một khách sạn cố định trên trang phòng.$c$,
    $c$Mai anh đào Đà Lạt thường cuối tháng 1 đến tháng 2. Năm nào cũng lệch. Trang không hẹn đúng ngày có hoa và không gọi đây là lễ hội vé đã bao.$c$,
    $c$Giá niêm yết 2.490.000đ mỗi khách. Cửa sổ dùng từ 20/1/2027 đến mùng 6 Tết. Giữ chỗ chưa phải phòng đã xác nhận. Muốn giảm 10% tiền phòng của sáu khách sạn đang bán, đặt riêng ở mục khách sạn.$c$
  ]::text[],
  '3 ngày 2 đêm',
  'Xe trong thành phố',
  '20/1/2027 – mùng 6 Tết',
  'Đà Lạt',
  'Đà Lạt',
  2490000,
  2490000,
  ARRAY[
    $c$Ngày 1: Tự tới Đà Lạt, nhận phòng, tối chợ đêm nếu còn mở.$c$,
    $c$Ngày 2: Xe đi hồ và các điểm trong thành phố. Hoa chỉ xem được nếu vườn đang nở.$c$,
    $c$Ngày 3: Ăn sáng, trả phòng.$c$
  ]::text[],
  'Hai đêm khách sạn 3 sao phòng đôi, ăn sáng, xe tham quan một ngày trong thành phố.',
  'Vé máy bay hoặc tàu tới Đà Lạt, vé cổng vườn, bữa trưa tối, phụ thu phòng đơn.',
  true,
  'tour',
  '/tours/tour-da-lat-tet.webp',
  'Ảnh minh họa mai anh đào trên đồi Đà Lạt',
  null,
  'Hoa Tết 2027',
  ARRAY['tet']::text[],
  6
),
(
  'tour-ha-giang-3n2d-xe-may',
  'HG03',
  'Tour Hà Giang 3 ngày 2 đêm bằng xe máy',
  'Tự lái xe máy: Lô Lô Chải, Đồng Văn, đèo Mã Pí Lèng. Xăng không nằm trong giá.',
  ARRAY[
    $c$Hành trình ba ngày hai đêm cho khách tự lái xe máy, không phải tour ngồi ô tô. Khởi hành hàng ngày từ Hà Nội khi còn xe.$c$,
    $c$Ngày 1 ngủ tại Lô Lô Chải. Ngày 2 đi Đồng Văn và đèo Mã Pí Lèng. Ngày 3 về Hà Nội. Có hướng dẫn viên đi cùng. Chỗ ở là homestay. Ăn uống mức cơ bản.$c$,
    $c$Xăng, tip và bảo hiểm cá nhân không gồm. Tháng 11–12 có thể gặp tam giác mạch ven đường, không phải điểm vé. Tour không đổi sang ô tô nếu bạn không muốn tự lái.$c$
  ]::text[],
  '3 ngày 2 đêm',
  'Xe máy',
  'Hàng ngày',
  'Hà Nội',
  'Hà Giang',
  3450000,
  3900000,
  ARRAY[
    $c$Ngày 1: Hà Nội đi Hà Giang, nghỉ Lô Lô Chải.$c$,
    $c$Ngày 2: Đồng Văn và đèo Mã Pí Lèng.$c$,
    $c$Ngày 3: Về Hà Nội.$c$
  ]::text[],
  'Xe máy, homestay, ăn uống cơ bản, hướng dẫn viên.',
  'Xăng, tip, bảo hiểm cá nhân.',
  false,
  'tour',
  '/tours/tour-ha-giang.webp',
  'Núi đá Hà Giang',
  null,
  'Tam giác mạch khoảng tháng 11–12',
  ARRAY['north', 'tet']::text[],
  7
),
(
  'tour-van-nam-6n5d',
  'VN65',
  'Vân Nam 6 ngày 5 đêm — Lệ Giang, Shangrila, Côn Minh',
  'Đi đường bộ qua Hà Khẩu, không phải tour bay. Visa cho khách Việt Nam nằm trong giá.',
  ARRAY[
    $c$Sáu ngày năm đêm từ Hà Nội, xuất cảnh cửa khẩu Hà Khẩu rồi tàu hỏa nội địa Trung Quốc. Không có vé máy bay trong giá. Lịch: Đại Lý, Shangrila, Lệ Giang, Côn Minh, rồi về Hà Khẩu.$c$,
    $c$Giá 12.690.000đ gồm visa cho khách quốc tịch Việt Nam, khách sạn khoảng 4 sao địa phương, xe, bữa theo lịch, cáp treo nhỏ lên khu Ngọc Long và vé show Ấn tượng Lệ Giang. Hộ chiếu còn hạn ít nhất 6 tháng sau ngày về.$c$,
    $c$Không gọi đây là tour không mua sắm: ngày 5 có chợ ở Côn Minh. Cáp lớn lên 4.500m không gồm. Phí xe điện Bạch Thủy Hà và vé Vạn Cổ Lầu không gồm. Tip ghi trong lịch gốc là 5 USD mỗi khách mỗi ngày, không nằm trong giá. Tháng 12–1 Shangrila có thể rét và có tuyết cục bộ, không cam kết.$c$
  ]::text[],
  '6 ngày 5 đêm',
  'Xe và tàu, qua cửa khẩu Hà Khẩu',
  'Theo ngày đoàn',
  'Hà Nội',
  'Đại Lý, Shangrila, Lệ Giang, Côn Minh',
  12690000,
  15690000,
  ARRAY[
    $c$Ngày 1: Hà Nội – Hà Khẩu – tàu đi Đại Lý.$c$,
    $c$Ngày 2: Nhĩ Hải, Sa Khê, tới Shangrila.$c$,
    $c$Ngày 3: Tùng Tán Lâm, thảo nguyên, tới Lệ Giang.$c$,
    $c$Ngày 4: Cáp nhỏ Ngọc Long, show Ấn tượng Lệ Giang.$c$,
    $c$Ngày 5: Tàu tới Côn Minh, có điểm chợ.$c$,
    $c$Ngày 6: Về Hà Khẩu, nhập cảnh, xe đêm về Hà Nội.$c$
  ]::text[],
  'Visa cho khách Việt Nam, khách sạn, xe, bữa theo lịch, cáp nhỏ Ngọc Long, vé show Lệ Giang, bảo hiểm, hướng dẫn.',
  'Hộ chiếu, visa cho người không phải quốc tịch Việt Nam, cáp lớn 4.500m, một số vé phụ, tip 5 USD mỗi ngày, VAT.',
  false,
  'tour',
  '/tours/tour-van-nam.webp',
  'Phố cổ đá, ảnh cho lịch Vân Nam',
  null,
  'Đông Vân Nam, tuyết không cam kết',
  ARRAY['world', 'tet']::text[],
  8
),
(
  'combo-sapa-3n2d-cabin',
  'SAPA3',
  'Combo Sapa 3 ngày 2 đêm — xe cabin và khách sạn 3 sao',
  'Ngủ Sapa, ăn sáng, không có hướng dẫn cả ngày và không có cáp Fansipan.',
  ARRAY[
    $c$Combo từ Hà Nội, khởi hành hằng ngày. Xe cabin khứ hồi và hai đêm khách sạn 3 sao trung tâm Sapa, gồm ăn sáng. Không phải tour dẫn đoàn cả ngày.$c$,
    $c$Không gồm cáp Fansipan, không gồm Hà Khẩu, không gồm bữa trưa tối. Khác với combo SPHK03: gói này rẻ hơn vì không có ngày sang Hà Khẩu và không có hướng dẫn viên dẫn cả lịch.$c$,
    $c$Giá 1.500.000đ mỗi khách. Tên khách sạn trên bảng gốc có thể đổi. Trang chỉ giữ hạng 3 sao trung tâm và ăn sáng, chốt tên khi xác nhận.$c$
  ]::text[],
  '3 ngày 2 đêm',
  'Xe cabin',
  'Hàng ngày',
  'Hà Nội',
  'Sapa',
  1500000,
  1650000,
  ARRAY[
    $c$Ngày 1: Xe cabin Hà Nội – Sapa, nhận phòng.$c$,
    $c$Ngày 2: Tự do. Ăn sáng tại khách sạn.$c$,
    $c$Ngày 3: Ăn sáng, xe cabin về Hà Nội.$c$
  ]::text[],
  'Xe cabin khứ hồi, hai đêm khách sạn 3 sao, ăn sáng.',
  'Cáp Fansipan, Hà Khẩu, hướng dẫn cả ngày, bữa trưa tối, vé bản.',
  false,
  'tour',
  '/tours/tour-xe-cabin.webp',
  'Ghế xe cabin trên đường lên Sapa',
  null,
  '',
  ARRAY['north']::text[],
  9
),
(
  'tour-mu-cang-chai-3n2d',
  'MCC32',
  'Mù Cang Chải 3 ngày 2 đêm bằng ô tô',
  'Ghép đoàn, khởi hành thứ 6. Mùa lúa vàng là tháng 9–10, không còn đúng lúc này.',
  ARRAY[
    $c$Ba ngày hai đêm từ Hà Nội, ô tô ghép đoàn, khởi hành thứ 6. Nghĩa Lộ, Tú Lệ, đèo Khau Phạ, Mù Cang Chải. Hai đêm: một đêm quanh Nghĩa Lộ, một đêm homestay Mù Cang Chải.$c$,
    $c$Tên lịch gốc nói mùa lúa chín. Lúa vàng thường tháng 9 và tháng 10. Từ tháng 11 đến Tết ruộng vẫn đi được nhưng không hẹn màu vàng. Vé xe ôm vào Mâm Xôi, Móng Ngựa, rừng trúc không gồm.$c$,
    $c$Nhà sàn tập thể. Phòng riêng phụ thu 150.000đ mỗi người mỗi đêm. Giá niêm yết 2.750.000đ.$c$
  ]::text[],
  '3 ngày 2 đêm',
  'Ô tô',
  'Thứ 6 hàng tuần',
  'Hà Nội',
  'Nghĩa Lộ và Mù Cang Chải',
  2750000,
  2950000,
  ARRAY[
    $c$Ngày 1: Hà Nội, Thanh Sơn, Suối Giàng, nghỉ quanh Nghĩa Lộ.$c$,
    $c$Ngày 2: Mường Lò, Khau Phạ, Tú Lệ, tối homestay Mù Cang Chải.$c$,
    $c$Ngày 3: Chợ, cầu Ba Nhà, trưa rồi về Hà Nội tối.$c$
  ]::text[],
  'Ô tô, hướng dẫn, năm bữa chính, hai bữa sáng, hai đêm ở, nước trên xe, bảo hiểm.',
  'Vé xe ôm và cổng các điểm ruộng tự chọn, phòng riêng, đồ uống, tip, VAT.',
  false,
  'tour',
  '/tours/tour-mu-cang-chai.webp',
  'Ruộng bậc thang Mù Cang Chải',
  null,
  'Lúa vàng tháng 9–10, đã qua',
  ARRAY['north']::text[],
  10
),
(
  'tour-mu-cang-chai-2n1d',
  'MCC01',
  'Tour Mù Cang Chải 2 ngày 1 đêm',
  'Một đêm homestay. Chỉ khởi hành thứ 7 từ Hà Nội. Không hẹn lúa vàng ngoài tháng 9–10.',
  ARRAY[
    $c$Tour cuối tuần cho khách muốn ngủ một đêm ở Mù Cang Chải mà không tự đặt xe và homestay. Lịch chỉ khởi hành thứ 7. Xe bus đón lúc 06:00 tại Hà Nội.$c$,
    $c$Ngày đầu đoàn lên Mù Cang Chải, nhận homestay, xem ruộng bậc thang và tối có giao lưu văn hóa. Sáng hôm sau xem bình minh, ghé chợ phiên, về Hà Nội khoảng 18:00.$c$,
    $c$Nên hiểu đây là lịch ruộng và homestay, không phải cam kết lúa chín. Từ tháng 11 đến Tết ruộng không còn vàng như tên mùa. Chưa có tên homestay hay thực đơn từng bữa.$c$
  ]::text[],
  '2 ngày 1 đêm',
  'Xe bus',
  'Thứ 7 hàng tuần',
  'Hà Nội',
  'Mù Cang Chải',
  1690000,
  1999000,
  ARRAY[
    $c$Ngày 1: 06:00 đón tại Hà Nội, đi Mù Cang Chải, nhận homestay, xem ruộng, tối giao lưu.$c$,
    $c$Ngày 2: Sáng ngắm bình minh, ghé chợ phiên, về Hà Nội khoảng 18:00.$c$
  ]::text[],
  'Xe đưa đón, homestay 1 đêm, 3 bữa ăn, hướng dẫn viên, bảo hiểm.',
  'Đồ uống, tip, chi tiêu riêng.',
  false,
  'tour',
  '/tours/tour-mu-cang-chai.webp',
  'Ruộng bậc thang Mù Cang Chải',
  null,
  'Lúa vàng tháng 9–10, đã qua',
  ARRAY['north']::text[],
  11
),
(
  'combo-sapa-ha-khau-3n2d',
  'SPHK03',
  'Combo Sapa – Hà Khẩu 3 ngày 2 đêm',
  'Xe cabin từ Hà Nội, hai đêm khách sạn 3 sao ở Sapa, một ngày sang Hà Khẩu.',
  ARRAY[
    $c$Combo ba ngày hai đêm xuất phát từ Hà Nội. Xe cabin. Khách sạn hạng 3 sao, hai đêm.$c$,
    $c$Ngày 1 lên Sapa và nhận phòng. Ngày 2 đi Hà Khẩu trong ngày. Ngày 3 tham quan Sapa rồi về Hà Nội. Lịch ngày 3 chưa ghi tên bản hay điểm vé, nên vé cổng phát sinh tính riêng.$c$,
    $c$Giá gồm xe, phòng, hướng dẫn viên và bảo hiểm. Ăn uống và vé tham quan không gồm. Không gồm cáp treo Fansipan. Muốn có cáp và không sang Hà Khẩu thì xem lịch SAPA-DONG.$c$
  ]::text[],
  '3 ngày 2 đêm',
  'Xe cabin',
  'Hàng ngày',
  'Hà Nội',
  'Sapa và Hà Khẩu',
  2050000,
  2250000,
  ARRAY[
    $c$Ngày 1: Hà Nội đi Sapa, nhận phòng khách sạn.$c$,
    $c$Ngày 2: Tour Hà Khẩu trong ngày.$c$,
    $c$Ngày 3: Tham quan Sapa, về Hà Nội.$c$
  ]::text[],
  'Xe cabin, khách sạn 2 đêm, hướng dẫn viên, bảo hiểm.',
  'Ăn uống, vé tham quan.',
  false,
  'tour',
  '/tours/tour-xe-cabin.webp',
  'Ghế xe cabin trên đường lên Sapa',
  null,
  '',
  ARRAY['north']::text[],
  12
),
(
  'tour-ha-khau-1-ngay',
  'HK01',
  'Tour Hà Khẩu 1 ngày từ Sapa',
  'Sang Hà Khẩu trong ngày rồi về Việt Nam tối cùng ngày. Không có đêm nghỉ.',
  ARRAY[
    $c$Tour cho khách đang ở Sapa, muốn sang Hà Khẩu rồi về trong tối. Không gồm đêm nghỉ. Xe 16 chỗ đón lúc 12:00 tại Sapa. Trong Hà Khẩu, đoàn đi bằng xe máy điện.$c$,
    $c$Sau thủ tục xuất nhập cảnh, khoảng 13:30 đoàn qua ga tàu, phố Hạnh Phúc và siêu thị. Lúc 20:00 làm thủ tục về Việt Nam. Đây là lịch đi phố và mua sắm, không phải tour thắng cảnh cả ngày.$c$,
    $c$Cần giấy tờ để làm thủ tục cửa khẩu đúng giờ đón. Tour không giữ sẵn một quán ăn và không cam kết siêu thị còn đúng món bạn định mua.$c$
  ]::text[],
  '1 ngày',
  'Xe 16 chỗ và xe máy điện',
  'Hàng ngày',
  'Sapa',
  'Hà Khẩu',
  600000,
  700000,
  ARRAY[
    $c$12:00 đón tại Sapa, làm thủ tục xuất nhập cảnh.$c$,
    $c$Khoảng 13:30 tham quan Hà Khẩu: ga tàu, phố Hạnh Phúc, siêu thị.$c$,
    $c$20:00 thủ tục về Việt Nam.$c$
  ]::text[],
  'Xe đưa đón, hướng dẫn viên, phí xuất nhập cảnh.',
  'Ăn uống, mua sắm, tip.',
  false,
  'tour',
  '/tours/tour-ha-khau.webp',
  'Phố thị biên giới, ảnh minh họa cho tour Hà Khẩu',
  null,
  '',
  ARRAY['north']::text[],
  13
),
(
  'tour-cat-ba-2n1d',
  'CB02',
  'Tour Cát Bà 2 ngày 1 đêm',
  'Vịnh, kayak và một đêm khách sạn trên đảo. Kayak nằm trong giá, không tách riêng.',
  ARRAY[
    $c$Tour hai ngày một đêm từ Hà Nội ra Cát Bà. Di chuyển bằng xe khách và du thuyền. Khách sạn hạng 2–3 sao trên đảo. Có ba bữa ăn.$c$,
    $c$Ngày 1 tham quan vịnh và chèo kayak rồi nhận phòng. Ngày 2 ra bãi tắm Cát Cò rồi về Hà Nội. Kayak thuộc lịch ngày 1, không phải khoản mua thêm.$c$,
    $c$Nếu chỉ cần tới đảo rồi tự lo phòng, dùng vé xe XE-CB01 giá 380.000đ. Vé đó không có thuyền, bãi tắm theo đoàn hay bữa ăn.$c$
  ]::text[],
  '2 ngày 1 đêm',
  'Xe khách và du thuyền',
  'Hàng ngày',
  'Hà Nội',
  'Cát Bà',
  2350000,
  2550000,
  ARRAY[
    $c$Ngày 1: Hà Nội ra Cát Bà, tham quan vịnh, chèo kayak, nhận phòng.$c$,
    $c$Ngày 2: Bãi tắm Cát Cò, về Hà Nội.$c$
  ]::text[],
  'Xe, thuyền, khách sạn, 3 bữa ăn, hướng dẫn viên.',
  'Đồ uống, hoạt động tự chọn ngoài lịch.',
  false,
  'tour',
  '/tours/tour-ha-long.webp',
  'Vịnh đá vôi trên đường ra Cát Bà',
  null,
  '',
  ARRAY['island']::text[],
  14
),
(
  'xe-ha-noi-cat-ba-cap-treo',
  'XE-CB01',
  'Xe Hà Nội – Cát Bà qua cáp treo',
  'Vé xe bus 45 chỗ và cáp treo khứ hồi. Tới đảo khoảng 3,5 giờ. Không phải tour nghỉ.',
  ARRAY[
    $c$Đây là vé xe, không phải tour nghỉ dưỡng. Xe bus 45 chỗ từ Hà Nội, nối cáp treo, để khỏi chờ phà. Mỗi ngày hai giờ: 8h và 10h45. Tới Cát Bà khoảng 3,5 giờ.$c$,
    $c$Giá gồm vé xe và cáp treo khứ hồi. Không có hướng dẫn viên, kayak hay bữa trưa. Ăn uống và khách sạn tự lo.$c$,
    $c$Chọn vé này khi đã có chỗ ở trên đảo hoặc đi trong ngày rồi về bằng vé khứ hồi. Muốn vịnh, kayak, bãi Cát Cò, một đêm và ba bữa ăn thì xem tour CB02.$c$
  ]::text[],
  'Khoảng 3,5 giờ',
  'Xe bus 45 chỗ và cáp treo',
  'Hàng ngày, 8h hoặc 10h45',
  'Hà Nội',
  'Cát Bà',
  380000,
  450000,
  ARRAY[
    $c$Khởi hành 8h hoặc 10h45 từ Hà Nội, xe bus rồi cáp treo, tới Cát Bà khoảng 3,5 giờ.$c$
  ]::text[],
  'Vé xe và cáp treo khứ hồi.',
  'Ăn uống, khách sạn, hướng dẫn viên.',
  false,
  'ticket',
  '/tours/tour-xe-cat-ba.webp',
  'Xe khách ven biển, ảnh minh họa vé xe Hà Nội – Cát Bà',
  ARRAY['8h', '10h45']::text[],
  '',
  ARRAY['island']::text[],
  15
)
on conflict (slug) do update set
  code = excluded.code,
  name = excluded.name,
  short = excluded.short,
  long_parts = excluded.long_parts,
  duration = excluded.duration,
  transport = excluded.transport,
  departure = excluded.departure,
  origin = excluded.origin,
  destination = excluded.destination,
  price = excluded.price,
  old_price = excluded.old_price,
  itinerary = excluded.itinerary,
  included = excluded.included,
  excluded = excluded.excluded,
  featured = excluded.featured,
  kind = excluded.kind,
  image = excluded.image,
  image_alt = excluded.image_alt,
  slots = excluded.slots,
  season = excluded.season,
  groups = excluded.groups,
  sort_order = excluded.sort_order;

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
    select price::bigint into v_adult_price
    from public.tours
    where code = p_product_id
    limit 1;
    if v_adult_price is null or v_adult_price <= 0 then
      raise exception 'unknown tour %', p_product_id;
    end if;
    v_total := (v_adult_price * (coalesce(p_adults, 1) + coalesce(p_children, 0)))::bigint;
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
