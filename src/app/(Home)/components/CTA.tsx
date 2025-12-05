import Link from "next/link"
import { Button } from "@/components/ui/button"

export const CTA = () => {
  return (
    <section id="cta" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-232 flex-col items-center justify-center gap-4 text-center bg-linear-to-b from-card to-background border border-primary/20 rounded-3xl p-8 md:p-12">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold text-white">
            Ready to accelerate your career?
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Join thousands of developers who are using NavLane to land their dream jobs.
          </p>
          <Link href="/dashboard">
             <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                Start Your Journey Now
             </Button>
          </Link>
        </div>
      </section>
  )
}
