import * as Icons from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

const defaultFeatures = [
  {
    title: "Globally Recognized Certificates",
    description: "Our certificates carry the official Certiva TÜV seal, providing undeniable proof of your qualifications to employers worldwide.",
    icon: "BadgeCheck"
  },
  {
    title: "Professional ID Cards",
    description: "Carry your credentials wherever you go. The high-quality printed ID card showcases your name, photo, and certified roles.",
    icon: "IdCard"
  },
  {
    title: "QR Code Verification",
    description: "Every certificate and ID card features a unique QR code. Employers can instantly scan it to verify authenticity and current validity status via our portal.",
    icon: "QrCode"
  }
];

export default function Features() {
  const { content } = useSiteContent();
  const featuresSection = content?.featuresSection || {
    title: "Official Certificates & ID Cards",
    description: "Upon successful completion of your training program, you will be awarded an internationally recognized certificate alongside a professional ID card. Both items are securely verifiable.",
    items: defaultFeatures
  };

  return (
    <section id="features" className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              {featuresSection.title}
            </h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              {featuresSection.description}
            </p>
            
            <dl className="space-y-8">
              {featuresSection.items.map((item, index) => {
                // @ts-ignore
                const IconComponent = Icons[item.icon] || Icons.CheckCircle;
                return (
                  <div key={index} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-700 text-white">
                        <IconComponent className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-xl font-semibold leading-6 text-gray-900">{item.title}</p>
                    </dt>
                    <dd className="mt-3 ml-16 text-base text-gray-500">
                      {item.description}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl shadow-xl overflow-hidden bg-gray-100 p-8 flex flex-col gap-6 justify-center items-center">
              {/* ID Card Mockup */}
              <div className="bg-white rounded-xl shadow-md w-full max-w-sm overflow-hidden border border-gray-200">
                <div className="bg-blue-800 px-6 py-4 flex justify-between items-center text-white">
                    <span className="font-bold tracking-tight">Certiva TÜV</span>
                    <span className="text-xs uppercase tracking-wider font-semibold">Certified Professional</span>
                </div>
                <div className="p-6 flex gap-6 items-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Ahmed Al-Farsi</h3>
                        <p className="text-sm text-gray-500 font-medium pb-2">ID: ID-8942-771</p>
                        <p className="text-xs text-blue-700 font-semibold border border-blue-200 bg-blue-50 px-2 py-1 rounded inline-block">ISO 9001 Lead Auditor</p>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">Valid til: Oct 2026</div>
                    <Icons.QrCode className="h-10 w-10 text-gray-800" />
                </div>
              </div>

               {/* Certificate Mockup snippet */}
               <div className="bg-white rounded-xl shadow-md w-full max-w-sm overflow-hidden border border-gray-200 p-6 flex items-start gap-4 transform rotate-2">
                 <Icons.BadgeCheck className="h-12 w-12 text-blue-700 flex-shrink-0" />
                 <div>
                    <h4 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">Certificate of Completion</h4>
                    <p className="text-sm text-gray-600 mb-1">This is to certify that</p>
                    <p className="text-base font-bold text-gray-900 mb-2">Ahmed Al-Farsi</p>
                    <p className="text-xs text-gray-500">has successfully completed the training requirements for ISO 9001:2015.</p>
                 </div>
               </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
