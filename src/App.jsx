import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Brands from "./sections/Brands";
import Contact from "./sections/Contact";
import Experience from "./sections/Experience";
import Familiar from "./sections/Familiar";
import Hero from "./sections/Hero";
import Process from "./sections/Process";
import Services from "./sections/Services";
import Statement from "./sections/Statement";
import Work from "./sections/Work";
import { useLenis } from "./hooks/useLenis";
import { useMotion } from "./hooks/useMotion";

export default function App() {
  useLenis();
  const { i18n } = useTranslation();
  useMotion(i18n.language);

  // Section heights change with the language; pinned triggers must follow.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [i18n.language]);

  // Web fonts change text metrics once loaded; recompute trigger windows.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Familiar />
        <Statement />
        <Services />
        <Process />
        <Work />
        <Brands />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
