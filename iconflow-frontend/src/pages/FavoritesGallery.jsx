"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getFavorites, toggleFavorite } from "@/lib/assetsApi";

export default function FavoritesGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getFavorites();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const removeFavorite = async (id) => {
    const updated = await toggleFavorite(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Favorites</h1>
      <p className="mb-6 text-sm text-slate-500">Your saved favorite generations.</p>

      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <img src={item.imageUrl} alt={item.title || "Favorite"} className="h-64 w-full object-cover" />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900">{item.title || "Untitled"}</h3>
              <p className="mb-3 text-xs text-slate-500">{item.type}</p>
              <div className="flex gap-2">
                <Button onClick={() => navigate(`/editor/${item.id}`)} size="sm" className="gap-1">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button onClick={() => removeFavorite(item.id)} size="sm" variant="outline" className="gap-1">
                  <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> Unfavorite
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}