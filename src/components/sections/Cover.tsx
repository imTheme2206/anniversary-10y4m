import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { story } from "../../content/story";
import { useDayCounter } from "../../hooks/useDayCounter";
import { gsap } from "../../lib/gsap";
import { Figure } from "../Figure";
import { SectionLabel } from "../SectionLabel";

export function Cover() {
  const sectionRef = useRef<HTMLElement>(null);
  const days = useDayCounter(story.anniversary.togetherSince);
  const words = story.anniversary.headline.split(" ");
  const coverPhotos = story.gallery.slice(0, 6);
  const photoCardClasses = [
    "-right-12 -top-2 z-[60] rotate-[10deg]",
    "-left-14 top-2 z-50 -rotate-[14deg]",
    "left-[34%] -top-8 z-40 rotate-[3deg]",
    "-bottom-0 -right-6 z-30 -rotate-[8deg]",
    "-bottom-4 -left-7 z-20 rotate-[13deg]",
    "-bottom-8 right-[32%] z-10 -rotate-[3deg]",
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.15 });

        tl.set(".headline-inner", { yPercent: 115, opacity: 0 })
          .set(".cover-meta", { y: 16, opacity: 0 })
          .set(".cover-photo-card", { y: 28, scale: 0.92, opacity: 0 })
          .set(".cover-cue", { opacity: 0 })
          .to(".headline-inner", {
            yPercent: 0,
            opacity: 1,
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.14,
          })
          .to(
            ".cover-meta",
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
            },
            "-=0.5",
          )
          .to(
            ".cover-photo-card",
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.08,
            },
            "-=0.45",
          )
          .to(".cover-cue", { opacity: 1, duration: 0.6 }, "-=0.2");

        return () => tl.kill();
      });

      return undefined;
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Cover"
      data-scene="cover"
      className="story-section relative flex min-h-dvh flex-col overflow-hidden bg-cream/25"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-between px-5 pb-6 pt-6 min-[360px]:px-6 min-[360px]:pb-8 min-[360px]:pt-8 md:px-10 md:pb-10 md:pt-10">
        <div className="cover-meta flex items-center justify-between border-b border-line/70 pb-4">
          <SectionLabel tone="gold">{story.anniversary.label}</SectionLabel>
        </div>

        <div className="relative grid flex-1 items-center gap-8 py-10 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-10 md:py-16 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="relative z-10 min-w-0">
            <h1 className="w-full min-w-0 max-w-4xl font-display text-balance text-[2.75rem] leading-[0.9] text-ink min-[360px]:text-[3.2rem] sm:text-7xl md:text-8xl lg:text-[9rem]">
              {words.map((word, i) => (
                <span key={i} className="block overflow-hidden">
                  <span
                    className={`headline-inner block ${
                      i === words.length - 1 ? "italic text-gold-deep" : ""
                    }`}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <div className="cover-meta relative z-10 mt-8 flex flex-wrap items-end gap-x-7 gap-y-4 border-l border-sage/60 pl-4 min-[360px]:mt-10 min-[360px]:gap-x-10 min-[360px]:pl-5">
              <p className="font-body text-[11px] uppercase leading-relaxed tracking-[0.2em] text-ink-soft">
                {story.couple.you} &amp; {story.couple.her}
              </p>
              <p className="font-display text-2xl text-ink md:text-3xl">
                <span className="text-gold-deep">
                  {days.toLocaleString("en-US")}
                </span>{" "}
                days
              </p>
            </div>
          </div>

          <div
            className="cover-meta relative z-0 h-52 w-dvw max-w-[20rem] justify-self-center min-[360px]:h-56 md:h-[26rem] md:max-w-none md:justify-self-end lg:h-[30rem]"
            aria-label="Featured memory photos"
          >
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl" />
            {coverPhotos.map((item, i) => (
              <div
                key={item.src}
                className={`cover-photo-card absolute w-dvw min-[360px]:w-28 md:w-36 lg:w-44 ${photoCardClasses[i]}`}
              >
                <div className="bg-ivory p-1.5 shadow-[0_18px_50px_rgba(46,40,34,0.18)] md:p-2">
                  <Figure
                    src={item.src}
                    alt={`Memory photo ${i + 1}`}
                    aspect="aspect-[4/5]"
                    className="border-line/80"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cover-cue flex items-center gap-3 self-start text-ink-soft">
          <span className="font-body text-xs uppercase tracking-[0.2em]">
            Scroll
          </span>
          <span
            aria-hidden="true"
            className="motion-safe:animate-bounce motion-reduce:animate-none h-8 w-px bg-ink-soft/60"
          />
        </div>
      </div>
    </section>
  );
}
