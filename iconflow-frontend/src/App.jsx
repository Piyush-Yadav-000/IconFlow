import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
import Landing from "@/pages/Landing";
import LogoGenerator from "@/pages/LogoGenerator";
import IconGenerator from "@/pages/IconGenerator";
import GhibliGenerator from "@/pages/GhibliGenerator";
import BackgroundRemover from "@/pages/BackgroundRemover";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import HistoryGallery from "@/pages/HistoryGallery";
import FavoritesGallery from "@/pages/FavoritesGallery";
import AssetEditor from "@/pages/AssetEditor";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/logo" element={<LogoGenerator />} />
                <Route path="/icon" element={<IconGenerator />} />
                <Route path="/ghibli" element={<GhibliGenerator />} />
                <Route path="/remove-bg" element={<BackgroundRemover />} />
              </Route>
              <Route element={<ProtectedRoute />}>
  <Route path="/logo" element={<LogoGenerator />} />
  <Route path="/icon" element={<IconGenerator />} />
  <Route path="/ghibli" element={<GhibliGenerator />} />
  <Route path="/remove-bg" element={<BackgroundRemover />} />
  <Route path="/history" element={<HistoryGallery />} />
  <Route path="/favorites" element={<FavoritesGallery />} />
  <Route path="/editor/:id" element={<AssetEditor />} />
</Route>
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}