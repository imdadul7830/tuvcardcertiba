import { ArrowRight, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

export default function Hero() {
  const { content } = useSiteContent();
  const heroContent = content?.hero;

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-16 lg:pt-32">
          
          <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <span className="text-blue-700 font-semibold tracking-wider uppercase text-sm mb-4 block">{heroContent?.subtitle || 'Certiva TÜV Training & Certification'}</span>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">{heroContent?.title1 || 'Empower your career with'}</span>{' '}
                <span className="block text-blue-700 xl:inline">{heroContent?.titleHighlight || 'Certified Quality'}</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {heroContent?.description || 'World-class training programs in Saudi Arabia. Graduates receive internationally recognized certificates and professional ID cards with QR code verification.'}
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a href="#courses" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 md:py-4 md:text-lg md:px-10 transition-colors">
                    {heroContent?.buttonText || 'View Courses'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#verify" className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors">
                    Verify Certificate
                    <ChevronRight className="ml-2 w-5 h-5 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50">
        <img 
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" 
          src={heroContent?.imageUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000"} 
          alt="Professional training environment" 
        />
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
      </div>
    </div>
  );
}
