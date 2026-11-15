import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CalendarDays, ExternalLink, Sparkles } from "lucide-react";

const NewsFeed = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <Navigation />

      <div className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chamber Dispatches & Legal Seminars</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-serif">
              News & Legal Insights
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500/80 via-amber-300 to-amber-500/80 mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground text-base leading-relaxed">
              Dispatches on key appellate decisions, regulatory compliance changes, legal seminars, and symposiums led by Law & Legacy advocates.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-muted-foreground py-16">Loading chamber dispatches...</div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    {event.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-3">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {event.event_date ? (
                          new Date(event.event_date).toLocaleDateString("en-BD", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        ) : (
                          "Chamber Announcement"
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 font-serif leading-snug">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {event.event_url && (
                    <div className="p-6 pt-0">
                      <a
                        href={event.event_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:underline font-semibold"
                      >
                        Read Event Details <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">No news items published yet.</div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsFeed;
