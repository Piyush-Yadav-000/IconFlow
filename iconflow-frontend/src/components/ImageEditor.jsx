import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import RangeSlider from "@/components/RangeSlider";

const presets = {
  none: { brightness: 0, contrast: 0, saturation: 0, hue: 0 },
  warm: { brightness: 0, contrast: 5, saturation: 10, hue: 0 },
  cool: { brightness: 0, contrast: 0, saturation: -5, hue: 10 },
  vintage: { brightness: 0, contrast: 5, saturation: -10, hue: 0 },
  bw: { brightness: 0, contrast: 5, saturation: -100, hue: 0 },
  cinematic: { brightness: 0, contrast: 10, saturation: -10, hue: 0 },
};

export default function ImageEditor({
  originalBase64,
  originalSrc,
  onChangeFilter,
  onDownload,
  onPreviewChange,
  onEditsStateChange,
}) {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [hue, setHue] = useState(0);
  const [preset, setPreset] = useState("none");

  const filterValue = `brightness(${100 + brightness}%) contrast(${100 + contrast}%) saturate(${100 + saturation}%) hue-rotate(${hue}deg)`;
  const hasEdits = brightness !== 0 || contrast !== 0 || saturation !== 0 || hue !== 0 || preset !== "none";

  useEffect(() => {
    onEditsStateChange?.(hasEdits);
    onChangeFilter?.(filterValue);

    const src = originalBase64
      ? `data:image/png;base64,${originalBase64}`
      : originalSrc || null;

    if (!src || !hasEdits) {
      onPreviewChange?.(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      ctx.filter = filterValue;
      ctx.drawImage(img, 0, 0);

      onPreviewChange?.(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      if (!cancelled) onPreviewChange?.(null);
    };

    return () => {
      cancelled = true;
    };
  }, [
    hasEdits,
    filterValue,
    originalBase64,
    originalSrc,
    onChangeFilter,
    onPreviewChange,
    onEditsStateChange,
  ]);

  const applyPreset = (value) => {
    setPreset(value);
    const p = presets[value] || presets.none;
    setBrightness(p.brightness);
    setContrast(p.contrast);
    setSaturation(p.saturation);
    setHue(p.hue);
  };

  const resetAll = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setHue(0);
    setPreset("none");
  };

  return (
    <div className="w-full rounded-[24px] border border-[#E7E8EC] bg-white p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Badge className="rounded-full bg-[#EEF2FF] text-[#2F5CFF] hover:bg-[#EEF2FF]">Editor</Badge>
        <Badge variant="outline" className="rounded-full border-[#E7E8EC]">Live update</Badge>
      </div>

      <div className="mb-4 rounded-2xl border border-[#E7E8EC] bg-[#FAFAFB] p-3">
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm font-medium text-[#0E0F13]">Preset</Label>
          <Select value={preset} onValueChange={applyPreset}>
            <SelectTrigger className="h-10 w-[150px] rounded-xl border-[#E7E8EC]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl border-[#E7E8EC] bg-white">
              <SelectItem value="none">Normal</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cool">Cool</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
              <SelectItem value="bw">Black & White</SelectItem>
              <SelectItem value="cinematic">Cinematic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <RangeSlider label="Brightness" value={brightness} min={-100} max={100} onChange={setBrightness} />
        <RangeSlider label="Contrast" value={contrast} min={-100} max={100} onChange={setContrast} />
        <RangeSlider label="Saturation" value={saturation} min={-100} max={100} onChange={setSaturation} />
        <RangeSlider label="Hue" value={hue} min={0} max={360} onChange={setHue} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Button onClick={resetAll} variant="outline" className="h-11 rounded-full border-[#E7E8EC]">
          Reset
        </Button>
        <Button onClick={onDownload} className="h-11 rounded-full bg-[#2F5CFF] font-semibold text-white hover:bg-[#2449CC]">
          Download
        </Button>
      </div>
    </div>
  );
}