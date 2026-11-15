import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Contact = () => {
  const { data: content } = useSiteContent("contact");
  const offices = content?.offices || [];
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceArea, setPracticeArea] = useState("Civil & Criminal Litigation");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ tracking_code: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: "Please fill in your name and email", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitConsultation({
        name,
        email,
        phone,
        practice_area: practiceArea,
        message,
      });

      setSuccessData({
        tracking_code: res.tracking_code,
        message: "Your inquiry has been successfully registered with our chamber registry.",
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      toast({
        title: "Legal Consultation Registered",
        description: `Docket Reference: ${res.tracking_code}`,
      });
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message || "Could not connect to chamber server. Please call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-muted/20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Strict Attorney-Client Confidentiality</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-serif">
            {content?.title || "Get In Touch"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500/80 via-amber-300 to-amber-500/80 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {content?.subtitle || "Reach out to Law & Legacy for prompt legal consultation, document scrutiny, and chamber advocacy."}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Glassy Consultation Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 border border-white/30 dark:border-white/10 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-border/40">
                <div>
                  <h3 className="text-xl font-bold text-foreground font-serif">Schedule a Consultation</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Direct chamber submission. Your inquiry is reviewed by our lead partners.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-medium">
                  <Lock className="w-3 h-3 text-amber-300" />
                  Privileged
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Full Name *</label>
                    <Input
                      placeholder="e.g. Barrister / Mr. / Ms. Rahman"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="glass-input text-xs rounded-xl h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Contact Email *</label>
                    <Input
                      type="email"
                      placeholder="name@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="glass-input text-xs rounded-xl h-10"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Phone / WhatsApp</label>
                    <Input
                      placeholder="+880 17XX XXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="glass-input text-xs rounded-xl h-10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Practice Area</label>
                    <select
                      value={practiceArea}
                      onChange={(e) => setPracticeArea(e.target.value)}
                      className="w-full h-10 rounded-xl glass-input text-xs px-3 text-foreground bg-background/50 border border-border/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      <option value="Civil & Criminal Litigation">Civil & Criminal Litigation</option>
                      <option value="Banking & Finance">Banking & Finance</option>
                      <option value="Company & Corporate Law">Company & Corporate Law</option>
                      <option value="Land & Property Law">Land & Property Law</option>
                      <option value="Documentation & Registration">Documentation & Registration</option>
                      <option value="Labour & Employment">Labour & Employment</option>
                      <option value="Intellectual Property">Intellectual Property</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Constitutional & Administrative">Constitutional & Administrative</option>
                      <option value="Alternative Dispute Resolution">Alternative Dispute Resolution</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Matter Overview</label>
                  <Textarea
                    placeholder="Provide a brief summary of your legal inquiry, litigation context, or contract scrutiny requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="glass-input text-xs rounded-xl resize-none"
                  />
                </div>

                {/* High-Contrast Readable Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#0B1E3D] via-[#142C54] to-[#0B1E3D] hover:from-[#133060] hover:to-[#1B3F78] text-white font-bold text-sm h-12 rounded-xl shadow-xl border border-amber-400/40 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Registering Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-300" />
                      Submit Legal Consultation Request
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Direct Chamber Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl p-6 border border-white/20 dark:border-white/10 space-y-6">
              <h4 className="text-lg font-bold text-foreground flex items-center gap-2 font-serif">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                Chamber Desk Information
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-background/50 border border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/40 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground">Chamber Secretariat</h5>
                    <a
                      href={`tel:${content?.phone || "+880 1716 32 8898"}`}
                      className="text-amber-300 font-bold text-sm hover:underline block"
                    >
                      {content?.phone || "+880 1716 32 8898"}
                    </a>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Available during consultation hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-background/50 border border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/40 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/20">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground">Official Communications</h5>
                    <a
                      href={`mailto:${content?.email || "info@lawandlegacy.com.bd"}`}
                      className="text-foreground hover:text-amber-300 font-medium text-sm hover:underline block"
                    >
                      {content?.email || "info@lawandlegacy.com.bd"}
                    </a>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Chamber documentation & case briefs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3.5 rounded-xl bg-background/50 border border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/40 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-400/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground">Consultation Hours</h5>
                    <p className="text-sm font-medium text-foreground">
                      {content?.office_hours || "Saturday - Thursday, 9:00 AM - 6:00 PM"}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Evening chamber available in Lalmatia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chamber Office Locations */}
        <div>
          <h3 className="text-xl font-bold text-center text-foreground mb-6 font-serif">Chamber Offices</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {offices.map((office: any, index: number) => (
              <div
                key={index}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-white/20 dark:border-white/10"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900/40 text-amber-300 flex items-center justify-center border border-amber-400/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-foreground text-sm">{office.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{office.address}</p>
                <p className="text-xs font-semibold text-amber-300">{office.city}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={!!successData} onOpenChange={(open) => !open && setSuccessData(null)}>
        <DialogContent className="glass-panel border-white/20 dark:border-white/10 max-w-md rounded-2xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-amber-400/15 text-amber-300 flex items-center justify-center mx-auto mb-2 border border-amber-400/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-foreground font-serif">
              Inquiry Registered
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Your consultation request has been received by Law & Legacy Chamber Secretariat.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-background/60 border border-border/40 text-center space-y-2 my-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Case Docket Reference
            </span>
            <div className="font-mono text-2xl font-extrabold text-amber-300 tracking-wider">
              {successData?.tracking_code}
            </div>
            <p className="text-xs text-muted-foreground">
              Please quote this reference in any subsequent correspondence.
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setSuccessData(null)}
              className="w-full bg-gradient-to-r from-[#0B1E3D] to-[#142C54] hover:from-[#133060] hover:to-[#1B3F78] text-white font-bold text-xs h-10 rounded-xl shadow-md border border-amber-400/40"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
