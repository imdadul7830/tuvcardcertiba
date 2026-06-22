/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import VerifyPage from './pages/VerifyPage';
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
          </Routes>
        </div>
      </ContentProvider>
    </Router>
  );
}
