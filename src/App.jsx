import { lazy, Suspense, useState } from "react";
import About from "./components/About";
import BrandsCarousel from "./components/BrandsCarousel";
import Experiences from "./components/Experiences";
import Presentation from "./components/Presentation";
import Projects from "./components/Projects";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import ScrollRail from "./layout/ScrollRail";
import StatusBar from "./layout/StatusBar";
import SceneBoundary from "./scene/SceneBoundary";
import { detectTier } from "./scene/quality";
import { useLenis } from "./hooks/useLenis";

const Scene = lazy(() => import("./scene/Scene"));

export default function App() {
  useLenis();
  const [tier, setTier] = useState(detectTier);
  const disableScene = () => setTier("off");

  return (
    <div className="relative text-fg">
      {tier !== "off" ? (
        <SceneBoundary onFail={disableScene}>
          <Suspense fallback={null}>
            <Scene tier={tier} onFail={disableScene} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <div aria-hidden="true" className="scene-fallback" />
      )}
      {tier !== "off" && <div className="scene-scrim" />}
      <div className="grain" />
      <Header />
      <StatusBar />
      <ScrollRail />
      <main className="relative z-10 px-4">
        <section id="hero" className="relative min-h-[92dvh]">
          <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-24 md:pt-36">
            <Presentation start />
          </div>
        </section>

        <div className="mx-auto w-full max-w-5xl">
          <div className="my-16 md:my-24">
            <BrandsCarousel />
          </div>
          <Experiences />
          <Projects />
          <About />
          <Footer />
        </div>
      </main>
    </div>
  );
}
