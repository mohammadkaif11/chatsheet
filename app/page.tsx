"use client";

import { useEffect, useRef, useState } from "react";
import { joinWaitlist } from "./actions/waitlist";
import { requestDemo } from "./actions/demo";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const painPoints = [
  {
    title: "The Midnight Delay",
    desc: "Your truck finishes loading at 2:00 AM, but your accountant is asleep. The vehicle sits stranded at the factory gate until morning.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    ),
  },
  {
    title: "Costly Manual Errors",
    desc: "Typing mistakes in a vehicle number or GSTIN on the government portal lead to transit delays and heavy GST penalties of up to ₹10,000+.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    title: "Complex Desktop Software",
    desc: "Traditional ERP systems (like Tally or Zoho) are too complicated for a warehouse loader or site supervisor to operate on the move.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Just Send a Text on WhatsApp",
    desc: "Your warehouse supervisor simply texts our bot in casual language: \"Truck HR-38 loaded with 500 bags of cement for Gupta Agency.\"",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Our AI Does the Heavy Lifting",
    desc: "The engine instantly extracts the text, matches the client's GSTIN, grabs the correct HSN Code, calculates tax value, and auto-fetches pincode distance.",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "PDF Sent Directly to the Driver",
    desc: "The official government-approved E-Way Bill PDF and QR code are automatically delivered straight back to the driver's phone. The truck moves instantly!",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

const features = [
  {
    title: "Simple Text-to-Bill",
    desc: "No technical knowledge needed. If your warehouse staff can send a WhatsApp text, they can generate an E-Way Bill.",
    icon: "💬",
  },
  {
    title: "100% Secure & Compliant",
    desc: "Data privacy is our priority. We route all requests securely using authorized GSP endpoints directly linked to the NIC portal.",
    icon: "🔐",
  },
  {
    title: "Live Auditor Dashboard",
    desc: "Business owners and head accountants can view a live desktop dashboard tracking every single automatic dispatch in real-time.",
    icon: "📊",
  },
  {
    title: "Error-Prevention Guardrails",
    desc: "Our smart AI validates vehicle formats and missing data fields before hitting the government portal, completely eliminating penalization risks.",
    icon: "🚫",
  },
];

const targetMarkets = [
  {
    title: "Heavy Manufacturers & Factories",
    desc: "Steel Mills, Cement Plants, Chemicals, Plastic Granules, Tiles",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "High-Volume Wholesalers",
    desc: "FMCG Distributors, Mandi Grain Traders, Electronics Importers",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
  {
    title: "Logistics & Fleet Operators",
    desc: "Third-Party Logistics (3PL), Transporters, and Local Booking Agents",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  WAITLIST FORM COMPONENT                                           */
/* ------------------------------------------------------------------ */

function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await joinWaitlist(email.trim());
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-6 py-4 text-emerald-400 ring-1 ring-emerald-500/20 ${compact ? "" : "mx-auto max-w-md"}`}>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold">You&apos;re on the list! We&apos;ll be in touch soon.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex w-full flex-col gap-3 sm:flex-row ${compact ? "" : "mx-auto max-w-lg"}`}>
      <div className="flex-1">
        <input
          type="text"
          placeholder="Enter your business email / WhatsApp number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full rounded-xl border border-slate-700 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-emerald-500/20 disabled:opacity-50"
          required
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] disabled:opacity-60 ${compact ? "py-3 text-sm" : "py-3.5 text-base"}`}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </>
        ) : compact ? (
          "Get Early Access"
        ) : (
          "Join the Exclusive Waitlist"
        )}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  WHATSAPP MOCKUP ANIMATION                                         */
/* ------------------------------------------------------------------ */

function WhatsAppMockupAnimation({ playing }: { playing: boolean }) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (!playing) {
      setPhase(0);
      return;
    }
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [playing]);

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[300px] overflow-hidden rounded-[2.5rem] border-8 border-slate-800 bg-[#0b141a] shadow-2xl">
      {/* Phone notch */}
      <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-800" />

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1">
        <span className="text-[10px] font-medium text-white">9:41</span>
        <div className="flex gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
      </div>

      {/* WhatsApp header */}
      <div className="flex items-center gap-2.5 bg-[#1f2c34] px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
          EB
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-white">EWayBill</div>
          <div className="text-[10px] text-emerald-400">online</div>
        </div>
      </div>

      {/* Chat area */}
      <div className="relative h-[calc(100%-88px)] overflow-hidden bg-[#0b141a] px-3 pt-4">
        {/* Date separator */}
        <div className="mb-4 text-center">
          <span className="inline-block rounded-lg bg-[#1f2c34] px-3 py-1 text-[10px] text-slate-400">Today</span>
        </div>

        {/* User message */}
        <div
          className="mb-3 ml-auto max-w-[85%] transition-all duration-700"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <div className="rounded-lg rounded-tr-none bg-[#005c4b] px-3 py-2">
            <p className="text-[12px] leading-relaxed text-white">
              Truck HR-38 loaded with 500 bags of cement for Gupta Agency
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span className="text-[9px] text-white/50">10:42 AM</span>
              <svg className="h-3 w-3 text-blue-300" fill="currentColor" viewBox="0 0 16 15">
                <path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033l-.358-.325a.319.319 0 00-.484.032l-.378.483a.418.418 0 00.036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 00-.064-.512zm-4.1 0l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Typing indicator */}
        <div
          className="mb-3 mr-auto max-w-[60%] transition-all duration-500"
          style={{
            opacity: phase === 2 ? 1 : 0,
            transform: phase === 2 ? "translateY(0)" : "translateY(5px)",
          }}
        >
          <div className="rounded-lg rounded-tl-none bg-[#1f2c34] px-3 py-2.5">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>

        {/* Bot reply with PDF */}
        <div
          className="mr-auto max-w-[90%] transition-all duration-700"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
          }}
        >
          <div className="rounded-lg rounded-tl-none bg-[#1f2c34] px-3 py-2">
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-[#2a3942] p-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="truncate text-[11px] font-medium text-white">E-Way Bill Approved</div>
                <div className="text-[9px] text-slate-400">PDF • 128 KB</div>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed text-white">
              ✅ E-Way Bill generated successfully!
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Bill No: 3410 1289 4521
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span className="text-[9px] text-white/50">10:42 AM</span>
            </div>
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
/*  DEMO REQUEST MODAL                                                 */
/* ------------------------------------------------------------------ */

function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const result = await requestDemo(fd);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a1420] p-6 shadow-2xl md:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Demo Requested!</h3>
            <p className="text-sm text-slate-400">Our team will reach out to you shortly to schedule your personalized demo.</p>
          </div>
        ) : (
          <>
            <h3 className="mb-1 text-xl font-bold text-white">Request a Demo</h3>
            <p className="mb-6 text-sm text-slate-400">See how EWayBillOnChat works for your business.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Full Name</label>
                <input name="name" type="text" required placeholder="Rahul Sharma" className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Company Name</label>
                <input name="company" type="text" required placeholder="Sharma Steel Pvt Ltd" className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Business Email</label>
                <input name="email" type="email" required placeholder="rahul@company.com" className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Phone / WhatsApp</label>
                <input name="phone" type="tel" required placeholder="+91 98765 43210" className="w-full rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Message <span className="text-slate-500">(optional)</span></label>
                <textarea name="message" rows={3} placeholder="Tell us about your dispatch volume..." className="w-full resize-none rounded-xl border border-slate-700 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-emerald-500/20" />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Schedule My Demo"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { ref: mockupRef, visible: mockupVisible } = useOnScreen<HTMLDivElement>(0.15);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050b14]">
      {/* Ambient glow layers */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-[500px] w-[500px] rounded-full bg-emerald-400/[0.03] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[600px] rounded-full bg-blue-500/[0.03] blur-[100px]" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-black">
            EB
          </div>
          <span className="text-xl font-bold text-white">
            EWay<span className="text-emerald-400">Bill</span>OnChat
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          <a href="#problem" className="transition-colors hover:text-emerald-400">Problem</a>
          <a href="#solution" className="transition-colors hover:text-emerald-400">Solution</a>
          <a href="#features" className="transition-colors hover:text-emerald-400">Features</a>
          <a href="#who-we-serve" className="transition-colors hover:text-emerald-400">Who We Serve</a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setShowDemo(true)}
            className="rounded-lg border border-emerald-500/30 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            Request Demo
          </button>
          <a
            href="#waitlist"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            Join Waitlist
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
            <a href="#problem" onClick={() => setShowMenu(false)} className="py-2">Problem</a>
            <a href="#solution" onClick={() => setShowMenu(false)} className="py-2">Solution</a>
            <a href="#features" onClick={() => setShowMenu(false)} className="py-2">Features</a>
            <a href="#who-we-serve" onClick={() => setShowMenu(false)} className="py-2">Who We Serve</a>
            <button
              onClick={() => { setShowMenu(false); setShowDemo(true); }}
              className="mt-2 rounded-lg border border-emerald-500/30 py-3 text-center font-semibold text-emerald-400"
            >
              Request Demo
            </button>
            <a href="#waitlist" className="rounded-lg bg-emerald-500 py-3 text-center font-semibold text-black">
              Join Waitlist
            </a>
          </div>
        </div>
      )}

      {/* ======================= HERO ======================= */}
      <section className="relative z-10 px-6 pt-12 pb-12 md:px-12 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <FadeUp>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Limited Beta Access Opening Soon
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                  No More Delayed Trucks When Your Accountant is Away.
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="mb-8 text-lg leading-relaxed text-slate-400">
                  India&apos;s First WhatsApp-Powered AI E-Way Bill Generator. Just send a simple text on WhatsApp, and get your official government E-Way Bill instantly. No computers, no manual typing, no compliance delays.
                </p>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div id="waitlist" className="mb-6">
                  <WaitlistForm />
                </div>
              </FadeUp>

              <FadeUp delay={0.4}>
                <p className="text-xs text-slate-500">
                  ⚡ Limited beta access opening soon. Safely integrated via Government-Authorized GSP.
                </p>
              </FadeUp>
            </div>

            {/* Right: WhatsApp Mockup */}
            <div ref={mockupRef} className="flex justify-center">
              <FadeUp delay={0.25}>
                <WhatsAppMockupAnimation playing={mockupVisible} />
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= PAIN POINTS ======================= */}
      <section id="problem" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
              Is your factory facing these everyday <span className="text-red-400">dispatch headaches?</span>
            </h2>
          </FadeUp>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((point, idx) => (
              <FadeUp key={point.title} delay={idx * 0.12}>
                <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-red-500/20 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(239,68,68,0.06)]">
                  <div className="mb-4 inline-flex rounded-2xl bg-red-500/10 p-4 text-red-400 ring-1 ring-red-500/20 transition-colors group-hover:bg-red-500/20">
                    {point.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{point.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= SOLUTION (HOW IT WORKS) ======================= */}
      <section id="solution" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
              Super Easy <span className="text-emerald-400">3-Step Automation.</span>
            </h2>
            <p className="mb-16 text-center text-lg text-slate-400">Zero Training Required!</p>
          </FadeUp>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ======================= FEATURES ======================= */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
              Why <span className="text-emerald-400">Choose Us</span>
            </h2>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((f, idx) => (
              <FadeUp key={f.title} delay={idx * 0.08}>
                <div className="group flex gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/20 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl ring-1 ring-emerald-500/20 transition-colors group-hover:bg-emerald-500/20">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= WHO WE SERVE ======================= */}
      <section id="who-we-serve" className="relative z-10 px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <h2 className="mb-16 text-center text-3xl font-bold text-white sm:text-4xl">
              Who We <span className="text-emerald-400">Serve</span>
            </h2>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {targetMarkets.map((market, idx) => (
              <FadeUp key={market.title} delay={idx * 0.1}>
                <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)]">
                  <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                    {market.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-white">{market.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{market.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FINAL CTA ======================= */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <FadeUp>
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-emerald-500/20 bg-[#0a1420] px-8 py-20 text-center md:px-16">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[80px]" />

            <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
              Be the first to supercharge your warehouse dispatch speed.
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-slate-400">
              We are currently accepting a limited number of businesses for our exclusive Beta Launch. Secure your spot today and completely automate your logistics compliance.
            </p>
            <div className="mx-auto max-w-md">
              <WaitlistForm compact />
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ======================= FOOTER ======================= */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-14 md:px-12">
        <FadeUp>
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-bold text-black">
                EB
              </div>
              <span className="text-xl font-bold text-white">
                EWay<span className="text-emerald-400">Bill</span>OnChat
              </span>
            </div>
            <p className="text-sm text-slate-500">
              India&apos;s First WhatsApp-Powered AI E-Way Bill Generator
            </p>
            <p className="text-xs text-slate-600">
              © 2025 ewaybillonchat.in — All rights reserved.
            </p>
          </div>
        </FadeUp>
      </footer>

      <DemoModal open={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}
