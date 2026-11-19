import { Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { formatVnd } from "@/lib/hotels";

export type FilterState = {
  maxPrice: number;
  stars: number[];
  amenities: string[];
};

export const DEFAULT_FILTERS: FilterState = { maxPrice: 3000000, stars: [], amenities: [] };
export const AMENITIES = [
  "Wi-Fi miễn phí",
  "Hồ bơi",
  "Bữa sáng",
  "Spa",
  "Nhà hàng",
  "Đỗ xe miễn phí",
];

export function Filters({
  value,
  onChange,
}: {
  value: FilterState;
  onChange: (v: FilterState) => void;
}) {
  const toggle = <K extends "stars" | "amenities">(key: K, item: FilterState[K][number]) => {
    const list = value[key] as (typeof item)[];
    onChange({
      ...value,
      [key]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-semibold">Khoảng giá / đêm</p>
        <Slider
          min={500000}
          max={3000000}
          step={50000}
          value={[value.maxPrice]}
          onValueChange={([v]) => onChange({ ...value, maxPrice: v ?? value.maxPrice })}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>500.000đ</span>
          <span className="font-semibold text-primary">≤ {formatVnd(value.maxPrice)}</span>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold">Xếp hạng sao</p>
        <div className="space-y-2.5">
          {[5, 4, 3].map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox
                checked={value.stars.includes(s)}
                onCheckedChange={() => toggle("stars", s)}
              />
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < s ? "size-4 fill-star text-star" : "size-4 fill-muted text-muted"
                    }
                  />
                ))}
              </span>
              <span className="text-muted-foreground">{s} sao</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm font-semibold">Tiện ích</p>
        <div className="space-y-2.5">
          {AMENITIES.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox
                checked={value.amenities.includes(a)}
                onCheckedChange={() => toggle("amenities", a)}
              />
              {a}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
