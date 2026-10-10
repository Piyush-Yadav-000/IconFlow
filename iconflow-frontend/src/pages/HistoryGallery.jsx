"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Pencil, Trash2, Star, RefreshCw, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getHistory, toggleFavorite, renameAsset, deleteAsset } from "@/lib/assetsApi";

export default function HistoryGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getHistory();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter((item) =>
    `${item.title || ""} ${item.prompt || ""} ${item.type || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleFavorite = async (id) => {
    await toggleFavorite(id);
    load();
  };

  const handleDelete = async (id) => {
    await deleteAsset(id);
    load();
  };

  const handleRename = async (id) => {
    await renameAsset(id, editTitle);
    setEditingId(null);
    setEditTitle("");
    load();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">History Gallery</h1>
          <p className="text-sm text-slate-500">Your generated and edited images appear here.</p>
        </div>
        <Button onClick={load} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="mb-5">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, prompt, or type..."
          className="max-w-xl"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white">
          <ImageIcon className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-lg font-medium text-slate-700">No saved images yet</p>
          <p className="text-sm text-slate-500">Generate something to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.title || "Generated image"}
                className="h-64 w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
              />

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{item.title || "Untitled"}</h3>
                    <p className="text-xs text-slate-500">{item.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.edited && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">
                        Edited
                      </span>
                    )}
                    {item.favorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                  </div>
                </div>

                <p className="line-clamp-2 text-xs text-slate-500">{item.prompt}</p>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => navigate(`/editor/${item.id}`)} className="gap-1">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleFavorite(item.id)} className="gap-1">
                    <Heart className="h-3.5 w-3.5" /> Favorite
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}