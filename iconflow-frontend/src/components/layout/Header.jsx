import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/Avatar";

const navLinks = [
  { label: "Logo", to: "/logo" },
  { label: "Icon", to: "/icon" },
  { label: "Ghibli", to: "/ghibli" },
  { label: "Remove BG", to: "/remove-bg" },
  { label: "History", to: "/history" },
  { label: "Favorites", to: "/favorites" },
];

const BLOB_PATHS = [
  "M50 6C68 4 88 18 92 40C96 62 84 84 62 92C40 100 14 92 6 70C-2 48 6 24 26 12C34 7 42 7 50 6Z",
  "M52 4C72 8 90 22 90 44C90 66 76 88 54 92C32 96 10 84 6 62C2 40 12 18 32 8C38 5 46 3 52 4Z",
  "M48 8C66 2 90 10 94 34C98 58 90 82 66 92C42 102 12 92 6 68C0 44 10 20 30 10C36 7 42 9 48 8Z",
  "M50 6C68 4 88 18 92 40C96 62 84 84 62 92C40 100 14 92 6 70C-2 48 6 24 26 12C34 7 42 7 50 6Z",
];

function FlowMark({ reduceMotion }) {
  return (
    <motion.div
      whileHover={{
        rotate: reduceMotion ? 0 : 8,
        scale: 1.05,
      }}
      whileTap={{ scale: 0.94 }}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-10 w-10 drop-shadow-[0_6px_16px_rgba(124,92,252,0.25)]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="flow-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        <motion.path
          fill="url(#flow-gradient)"
          d={BLOB_PATHS[0]}
          animate={
            reduceMotion
              ? undefined
              : {
                  d: BLOB_PATHS,
                }
          }
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          }}
        />
      </svg>

      <span className="absolute h-2.5 w-2.5 rounded-full bg-white/90 shadow-sm" />
    </motion.div>
  );
}

function getUserCredits(user) {
  const credits =
    user?.credits ??
    user?.creditBalance ??
    user?.remainingCredits ??
    0;

  const numericCredits = Number(credits);

  if (!Number.isFinite(numericCredits)) {
    return "0";
  }

  return numericCredits.toLocaleString();
}

function UserChip({ user, onLogout }) {
  const credits = getUserCredits(user);

  return (
    <div
      className="
        flex w-full min-w-0 items-center gap-3 rounded-2xl
        border border-slate-200 bg-white px-3 py-2.5
        shadow-[0px_2px_0px_0px_rgba(255,255,255,0.8)_inset,0px_1px_3px_rgba(15,23,42,0.08)]
        sm:rounded-full
        md:w-auto
      "
    >
      <Avatar name={user?.name || "User"} />

      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold text-slate-900">
          {user?.name || "User"}
        </p>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-xs text-slate-500">
            Available credits
          </span>

          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-700">
            {credits}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="
          shrink-0 rounded-full border border-slate-200
          bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700
          transition hover:bg-slate-100 active:scale-95
        "
      >
        Logout
      </button>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [hidden, setHidden] = useState(false);

  const reduceMotion = useReducedMotion();
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const onScroll = () => {
      setHidden(window.scrollY > 40);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{
        y: hidden ? -120 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="sticky top-0 z-50 w-full bg-transparent"
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4 md:h-20">
        <Link
          to="/"
          className="group flex min-w-0 shrink-0 items-center gap-3"
        >
          <FlowMark reduceMotion={reduceMotion} />

          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-space-grotesk text-[15px] font-semibold tracking-tight text-slate-900">
              IconFlow
            </span>

            <span className="hidden font-inter text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
              AI Design Studio
            </span>
          </div>
        </Link>

        <nav
          onMouseLeave={() => setHovered(null)}
          className="relative hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((item, index) => (
            <Link
              key={item.label}
              to={item.to}
              onMouseEnter={() => setHovered(index)}
              className="
                relative rounded-full px-4 py-2
                font-inter text-lg font-medium text-slate-700
                transition-colors hover:text-slate-900
              "
            >
              {hovered === index && (
                <motion.span
                  layoutId="nav-hover-flow"
                  className="
                    absolute inset-0 rounded-full bg-slate-100
                    shadow-[0px_2px_0px_0px_rgba(255,255,255,0.8)_inset,0px_1px_3px_rgba(15,23,42,0.08)]
                  "
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}

              <span className="relative z-10">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 items-center gap-2">
          {token && user ? (
            <div className="hidden md:block">
              <UserChip
                user={user}
                onLogout={handleLogout}
              />
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="
                  rounded-full border border-slate-200 bg-white
                  px-4 py-2 font-inter text-lg font-medium text-slate-900
                  shadow-[0px_2px_0px_0px_rgba(255,255,255,0.8)_inset,0px_1px_3px_rgba(15,23,42,0.08)]
                  transition-all duration-200 hover:border-slate-300 hover:bg-slate-50
                  active:scale-[0.98]
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-full bg-black px-4 py-2
                  font-inter text-lg font-medium text-white
                  shadow-[0px_2px_0px_0px_rgba(255,255,255,0.8)_inset,0px_1px_3px_rgba(15,23,42,0.08)]
                  transition-all duration-200 hover:bg-slate-900
                  active:scale-[0.98]
                "
              >
                Register
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((value) => !value)}
            className="shrink-0 rounded-full text-slate-700 md:hidden"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{
                  rotate: -90,
                  opacity: 0,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
                }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.28,
              ease: "easeOut",
            }}
            className="overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-2xl md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className="
                      flex items-center justify-between rounded-2xl
                      px-4 py-3 font-inter text-sm font-medium
                      text-slate-700 transition hover:bg-slate-100
                      hover:text-slate-950
                    "
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                  </Link>
                ))}
              </div>

              <div className="mt-4">
                {token && user ? (
                  <UserChip
                    user={user}
                    onLogout={handleLogout}
                  />
                ) : (
                  <div className="flex w-full items-center gap-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="
                        flex-1 rounded-full border border-slate-200
                        bg-white px-4 py-2 text-center
                        font-inter text-sm font-medium text-slate-900
                      "
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="
                        flex-1 rounded-full bg-black px-4 py-2
                        text-center font-inter text-sm font-medium text-white
                      "
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-3xl bg-gradient-to-br from-slate-50 to-white p-4">
                <Badge className="mb-3 rounded-full bg-white font-inter text-slate-700">
                  New
                </Badge>

                <p className="font-inter text-sm leading-6 text-slate-600">
                  Generate premium logos, icons, and art in seconds.
                </p>

                <Button
                  asChild
                  className="
                    mt-4 w-full  rounded-2xl
                    bg-gradient-to-r from-violet-600 to-fuchsia-600
                    font-inter text-white
                    hover:from-violet-700 hover:to-fuchsia-700
                  "
                >
                  <Link
                    to="/logo"
                    onClick={closeMobileMenu}
                  >
                    Start creating
                    {/* <ArrowRight className="h-4 w-4" /> */}
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}