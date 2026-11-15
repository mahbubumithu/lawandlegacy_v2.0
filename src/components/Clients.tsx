import { Building2, Landmark, Shield, Briefcase, type LucideIcon } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, LucideIcon> = { Landmark, Building2, Shield, Briefcase };

export const Clients = () => {
  const { data: content } = useSiteContent("clients");
  const categories = content?.categories || [];

  return (
    <section id="clients" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-serif">
            {content?.title || "Our Clients"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500/80 via-amber-300 to-amber-500/80 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {content?.subtitle || "Trusted by government ministries, multinational corporations, banks, and leading businesses across Bangladesh."}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category: any, index: number) => {
            const Icon = iconMap[category.icon] || Building2;
            return (
              <div 
                key={index} 
                className="glass-card glass-card-hover rounded-3xl p-8 border border-white/20 dark:border-white/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/40 text-amber-300 flex items-center justify-center border border-amber-400/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground font-serif">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">Enlisted Legal Representation</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(category.clients || []).map((client: string, clientIndex: number) => (
                    <div key={clientIndex} className="flex items-center gap-2 p-2 rounded-xl bg-background/40 border border-border/30 text-xs text-foreground font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="truncate">{client}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
