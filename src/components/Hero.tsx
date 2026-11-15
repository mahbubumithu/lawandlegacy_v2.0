import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Scale, ArrowRight, ShieldCheck } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const fallbackHeroImages = [
  {
    url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2070&q=85",
    caption: "Supreme Court Architecture & Apex Chambers",
  },
  {
    url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2070&q=85",
    caption: "Comprehensive Jurisprudence & Legal Precedents",
  },
  {
    url: "https://images.unsplash.com/photo-1453733197781-704fa5988299?auto=format&fit=crop&w=2070&q=85",
    caption: "Advocate Counsel & Scales of Justice",
  },
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070&q=85",
    caption: "Corporate Advisory & Commercial Arbitration",
  },
  {
    url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=2070&q=85",
    caption: "High Court Division & Appellate Practice",
  },
];

export const Hero = () => {
  const { data: content } = useSiteContent("hero");
  const [currentBg, setCurrentBg] = useState(0);

  // Fetch dynamic slide images managed via admin panel
  const { data: dbSlides } = useQuery({
    queryKey: ["hero_slides"],
    queryFn: () => api.getSlides(),
  });

  const activeSlides =
    dbSlides && dbSlides.length > 0
      ? dbSlides
          .filter((s) => s.is_active)
          .map((s) => ({ url: s.image_url, caption: s.caption || s.title || "" }))
      : fallbackHeroImages;

  const currentSlides = activeSlides.length > 0 ? activeSlides : fallbackHeroImages;
  const activeIdx = currentBg % currentSlides.length;

  // Automated background rotation every 6 seconds
  useEffect(() => {
    if (currentSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % currentSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlides.length]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[96vh] flex items-center justify-center overflow-hidden pt-28 pb-20">
      {/* Automated Background Cross-fading Image Slider - Vividly visible with translucent overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {currentSlides.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform ${
              idx === activeIdx
                ? "opacity-75 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
            style={{ backgroundImage: `url(${img.url})` }}
          />
        ))}

        {/* Slightly transparent vignette overlay allowing slider images to clearly show through */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(11,30,61,0.55)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="text-center space-y-6">
          {/* Chamber Crest in Glowing Glass Halo */}
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 rounded-3xl glass-card flex items-center justify-center border border-amber-400/30 shadow-[0_0_35px_rgba(212,175,55,0.25)] group transition-transform hover:scale-105">
              <Scale className="w-10 h-10 text-amber-300 drop-shadow-md" />
            </div>
          </div>

          {/* Chamber Dignity Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-400/30 text-amber-200 text-xs font-semibold shadow-lg">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Advocates & Legal Consultants &bull; Supreme Court of Bangladesh</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight font-serif drop-shadow-lg">
            {content?.title || "Law & Legacy"}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-amber-200 font-medium tracking-wide drop-shadow-md font-serif">
            {content?.subtitle || "Premier Advocacy Firm in Bangladesh"}
          </p>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
            {content?.description ||
              "A new-generation law firm providing comprehensive legal solutions from documentation to litigation, serving individuals, corporations, and government entities with excellence and integrity."}
          </p>

          {/* Actions - High-Contrast Readable Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-to-r from-[#0B1E3D] via-[#142C54] to-[#0B1E3D] hover:from-[#133060] hover:to-[#1B3F78] text-white font-bold text-sm px-8 py-6 rounded-2xl shadow-2xl border border-amber-400/40 transition-all hover:scale-105"
            >
              {content?.button_text || "Get Legal Consultation"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("practice-areas")}
              className="glass-panel text-white hover:text-amber-300 hover:bg-white/10 border-white/30 text-sm px-7 py-6 rounded-2xl transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Explore Practice Areas</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Button>
          </div>

          {/* Prestigious Metric Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            <div className="glass-panel rounded-2xl p-4 text-center border border-white/20 shadow-md">
              <p className="text-2xl font-bold text-white font-serif">17+ Years</p>
              <p className="text-xs text-slate-200 mt-1">Litigation & Advisory</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center border border-white/20 shadow-md">
              <p className="text-2xl font-bold text-amber-300 font-serif">12 Practice</p>
              <p className="text-xs text-slate-200 mt-1">Specialized Areas</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center border border-white/20 shadow-md">
              <p className="text-2xl font-bold text-white font-serif">Supreme Court</p>
              <p className="text-xs text-slate-200 mt-1">Appellate & High Court</p>
            </div>
            <div className="glass-panel rounded-2xl p-4 text-center border border-white/20 shadow-md">
              <p className="text-2xl font-bold text-amber-300 font-serif">Enlisted</p>
              <p className="text-xs text-slate-200 mt-1">Banks, Corporates & Ministries</p>
            </div>
          </div>

          {/* Automated Background Slider Dot Indicators */}
          <div className="pt-6 flex items-center justify-center gap-2">
            {currentSlides.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentBg(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIdx
                    ? "w-8 h-2 bg-amber-400 shadow-[0_0_10px_rgba(245,190,60,0.6)]"
                    : "w-2 h-2 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Switch to slide ${i + 1}: ${img.caption}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
