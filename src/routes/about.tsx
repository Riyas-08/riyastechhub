import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Mail, MapPin } from "lucide-react";

import ownerPhoto from "@/assets/owner-profile.jpg";
import { PageShell } from "@/components/site-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Riyas U — RiyasTech Hub" },
      {
        name: "description",
        content:
          "Riyas U, first-year ECE student at Kumaraguru College of Technology and the founder of RiyasTech Hub.",
      },
      { property: "og:title", content: "About Riyas U — RiyasTech Hub" },
      { property: "og:description", content: "Meet the founder behind RiyasTech Hub." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="Step 9 of 10"
      title="About the Owner"
      description="The person building RiyasTech Hub."
      className="max-w-3xl"
    >
      <article className="glass card-hover overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <img
            src={ownerPhoto}
            alt="Portrait of Riyas U, founder of RiyasTech Hub"
            loading="lazy"
            className="h-40 w-40 shrink-0 rounded-2xl border border-primary/40 object-cover glow-ring"
          />
          <div className="min-w-0 text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold neon-text">Riyas U</h2>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-primary">Founder & Developer</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                B.E. Electronics & Communication Engineering — 1st Year
              </li>
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                Kumaraguru College of Technology, Coimbatore
              </li>
              <li className="flex items-center justify-center gap-2 sm:justify-start">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a className="hover:text-primary" href="mailto:riyasusman2008@gmail.com">
                  riyasusman2008@gmail.com
                </a>
              </li>
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">
              RiyasTech Hub started from a simple frustration: hardware project students waste weeks
              hunting for the right components, decoding datasheets and preparing for viva. This
              platform collapses all of that into one guided flow — analyse the idea, get the exact
              parts, compare Indian store prices, learn every component and walk into the viva ready.
            </p>
          </div>
        </div>
      </article>
    </PageShell>
  );
}