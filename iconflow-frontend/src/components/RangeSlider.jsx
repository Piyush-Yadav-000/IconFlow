import { Label } from "@/components/ui/label";

export default function RangeSlider({
  label,
  value,
  min,
  max,
  onChange,
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-2xl border border-[#E7E8EC] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Label className="text-sm font-medium text-[#0E0F13]">{label}</Label>
        <span className="font-mono-forma text-xs text-[#667085]">
          {value > 0 ? `+${value}` : value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider h-2 w-full appearance-none rounded-full bg-transparent outline-none"
        style={{
          background: `linear-gradient(to right, #0E0F13 0%, #0E0F13 ${percent}%, #E7E8EC ${percent}%, #E7E8EC 100%)`,
        }}
      />
    </div>
  );
}