"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ImageIcon } from "lucide-react";
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
  .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
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

const suggestions = [
  "A peaceful village at sunset in Studio Ghibli style",
  "A train traveling through magical clouds",
  "A forest spirit among glowing mushrooms",
  "A small boat on a calm, starlit sea",
];

const MAX_LEN = 200;

export default function GhibliGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [filterValue, setFilterValue] = useState(
    "brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg)"
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastPressedKey, setLastPressedKey] = useState(null);



const [originalImage, setOriginalImage] = useState(null);
const [editedImage, setEditedImage] = useState(null);
const [hasEdits, setHasEdits] = useState(false);


const typingTimeoutRef = useRef(null);
  const inputWrapRef = useRef(null);

  const { refreshUser } = useAuth();

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setFilterValue("brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg)");
    try {
      const res = await api.post("/api/generate-ghibli", {
        prompt,
        style: "ghibli",
      });
      setResult(res.data);
      await refreshUser();

setOriginalImage(res.data.base64);
setEditedImage(null);
setHasEdits(false);
    } catch (e) {
      setError(e.message || "Ghibli generation failed");
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
      generate();
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
      const wrap = inputWrapRef.current;
      if (!wrap) return;

      const target = e.target;
      if (!wrap.contains(target)) {
        setIsFocused(false);
        setIsTyping(false);
      }
    };

    document.addEventListener("pointermove", onPointerMove);
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);

  const downloadOriginal = () => {
    if (!result?.base64) return;
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${result.base64}`;
    a.download = "iconflow-ghibli.png";
    a.click();
  };

  const downloadEdited = async () => {
    if (!result?.base64) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `data:image/png;base64,${result.base64}`;
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
      a.download = "iconflow-ghibli-edited.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };


  return (
    <div className="forma-root min-h-screen bg-white text-[#0E0F13]">
      <style>{fontStyles}</style>

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-[28px] border border-[#E7E8EC] bg-white p-6 shadow-[0_1px_2px_rgba(14,15,19,0.04)]">
            <div ref={inputWrapRef} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-[#0E0F13]">
                  Describe your scene
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
                placeholder="e.g., a peaceful village at sunset in Studio Ghibli style"
                rows={6}
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

            <Button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="mt-8 h-12 w-full rounded-2xl bg-cyan-400 text-lg font-extrabold text-white hover:bg-[#3cbde0] disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate Ghibli"
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
                    Painting your scene…
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
                  {result && !hasEdits && (
  <div className="flex justify-center rounded-[24px] border border-[#E7E8EC] bg-white p-4 shadow-sm">
    <img
      src={`data:image/png;base64,${originalImage}`}
      alt="Generated Ghibli art"
      className="max-h-[380px] w-full max-w-[500px] object-contain"
    />
  </div>
)}

{result && hasEdits && (
  <ImageCompareSlider
  originalSrc={`data:image/png;base64,${originalImage}`}
  editedSrc={editedImage}
    alt="Generated Ghibli art"
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
                    Your Ghibli art will appear here
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

      {/* <AnimatePresence>
        {keyboardVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2"
          >
            <Keyboard enableSound showPreview lastPressedKey={lastPressedKey} />
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}