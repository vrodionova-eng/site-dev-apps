import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LiveDemo from "@/components/LiveDemo";
import Catalog from "@/components/Catalog";
import Integrations from "@/components/Integrations";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog />
        <LiveDemo />
        <Integrations />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
