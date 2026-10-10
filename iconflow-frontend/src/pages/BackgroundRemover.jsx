"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageEditor from "@/components/ImageEditor";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/context/AuthContext";

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

export default function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState(null);
  const [filterValue, setFilterValue] = useState(
    "brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg)"
  );

  const { refreshUser } = useAuth();

  const handleRemove = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResultUrl(null);
    setFilterValue("brightness(100%) contrast(100%) saturate(100%) hue-rotate(0deg)");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/remove-background", formData, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const url = URL.createObjectURL(res.data);
      setResultUrl(url);
      await refreshUser();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Background removal failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadOriginal = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "iconflow-no-bg.png";
    a.click();
  };

  const downloadEdited = async () => {
    if (!resultUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = resultUrl;
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
      a.download = "iconflow-no-bg-edited.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="forma-root min-h-screen bg-white text-[#0E0F13]">
      <style>{fontStyles}</style>

      <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-[28px] border border-[#E7E8EC] bg-[#fbfbfb] p-6 shadow-[0_1px_2px_rgba(14,15,19,0.04)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#0E0F13]">Image</label>
                <span className="font-mono-forma text-[11px] text-[#9CA3AF]">
                  {file ? file.name : "No file selected"}
                </span>
              </div>

              <div className="w-full rounded-2xl border border-[#E7E8EC] bg-[#4e4d4d] p-3">
                <FileUpload
                  onChange={(files) => {
                    setFile(files?.[0] || null);
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2 text-xs text-[#667085]">
                <span>Supported: PNG, JPG, WEBP</span>
                <span>•</span>
                <span>Max 10MB</span>
              </div>
            </div>

            <Button
              onClick={handleRemove}
              disabled={loading || !file}
              className="mt-8 h-12 w-full rounded-2xl bg-cyan-400 text-lg font-extrabold text-white hover:bg-[#3cbde0] disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing…
                </>
              ) : (
                "Remove Background"
              )}
            </Button>

            <p className="font-mono-forma mt-3 text-center text-[11px] text-[#9CA3AF]">
              ⌘ + Enter to remove background
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
                    Removing background…
                  </span>
                </motion.div>
              ) : resultUrl ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col gap-4 p-4 md:p-6"
                >
                  <div className="flex justify-center rounded-[24px] border border-[#E7E8EC] bg-white p-4 shadow-sm">
                    <img
                      src={resultUrl}
                      alt="Background removed"
                      className="max-h-[380px] w-full max-w-[500px] object-contain"
                      style={{ filter: filterValue }}
                    />
                  </div>

                  <ImageEditor
                    originalBase64={null}
                    originalSrc={resultUrl}
                    onChangeFilter={setFilterValue}
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
                    <Upload className="h-7 w-7 text-[#C7CBD4]" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-medium text-[#667085]">
                    Upload an image to remove its background
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