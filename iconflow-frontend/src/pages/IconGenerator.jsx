"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Circle,
  Square,
  Hexagon,
  PenLine,
  Sparkles,
  Loader2,
  ImageIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageEditor from "@/components/ImageEditor";
import { useAuth } from "@/context/AuthContext";
import ImageCompareSlider from "@/components/ImageCompareSlider";

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  .forma-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  .font-display { font-family: 'Space+Grotesk', ui-sans-serif, system-ui, sans-serif; }
  .font-mono-forma { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
  .forma-checker {
    background-image:
      linear-gradient(45deg, #F3F4F6 25%, transparent 25%),
      linear-gradient(-45deg, #F3F4F6 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #F3F4F6 75%),
      linear-gradient(-45deg, transparent 75%, #F3F4F6 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  }
`;

const styleOptions = [
  {
    value: "minimalist",
    label: "Minimalist",
    icon: Circle,
    image: "https://c4.wallpaperflare.com/wallpaper/910/529/102/ai-art-minimalism-hd-wallpaper-preview.jpg",
  },
  {
    value: "modern",
    label: "Modern",
    icon: Sparkles,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4DyPo005x0eXIHc5efJ-n7Dfrpu7g4-u2o7khpeu2DzTOPSswgCuBcOM&s=10",
  },
  {
    value: "flat",
    label: "Flat",
    icon: Square,
    image: "https://www.logoai.com/oss/ai-art/out-flat-illustrative-style.png?v=1782805289614&x-oss-process=image%2Fresize,m_fixed,w_500,h_0%2Fformat,webp",
  },
  {
    value: "geometric",
    label: "Geometric",
    icon: Hexagon,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8t0-QTTKgF1-CeFpEiJB3Q1gqvaSJKgGt19ZLsjWSAc_3liiVoRkKzqb3&s=10",
  },
  {
    value: "line art",
    label: "Line Art",
    icon: PenLine,
    image: "https://static.vecteezy.com/system/resources/previews/073/745/764/non_2x/detailed-brown-sketch-of-mountain-range-on-white-background-for-design-projects-vector.jpg",
  },
];

const suggestions = ["Shopping cart", "Settings gear", "Chat bubble", "Camera lens"];
const MAX_LEN = 200;

export default function IconGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("minimalist");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [filterValue, setFilterValue] = useState("brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg)");
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastPressedKey, setLastPressedKey] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const [hasEdits, setHasEdits] = useState(false);

  const typingTimeoutRef = useRef(null);
  const inputWrapRef = useRef(null);
  const { refreshUser } = useAuth();

  const generateIcon = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setFilterValue("brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg)");
    setOriginalImage(null);
    setEditedImage(null);
    setHasEdits(false);

    try {
      const res = await api.post("/api/generate-icon", { prompt, style });
      setResult(res.data);
      setOriginalImage(res.data.base64);
      setEditedImage(null);
      setHasEdits(false);
      await refreshUser();
    } catch (e) {
      setError(e.message || "Icon generation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetTypingTimer = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    resetTypingTimer();
    if (e.code) setLastPressedKey(e.code);
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      generateIcon();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    resetTypingTimer();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    setPrompt(e.target.value.slice(0, MAX_LEN));
    resetTypingTimer();
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (e) => {
      const target = e.target;
      const inputWrap = inputWrapRef.current;
      if (!inputWrap) return;
      if (!inputWrap.contains(target)) {
        setIsFocused(false);
        setIsTyping(false);
      }
    };

    document.addEventListener("pointermove", onPointerMove);
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);

  const downloadOriginal = () => {
    if (!originalImage) return;
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${originalImage}`;
    a.download = "iconflow-icon.png";
    a.click();
  };

  const downloadEdited = async () => {
    if (!originalImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `data:image/png;base64,${originalImage}`;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.filter = filterValue;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "iconflow-icon-edited.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="forma-root min-h-screen bg-white text-[#0E0F13]">
      <style>{fontStyles}</style>

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-2">
        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-[28px] border border-[#E7E8EC] bg-white p-6 shadow-[0_1px_2px_rgba(14,15,19,0.04)]">
            <div ref={inputWrapRef} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-[#0E0F13]">
                  Describe your icon
                </Label>
                <span className="font-mono-forma text-[11px] text-[#9CA3AF]">
                  {prompt.length}/{MAX_LEN}
                </span>
              </div>

              <Textarea
                value={prompt}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="e.g., shopping cart, settings gear, app icon"
                rows={5}
                className="resize-none rounded-2xl border-[#E7E8EC] text-[15px] leading-6 placeholder:text-[#9CA3AF] focus-visible:border-[#2F5CFF] focus-visible:ring-[#2F5CFF]/20"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="rounded-full border border-[#E7E8EC] px-3 py-1.5 text-xs text-[#667085] transition-colors hover:border-[#2F5CFF] hover:text-[#2F5CFF]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 space-y-3">
              <Label className="text-sm font-medium text-[#0E0F13]">Style</Label>
              <div className="flex flex-wrap gap-3">
                {styleOptions.map((opt) => {
                  const active = style === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      type="button"
                      onClick={() => setStyle(opt.value)}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                      className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border transition-all ${
                        active
                          ? "border-[#2F5CFF] bg-[#EEF2FF] shadow-[0_4px_16px_-6px_rgba(47,92,255,0.35)]"
                          : "border-[#E7E8EC] hover:border-[#2F5CFF] hover:shadow-[0_4px_14px_-6px_rgba(0,0,0,0.12)]"
                      }`}
                    >
                      {active && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2F5CFF]">
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </span>
                      )}

                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-[#E7E8EC] bg-white">
                        <img
                          src={opt.image}
                          alt={`${opt.label} style preview`}
                          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                        />
                      </div>

                      <span
                        className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium ${
                          active ? "text-[#2F5CFF]" : "text-[#667085]"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={generateIcon}
              disabled={loading || !prompt.trim()}
              className="mt-8 h-12 w-full rounded-2xl bg-cyan-400 text-lg font-extrabold text-white hover:bg-[#3cbde0] disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate icon"
              )}
            </Button>

            <p className="font-mono-forma mt-3 text-center text-[11px] text-[#9CA3AF]">
              ⌘ + Enter to generate
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <Alert variant="destructive" className="mt-5 rounded-2xl">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="forma-checker relative overflow-hidden rounded-[28px] border border-[#E7E8EC] bg-[#FAFAFB] p-4">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center gap-4"
                >
                  <div className="h-40 w-40 animate-pulse rounded-[28px] bg-gradient-to-br from-[#E7E8EC] to-[#F3F4F6] sm:h-52 sm:w-52" />
                  <span className="font-mono-forma text-xs uppercase tracking-[0.1em] text-[#9CA3AF]">
                    Shaping your icon…
                  </span>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col gap-4 p-4 md:p-6"
                >
                  {!hasEdits && originalImage && (
                    <div className="flex justify-center rounded-[24px] border border-[#E7E8EC] bg-white p-4 shadow-sm">
                      <img
                        src={`data:image/png;base64,${originalImage}`}
                        alt="Generated icon"
                        className="max-h-[380px] w-full max-w-[500px] object-contain"
                      />
                    </div>
                  )}

                  {hasEdits && originalImage && editedImage && (
                    <ImageCompareSlider
                      originalSrc={`data:image/png;base64,${originalImage}`}
                      editedSrc={editedImage}
                      alt="Generated icon"
                    />
                  )}

                  <ImageEditor
                    originalBase64={originalImage}
                    onChangeFilter={setFilterValue}
                    onPreviewChange={setEditedImage}
                    onEditsStateChange={setHasEdits}
                    onDownload={downloadEdited}
                  />

                  <Button
                    variant="outline"
                    onClick={downloadOriginal}
                    className="h-11 rounded-full border-[#E7E8EC] bg-gray-800 text-sm font-medium text-white hover:bg-black"
                  >
                    Download Original
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[420px] flex-col items-center justify-center gap-3 px-8 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E7E8EC] bg-white">
                    <ImageIcon className="h-7 w-7 text-[#C7CBD4]" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium text-[#667085]">
                    Your icon will appear here
                  </p>
                  <p className="font-mono-forma text-[11px] uppercase tracking-[0.1em] text-[#C7CBD4]">
                    1024 × 1024 · PNG
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}