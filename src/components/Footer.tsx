import { useSiteContent } from "@/hooks/useSiteContent";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Scale } from "lucide-react";

export const Footer = () => {
  const { data: content } = useSiteContent("footer");
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-navy-dark border-t border-white/10 text-slate-300 py-12 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            {/* Logo Section - ONLY Logo Image, Click to Home */}
            <div className="mb-5">
              <button
                onClick={handleLogoClick}
                className="group focus:outline-none block transition-transform duration-300 hover:scale-105"
                aria-label="Law & Legacy Home"
              >
                <img 
                  src="/logo.png" 
                  alt="Law & Legacy" 
                  className="h-16 w-auto object-contain filter drop-shadow"
                />
              </button>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {content?.description || "A pre-eminent law firm providing comprehensive legal services across Bangladesh. We pride ourselves on our commitment to personal service and delivering the very best results for our clients."}
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px]">
                <Scale className="w-3.5 h-3.5 text-gold" /> Supreme Court of Bangladesh
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-gold" /> Supreme Court Bar Enrolled
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gold uppercase tracking-wider font-serif">Chamber Directory</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-gold transition-colors">About Chamber</a></li>
              <li><a href="#practice-areas" className="hover:text-gold transition-colors">Areas of Practice</a></li>
              <li><a href="#team" className="hover:text-gold transition-colors">Legal Team</a></li>
              <li><a href="#clients" className="hover:text-gold transition-colors">Enlisted Clients</a></li>
              <li><Link to="/news" className="hover:text-gold transition-colors">News & Legal Seminars</Link></li>
              <li><a href="#contact" className="hover:text-gold transition-colors">Consultation & Offices</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gold uppercase tracking-wider font-serif">Core Practice</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Civil & Criminal Litigation</li>
              <li>Banking & NBFI Securities</li>
              <li>Corporate & Mergers (RJSC)</li>
              <li>Land Scrutiny & Property Law</li>
              <li>Constitutional & Administrative Writs</li>
              <li>Labour & Employment (BLA)</li>
              <li>Arbitration & ADR</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Law & Legacy. All rights reserved.</p>
          <p>
            Designed By | <a href="https://www.linkedin.com/in/mahbubumithu/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors font-medium">Mahbub Mithu</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
