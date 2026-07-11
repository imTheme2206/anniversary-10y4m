import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { story } from "../../content/story";
import { gsap } from "../../lib/gsap";
import { Figure } from "../Figure";
import { SectionLabel } from "../SectionLabel";

export function Intro() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".intro-copy", {
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.set(".intro-mask", { clipPath: "inset(0 0 100% 0)" });
        gsap.to(".intro-mask", {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: {
            trigger: ".intro-figure",
            start: "top 90%",
            end: "top 35%",
            scrub: 1,
          },
        });
      });

      return undefined;
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Prologue"
      data-scene="intro"
      className="story-section relative py-20 md:py-48"
    >
      <div className="relative z-10 mx-auto grid max-w-[82rem] gap-7 px-5 min-[360px]:px-6 md:grid-cols-[0.8fr_1.35fr] md:items-end md:gap-20 md:px-10">
        {/*<div className="intro-copy order-2 pb-4 md:order-1 md:pb-12">
          <p className="mt-5 max-w-md text-pretty font-display text-xl italic leading-snug text-ink min-[360px]:text-[1.375rem] md:mt-6 md:text-4xl">
            {story.intro.body}
          </p>
        </div>*/}
        <SectionLabel
          className="absolute z-20 bottom-20 right-20 rotate-3 font-extrabold text-[22px]"
          tone="ink"
        >
          {story.intro.kicker}
        </SectionLabel>

        <div className="intro-figure order-1 md:order-2 md:rotate-[1.5deg]">
          <div className="intro-mask shadow-[0_28px_80px_rgba(46,40,34,0.12)]">
            <Figure
              src={story.intro.image}
              alt="The two of us, near the beginning"
              aspect="aspect-[4/5]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
