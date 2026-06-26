import { QRCodeSVG } from 'qrcode.react';
import { BadgeCheck, Cog, CheckCircle, Award, Phone, Globe, Shield, Activity, FileText } from 'lucide-react';

interface IdCardProps {
  trainee: {
    id: string;
    name: string;
    iqama: string;
    company: string;
    project: string;
    course: string;
    photoUrl: string;
    issueDate: string;
    expiryDate: string;
    trainedBy: string;
    approvedBy: string;
    levelCategory: string;
    status: string;
  };
}

export default function IdCardView({ trainee }: IdCardProps) {
  const verifyUrl = `${window.location.origin}/verify/${trainee.id}`;

  return (
    <div className="flex flex-col items-center gap-8" id="id-card-view">
      {/* --- FRONT OF ID CARD --- */}
      <div className="w-[600px] h-[380px] bg-sky-50 rounded-lg shadow-2xl relative overflow-hidden flex flex-col font-sans border border-gray-200">
        {/* Tech Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 text-sky-200 opacity-30">
          <Globe size={400} strokeWidth={0.5} />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Top Header Section */}
          <div className="flex justify-between items-start px-6 pt-6 mb-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-blue-900 border-b-2 border-blue-900 pb-1 pr-4">
                <Cog className="w-8 h-8 text-blue-700" />
                <h1 className="font-extrabold text-2xl tracking-tighter">Certiva <span className="font-light italic">TÜV</span></h1>
              </div>
              <p className="text-[10px] font-bold tracking-widest text-blue-800 mt-1 uppercase">INSPECTION & TRAINING</p>
              <p className="text-red-600 font-bold text-lg mt-1 tracking-wider">{trainee.id}</p>
            </div>
            <div className="text-right max-w-[280px]">
              <h2 className="text-xl font-bold text-gray-900 leading-tight block">CERTIFIED</h2>
              <h3 className="text-lg font-bold text-gray-900 leading-tight uppercase">{trainee.course}</h3>
            </div>
          </div>

          {/* Middle Content Base */}
          <div className="flex flex-1 px-6">
            {/* Photo */}
            <div className="w-32 h-40 bg-white border-2 border-gray-300 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
               <img src={trainee.photoUrl} alt="Trainee" className="w-full h-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex-1 pl-6 flex flex-col justify-center space-y-2.5">
              <div className="flex items-center text-sm font-bold text-gray-900 uppercase">
                <span className="w-24 flex-shrink-0 text-gray-700">NAME :</span>
                <span className="truncate">{trainee.name}</span>
              </div>
              <div className="flex items-center text-sm font-bold text-gray-900 uppercase">
                <span className="w-24 flex-shrink-0 text-gray-700">ID NO :</span>
                <span>{trainee.iqama}</span>
              </div>
              <div className="flex items-center text-sm font-bold text-gray-900 uppercase">
                <span className="w-24 flex-shrink-0 text-gray-700">ISSUED :</span>
                <span>{new Date(trainee.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '-')}</span>
              </div>
              <div className="flex items-center text-sm font-bold text-gray-900 uppercase">
                <span className="w-24 flex-shrink-0 text-gray-700">EXPIRY :</span>
                <span>{new Date(trainee.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '-')}</span>
              </div>
              <div className="flex items-center text-sm font-bold text-gray-900 uppercase">
                <span className="w-24 flex-shrink-0 text-gray-700">COMPANY :</span>
                <span className="truncate">{trainee.company}</span>
              </div>
              {trainee.project !== "N/A" && (
                <div className="flex items-center text-sm font-bold text-gray-900 uppercase">
                  <span className="w-24 flex-shrink-0 text-gray-700">PROJECT :</span>
                  <span className="truncate">{trainee.project}</span>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="flex-shrink-0 pl-4 pt-1">
              <div className="bg-white p-1.5 border border-gray-300">
                <QRCodeSVG value={verifyUrl} size={100} level="M" />
              </div>
            </div>
          </div>

          {/* Footer Logistics/Partners */}
          <div className="mt-4 pb-2">
            <div className="h-[2px] w-full bg-blue-100 flex items-center justify-center gap-1 opacity-50 mb-2 overflow-hidden px-4">
               {Array.from({length: 10}).map((_, i) => <span key={i} className="text-[6px] text-gray-300 tracking-[0.2em]">{trainee.id}</span>)}
            </div>
            
            {/* Fake Partner Logos */}
            <div className="flex justify-center items-center gap-4 px-6 opacity-60 mb-2 grayscale">
              <Shield size={16} /> <BadgeCheck size={16} /> <Award size={16} /> <CheckCircle size={16} /> <Activity size={16} /> <FileText size={16} />
            </div>

            <div className="text-center px-4">
              <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tighter">Olayya Street, King Fahd District, Riyadh 11543, Saudi Arabia | Telephone: +966 11 412 8734</p>
              <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tighter">Fax : +966 11 412 8735 Email: info@certiva-tuv.com Website : www.certiva-tuv.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- BACK OF ID CARD --- */}
      <div className="w-[600px] h-[380px] bg-sky-50 rounded-lg shadow-2xl relative overflow-hidden flex flex-col font-sans border border-gray-200">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
        <div className="absolute -left-20 top-10 text-sky-200 opacity-20 transform rotate-180">
          <Globe size={400} strokeWidth={0.5} />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Top Area */}
          <div className="flex justify-between pt-6 px-8">
            <div className="space-y-2">
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                TRAINED BY : {trainee.trainedBy}
              </div>
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                APPROVED BY : {trainee.approvedBy}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">ENR NO</div>
              <div className="text-red-600 font-bold text-lg tracking-wider">{trainee.id.replace('ID', 'GAT').split('-')[0]}04608</div>
            </div>
          </div>

          {/* Middle Stamp & Box */}
          <div className="flex-1 flex px-8 items-center justify-between">
            {/* Realistic Round Stamp */}
            <div className="relative w-48 h-48 flex items-center justify-center transform -rotate-12 mix-blend-multiply opacity-90">
               {/* Stamp Outer Rings */}
               <div className="absolute inset-0 rounded-full border-[4px] border-red-700/85"></div>
               <div className="absolute inset-[5px] rounded-full border-[1px] border-red-700/85"></div>
               <div className="absolute inset-[30px] rounded-full border-[1.5px] border-red-700/85"></div>
               
               {/* Stamp Inner Content */}
               <div className="text-center z-10 pt-1">
                 <div className="flex justify-center mb-1"><Shield className="w-7 h-7 text-red-700/85" /></div>
                 <div className="text-red-700/85 font-black text-xl tracking-tighter border-y-[1.5px] border-red-700/85 py-1 mb-1 transform scale-y-110">
                   CERTIVA TÜV
                 </div>
                 <div className="text-red-700/85 font-bold text-[8px] uppercase tracking-widest mt-1">
                   OFFICIAL SEAL
                 </div>
               </div>

               {/* Outer circular text */}
               <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                 <path id="topCurve" d="M 16 50 a 34 34 0 0 1 68 0" fill="transparent" />
                 <path id="bottomCurve" d="M 16 50 a 34 34 0 0 0 68 0" fill="transparent" />
                 <text className="text-[7.5px] font-bold fill-red-700/85 uppercase tracking-widest">
                   <textPath href="#topCurve" startOffset="50%" textAnchor="middle">★ CERTIVA TUV CO. LTD. ★</textPath>
                 </text>
                 <text className="text-[7px] font-bold fill-red-700/85 uppercase tracking-widest">
                   <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">INSPECTION &amp; TRAINING</textPath>
                 </text>
               </svg>

               {/* Stamp noise texture overlay */}
               <div className="absolute inset-0 rounded-full mix-blend-overlay opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stucco.png')]"></div>

               {/* Handwritten Signature Overlay */}
               <div className="absolute -right-4 bottom-8 transform -rotate-12 opacity-80 z-20 pointer-events-none">
                 <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M10 40 C 20 20, 30 15, 40 35 C 50 55, 60 45, 70 25 C 80 5, 90 25, 100 45 C 110 55, 115 40, 118 35" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                   <path d="M35 30 L 65 25" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
                 </svg>
               </div>
            </div>

            {/* Level Box */}
            <div className="w-[280px]">
              <div className="text-center mb-1">
                <span className="bg-sky-50 px-2 font-bold text-sm text-gray-900 uppercase tracking-wide">LEVEL / CATEGORIES / OTHERS</span>
              </div>
              <div className="border-[3px] border-cyan-400 rounded-lg p-6 min-h-[120px] bg-white/50 relative">
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-[3px] border-l-[3px] border-cyan-600 rounded-tl"></div>
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-[3px] border-r-[3px] border-cyan-600 rounded-tr"></div>
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-cyan-600 rounded-bl"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-cyan-600 rounded-br"></div>
                 <p className="font-bold text-gray-900 text-lg uppercase">{trainee.levelCategory}</p>
              </div>
            </div>
          </div>

          <div className="h-[2px] w-full flex items-center justify-center gap-1 opacity-30 overflow-hidden px-4 mb-2">
               {Array.from({length: 10}).map((_, i) => <span key={i} className="text-[6px] text-gray-400 tracking-[0.2em]">{trainee.id}</span>)}
          </div>

          {/* Bottom Warning Banner */}
          <div className="bg-blue-900 text-white text-center py-3 px-6 h-[88px] flex flex-col justify-center">
            <p className="text-[11px] leading-snug">
              This card is only valid for the equipment as stated. Use of this card by a person other than its owner is considered forgery and will be punishable by Law and whoever finds it shall return to Certiva TUV Co. Ltd. office. Any liability occurring due to error in operation or damage will not be the responsibility of the issuing agency.
            </p>
            <p className="text-sm font-bold mt-1 tracking-wide">THIS IS NOT A SAUDI GOVERNMENT LICENSE ID.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
