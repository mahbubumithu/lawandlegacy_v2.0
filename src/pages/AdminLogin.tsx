import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { password },
      });

      if (error || !data?.success) {
        toast({ title: "Invalid passcode", description: "Please check your authorization credentials.", variant: "destructive" });
      } else {
        sessionStorage.setItem("admin_authenticated", "true");
        toast({ title: "Authorized", description: "Welcome to Chamber Control Panel." });
        navigate("/admin");
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

      <Navigation />

      <div className="pt-32 pb-20 flex items-center justify-center min-h-[85vh] px-4 relative z-10">
        <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-white/30 dark:border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 bg-slate-900/40 rounded-2xl flex items-center justify-center mb-4 border border-amber-400/30 text-amber-300 shadow-md">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-foreground font-serif">Chamber Portal</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Authenticate to update practice areas, team profiles, and hero slide images.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Chamber Passcode</label>
              <Input
                type="password"
                placeholder="Enter access passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input h-11 text-sm rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0B1E3D] via-[#142C54] to-[#0B1E3D] hover:from-[#133060] hover:to-[#1B3F78] text-white font-bold h-11 rounded-xl shadow-lg border border-amber-400/40 transition-all hover:scale-[1.01]"
            >
              {loading ? "Authorizing..." : "Enter Chamber Portal"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/40 text-center">
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Privileged & Confidential Chamber Access</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
