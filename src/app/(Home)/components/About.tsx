import { Users } from 'lucide-react'
import React from 'react'

export const About = () => {
  return (
    <section id="about" className="container py-8 md:py-12 lg:py-24">
         <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
                <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl lg:text-5xl font-bold text-white">
                    Our Mission
                </h2>
                <p className="leading-normal text-muted-foreground text-sm lg:text-lg sm:leading-7">
                    At NavLane, we believe that everyone deserves a clear path to their dream career. We leverage the power of AI to democratize career guidance, making it accessible, personalized, and data-driven for students and developers worldwide.
                </p>
                <div className="flex items-center gap-4 pt-4">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-primary">10k+</span>
                        <span className="text-sm text-muted-foreground">Users</span>
                    </div>
                    <div className="w-px h-12 bg-border"></div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-secondary">50+</span>
                        <span className="text-sm text-muted-foreground">Countries</span>
                    </div>
                     <div className="w-px h-12 bg-border"></div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-primary">1M+</span>
                        <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden glass border-primary/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10 z-0"></div>
                <Users className="h-32 w-32 text-primary/20 z-10" />
            </div>
         </div>
      </section>
  )
}
