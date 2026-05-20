import { lazy, Suspense, useState } from "react";
import About from "./components/About";
import BrandsCarousel from "./components/BrandsCarousel";
import Curtain from "./components/Curtain";
import Experiences from "./components/Experiences";
import Presentation from "./components/Presentation";
import Projects from "./components/Projects";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import ScrollRail from "./layout/ScrollRail";
import StatusBar from "./layout/StatusBar";
import { useLenis } from "./hooks/useLenis";

const HeroBackground = lazy(() => import("./components/HeroBackground"));

export default function App() {
  useLenis();
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="relative text-fg">
      <Curtain onDone={() => setIntroDone(true)} />
      <Suspense fallback={null}>
        <HeroBackground />
      </Suspense>
      <div className="grain" />
      <Header />
      <StatusBar />
      <ScrollRail />
      <main className="relative px-4">
        <section id="hero" className="relative min-h-[92dvh]">
          <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-24 md:pt-36">
            <Presentation start={introDone} />
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
