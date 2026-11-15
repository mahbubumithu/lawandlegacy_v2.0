import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogoClick = () => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (link: { href: string; isPage?: boolean }) => {
    setIsMobileMenuOpen(false);
    if (link.isPage) {
      navigate(`/${link.href}`);
    } else if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(link.href)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(link.href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "About Chamber", href: "about" },
    { label: "Practice Areas", href: "practice-areas" },
    { label: "Legal Team", href: "team" },
    { label: "Our Clients", href: "clients" },
    { label: "News & Insights", href: "news", isPage: true },
    { label: "Contact", href: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "glass-panel bg-slate-950/85 backdrop-blur-xl shadow-2xl border-b border-amber-400/20 py-1"
          : "bg-slate-950/40 backdrop-blur-md border-b border-white/10 py-2.5 md:py-3.5"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? "h-14 md:h-16" : "h-18 md:h-20"
          }`}
        >
          {/* Logo Section - ONLY Logo Image, Click to Home, Dynamically Slims on Scroll */}
          <button
            onClick={handleLogoClick}
            className="flex items-center group py-1 focus:outline-none transition-transform duration-300"
            aria-label="Law & Legacy Home"
          >
            <img
              src="/logo.png"
              alt="Law & Legacy"
              className={`w-auto object-contain filter drop-shadow transition-all duration-300 ease-in-out group-hover:scale-105 ${
                isScrolled ? "h-8 md:h-9" : "h-12 md:h-14"
              }`}
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className={`text-xs font-semibold uppercase tracking-wider transition-all hover:text-amber-300 py-1 ${
                  location.pathname === `/${link.href}`
                    ? "text-amber-300 border-b-2 border-amber-400 font-bold"
                    : "text-slate-100 hover:text-amber-300"
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 glass-card hover:bg-amber-400/15 hover:text-amber-300 transition-all"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
            </Button>

            {/* High-Contrast Readable Deep Navy & Champagne Consultation Button */}
            <button
              onClick={() => handleNavClick({ href: "contact" })}
              className={`px-5 rounded-xl bg-gradient-to-r from-[#0B1E3D] to-[#152B52] hover:from-[#112E5C] hover:to-[#1B3666] text-white font-bold text-xs shadow-lg border border-amber-400/40 transition-all duration-300 hover:scale-105 flex items-center gap-1.5 ${
                isScrolled ? "py-2" : "py-2.5"
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span>Consultation</span>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 glass-card"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-amber-200" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="glass-card rounded-xl text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass-panel rounded-2xl my-2 p-5 space-y-2.5 bg-slate-950/95 border border-white/20 shadow-2xl">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link)}
                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-100 hover:bg-amber-400/15 hover:text-amber-300 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => handleNavClick({ href: "contact" })}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0B1E3D] to-[#152B52] text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-md border border-amber-400/40"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                <span>Schedule Legal Consultation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
