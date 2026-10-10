import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Cpu,
  ChevronDown,
  Wand2,
  ImageIcon,
  Scissors,
  ScanSearch,
  Zap,
  CheckCircle2,
  Bird,
  Cat,
  MessageCircle,
  Mountain,
  Ghost,
  Car,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* -----------------------------------------------------------------------
   Forma — token system
   ink        #0E0F13  primary text
   paper      #FFFFFF  page background
   mist       #667085  secondary / muted text
   hairline   #E7E8EC  borders, dividers
   cobalt     #2F5CFF  signature accent (buttons, links, active states)
   cobalt-050 #EEF2FF  accent tint (chips, hovers)
   dusk       #0B0E1A  contrast section (final CTA)
   Display face: Space Grotesk — a little mechanical, drawn like a stencil
   Body face:    Inter
   Utility/mono: IBM Plex Mono — coordinates & counters, the "spec sheet" voice
------------------------------------------------------------------------ */

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  .forma-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  .font-display { font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; }
  .font-mono-forma { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

  @keyframes forma-marquee-left {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes forma-marquee-right {
    from { transform: translateX(-50%); }
    to { transform: translateX(0); }
  }
  .forma-track {
    display: flex;
    width: max-content;
    animation: forma-marquee-left 46s linear infinite;
  }
  .forma-track-rev {
    animation: forma-marquee-right 54s linear infinite;
  }
  .forma-marquee:hover .forma-track {
    animation-play-state: paused;
  }
  @media (prefers-reduced-motion: reduce) {
    .forma-track, .forma-track-rev { animation: none; }
  }
`;

/* ---------- asset tiles for the signature marquee ---------- */

const tileDefs = [
  { kind: "mark", letter: "N", from: "#2F5CFF", to: "#7C93FF" },
  { kind: "icon", Icon: MessageCircle, from: "#111318", to: "#3A3F4B" },
  { kind: "icon", Icon: Car, from: "#1E3A8A", to: "#3B82F6" },
  { kind: "scene", Icon: Mountain, from: "#0F766E", to: "#5EEAD4" },
  { kind: "mark", letter: "V", from: "#7C3AED", to: "#C4B5FD" },
  { kind: "cutout", Icon: Cat, from: "#F3F4F6", to: "#E5E7EB", dark: true },
  { kind: "icon", Icon: Ghost, from: "#111318", to: "#4B5563" },
  { kind: "scene", Icon: Bird, from: "#0369A1", to: "#7DD3FC" },
  { kind: "mark", letter: "K", from: "#EA580C", to: "#FDBA74" },
  { kind: "icon", Icon: Wand2, from: "#2F5CFF", to: "#93C5FD" },
  { kind: "cutout", Icon: ImageIcon, from: "#F3F4F6", to: "#E5E7EB", dark: true },
  { kind: "mark", letter: "R", from: "#BE123C", to: "#FDA4AF" },
  { kind: "scene", Icon: Sparkles, from: "#4338CA", to: "#A5B4FC" },
  { kind: "icon", Icon: Scissors, from: "#111318", to: "#3A3F4B" },
];

function AssetTile({ def }) {
  const { kind, Icon, letter, from, to, dark } = def;
  return (
    <div
      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] shadow-[0_8px_24px_rgba(15,15,20,0.10)] md:h-24 md:w-24"
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {kind === "mark" ? (
        <span className="font-display text-3xl font-semibold text-white/95 md:text-4xl">
          {letter}
        </span>
      ) : (
        <Icon
          className={`h-8 w-8 md:h-9 md:w-9 ${dark ? "text-slate-500" : "text-white/95"}`}
          strokeWidth={1.75}
        />
      )}
    </div>
  );
}

function Marquee({ reverse = false }) {
  const tiles = reverse ? [...tileDefs].reverse() : tileDefs;
  const doubled = [...tiles, ...tiles];
  return (
    <div className="forma-marquee overflow-hidden">
      <div className={`forma-track gap-4 ${reverse ? "forma-track-rev" : ""}`}>
        {doubled.map((def, i) => (
          <AssetTile def={def} key={`${reverse ? "r" : "f"}-${i}`} />
        ))}
      </div>
    </div>
  );
}

/* ---------- shared atoms ---------- */

function Eyebrow({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E8EC] bg-white px-3.5 py-1.5 font-mono-forma text-[11px] uppercase tracking-[0.14em] text-[#667085]">
      {children}
    </span>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const nav = [
  { label: "Showcase", href: "#showcase" },
  { label: "Studio", href: "#studio" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const primaryFeatures = [
  {
    tag: "01 — Identity",
    title: "Logo Generator",
    description:
      "Describe the brand, not the pixels. Forma proposes mark, type, and color together, then lets you refine each independently until it's unmistakably yours.",
    icon: Sparkles,
    to: "/logo",
    from: "#2F5CFF",
    to2: "#93C5FD",
  },
  {
    tag: "02 — Illustration",
    title: "Ghibli Generator",
    description:
      "Turn a plain concept into a cinematic scene — soft light, hand‑painted texture, and a sense of place, tuned for hero images and story panels.",
    icon: Wand2,
    to: "/ghibli",
    from: "#0F766E",
    to2: "#5EEAD4",
  },
  {
    tag: "03 — Isolation",
    title: "Background Remover",
    description:
      "Clean cutouts with edges that survive close inspection — hair, glass, and fine detail preserved, ready to drop onto any background.",
    icon: Scissors,
    to: "/remove-bg",
    from: "#111318",
    to2: "#4B5563",
  },
];

const minorFeatures = [
  {
    title: "App Icon Generator",
    description: "Balanced, platform‑ready icons that hold up at 29px and 1024px alike.",
    icon: ImageIcon,
    to: "/icon",
  },
  {
    title: "Prompt Enhancer",
    description: "Rewrites your brief for sharper composition and more consistent output.",
    icon: ScanSearch,
  },
  {
    title: "AI Image Upscaler",
    description: "Recovers detail and lifts resolution without the plastic look.",
    icon: Zap,
  },
];

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Creative Director, Studio Nine",
    text: "The first tool that feels considered rather than assembled. It reads like something a type designer signed off on.",
  },
  {
    name: "Sara Khan",
    role: "Product Designer",
    text: "I stopped opening five tabs. Logo, icon, and cutout in the same flow, with results I'd actually ship.",
  },
  {
    name: "Rohit Verma",
    role: "Founder, Northline",
    text: "Our landing page went from placeholder to production in an afternoon. The marks hold up at any size.",
  },
];

const faqs = [
  {
    q: "Can I use the output commercially?",
    a: "Yes. Every asset you generate on a paid plan is yours to use commercially, with no attribution required.",
  },
  {
    q: "Do you keep my uploads or prompts?",
    a: "Uploads are used only to generate your result and are removed from active storage after 30 days.",
  },
  {
    q: "What file formats do I get?",
    a: "PNG and SVG for marks and icons, PNG for scenes and cutouts, with platform‑ready size sets included.",
  },
];

export default function Landing() {
  const shouldReduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="forma-root relative min-h-screen bg-white text-[#0E0F13]">
      <style>{fontStyles}</style>

      <main>
        {/* Hero */}
{/* Hero */}
<section className="relative overflow-hidden px-6 pb-16 pt-18 md:pt-28">
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute left-1/2 top-[-8%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(47,92,255,0.16),transparent_65%)] blur-3xl" />
    <div className="absolute right-[-12%] top-[15%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.10),transparent_65%)] blur-3xl" />
    <div className="absolute bottom-[-12%] left-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_65%)] blur-3xl" />
  </div>

  <div className="mx-auto max-w-8xl">
    <div className="mx-auto max-w-4xl text-center">
      <Reveal>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E7E8EC] bg-blue-50 px-4 py-2 text-sm font-medium text-[#158a97] shadow-sm">
          <span className="text-[#2feaff]">✨</span>
          Get a free credit on sign up
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="font-display mt-8 text-[2.8rem] font-semibold leading-[1.03] tracking-tight text-[#0E0F13] sm:text-6xl md:text-[4.8rem]">
          Generate <span className="text-cyan-400">designer-grade</span>
          <br />
          app icons in seconds
        </h1>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#667085] sm:text-lg">
          Create premium, production-ready app icons using AI that scale flawlessly across iOS and Android. No design skills required.
        </p>
      </Reveal>

     <Reveal delay={0.15}>
  <div className="mt-8 flex justify-center">
    <Button
      asChild
      size="lg"
      className="group h-14 rounded-2xl bg-cyan-400 border-2 px-8 py-5 font-bold text-lg text-white shadow-[0_14px_40px_rgba(47,92,255,0.28)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_50px_rgba(47,92,255,0.34)] active:scale-[0.98]"
    >
      <Link to="/icon" className="flex items-center">
        Get Your First Icon
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Button>
  </div>
</Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs font-mono-forma uppercase tracking-[0.12em] text-[#667085]">
          <span className="rounded-full border border-[#E7E8EC] bg-white px-4 py-2">iOS ready</span>
          <span className="rounded-full border border-[#E7E8EC] bg-white px-4 py-2">Android ready</span>
          <span className="rounded-full border border-[#E7E8EC] bg-white px-4 py-2">SVG + PNG export</span>
        </div>
      </Reveal>
    </div>

    <Reveal delay={0.12} className="mt-14">
      <div className="relative mx-auto max-w-5xl">
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-4 top-10 z-10 hidden rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:block"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF2FF]">
              <Sparkles className="h-5 w-5 text-[#2F5CFF]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0E0F13]">Smart Variations</div>
              <div className="text-xs text-[#667085]">Multiple icon styles</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 top-24 z-10 hidden rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:block"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0E0F13]">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#0E0F13]">Pixel Perfect</div>
              <div className="text-xs text-[#667085]">Sharp at every size</div>
            </div>
          </div>
        </motion.div>

        <div className="rounded-[36px] border border-[#E7E8EC] bg-white p-4 shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 rounded-[28px] bg-gradient-to-br from-[#F8FAFF] via-white to-[#F4F7FF] p-5 md:grid-cols-[1.25fr_0.75fr] md:p-6">
            <motion.div
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-[28px] bg-[#2F5CFF] p-6 text-white shadow-lg shadow-[#2F5CFF]/20"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono-forma uppercase tracking-[0.14em] text-white/70">
                  Featured preview
                </div>
                <Badge className="rounded-full bg-white/15 text-white hover:bg-white/15">
                  Live
                </Badge>
              </div>

              <div className="mt-8 flex items-center justify-center">
                <div className="flex h-40 w-40 items-center justify-center rounded-[34px] bg-white/15 backdrop-blur-sm">
                  <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                    <ImageIcon className="h-14 w-14 text-[#2F5CFF]" />
                  </div>
                </div>
              </div>

              <h3 className="mt-8 font-display text-2xl font-semibold">
                Icon that feels premium
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
                Built for app stores, launch screens, and product branding — clean, balanced, and instantly usable.
              </p>
            </motion.div>

            <div className="grid gap-4">
              <motion.div
                whileHover={{ y: -3 }}
                className="rounded-[28px] border border-[#E7E8EC] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF]">
                    <Wand2 className="h-5 w-5 text-[#2F5CFF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0E0F13]">AI Style Control</h4>
                    <p className="text-sm text-[#667085]">Minimal, 3D, glass, flat, bold</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="rounded-[28px] border border-[#E7E8EC] bg-[#0E0F13] p-5 text-white shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Production Ready</h4>
                    <p className="text-sm text-white/65">Scale across iOS and Android</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="rounded-[28px] border border-[#E7E8EC] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF2FF]">
                    <CheckCircle2 className="h-5 w-5 text-[#2F5CFF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0E0F13]">Free to Start</h4>
                    <p className="text-sm text-[#667085]">Try it with one free credit</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  </div>
</section>

        {/* Signature marquee */}
        <section className="mt-6 space-y-4 py-6">
          <Marquee />
          <Marquee reverse />
        </section>

        {/* How it works */}
        <section id="studio" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>Magic in motion</Eyebrow>
            <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Three steps from idea to export
            </h2>
            <p className="mt-4 text-base leading-7 text-[#667085]">
              No layers, no brushes — describe what you need and shape it from there.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-[#E7E8EC] bg-[#E7E8EC] sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Describe",
                text: "Enter a prompt or pick a generator built for the asset you need.",
              },
              {
                n: "02",
                title: "Refine",
                text: "Nudge composition, palette, and style with live previews as you go.",
              },
              {
                n: "03",
                title: "Export",
                text: "Download platform‑ready files — PNG, SVG, and full icon size sets.",
              },
            ].map((step) => (
              <div key={step.n} className="bg-white p-8">
                <span className="font-mono-forma text-sm text-[#2F5CFF]">{step.n}</span>
                <h3 className="font-display mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-6 text-[#667085]">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Alternating primary features */}
        <section id="showcase" className="border-y border-[#E7E8EC] bg-[#FAFAFB] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Ideas into production‑ready assets</Eyebrow>
              <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for the parts that are hard to get right
              </h2>
            </Reveal>

            <div className="mt-16 space-y-20">
              {primaryFeatures.map((feature, i) => (
                <Reveal key={feature.title}>
                  <div
                    className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                      i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div
                      className="flex aspect-[4/3] items-center justify-center rounded-[28px] p-10"
                      style={{
                        background: `linear-gradient(135deg, ${feature.from}, ${feature.to2})`,
                      }}
                    >
                      <div className="flex h-28 w-28 items-center justify-center rounded-[24px] bg-white/15 backdrop-blur-sm md:h-36 md:w-36">
                        <feature.icon className="h-14 w-14 text-white md:h-16 md:w-16" strokeWidth={1.5} />
                      </div>
                    </div>

                    <div>
                      <span className="font-mono-forma text-xs uppercase tracking-[0.14em] text-[#2F5CFF]">
                        {feature.tag}
                      </span>
                      <h3 className="font-display mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                        {feature.title}
                      </h3>
                      <p className="mt-4 max-w-md text-base leading-7 text-[#667085]">
                        {feature.description}
                      </p>
                      <Link
                        to={feature.to}
                        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0E0F13] hover:text-[#2F5CFF]"
                      >
                        Try {feature.title}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* minor features */}
            <div className="mt-20 grid gap-6 sm:grid-cols-3">
              {minorFeatures.map((f) => (
                <Reveal key={f.title}>
                  <div className="h-full rounded-2xl border border-[#E7E8EC] bg-white p-6">
                    <f.icon className="h-6 w-6 text-[#2F5CFF]" strokeWidth={1.75} />
                    <h4 className="font-display mt-4 text-lg font-semibold">{f.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#667085]">{f.description}</p>
                    {f.to ? (
                      <Link
                        to={f.to}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2F5CFF]"
                      >
                        Launch <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <p className="mt-4 text-xs font-medium text-[#9CA3AF]">
                        Included in every generator
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>Word of mouth</Eyebrow>
            <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Trusted by people who ship
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Reveal key={t.name}>
                <div className="h-full rounded-2xl border border-[#E7E8EC] p-6">
                  <p className="text-sm leading-6 text-[#374151]">"{t.text}"</p>
                  <Separator className="my-5 bg-[#E7E8EC]" />
                  <div className="font-display text-sm font-semibold">{t.name}</div>
                  <div className="font-mono-forma text-xs text-[#9CA3AF]">{t.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-t border-[#E7E8EC] bg-[#FAFAFB] py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Eyebrow>Pricing</Eyebrow>
              <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Start free, scale when it's working
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-3xl border border-[#E7E8EC] bg-white p-8">
                  <h3 className="font-display text-xl font-semibold">Starter</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    For trying the generators and validating an idea.
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold">Free</span>
                  </div>
                  <Separator className="my-6 bg-[#E7E8EC]" />
                  <ul className="space-y-3">
                    {["Logo generator", "App icon generator", "Prompt enhancer"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                        <CheckCircle2 className="h-4 w-4 text-[#2F5CFF]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-8 w-full rounded-full border-[#E7E8EC]"
                  >
                    <Link to="/logo">Start free</Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="relative h-full rounded-3xl border border-[#2F5CFF] bg-white p-8">
                  <Badge className="absolute -top-3 left-8 rounded-full bg-[#2F5CFF] px-3 py-1 text-xs text-white hover:bg-[#2F5CFF]">
                    Most popular
                  </Badge>
                  <h3 className="font-display text-xl font-semibold">Pro</h3>
                  <p className="mt-2 text-sm text-[#667085]">
                    For creators and teams shipping every week.
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold">₹999</span>
                    <span className="font-mono-forma text-sm text-[#9CA3AF]">/month</span>
                  </div>
                  <Separator className="my-6 bg-[#E7E8EC]" />
                  <ul className="space-y-3">
                    {[
                      "Every generator, unlimited style",
                      "Background remover & upscaler",
                      "Vector (SVG) export",
                      "Priority render queue",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[#374151]">
                        <CheckCircle2 className="h-4 w-4 text-[#2F5CFF]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-8 w-full rounded-full bg-[#2F5CFF] hover:bg-[#2449CC]">
                    <Link to="/logo">Go Pro</Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <Reveal className="text-center">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="font-display mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Common questions
            </h2>
          </Reveal>

          <div className="mt-12 divide-y divide-[#E7E8EC] rounded-2xl border border-[#E7E8EC]">
            {faqs.map((item, i) => (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-medium">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-6 text-[#667085]">{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA — the one dark, high-contrast beat */}
        <section className="bg-[#0B0E1A] py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Designer‑grade assets,
              <br />
              minus the designer.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/60">
              Your project's first impression starts here. Try it free — no card required.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full bg-[#2F5CFF] px-7 font-medium hover:bg-[#4B74FF]"
              >
                <Link to="/logo">
                  Try Forma free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mx-auto mt-12 flex max-w-md items-center justify-center gap-8 font-mono-forma text-[11px] uppercase tracking-[0.1em] text-white/35">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Commercial use
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" /> Fast pipelines
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E7E8EC] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#2F5CFF]">
                  <span className="h-2 w-2 rotate-45 bg-white" />
                </span>
                <span className="font-display text-base font-semibold">Forma</span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-[#9CA3AF]">
                An AI design studio for logos, icons, scenes, and clean cutouts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-3 font-mono-forma text-xs uppercase tracking-[0.08em] text-[#667085] sm:grid-cols-3">
              <a href="#showcase" className="hover:text-[#0E0F13]">Showcase</a>
              <a href="#pricing" className="hover:text-[#0E0F13]">Pricing</a>
              <a href="#faq" className="hover:text-[#0E0F13]">FAQ</a>
              <Link to="/logo" className="hover:text-[#0E0F13]">Studio</Link>
              <span className="text-[#D1D5DB]">Privacy</span>
              <span className="text-[#D1D5DB]">Terms</span>
            </div>
          </div>

          <Separator className="my-8 bg-[#E7E8EC]" />
          <p className="font-mono-forma text-xs text-[#9CA3AF]">© 2026 Forma. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}