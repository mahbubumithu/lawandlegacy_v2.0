import { CheckCircle2, Quote } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export const About = () => {
  const { data: content } = useSiteContent("about");

  const highlights: string[] = content?.highlights || [
    "Top-tier legal professionals from leading law schools",
    "Comprehensive one-stop legal service centre",
    "Enlisted with numerous companies and banks",
    "Proven track record with government ministries",
  ];

  return (
    <section id="about" className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-serif">
            {content?.title || "About Law & Legacy"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500/80 via-amber-300 to-amber-500/80 mx-auto rounded-full" />
        </div>
        
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/30 dark:border-white/10 shadow-xl space-y-8">
          <p className="text-lg md:text-xl text-foreground/90 leading-relaxed font-light">
            {content?.paragraph1 || "Law & Legacy is a pre-eminent law firm providing specialist advice and a full range of legal services. As one of the most promising, growing, and multidimensional law firms in Bangladesh, we offer comprehensive legal services meeting virtually every need of our clients."}
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {content?.paragraph2 || "Our practice is predominantly litigation-based, providing comprehensive advice to clients ranging from individuals and small businesses to large privately held national and international corporations, banks, and governmental entities."}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-background/50 border border-border/40">
                <div className="w-8 h-8 rounded-xl bg-slate-900/40 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-foreground text-sm font-semibold">{highlight}</p>
              </div>
            ))}
          </div>
          
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-400 border-white/20 dark:border-white/10 relative">
            <Quote className="w-8 h-8 text-amber-400/20 absolute top-4 right-4" />
            <p className="text-base md:text-lg text-foreground italic leading-relaxed font-serif">
              "{content?.quote || "We depend on our legal mind and prudence rather than traditional understanding. Our audacity of honesty and sincerity has instituted us as a successful growing law firm."}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
