import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function VerifyPage() {
  const { id } = useParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyId = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/verify/${encodeURIComponent(id)}`);
        const data = await response.json();
        
        if (data.success) {
          setResult(data);
        } else {
          setError(data.message || 'Verification failed. Invalid ID.');
        }
      } catch (err) {
        setError('An error occurred during verification. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyId();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8">
          
          <div className="text-center">
            <ShieldCheck className="mx-auto h-16 w-16 text-blue-700" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Credential Verification
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Checking the authenticity of credential ID: <span className="font-mono font-bold">{id}</span>
            </p>
          </div>

          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Verifying credentials against our database...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center text-center">
                <XCircle className="w-16 h-16 text-red-600 mb-4" />
                <h3 className="text-xl font-bold text-red-800 mb-2">Verification Failed</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Homepage
                </Link>
              </div>
            ) : result && result.success ? (
              <div className="border border-green-200 bg-white rounded-lg overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800 text-lg">
                        Authentic {result.type === 'certificate' ? 'Certificate' : 'ID Card'}
                      </h3>
                      <p className="text-green-700 text-sm">Verified successfully by Certiva TUV.</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wide inline-block text-center shadow-sm">
                    {result.data.status}
                  </span>
                </div>
                
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {result.data.photoUrl && (
                      <div className="flex-shrink-0 flex justify-center md:justify-start">
                        <img 
                          src={result.data.photoUrl} 
                          alt={result.data.name} 
                          className="w-40 h-40 object-cover rounded-xl border-4 border-gray-100 shadow-md"
                        />
                      </div>
                    )}
                    
                    <div className="flex-grow">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        <div>
                          <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Name</dt>
                          <dd className="mt-1 text-xl font-bold text-gray-900 border-b pb-2">{result.data.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Credential ID</dt>
                          <dd className="mt-1 text-xl font-mono font-semibold text-gray-900 border-b pb-2">{result.data.id}</dd>
                        </div>
                        
                        {result.type === 'certificate' ? (
                          <>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Approved Course / Training</dt>
                              <dd className="mt-2 text-lg font-medium text-blue-900 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                {result.data.course}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Issue Date</dt>
                              <dd className="mt-1 text-lg text-gray-900 font-medium">{result.data.issueDate}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Valid Until</dt>
                              <dd className="mt-1 text-lg text-gray-900 font-medium">{result.data.expiryDate}</dd>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Role / Title</dt>
                              <dd className="mt-2 text-lg font-medium text-blue-900 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                {result.data.role}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Organization / Company</dt>
                              <dd className="mt-1 text-lg text-gray-900 font-medium">{result.data.organization}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">Valid Until</dt>
                              <dd className="mt-1 text-lg text-gray-900 font-medium">{result.data.validUntil}</dd>
                            </div>
                            {result.data.iqama && (
                              <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500 uppercase tracking-wider">National ID / Iqama</dt>
                                <dd className="mt-1 text-lg text-gray-900 font-medium">{result.data.iqama}</dd>
                              </div>
                            )}
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-center">
                  <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
