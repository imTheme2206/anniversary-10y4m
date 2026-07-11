import { lazy, Suspense, useEffect } from "react";
import { GrainOverlay } from "./components/GrainOverlay";
import { Cover } from "./components/sections/Cover";
import { Intro } from "./components/sections/Intro";
import { Timeline } from "./components/sections/Timeline";
import { VideoFinale } from "./components/sections/VideoFinale";
import { useLenis } from "./hooks/useLenis";
import { ScrollTrigger } from "./lib/gsap";

const ThreeDaisyField = lazy(() =>
  import("./components/ThreeDaisyField").then((module) => ({
    default: module.ThreeDaisyField,
  })),
);

function App() {
  useLenis();

  // Web fonts (Fraunces in particular) reflow headings after they finish
  // loading — refresh ScrollTrigger so start/end positions stay accurate.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if ("fonts" in document) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <div className="relative overflow-x-hidden bg-cream">
      <Suspense
        fallback={
          <div
            aria-hidden="true"
            className="three-fallback pointer-events-none fixed inset-0 z-[5]"
          />
        }
      >
        <ThreeDaisyField />
      </Suspense>
      <GrainOverlay />

      <main>
        <Cover />
        <Intro />
        <Timeline />
        {/*<Milestones />*/}
        {/*<Gallery />*/}
        {/*<Letter />*/}
        <VideoFinale />
        {/*<Reasons />
         */}
      </main>

      {/*<Footer />*/}
    </div>
  );
}

export default App;
