// src/components/Avatar.jsx
export default function Avatar({ name, size = "h-8 w-8" }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      className={`flex ${size} items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white shadow`}
      title={name || "User"}
    >
      {initial}
    </div>
  );
}