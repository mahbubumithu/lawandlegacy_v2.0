import { 
  Scale, Building2, Briefcase, Users, Shield, Home,
  Gavel, FileText, Landmark, Globe, TrendingUp, Award,
  type LucideIcon, ArrowUpRight
} from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, LucideIcon> = {
  Scale, Building2, Briefcase, Users, Shield, Home,
  Gavel, FileText, Landmark, Globe, TrendingUp, Award,
};

const defaultAreas = [
  { icon: "Gavel", title: "Civil & Criminal Litigation", description: "Representing clients before all courts of Bangladesh from Judges Court to Appellate Division with meticulous case preparation." },
  { icon: "Building2", title: "Banking & Finance", description: "Expert scrutiny of documents, property title determination, and drafting security documents for banks and NBFIs." },
];

export const PracticeAreas = () => {
  const { data: content } = useSiteContent("practice_areas");
  const areas = content?.areas || defaultAreas;

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="practice-areas" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-serif">
            {content?.title || "Areas of Practice"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500/80 via-amber-300 to-amber-500/80 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {content?.subtitle || "Comprehensive legal services across diverse practice areas meeting virtually every need of our clients."}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {areas.map((area: any, index: number) => {
            const Icon = iconMap[area.icon] || Scale;
            return (
              <div 
                key={index}
                onClick={scrollToContact}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-white/20 dark:border-white/10 group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900/40 border border-amber-400/20 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                      <Icon className="w-6 h-6 text-amber-300" />
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground uppercase opacity-60">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-amber-300 transition-colors font-serif">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {area.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground group-hover:text-amber-300">
                  <span className="font-medium">Request Counsel In This Area</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 text-amber-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
