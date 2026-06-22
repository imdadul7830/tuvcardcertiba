import { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function Verify() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`/api/verify/${encodeURIComponent(searchTerm.trim())}`);
      const data = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Verification failed. Invalid ID.');
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="verify" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <ShieldCheck className="w-12 h-12 text-blue-700 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Verify Credentials
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Scan the QR code on the certificate or ID card, or manually enter the Certificate Number / ID Number below to verify authenticity.
          </p>
          <div className="mt-4 text-sm text-gray-400">
            (Hint: Try <span className="font-mono bg-gray-200 px-1 rounded text-gray-700">CERT-123</span> or <span className="font-mono bg-gray-200 px-1 rounded text-gray-700">2345678901</span>)
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg bg-gray-50 shadow-inner"
                placeholder="Enter Certificate No. or ID Number (e.g., 2345678901)"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Now'}
            </button>
          </form>

          {/* Results Area */}
          <div className="mt-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-semibold">Verification Failed</h4>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {result && result.success && (
              <div className="border border-green-200 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-800 text-lg">
                      Valid {result.type === 'certificate' ? 'Certificate' : 'ID Card'} Found
                    </h3>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {result.data.status}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {result.data.photoUrl && (
                      <div className="flex-shrink-0">
                        <img 
                          src={result.data.photoUrl} 
                          alt={result.data.name} 
                          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">{result.data.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Credential ID</dt>
                          <dd className="mt-1 text-lg font-mono text-gray-900">{result.data.id}</dd>
                        </div>
                        
                        {result.type === 'certificate' ? (
                          <>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Approved Course / Training</dt>
                              <dd className="mt-1 text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded border border-gray-100">{result.data.course}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                              <dd className="mt-1 text-base text-gray-900">{result.data.issueDate}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                              <dd className="mt-1 text-base text-gray-900">{result.data.expiryDate}</dd>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500">Role / Title</dt>
                              <dd className="mt-1 text-lg font-medium text-gray-900">{result.data.role}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Organization</dt>
                              <dd className="mt-1 text-base text-gray-900">{result.data.organization}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Valid Until</dt>
                              <dd className="mt-1 text-base text-gray-900">{result.data.validUntil}</dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
