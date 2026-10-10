"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAsset } from "@/lib/assetsApi";
import ImageEditor from "@/components/ImageEditor";
import ImageCompareSlider from "@/components/ImageCompareSlider";
import api from "@/lib/axios";

export default function AssetEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [hasEdits, setHasEdits] = useState(false);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [hue, setHue] = useState(0);
  const [preset, setPreset] = useState("none");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAsset(id);
        setAsset(data);
      } catch (e) {
        setError(e.message || "Failed to load asset");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const saveEdited = async () => {
    if (!editedImage || !asset?.id) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const blob = await (await fetch(editedImage)).blob();
      const formData = new FormData();
      formData.append("file", blob, "edited.png");
      formData.append(
        "editMetaJson",
        JSON.stringify({ brightness, contrast, saturation, hue, preset })
      );

      await api.post(`/api/assets/${asset.id}/edited-new`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      setSuccess("Edited image saved as a new history item");
      navigate("/history");
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to save edited image");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Editor</h1>
          <p className="text-sm text-slate-500">Open, crop, resize, and refine saved images.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-5 border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      ) : asset ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            {!hasEdits && asset.imageUrl && (
              <img
                src={asset.imageUrl}
                alt={asset.title || "Asset"}
                className="max-h-[500px] w-full object-contain"
              />
            )}

            {hasEdits && asset.imageUrl && editedImage && (
              <ImageCompareSlider
                originalSrc={asset.imageUrl}
                editedSrc={editedImage}
                alt={asset.title || "Asset"}
              />
            )}
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4">
            <ImageEditor
              originalBase64={null}
              originalSrc={asset.imageUrl}
              onPreviewChange={setEditedImage}
              onEditsStateChange={setHasEdits}
              onDownload={() => {
                const a = document.createElement("a");
                a.href = asset.imageUrl;
                a.download = `${asset.title || "asset"}.png`;
                a.click();
              }}
              onChangeFilter={() => {}}
            />

            <Button
              onClick={saveEdited}
              disabled={!editedImage || saving}
              className="h-11 w-full rounded-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Edited Image
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}