import { ShieldCheck, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl tracking-tight text-white">Certiva<span className="font-light"> TÜV</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Global experts for safety, quality, and environmental protection. Certiva TÜV acts as your independent, impartial, and expert partner.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Services</h3>
            <ul className="space-y-3">
              <li><a href="/certification" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Certification</a></li>
              <li><a href="/testing" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Testing</a></li>
              <li><a href="/inspection" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Inspection</a></li>
              <li><a href="/training-education" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Training & Education</a></li>
              <li><a href="/digital-it" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Digital & IT</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Industries</h3>
            <ul className="space-y-3">
              <li><a href="/energy-utilities" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Energy & Utilities</a></li>
              <li><a href="/oil-gas" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Oil & Gas</a></li>
              <li><a href="/infrastructure" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Infrastructure</a></li>
              <li><a href="/healthcare" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Healthcare</a></li>
              <li><a href="/mobility" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Mobility</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about-us" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="/careers" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="/press" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Press</a></li>
              <li><a href="/locations" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Locations</a></li>
              <li><a href="/contact" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Certiva TÜV. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
            <a href="/imprint" className="text-gray-500 hover:text-white transition-colors">Imprint</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
