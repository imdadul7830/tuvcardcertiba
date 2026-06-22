import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import Verify from '../components/Verify';
import Stats from '../components/Stats';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Services />
      <Features />
      <Verify />
      <Stats />
      <Contact />
      <Footer />
    </div>
  );
}
