import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { PracticeAreas } from "@/components/PracticeAreas";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { Clients } from "@/components/Clients";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-amber-400/30 selection:text-foreground">
      <Navigation />
      <Hero />
      <PracticeAreas />
      <About />
      <Team />
      <Clients />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
