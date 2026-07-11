import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { story } from "../../content/story";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { DaisyBloom } from "../DaisyBloom";
import { Figure } from "../Figure";

export function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const railDesktopRef = useRef<HTMLDivElement>(null);
  const railMobileRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLLIElement>(
        ".chapter-item",
        sectionRef.current!,
      );

      // Sticky memory rail: swap the displayed marker as each chapter enters
      // center-viewport. This is a content sync, not an animation, so it
      // stays active regardless of reduced-motion preference.
      items.forEach((item) => {
        const label = item.dataset.label ?? "";
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (!self.isActive) return;
            if (railDesktopRef.current)
              railDesktopRef.current.textContent = label;
            if (railMobileRef.current)
              railMobileRef.current.textContent = label;
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        items.forEach((item) => {
          gsap.from(item, {
            y: 32,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });
        });

        gsap.from(".stem-line", {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 80%",
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
      aria-label="Our story"
      data-scene="timeline"
      className="story-section relative py-16 md:py-40"
    >
      <div className="relative z-10 mx-auto max-w-[86rem] px-5 min-[360px]:px-6 md:grid md:grid-cols-[220px_1fr] md:gap-16 md:px-10">
        {/* Desktop sticky rail */}
        <div className="hidden md:block">
          <div className="sticky top-32">
            {/*<SectionLabel tone="gold">Our Story</SectionLabel>*/}
            {/*<div
              ref={railDesktopRef}
              className="mt-5 font-display text-5xl italic text-ink"
            >
              {story.chapters[0]?.label}
            </div>*/}
            <div className="mt-8 h-16 w-px bg-line" aria-hidden="true" />
          </div>
        </div>

        {/* Mobile sticky chip */}
        <div className="sticky top-0 z-20 -mx-5 mb-10 flex items-center justify-between border-b border-line bg-cream/95 px-5 py-3 backdrop-blur-sm min-[360px]:-mx-6 min-[360px]:px-6 md:hidden">
          {/*<SectionLabel tone="gold">Our Story</SectionLabel>*/}
          {/*<div ref={railMobileRef} className="font-display text-base text-ink">
            {story.chapters[0]?.label}
          </div>*/}
        </div>

        <ol className="relative flex flex-col gap-20 md:gap-52">
          <div
            className="stem-line absolute left-[9px] top-2 bottom-2 w-px bg-line md:left-[9px]"
            aria-hidden="true"
          />

          {story.chapters.map((chapter, i) => (
            <li
              key={chapter.title}
              className={`chapter-item relative pl-8 md:grid md:grid-cols-2 md:items-center md:gap-16 md:pl-10 ${i % 2 ? "md:[&_.chapter-media]:order-first" : ""}`}
              data-label={chapter.label}
            >
              <span className="absolute left-0 top-1">
                <DaisyBloom size={26} petals={8} trigger="scroll" />
              </span>

              <div className="chapter-copy">
                {/*<SectionLabel className="mb-2 block">
                  {chapter.label}
                </SectionLabel>*/}
                <h3 className="text-balance font-display text-3xl leading-[1.02] text-ink min-[360px]:text-4xl md:text-6xl">
                  {chapter.title}
                </h3>
                {/*<details className="group/memory mt-5 max-w-sm border-t border-line/80 pt-1">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-ink-soft transition-colors duration-300 hover:text-ink focus-visible:text-ink [&::-webkit-details-marker]:hidden">
                    <span>Read this memory</span>
                    <span
                      aria-hidden="true"
                      className="text-lg leading-none text-gold-deep transition-transform duration-500 ease-power3-out group-open/memory:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-3 text-pretty text-sm leading-relaxed text-ink-soft md:text-base">
                    {chapter.body}
                  </p>
                </details>*/}
              </div>
              <div className="chapter-media mt-7 md:mt-0">
                <Figure
                  src={chapter.image}
                  alt={chapter.title}
                  aspect={
                    i % 2
                      ? "aspect-[4/3] md:aspect-[4/5]"
                      : "aspect-[4/3] md:aspect-[5/4]"
                  }
                  className="max-w-xl shadow-[0_24px_70px_rgba(46,40,34,0.10)]"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
