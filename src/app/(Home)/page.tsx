import { About } from "./components/About";
import { CTA } from "./components/CTA";
import { Features } from "./components/Features";
import { Hero } from "./components/Hero";

export default function Home() {
    return (
       <div className="flex flex-col min-h-screen relative overflow-x-clip">
  <div className="absolute top-8 md:top-16 left-1/2 -translate-x-1/2 w-120 md:w-160 md:h-76 lg:w-250 h-96 lg:h-120 bg-primary/20 rounded-full blur-[120px] -z-10" />
  <div className="absolute bottom-0 right-0 w-[70vw] sm:w-[800px] h-[50vh] sm:h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10" />

  <Hero />
  <Features />
  <About />
  <CTA />
</div>

    );
}