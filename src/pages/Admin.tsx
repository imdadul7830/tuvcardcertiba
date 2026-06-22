import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Users, ShieldCheck, Download, X, UserCog, Key, PanelTop } from 'lucide-react';
import IdCardView from '../components/IdCardView';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useSiteContent } from '../context/ContentContext';
import SiteContentEditor from '../components/SiteContentEditor';

interface Trainee {
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
}

interface AppUser {
  id: string;
  username: string;
  name: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'trainees' | 'settings' | 'users' | 'profile' | 'site'>('trainees');
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [iqama, setIqama] = useState('');
  const [company, setCompany] = useState('');
  const [course, setCourse] = useState('');
  const [project, setProject] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [trainedBy, setTrainedBy] = useState('REEZAM HUSSAIN');
  const [approvedBy, setApprovedBy] = useState('SAYED RAFIK ABDULLAH');
  const [levelCategory, setLevelCategory] = useState('NA');

  // Settings forms
  const [newCourse, setNewCourse] = useState('');
  const [newBranch, setNewBranch] = useState('');

  // User forms
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');

  // Password change
  const [passwordChangeTarget, setPasswordChangeTarget] = useState<string | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  useEffect(() => {
    // Basic auth check
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const initDate = new Date().toISOString().split('T')[0];
    setIssueDate(initDate);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setExpiryDate(nextYear.toISOString().split('T')[0]);

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [traineesRes, settingsRes, usersRes] = await Promise.all([
        fetch('/api/trainees'),
        fetch('/api/settings'),
        fetch('/api/users')
      ]);
      const traineesData = await traineesRes.json();
      const settingsData = await settingsRes.json();
      const usersData = await usersRes.json();
      
      setTrainees(traineesData);
      setCourses(settingsData.courses);
      setBranches(settingsData.branches);
      setAppUsers(usersData);
      if (settingsData.courses.length > 0) setCourse(settingsData.courses[0]);
      if (settingsData.branches.length > 0) setProject(settingsData.branches[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const res = await fetch('/api/trainees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, iqama, company, project, course, photoUrl, issueDate, expiryDate, trainedBy, approvedBy, levelCategory })
      });
      
      const data = await res.json();
      if (data.success) {
        setTrainees([data.trainee, ...trainees]);
        // Reset form
        setName('');
        setIqama('');
        setCompany('');
        setPhotoUrl('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse) return;
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: newCourse })
      });
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        setNewCourse('');
      }
    } catch (e) {}
  };

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch) return;
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch: newBranch })
      });
      const data = await res.json();
      if (data.success) {
        setBranches(data.branches);
        setNewBranch('');
      }
    } catch (e) {}
  };

  const deleteTrainee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trainee?')) return;
    
    try {
      await fetch(`/api/trainees/${id}`, { method: 'DELETE' });
      setTrainees(trainees.filter(t => t.id !== id));
      if (selectedTrainee?.id === id) setSelectedTrainee(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newUserName) return;
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, name: newUserName })
      });
      const data = await res.json();
      if (data.success) {
        setAppUsers(data.users);
        setNewUsername('');
        setNewPassword('');
        setNewUserName('');
      } else {
        alert(data.message);
      }
    } catch (e) {}
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordChangeTarget || !newPasswordValue) return;
    try {
      const res = await fetch(`/api/users/${passwordChangeTarget}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPasswordValue })
      });
      const data = await res.json();
      if (data.success) {
        alert('Password updated successfully!');
        setPasswordChangeTarget(null);
        setNewPasswordValue('');
      } else {
        alert(data.message);
      }
    } catch (e) {}
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppUsers(appUsers.filter(u => u.id !== id));
      } else {
        alert(data.message);
      }
    } catch (e) {}
  };

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
         alert('File is too large. Please select an image under 2MB.');
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('id-card-view');
    if (!element || !selectedTrainee) return;
    
    setIsGeneratingPDF(true);
    try {
      const dataUrl = await toPng(element, { 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight]
      });
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, element.offsetWidth, element.offsetHeight);
      pdf.save(`ID_${selectedTrainee.id}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) return <div className="text-center p-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
           <ShieldCheck className="h-8 w-8 text-blue-400" />
           <span className="font-bold text-xl tracking-tight">Admin<span className="font-light">Panel</span></span>
        </div>
        <div className="p-4 flex-1">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveTab('trainees')} className={`flex items-center gap-3 p-3 rounded-md w-full font-medium transition-colors ${activeTab === 'trainees' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                <Users className="w-5 h-5 text-blue-400" />
                Trainees
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 p-3 rounded-md w-full font-medium transition-colors ${activeTab === 'users' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                <UserCog className="w-5 h-5 text-blue-400" />
                Users
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-md w-full font-medium transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Projects & Courses
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('site')} className={`flex items-center gap-3 p-3 rounded-md w-full font-medium transition-colors ${activeTab === 'site' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
                <PanelTop className="w-5 h-5 text-blue-400" />
                Site Content
              </button>
            </li>
          </ul>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 w-full p-2 rounded text-left transition-colors mb-2 ${activeTab === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{currentUser?.name?.charAt(0) || 'U'}</div>
            <div className="flex-1 truncate">
              <div className="text-sm font-medium">{currentUser?.name}</div>
              <div className="text-xs opacity-75 truncate">{currentUser?.username}</div>
            </div>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full p-2">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'trainees' ? 'Trainee Management' : 
             activeTab === 'users' ? 'User Administration' :
             activeTab === 'site' ? 'Site Content' :
             activeTab === 'profile' ? 'My Profile' :
             'Admin Settings'}
          </h1>
        </div>

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {/* Courses Mgmt */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Courses</h2>
               <form onSubmit={handleAddCourse} className="flex gap-2 mb-6">
                 <input type="text" value={newCourse} onChange={e=>setNewCourse(e.target.value)} placeholder="New Course Name..." className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
                 <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 text-sm font-medium">Add</button>
               </form>
               <ul className="space-y-2">
                 {courses.map(c => (
                   <li key={c} className="bg-gray-50 px-4 py-2 rounded-md border border-gray-100 text-sm font-medium text-gray-700 flex justify-between items-center">
                     {c}
                   </li>
                 ))}
               </ul>
            </div>
            
            {/* Branches/Projects Mgmt */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Projects / Branches</h2>
               <form onSubmit={handleAddBranch} className="flex gap-2 mb-6">
                 <input type="text" value={newBranch} onChange={e=>setNewBranch(e.target.value)} placeholder="New Project/Branch Name..." className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
                 <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 text-sm font-medium">Add</button>
               </form>
               <ul className="space-y-2">
                 {branches.map(b => (
                   <li key={b} className="bg-gray-50 px-4 py-2 rounded-md border border-gray-100 text-sm font-medium text-gray-700 flex justify-between items-center">
                     {b}
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Change My Password</h2>
            <form onSubmit={(e) => { e.preventDefault(); setPasswordChangeTarget(currentUser?.id || null); handleUpdatePassword(e); }} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input required type="password" value={newPasswordValue} onChange={e=>setNewPasswordValue(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
               </div>
               <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 font-medium">Update Password</button>
            </form>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
               <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><UserCog className="w-5 h-5 text-blue-700" /> Add New User</h2>
               <form onSubmit={handleAddUser} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input required type="text" value={newUserName} onChange={e=>setNewUserName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input required type="text" value={newUsername} onChange={e=>setNewUsername(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input required type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border bg-gray-50" />
                 </div>
                 <button type="submit" className="w-full bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-800 font-medium mt-2">Create User</button>
               </form>
            </div>
            
            <div className="md:col-span-2">
               <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appUsers.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {passwordChangeTarget === user.id ? (
                              <div className="flex items-center justify-end gap-2">
                                <input type="password" placeholder="New Password" value={newPasswordValue} onChange={e=>setNewPasswordValue(e.target.value)} className="text-xs px-2 py-1 border rounded w-32" />
                                <button onClick={handleUpdatePassword} className="text-green-600 hover:text-green-900">Save</button>
                                <button onClick={() => { setPasswordChangeTarget(null); setNewPasswordValue(''); }} className="text-gray-600 hover:text-gray-900 text-xs">Cancel</button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-4">
                                <button onClick={() => { setPasswordChangeTarget(user.id); setNewPasswordValue(''); }} className="text-blue-600 hover:text-blue-900 text-xs flex items-center gap-1"><Key className="w-3 h-3" /> Password</button>
                                {currentUser?.id !== user.id && (
                                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 text-xs">Delete</button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'site' && <SiteContentEditor />}

        {activeTab === 'trainees' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Add Trainee Form */}
          <div className="xl:col-span-1 border border-gray-200 bg-white rounded-xl shadow-sm p-6 self-start">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-700" />
              Add Trainee
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Full Name</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">ID / Iqama No.</label>
                  <input required type="text" value={iqama} onChange={e => setIqama(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Company</label>
                  <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Project/Branch</label>
                  <select required value={project} onChange={e => setProject(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50">
                    <option value="N/A">N/A</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700">Course / Certification</label>
                <select required value={course} onChange={e => setCourse(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50">
                  <option value="" disabled>Select Course...</option>
                  {courses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Photo</label>
                  <div className="flex gap-2">
                    <input type="text" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="URL or..." className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                    <label className="cursor-pointer bg-white border border-gray-300 rounded px-2 py-1.5 text-xs flex items-center justify-center hover:bg-gray-50 whitespace-nowrap text-gray-700 font-medium">
                      Upload
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Level / Category</label>
                  <input type="text" value={levelCategory} onChange={e => setLevelCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Issue Date</label>
                  <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Expiry Date</label>
                  <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Trained By</label>
                  <input type="text" value={trainedBy} onChange={e => setTrainedBy(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Approved By</label>
                  <input type="text" value={approvedBy} onChange={e => setApprovedBy(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs px-2 py-1.5 border bg-gray-50" />
                </div>
              </div>

              <button disabled={isAdding || !course} type="submit" className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50">
                {isAdding ? 'Processing...' : 'Generate Profile & ID'}
              </button>
            </form>
          </div>

          {/* Trainees List */}
          <div className="xl:col-span-2 border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Issued Credentials</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{trainees.length} Total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainee Info</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course / Project</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainees.map((trainee) => (
                    <tr key={trainee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={trainee.photoUrl} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{trainee.name}</div>
                            <div className="text-sm text-gray-500">ID: {trainee.iqama}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-gray-900 truncate max-w-[200px]">{trainee.course}</div>
                        <div className="text-xs text-gray-500">{trainee.project !== 'N/A' ? trainee.project : trainee.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {trainee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button onClick={() => setSelectedTrainee(trainee)} className="text-blue-600 hover:text-blue-900">View ID</button>
                        <button onClick={() => deleteTrainee(trainee.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                  
                  {trainees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                        No trainees found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* ID Card Modal */}
      {selectedTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative py-12">
            <button 
              onClick={() => setSelectedTrainee(null)}
              className="absolute top-4 right-0 text-white hover:text-gray-300 bg-gray-800 rounded-full p-2 z-50 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <IdCardView trainee={selectedTrainee} />
            <div className="mt-6 flex justify-center sticky bottom-4 z-50 gap-4">
                <button onClick={() => window.print()} className="bg-white text-gray-900 border border-gray-300 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-gray-50 flex items-center gap-2 transition-colors">
                    Print ID Card
                </button>
                <button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF}
                  className="bg-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
