/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import VerifyPage from './pages/VerifyPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Imprint from './pages/Imprint';

// Footer Pages
import Certification from './pages/Certification';
import Testing from './pages/Testing';
import Inspection from './pages/Inspection';
import TrainingEducation from './pages/TrainingEducation';
import DigitalIT from './pages/DigitalIT';
import EnergyUtilities from './pages/EnergyUtilities';
import OilGas from './pages/OilGas';
import Infrastructure from './pages/Infrastructure';
import Healthcare from './pages/Healthcare';
import Mobility from './pages/Mobility';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Locations from './pages/Locations';
import Contact from './pages/Contact';

import { ContentProvider } from './context/ContentContext';

export default function App() {
  return (
    <Router>
      <ContentProvider>
        <div className="min-h-screen bg-white font-sans text-gray-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/verify/:id" element={<VerifyPage />} />
            
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/imprint" element={<Imprint />} />
            
            <Route path="/certification" element={<Certification />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/inspection" element={<Inspection />} />
            <Route path="/training-education" element={<TrainingEducation />} />
            <Route path="/digital-it" element={<DigitalIT />} />
            <Route path="/energy-utilities" element={<EnergyUtilities />} />
            <Route path="/oil-gas" element={<OilGas />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/healthcare" element={<Healthcare />} />
            <Route path="/mobility" element={<Mobility />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </ContentProvider>
    </Router>
  );
}
