import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import { useSiteContent } from '../context/ContentContext';

export default function Imprint() {
  const { content } = useSiteContent();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Helmet>
        <title>Imprint - Certiva TUV</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Imprint (Legal Notice)</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Information in accordance with legal requirements</h2>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Certiva TUV Co. Ltd.</p>
              <p>{content?.contactSection?.address || '123 Business Avenue, Tech District, City, Country'}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <div className="space-y-1">
              <p>Email: <a href={`mailto:${content?.contactSection?.email}`} className="text-blue-600 hover:underline">{content?.contactSection?.email || 'info@certivatuv.com'}</a></p>
              <p>Phone: <a href={`tel:${content?.contactSection?.phone}`} className="text-blue-600 hover:underline">{content?.contactSection?.phone || '+1 234 567 890'}</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Represented by</h2>
            <p>Managing Director / CEO</p>
            <p>Certiva TUV Management</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Dispute Resolution</h2>
            <p>We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Liability for Contents</h2>
            <p>As service providers, we are liable for own contents of these websites according to general laws. However, we are not obliged to monitor submitted or stored information or to search for evidences that indicate illegal activities. Legal obligations to removing information or to blocking the use of information remain unchallenged. In this case, liability is only possible at the time of knowledge about a specific violation of law. Illegal contents will be removed immediately at the time we get knowledge of them.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
