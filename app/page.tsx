"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const steps = [
  {
    num: "01",
    title: "Create Your Data Structure",
    desc: "Define the type of information you want to collect.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Add Your Team",
    desc: "Invite workers or staff members to send updates through WhatsApp.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Receive Messages",
    desc: "Workers send normal WhatsApp messages.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "AI Organizes Everything",
    desc: "ChatSheet converts conversations into structured business records automatically.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
];

const features = [
  "Works directly with WhatsApp",
  "No app installation for workers",
  "AI-powered data extraction",
  "Custom workflows and schemas",
  "Real-time organized records",
  "Export to Excel and CSV",
  "Search and filter everything",
  "Built for operational teams",
];

const useCases = [
  {
    title: "Expense Tracking",
    desc: "Collect expenses directly from WhatsApp chats.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: "Inventory Updates",
    desc: "Track stock movement in real time.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    title: "Attendance Logs",
    desc: "Simple attendance reporting through messaging.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Field Reports",
    desc: "Capture operational updates instantly.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  WHATSAPP → SHEET ANIMATION                                        */
/* ------------------------------------------------------------------ */

function WhatsAppToSheetAnimation({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);

  useEffect(() => {
    if (!playing) {
      setPhase(0);
      return;
    }
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [playing]);

  const messageWords = [
    { text: "Delivered", highlight: false },
    { text: "25", highlight: true, field: "Quantity", color: "bg-amber-500/30 text-amber-200" },
    { text: "cement", highlight: false },
    { text: "bags", highlight: true, field: "Item", color: "bg-emerald-500/30 text-emerald-200" },
    { text: "to", highlight: false },
    { text: "Site B", highlight: true, field: "Location", color: "bg-blue-500/30 text-blue-200" },
  ];

  return (
    <div className="relative flex h-72 items-center justify-center overflow-hidden">
      {/* Phase 0–2: WhatsApp message */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{
          opacity: phase <= 2 ? 1 : 0,
          transform:
            phase === 0
              ? "scale(1)"
              : phase === 1
                ? "scale(1.02)"
                : phase === 2
                  ? "scale(0.95) translateY(-10px)"
                  : "scale(0.8) translateY(-30px)",
        }}
      >
        <div className="flex items-end gap-3 px-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-lg">👷</div>
          <div className="relative">
            {/* WhatsApp bubble tail */}
            <div
              className="absolute -left-2 bottom-1 h-4 w-4 rotate-45 rounded-sm"
              style={{ backgroundColor: "#075e54" }}
            />
            <div
              className="relative max-w-[220px] rounded-2xl rounded-bl-none px-4 py-3"
              style={{ backgroundColor: "#075e54" }}
            >
              <div className="flex flex-wrap gap-x-1.5 gap-y-1 text-sm text-white">
                {messageWords.map((w, i) => (
                  <span
                    key={i}
                    className="transition-all duration-500"
                    style={{
                      opacity: phase >= 1 && w.highlight ? 0.35 : 1,
                      transform:
                        phase === 2 && w.highlight
                          ? `translateY(-${20 + i * 8}px) scale(0.9)`
                          : "translateY(0) scale(1)",
                      transitionDelay: w.highlight ? `${i * 80}ms` : "0ms",
                    }}
                  >
                    {w.text}
                  </span>
                ))}
              </div>
              <div className="mt-1.5 flex items-center justify-end gap-1">
                <span className="text-[10px] text-white/50">10:42 AM</span>
                <svg className="h-3.5 w-3.5 text-blue-300" fill="currentColor" viewBox="0 0 16 15">
                  <path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033l-.358-.325a.319.319 0 00-.484.032l-.378.483a.418.418 0 00.036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 00-.064-.512zm-4.1 0l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flying highlights — words that extract out */}
      {phase >= 1 &&
        messageWords
          .filter((w) => w.highlight)
          .map((w, i) => (
            <div
              key={i}
              className={`pointer-events-none absolute z-20 rounded-full px-3 py-1 text-xs font-bold ${w.color} backdrop-blur-sm ring-1 ring-white/10 transition-all duration-700`}
              style={{
                opacity: phase === 1 ? 1 : phase === 2 ? 1 : 0,
                top: "45%",
                left: `${35 + i * 18}%`,
                transform:
                  phase === 1
                    ? "translateY(0) scale(1)"
                    : phase === 2
                      ? "translateY(-50px) scale(1.15)"
                      : "translateY(-80px) scale(0.5)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {w.field}
            </div>
          ))}

      {/* Sparkle particles during transition */}
      {phase === 2 &&
        Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`spark-${i}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400"
            style={{
              top: `${30 + Math.random() * 40}%`,
              left: `${20 + Math.random() * 60}%`,
              animation: `particleFly 0.8s ease-out forwards ${i * 60}ms`,
              opacity: 0.8,
            }}
          />
        ))}

      {/* Phase 3–4: Sheet / structured record */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-all duration-700"
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        }}
      >
        <div className="w-full max-w-[260px]">
          {/* Sheet header */}
          <div className="mb-2 flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-emerald-500/20 text-[9px] font-bold text-emerald-400 flex items-center justify-center">
              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Extracted Record</span>
          </div>

          {/* Mini table */}
          <div className="overflow-hidden rounded-lg border border-emerald-500/20 bg-[#0c1a26]">
            {/* Header row */}
            <div className="flex border-b border-white/5 bg-emerald-500/[0.08]">
              {["Field", "Value"].map((h) => (
                <div key={h} className="flex-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
                  {h}
                </div>
              ))}
            </div>
            {/* Data rows */}
            {[
              { label: "Item", value: "Cement Bags", delay: 0 },
              { label: "Quantity", value: "25", delay: 0.15 },
              { label: "Location", value: "Site B", delay: 0.3 },
              { label: "Status", value: "Delivered", delay: 0.45 },
            ].map((row) => (
              <div
                key={row.label}
                className="flex border-b border-white/[0.03] last:border-0"
                style={{
                  opacity: phase >= 4 ? 1 : 0,
                  transform: phase >= 4 ? "translateX(0)" : "translateX(-10px)",
                  transition: `opacity 0.35s ease-out ${row.delay}s, transform 0.35s ease-out ${row.delay}s`,
                }}
              >
                <div className="flex-1 px-3 py-2 text-[11px] text-slate-400">{row.label}</div>
                <div className="flex-1 px-3 py-2 text-[11px] font-semibold text-white">{row.value}</div>
              </div>
            ))}
          </div>

          {/* Auto-save indicator */}
          <div
            className="mt-2 flex items-center justify-end gap-1.5"
            style={{
              opacity: phase >= 4 ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.6s",
            }}
          >
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-[9px] text-slate-500">Synced to Sheet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ANIMATION HOOK                                                     */
/* ------------------------------------------------------------------ */

function useOnScreen<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useOnScreen<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  /* ---- From-This-To-This play-state ---- */
  const { ref: ftRef, visible: ftVisible } = useOnScreen<HTMLDivElement>(0.2);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b14]">
      {/* Ambient glow layers */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-emerald-400/[0.03] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[600px] rounded-full bg-blue-500/[0.03] blur-[100px]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <a href="#" className="flex items-center">
          <Image
            src="/chatSheetLogo2.png"
            alt="ChatSheet"
            width={320}
            height={80}
            className="h-20 w-auto"
            priority
          />
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-emerald-400">How It Works</a>
          <a href="#features" className="transition-colors hover:text-emerald-400">Features</a>
          <a href="#use-cases" className="transition-colors hover:text-emerald-400">Use Cases</a>
        </div>

        <div className="hidden md:block">
          <a
            href="#"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            Start Free
          </a>
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 md:hidden"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {showMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </nav>

      {showMenu && (
        <div className="relative z-10 border-t border-white/5 bg-[#050b14]/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-slate-300">
            <a href="#how-it-works" onClick={() => setShowMenu(false)} className="py-2">How It Works</a>
            <a href="#features" onClick={() => setShowMenu(false)} className="py-2">Features</a>
            <a href="#use-cases" onClick={() => setShowMenu(false)} className="py-2">Use Cases</a>
            <a href="#" className="mt-2 rounded-lg bg-emerald-500 py-3 text-center font-semibold text-black">
              Start Free
            </a>
          </div>
        </div>
      )}

      {/* ======================= HERO ======================= */}
      <section className="relative z-10 px-6 pt-16 pb-12 text-center md:px-12 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <FadeUp>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Turn WhatsApp chats into{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                organized business data
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              ChatSheet automatically converts worker messages into structured records, spreadsheets, and operational reports.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
              >
                Start Free
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-500 hover:bg-white/10"
              >
                Book Demo
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ======================= SOCIAL PROOF ======================= */}
      <section className="relative z-10 px-6 pb-20 text-center md:px-12">
        <FadeUp>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
            Trusted by operational teams, field workers, and growing businesses.
          </p>
        </FadeUp>
      </section>

      {/* ======================= HOW IT WORKS ======================= */}
      <section id="how-it-works" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
              How It <span className="text-emerald-400">Works</span>
            </h2>
          </FadeUp>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <FadeUp key={step.num} delay={idx * 0.12}>
                <div className="relative">
                  <div className="mb-6 inline-flex rounded-2xl bg-emerald-500/10 p-4 text-emerald-400 ring-1 ring-emerald-500/20">
                    {step.icon}
                  </div>
                  <div className="mb-2 text-xs font-black uppercase tracking-widest text-emerald-500/70">
                    Step {step.num}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FROM THIS → TO THIS (ANIMATED) ======================= */}
      <section ref={ftRef} className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
              From This <span className="text-slate-600">&rarr;</span>{" "}
              <span className="text-emerald-400">To This</span>
            </h2>
          </FadeUp>

          <div className="grid items-center gap-6 md:grid-cols-3">
            {/* ── FROM THIS ── */}
            <div
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8"
              style={{
                opacity: ftVisible ? 1 : 0,
                transform: ftVisible ? "translateX(0)" : "translateX(-30px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              }}
            >
              <div className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-500">From This</div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-lg">👷</div>
                <div
                  className="rounded-2xl rounded-tl-none bg-white/5 px-4 py-3 text-sm text-slate-300"
                  style={{
                    opacity: ftVisible ? 1 : 0,
                    transform: ftVisible ? "scale(1)" : "scale(0.9)",
                    transition: "opacity 0.5s ease-out 0.5s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.5s",
                  }}
                >
                  Delivered 25 cement bags to Site B
                </div>
              </div>
            </div>

            {/* ── ARROW ── */}
            <div
              className="flex justify-center"
              style={{
                opacity: ftVisible ? 1 : 0,
                transition: "opacity 0.5s ease-out 0.8s",
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  style={{
                    animation: ftVisible ? "bounceArrow 1.2s ease-in-out infinite 1.2s" : "none",
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>

            {/* ── TO THIS ── */}
            <div
              className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-6 sm:p-8"
              style={{
                opacity: ftVisible ? 1 : 0,
                transform: ftVisible ? "translateX(0)" : "translateX(30px)",
                transition: "opacity 0.6s ease-out 1s, transform 0.6s ease-out 1s",
                animation: ftVisible ? "glowPulse 3s ease-in-out infinite 1.4s" : "none",
              }}
            >
              <div className="mb-5 text-xs font-bold uppercase tracking-widest text-emerald-500">To This</div>
              <WhatsAppToSheetAnimation playing={ftVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* ======================= FEATURES ======================= */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl">
          <FadeUp>
            <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
              Why <span className="text-emerald-400">ChatSheet</span>
            </h2>
          </FadeUp>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, idx) => (
              <FadeUp key={f} delay={idx * 0.06}>
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 transition-all hover:border-emerald-500/20 hover:bg-white/[0.04]">
                  <svg className="h-5 w-5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-200">{f}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= USE CASES ======================= */}
      <section id="use-cases" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
              Use <span className="text-emerald-400">Cases</span>
            </h2>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((uc, idx) => (
              <FadeUp key={uc.title} delay={idx * 0.1}>
                <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
                  <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                    {uc.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">{uc.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{uc.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= DASHBOARD PREVIEW ======================= */}
      <section className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Everything organized in <span className="text-emerald-400">one place</span>
              </h2>
              <p className="mx-auto max-w-xl text-slate-400">
                Monitor incoming entries, manage workers, review structured data, and export reports anytime.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-emerald-500/15 to-transparent blur-xl" />
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a1420] shadow-2xl">
                {/* Fake window chrome */}
                <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-slate-500">
                    chatsheet.app/dashboard
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/5" />
                    <div className="h-8 w-24 rounded-lg bg-white/10" />
                    <div className="hidden h-8 w-20 rounded-lg bg-emerald-500/20 sm:block" />
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Dummy buttons */}
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-white/5 transition-colors hover:bg-white/10 hover:text-slate-300">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21.75l-.581-.323A2.25 2.25 0 016.75 19.5v-2.927a2.25 2.25 0 00-.659-1.591L.659 9.678A2.25 2.25 0 010 8.087V7.043c0-.54.384-1.006.917-1.096A49.434 49.434 0 0112 3z" />
                      </svg>
                      Filter
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-white/5 transition-colors hover:bg-white/10 hover:text-slate-300">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Export CSV
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/25">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      New Entry
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-white/5 transition-colors hover:bg-white/10 hover:text-slate-300">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Refresh
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="px-4 py-4 sm:px-6">
                  <div className="overflow-hidden rounded-lg border border-white/5">
                    <div className="flex gap-4 bg-white/[0.03] px-4 py-3">
                      {["Worker", "Type", "Data", "Time"].map((h) => (
                        <div key={h} className="flex-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                          {h}
                        </div>
                      ))}
                    </div>
                    {[
                      { worker: "Ravi K.", type: "Inventory", data: "Cement Bags: 25 at Site B", time: "10:42 AM" },
                      { worker: "Priya M.", type: "Expense", data: "Fuel: Rs. 1,200 receipt", time: "10:15 AM" },
                      { worker: "Amit S.", type: "Attendance", data: "Clock-in at HQ", time: "09:30 AM" },
                      { worker: "Deepak R.", type: "Field Report", data: "Site inspection complete", time: "09:00 AM" },
                    ].map((row, i) => (
                      <div key={i} className="flex gap-4 border-t border-white/5 px-4 py-3 hover:bg-white/[0.02]">
                        <div className="flex-1 text-sm text-slate-300">{row.worker}</div>
                        <div className="flex-1">
                          <span className="inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                            {row.type}
                          </span>
                        </div>
                        <div className="flex-1 text-sm text-slate-400">{row.data}</div>
                        <div className="flex-1 text-xs text-slate-500">{row.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ======================= FINAL CTA ======================= */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <FadeUp>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0a1420] px-8 py-20 text-center md:px-16">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[80px]" />

            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
              Your workforce already chats.
            </h2>
            <h3 className="mb-6 text-3xl font-bold text-emerald-400 sm:text-4xl">
              Now your database can too.
            </h3>
            <p className="mx-auto mb-10 max-w-lg text-slate-400">
              Start collecting structured operational data through WhatsApp in minutes.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 text-base font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.35)]"
            >
              Get Started
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </FadeUp>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-14 md:px-12">
        <FadeUp>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
            <div className="flex items-center">
              <Image
                src="/chatSheetLogo2.png"
                alt="ChatSheet"
                width={280}
                height={70}
                className="h-20 w-auto"
              />
            </div>
            <p className="text-2xl font-light tracking-wide text-slate-400">
              Capture. Organize. Export.
            </p>
            <p className="text-sm text-slate-600">
              Built with Next.js + Tailwind. Open source.
            </p>
          </div>
        </FadeUp>
      </footer>

      {/* ======================= KEYFRAME STYLES ======================= */}
      <style>{`
        @keyframes bounceArrow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(16,185,129,0); }
          50% { box-shadow: 0 0 30px rgba(16,185,129,0.15); }
        }
        @keyframes particleFly {
          0%   { opacity: 0.8; transform: translate(0, 0) scale(1); }
          100% { opacity: 0;   transform: translate(var(--tx, 20px), var(--ty, -30px)) scale(0.2); }
        }
      `}</style>
    </div>
  );
}
