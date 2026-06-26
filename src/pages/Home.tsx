import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import Verify from '../components/Verify';
import Stats from '../components/Stats';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { useSiteContent } from '../context/ContentContext';

export default function Home() {
  const { content } = useSiteContent();

  return (
    <div className="bg-white">
      <Helmet>
        <title>{content?.heroTitle || 'Certiva TUV'} - Home</title>
        <meta name="description" content={content?.heroSubtitle || 'Professional Certification & Training Services'} />
      </Helmet>
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
