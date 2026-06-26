import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Helmet>
        <title>About Us - Certiva TUV</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Us</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p>
            Welcome to the About Us page. This section provides detailed information about our about us services and offerings. 
            We are continuously working to update this page with the latest information, capabilities, and solutions to help your business achieve excellence and compliance.
          </p>
          <p>
            Please check back soon for a comprehensive overview of our expertise, methodologies, and success stories in this area.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
