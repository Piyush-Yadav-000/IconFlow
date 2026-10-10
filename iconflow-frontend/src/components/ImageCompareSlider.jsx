import { useRef, useState } from "react";

export default function ImageCompareSlider({ originalSrc, editedSrc, alt = "Comparison image" }) {
  const wrapRef = useRef(null);
  const [position, setPosition] = useState(50);

  const updatePosition = (clientX) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-[420px] w-full overflow-hidden rounded-[24px] border border-[#E7E8EC] bg-white select-none"
      onMouseMove={(e) => e.buttons === 1 && updatePosition(e.clientX)}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
      onMouseDown={(e) => updatePosition(e.clientX)}
      onTouchStart={(e) => updatePosition(e.touches[0].clientX)}
    >
      <img
        src={originalSrc}
        alt={`${alt} original`}
        className="absolute inset-0 h-full w-full object-contain bg-[#FAFAFB]"
        draggable="false"
      />

      <div
        className="absolute inset-y-0 right-0 overflow-hidden"
        style={{ width: `${100 - position}%` }}
      >
        <img
          src={editedSrc}
          alt={`${alt} edited`}
          className="h-full w-full object-contain bg-[#FAFAFB]"
          draggable="false"
        />
      </div>

      <div
        className="absolute top-0 h-full w-[2px] bg-white shadow-lg"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E7E8EC] bg-white shadow-md">
          <div className="h-4 w-4 rounded-full bg-cyan-400" />
        </div>
      </div>

      <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
        Original
      </div>

      <div className="absolute right-4 top-4 rounded-full bg-cyan-500/90 px-3 py-1 text-xs font-medium text-white">
        Edited
      </div>
    </div>
  );
}