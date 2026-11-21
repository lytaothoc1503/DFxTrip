# DFxTrip

Web khách sạn, tour và vé Symphony of the Sea.

Nguồn để sửa nằm ở nhánh `main`.
Link https://lytaothoc1503.github.io/DFxTrip/ chỉ là bản xem tĩnh, không phải app đang chạy.

## Chạy trong Cursor

```
npm install
npm run dev
```

Mở http://localhost:8080

## Sửa những chỗ này

| Việc | File |
|---|---|
| Trang chủ, khách sạn, tour, vé, giữ chỗ | `src/routes/` |
| Thẻ phòng, menu, ô tìm | `src/components/site/` |
| Danh sách khách sạn | `src/lib/hotels.ts` |
| Tour | `src/lib/tours.ts` |
| Vé Phú Quốc | `src/lib/services.ts` |
| Ảnh | `public/photos/`, `public/tours/`, `public/reviews/` |

## Không viết lại phần khung Grok

Các file dưới đây chỉ để Grok xem trước. Xoá hoặc sửa sẽ làm app không chạy, và không giúp web trên GitHub.

- `src/components/preview-host-bridge.tsx`
- `src/lib/preview-host-bridge.ts`
- `scripts/grok-pwa-plugin.mjs`
- `server/middleware/grok-pwa.ts`
- `public/__grok/`

Muốn web thật trên tên miền riêng thì triển khai nhánh `main` lên Vercel (`npm run build`). Đừng dựng lại từ nhánh `gh-pages`.
