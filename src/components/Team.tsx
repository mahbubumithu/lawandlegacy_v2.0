import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/hooks/useSiteContent";
import { UserCheck } from "lucide-react";

export const Team = () => {
  const { data: content } = useSiteContent("team");
  const members = content?.members || [];

  return (
    <section id="team" className="py-24 bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-serif">
            {content?.title || "Our Legal Team"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500/80 via-amber-300 to-amber-500/80 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {content?.subtitle || "Experienced legal professionals committed to providing the highest standards of advocacy and advice."}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: any, index: number) => (
            <div 
              key={index} 
              className="glass-card glass-card-hover rounded-2xl p-6 border border-white/20 dark:border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground font-serif">{member.name}</h3>
                    <Badge variant="secondary" className="mt-1.5 bg-amber-400/10 text-amber-300 border-amber-400/30 font-semibold text-xs">
                      {member.role}
                    </Badge>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900/40 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/20">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2.5 text-xs pt-3 border-t border-border/40">
                  {member.credentials && (
                    <p className="text-muted-foreground">
                      <strong className="text-foreground font-semibold">Credentials:</strong> {member.credentials}
                    </p>
                  )}
                  {member.education && (
                    <p className="text-muted-foreground">
                      <strong className="text-foreground font-semibold">Education:</strong> {member.education}
                    </p>
                  )}
                  {member.experience && (
                    <p className="text-muted-foreground">
                      <strong className="text-foreground font-semibold">Experience:</strong> {member.experience}
                    </p>
                  )}
                  {member.specialization && (
                    <p className="text-muted-foreground">
                      <strong className="text-foreground font-semibold">Focus Areas:</strong> {member.specialization}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="text-amber-300 font-medium">Chamber Counsel</span>
                <span className="font-serif italic text-muted-foreground">Supreme Court & Bar Enlisted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
