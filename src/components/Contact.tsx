import { MapPin, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useSiteContent } from '../context/ContentContext';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { content } = useSiteContent();
  const contactInfo = content?.contact || {
    phone: "+966 11 412 8734",
    email: "hello@certiva-tuv.com",
    address: "Olayya Street, King Fahd District, Riyadh 11543, Kingdom of Saudi Arabia",
    fax: ""
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      service: formData.get('service'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Get in touch with us</h2>
            <p className="mt-4 text-lg text-gray-500 mb-8">
              Whether you need testing, certification, training or technical advisory, our engineering experts in Saudi Arabia are ready to assist you.
            </p>
            
            <div className="space-y-6">
              <div className="flex bg-gray-50 p-4 rounded-lg">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-blue-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Headquarters Riyadh</h3>
                  <p className="mt-1 text-gray-500 whitespace-pre-line">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
              
              <div className="flex bg-gray-50 p-4 rounded-lg">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-500">
                    {contactInfo.phone}
                    {contactInfo.fax && <><br/>Fax: {contactInfo.fax}</>}
                  </p>
                </div>
              </div>

              <div className="flex bg-gray-50 p-4 rounded-lg">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-500">
                    {contactInfo.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" id="first-name" name="firstName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border bg-gray-50" placeholder="John" />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" id="last-name" name="lastName" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border bg-gray-50" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border bg-gray-50" placeholder="john@company.com" />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service of Interest</label>
                <select id="service" name="service" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border bg-gray-50">
                  <option>Certification & Auditing</option>
                  <option>Industrial Testing</option>
                  <option>Cybersecurity</option>
                  <option>Training</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" name="message" required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-3 border bg-gray-50" placeholder="How can we help you?"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-md">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Message sent successfully! We will get back to you shortly.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="text-red-600 text-sm font-medium mt-2">
                  Failed to send message. Please try again later.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
