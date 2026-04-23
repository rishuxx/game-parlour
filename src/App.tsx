import React, { useState, useEffect } from 'react';
import { Gamepad2, Users, Receipt, AlertCircle, PlayCircle, StopCircle, UserPlus, Database, MonitorPlay, Dices, Trash2, Library, X } from 'lucide-react';
import { format } from 'date-fns';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'customers' | 'billing' | 'consoles' | 'games'>('sessions');
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; error?: string } | null>(null);
  const [splashIndex, setSplashIndex] = useState(0);

  const developerNames = [
    'RISHU',
    'ASHUTOSH',
    'MUKUL'
  ];

  useEffect(() => {
    // 0, 1, 2 = Developers
    // 3 = Logo & entering
    // 4 = Complete
    if (splashIndex < 4) {
      const timer = setTimeout(() => setSplashIndex(s => s + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [splashIndex]);

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(err => setDbStatus({ connected: false, error: 'Cannot reach backend server' }));
  }, []);

  if (splashIndex < 3) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-white overflow-hidden animate-in fade-in duration-1000">
        {/* Center Logo */}
        <div className="flex flex-col items-center gap-6 mt-[-40px]">
           <div className="w-28 h-28 bg-[#5841ff] rounded-[2rem] flex items-center justify-center shadow-[0_8px_30px_-6px_rgba(88,65,255,0.4)]">
             <Gamepad2 size={56} className="text-white" strokeWidth={1.5} />
           </div>
           <h1 className="text-3xl md:text-[2.5rem] text-black font-display flex items-center gap-2">
             <span className="font-bold tracking-tight">GAMEX</span>
             <span className="font-light tracking-wide">PARLOUR</span>
           </h1>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 flex flex-col items-center">
           <p className="text-xs md:text-sm text-black font-sans tracking-[0.2em] uppercase flex items-center gap-1.5">
             <span className="font-bold">DEVELOPED BY</span>
             <span key={splashIndex} className="font-light animate-in fade-in slide-in-from-bottom-2 duration-700 opacity-90">
               {developerNames[splashIndex]}
             </span>
           </p>
        </div>
      </div>
    );
  }

  if (splashIndex === 3) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-white overflow-hidden">
        <div key="entering" className="flex flex-col items-center gap-8 animate-in fade-in scale-in-95 duration-1000 transform-gpu">
           <div className="w-28 h-28 bg-[#5841ff] rounded-[2rem] flex items-center justify-center shadow-[0_8px_30px_-6px_rgba(88,65,255,0.4)]">
             <Gamepad2 size={56} className="text-white" strokeWidth={1.5} />
           </div>
           
           <h1 className="text-xl md:text-2xl text-[#5841ff] font-display font-light tracking-[0.2em] uppercase flex items-center gap-2 animate-pulse">
             Entering Gamex Parlour
           </h1>
        </div>
      </div>
    );
  }

  if (!dbStatus) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-mono">Loading Database...</div>;

  if (!dbStatus.connected) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-700">
        <div className="max-w-2xl w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-md">
          <div className="flex items-center gap-4 text-slate-900 mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Database size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Database Connection <span className="text-indigo-600 font-light underline decoration-indigo-600/50">Required</span></h1>
          </div>
          
          <div className="p-4 bg-red-900/20 text-red-400 rounded-lg flex gap-3 mb-6 items-start border border-red-500/30">
            <AlertCircle className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">MySQL is not connected!</p>
              <p className="text-sm opacity-90">{dbStatus.error || 'Check your console for details.'}</p>
            </div>
          </div>

          <div className="space-y-4 text-slate-600">
            <p>To run this DBMS project locally, please follow these steps:</p>
            <ol className="list-decimal pl-5 space-y-2 font-medium">
              <li>Ensure MySQL Server is running on your machine.</li>
              <li>Open your MySQL Workbench or terminal.</li>
              <li>Create a database using the provided schema file:</li>
              <pre className="bg-slate-50 text-green-400 p-3 rounded-xl border border-green-500/20 shadow-inner shadow-slate-200/50 text-sm overflow-x-auto mt-2 font-mono">
                source ./database_schema.sql;
              </pre>
              <li>Create a <code>.env</code> file in the project root with your credentials:</li>
              <pre className="bg-slate-50 text-indigo-500 p-3 rounded-xl border border-slate-200 text-sm overflow-x-auto mt-2 font-mono">
                DB_HOST="localhost"<br/>
                DB_USER="root"<br/>
                DB_PASSWORD="your_password"<br/>
                DB_NAME="gaming_parlour"<br/>
                DB_PORT="3306"
              </pre>
              <li>Restart the development server.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans p-6 overflow-hidden flex flex-col gap-6">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-md gap-4 md:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
             <Gamepad2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">GAMEX <span className="text-indigo-600 font-light underline decoration-indigo-600/50">MANAGEMENT</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-600 opacity-70">DBMS Core: MySQL 8.0 Connected</p>
          </div>
        </div>
        
        <nav className="flex gap-6 text-sm font-medium">
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`transition-colors ${activeTab === 'sessions' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'hover:text-indigo-500'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('consoles')}
            className={`transition-colors ${activeTab === 'consoles' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'hover:text-indigo-500'}`}
          >
            Consoles
          </button>
          <button 
            onClick={() => setActiveTab('games')}
            className={`transition-colors ${activeTab === 'games' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'hover:text-indigo-500'}`}
          >
            Games
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`transition-colors ${activeTab === 'customers' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'hover:text-indigo-500'}`}
          >
            Customers
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`transition-colors ${activeTab === 'billing' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'hover:text-indigo-500'}`}
          >
            Billing
          </button>
        </nav>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-full border border-slate-300">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          <span className="text-xs font-mono text-slate-600">SYS_ADMIN: ACTIVE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 h-full pb-6">
        {activeTab === 'sessions' && <ActiveSessionsPanel />}
        {activeTab === 'consoles' && <ConsolesPanel />}
        {activeTab === 'games' && <GamesPanel />}
        {activeTab === 'customers' && <CustomersPanel />}
        {activeTab === 'billing' && <BillingPanel />}
      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component: Active Sessions (Uses the Bookings API and Stored Procedure)
// -----------------------------------------------------------------------------
function ActiveSessionsPanel() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [prevSessions, setPrevSessions] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [consoles, setConsoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Booking State
  const [selectedCust, setSelectedCust] = useState('');
  const [selectedConsole, setSelectedConsole] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessRes, custRes, consRes, prevSessRes] = await Promise.all([
        fetch('/api/active-sessions').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/consoles').then(r => r.json()),
        fetch('/api/previous-sessions').then(r => r.json())
      ]);
      setSessions(Array.isArray(sessRes) ? sessRes : []);
      setCustomers(Array.isArray(custRes) ? custRes : []);
      setConsoles(Array.isArray(consRes) ? consRes : []);
      setPrevSessions(Array.isArray(prevSessRes) ? prevSessRes : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleStartBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/bookings/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: selectedCust, console_id: selectedConsole })
      });
      const data = await res.json();
      if (!res.ok) alert(data.error);
      else {
        setSelectedCust('');
        setSelectedConsole('');
        loadData();
      }
    } catch (err) {
      alert('Error starting booking');
    }
  };

  const handleEndBooking = async (bookingId: number) => {
    try {
      const res = await fetch(`/api/bookings/end/${bookingId}`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to end booking.');
        return;
      }
      loadData();
    } catch (err) {
      alert('Error ending booking');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Start New Session Form */}
      <div className="col-span-1 md:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col">
        <h3 className="text-sm text-indigo-600 uppercase tracking-tighter mb-4 flex items-center gap-2">
          <PlayCircle size={16} /> New Session
        </h3>
        <form onSubmit={handleStartBooking} className="flex flex-col gap-4 flex-1">
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Customer</label>
            <select 
              required value={selectedCust} onChange={e => setSelectedCust(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2 outline-none focus:border-indigo-600 text-sm"
            >
              <option value="">-- Select --</option>
              {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Console</label>
            <select 
              required value={selectedConsole} onChange={e => setSelectedConsole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2 outline-none focus:border-indigo-600 text-sm"
            >
              <option value="">-- Select --</option>
              {consoles.filter(c => c.status === 'Available').map(c => 
                <option key={c.console_id} value={c.console_id}>{c.name}</option>
              )}
            </select>
          </div>
          <div className="mt-auto pt-6">
            <button type="submit" className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow">
              INITIALIZE
            </button>
          </div>
        </form>
      </div>

      {/* Active Sessions Grid */}
      <div className="col-span-1 md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
            Active Sessions
            <span className="text-[10px] bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded border border-slate-300 font-mono">SELECT * FROM vw_active_sessions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? <p className="text-indigo-600 font-mono text-sm">Loading data...</p> : sessions.length === 0 ? (
            <div className="col-span-full border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
              No active sessions found in database.
            </div>
          ) : sessions.map(session => (
            <div key={session.booking_id} className="bg-slate-50 rounded-xl border border-slate-300 flex flex-col shadow-sm">
               <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{session.console_name}</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
               </div>
               <div className="p-4 flex flex-col gap-3">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 uppercase">Player</span>
                    <span className="text-sm text-indigo-500 font-medium">{session.customer_name}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 uppercase">Start</span>
                    <span className="text-sm text-slate-600 font-mono">{format(new Date(session.start_time), 'HH:mm')}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 uppercase">Duration</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">{session.duration_minutes} <span className="text-[10px] text-slate-400 tracking-tighter font-sans">MINS</span></span>
                 </div>
               </div>
               <div className="p-3 mt-auto border-t border-slate-100">
                 <button 
                  onClick={() => handleEndBooking(session.booking_id)}
                  className="w-full text-[11px] bg-red-500 hover:bg-red-600 text-white shadow-sm px-3 py-2 rounded-lg font-bold transition-all uppercase tracking-wider"
                 >
                   End & Generate Bill
                 </button>
               </div>
            </div>
          ))}
        </div>

        {/* DB Logic Panel for Sessions */}
        <div className="mt-6 bg-slate-100 border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase text-slate-400">Trigger Status</span>
              <span className="text-[11px] text-indigo-500">after_booking_completed: ACTIVE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase text-slate-400">View Active</span>
              <span className="text-[11px] text-indigo-500 font-mono">vw_active_sessions</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest hidden md:block">
            DBMS Lab :: Session Module
          </div>
        </div>
      </div>

      {/* Previous Completed Sessions Grid */}
      <div className="col-span-1 md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
            Previous Sessions
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-300 font-mono">STATUS = 'Completed'</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? <p className="text-slate-500 font-mono text-sm">Loading data...</p> : prevSessions.length === 0 ? (
            <div className="col-span-full border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
              No previous sessions found.
            </div>
          ) : prevSessions.map(session => (
            <div key={session.booking_id} className="bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm opacity-80 hover:opacity-100 transition-opacity">
               <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                  <span className="font-bold text-slate-900 text-sm">{session.console_name}</span>
                  <div className="w-2 h-2 rounded-full bg-slate-300"></div>
               </div>
               <div className="p-4 flex flex-col gap-3">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 uppercase">Player</span>
                    <span className="text-sm text-slate-700 font-medium">{session.customer_name}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 uppercase">Started</span>
                    <span className="text-sm text-slate-600 font-mono">{format(new Date(session.start_time), 'HH:mm')}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] text-slate-400 uppercase">Ended</span>
                    <span className="text-sm text-slate-600 font-mono">{format(new Date(session.end_time), 'HH:mm')}</span>
                 </div>
                 <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase">Total Time</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">{session.duration_mins} <span className="text-[10px] text-slate-400 tracking-tighter font-sans">MINS</span></span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component: Customers Panel
// -----------------------------------------------------------------------------
function CustomersPanel() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const loadData = async () => {
    setLoading(true);
    fetch('/api/customers')
      .then(r => r.json())
      .then(data => setCustomers(Array.isArray(data) ? data : []))
      .catch(console.error);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email })
      });
      if (res.ok) {
        setName(''); setPhone(''); setEmail('');
        loadData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { alert('Error creating customer'); }
  };

  const handleDeleteCustomer = async (id: number) => {
    if(!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { alert('Error deleting customer'); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Registration Form */}
      <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
        <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-tighter mb-4 flex items-center gap-2">
          <UserPlus size={16} /> Register Player
        </h3>
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Full Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Phone Number</label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Email (Optional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <button type="submit" className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow mt-2">
            SAVE CUSTOMER
          </button>
        </form>
      </div>

      {/* Members List Table */}
      <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Registered Members</h3>
           <span className="text-[10px] bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded border border-slate-300 font-mono">SELECT * FROM customers</span>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-indigo-600 uppercase tracking-wider">
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">ID</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Name</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Contact</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Joined Date</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-indigo-600 font-mono">Loading data...</td></tr>
              ) : customers.map(c => (
                <tr key={c.customer_id} className="hover:bg-indigo-700/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-indigo-600 tracking-tight">#{c.customer_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600">{c.phone}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-sans">
                    {format(new Date(c.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteCustomer(c.customer_id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-md border border-red-500/20">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component: Billing & Reports Panel (Uses the View and Payment Update API)
// -----------------------------------------------------------------------------
function BillingPanel() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    fetch('/api/billing')
      .then(r => r.json())
      .then(data => setBills(Array.isArray(data) ? data : []))
      .catch(console.error);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const [payingBillId, setPayingBillId] = useState<number | null>(null);

  const handlePay = async (paymentId: number, method: string) => {
    try {
      await fetch(`/api/payments/pay/${paymentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method })
      });
      setPayingBillId(null);
      loadData();
    } catch (err) { alert('Error updating payment block'); }
  };

  // Calculate total revenue for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const totalRevenueThisMonth = bills
    .filter(bill => {
      if (bill.payment_status !== 'Paid') return false;
      const d = new Date(bill.payment_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, bill) => sum + parseFloat(bill.amount), 0);

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-slate-300">
                <Receipt className="text-indigo-600" size={20} />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-slate-900 leading-tight">Billing & Reports Matrix</h3>
               <p className="text-xs text-indigo-500 font-mono mt-0.5 tracking-wider uppercase">SELECT * FROM vw_billing_report</p>
             </div>
          </div>
          
          <div className="flex flex-col text-right bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Revenue This Month</span>
             <span className="text-xl font-bold text-slate-900 font-mono tracking-tight text-indigo-600">₹{totalRevenueThisMonth.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-indigo-600 uppercase tracking-wider">
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-4 font-medium text-slate-400">Bill ID</th>
                <th className="px-6 py-4 font-medium text-slate-400">Customer</th>
                <th className="px-6 py-4 font-medium text-slate-400">Console</th>
                <th className="px-6 py-4 font-medium text-slate-400 text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-slate-400 text-center">Status</th>
                <th className="px-6 py-4 font-medium text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-indigo-600 font-mono">Loading billing records...</td></tr>
              ) : bills.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No billing history found.</td></tr>
              ) : bills.map(bill => (
                <tr key={bill.payment_id} className="hover:bg-indigo-700/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-indigo-600 tracking-tight">P-{bill.payment_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{bill.customer_name}</td>
                  <td className="px-6 py-4 text-slate-600">{bill.console_name}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 font-mono">₹{bill.amount}</td>
                  <td className="px-6 py-4 text-center">
                    {bill.payment_status === 'Paid' ? (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] border border-green-500/20 font-bold uppercase tracking-widest">Paid</span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-[10px] border border-orange-500/20 font-bold uppercase tracking-widest">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {bill.payment_status === 'Pending' ? (
                      payingBillId === bill.payment_id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handlePay(bill.payment_id, 'Cash')} className="text-[9px] bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow-sm font-bold uppercase tracking-wider">Cash</button>
                          <button onClick={() => handlePay(bill.payment_id, 'UPI')} className="text-[9px] bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded shadow-sm font-bold uppercase tracking-wider">UPI</button>
                          <button onClick={() => handlePay(bill.payment_id, 'Card')} className="text-[9px] bg-slate-700 hover:bg-slate-800 text-white px-2 py-1 rounded shadow-sm font-bold uppercase tracking-wider">Card</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setPayingBillId(bill.payment_id)}
                          className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md font-bold transition-all shadow-[0_0_10px_rgba(147,51,234,0.3)] uppercase tracking-wider"
                        >
                          Settle Bill
                        </button>
                      )
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Settled Via</span>
                        <span className="text-indigo-500 text-xs font-mono">{bill.payment_method || 'System'}</span>
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
  );
}

// -----------------------------------------------------------------------------
// Component: Consoles Panel
// -----------------------------------------------------------------------------
function ConsolesPanel() {
  const [consoles, setConsoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [type, setType] = useState('PS5');
  const [hourlyRate, setHourlyRate] = useState('');

  const [managingConsole, setManagingConsole] = useState<any | null>(null);
  const [managingGames, setManagingGames] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [selectedGameToAdd, setSelectedGameToAdd] = useState('');

  const loadData = async () => {
    setLoading(true);
    fetch('/api/consoles')
      .then(r => r.json())
      .then(data => setConsoles(Array.isArray(data) ? data : []))
      .catch(console.error);
    setLoading(false);
  };

  const openManageGames = async (c: any) => {
    setManagingConsole(c);
    setManagingGames([]);
    // Fetch mapped games
    fetch(`/api/consoles/${c.console_id}/games`)
      .then(r => r.json())
      .then(data => setManagingGames(Array.isArray(data) ? data : []));
    
    // Fetch all games
    fetch(`/api/games`)
      .then(r => r.json())
      .then(data => setAllGames(Array.isArray(data) ? data : []));
  };

  const closeManageGames = () => {
    setManagingConsole(null);
    setSelectedGameToAdd('');
  };

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingConsole || !selectedGameToAdd) return;
    try {
      const res = await fetch(`/api/consoles/${managingConsole.console_id}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: selectedGameToAdd })
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to map game");
      } else {
        openManageGames(managingConsole); // reload games
        setSelectedGameToAdd('');
      }
    } catch { alert('Error mapping game'); }
  };

  const handleRemoveGame = async (gameId: number) => {
    if (!managingConsole) return;
    try {
      await fetch(`/api/consoles/${managingConsole.console_id}/games/${gameId}`, { method: 'DELETE' });
      openManageGames(managingConsole);
    } catch { alert('Error removing game map'); }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/consoles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, hourly_rate: parseFloat(hourlyRate) })
      });
      if (res.ok) {
        setName(''); setHourlyRate('');
        loadData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { alert('Error creating console'); }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/consoles/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadData();
    } catch (err) { alert('Error updating status'); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Are you sure you want to delete this console?')) return;
    try {
      const res = await fetch(`/api/consoles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { alert('Error deleting console'); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
        <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-tighter mb-4 flex items-center gap-2">
          <MonitorPlay size={16} /> Add Console
        </h3>
        <form onSubmit={handleCreateConsole} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">System Name</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Station 5" className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Type</label>
            <select required value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm">
              <option value="PS5">PlayStation 5</option>
              <option value="Xbox">Xbox Series X</option>
              <option value="PC">Gaming PC</option>
              <option value="VR">VR Station</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Hourly Rate (₹)</label>
            <input required type="number" min="0" step="0.01" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <button type="submit" className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow mt-2">
            ADD CONSOLE
          </button>
        </form>
      </div>

      <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">System Inventory</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-indigo-600 uppercase tracking-wider">
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">System</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Rate</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Status</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-indigo-600 font-mono">Loading data...</td></tr>
              ) : consoles.map(c => (
                <tr key={c.console_id} className="hover:bg-indigo-700/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{c.name}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{c.type}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-indigo-500">₹{c.hourly_rate} / hr</td>
                  <td className="px-6 py-4">
                    {c.status === 'In Use' ? (
                      <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-[10px] border border-red-500/20 font-bold uppercase tracking-widest">In Use</span>
                    ) : (
                      <select 
                        value={c.status} 
                        onChange={(e) => handleStatusChange(c.console_id, e.target.value)}
                        className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-full border outline-none ${c.status === 'Available' ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-orange-500/10 text-orange-700 border-orange-500/20'}`}
                      >
                        <option value="Available" className="bg-white text-slate-800">Available</option>
                        <option value="Maintenance" className="bg-white text-slate-800">Maintenance</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => openManageGames(c)} className="text-indigo-400 hover:text-indigo-600 transition-colors bg-indigo-500/10 p-1.5 rounded-md border border-indigo-500/20" title="Manage Games">
                      <Library size={14} />
                    </button>
                    <button onClick={() => handleDelete(c.console_id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-md border border-red-500/20" disabled={c.status === 'In Use'} title="Delete Console">
                      <Trash2 size={14} className={c.status === 'In Use' ? 'opacity-50' : ''} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {managingConsole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-[400px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Library size={20} className="text-indigo-600"/> Manage Library</h3>
                  <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{managingConsole.name}</p>
               </div>
               <button onClick={closeManageGames} className="text-slate-400 hover:text-slate-600 bg-slate-200/50 p-2 rounded-full"><X size={16} /></button>
            </div>
            
            <div className="p-6 border-b border-slate-100">
              <form onSubmit={handleAddGame} className="flex gap-2">
                <select 
                  value={selectedGameToAdd} 
                  onChange={e => setSelectedGameToAdd(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2 outline-none focus:border-indigo-600 text-sm"
                  required
                >
                  <option value="">-- Add a game --</option>
                  {allGames.filter(g => !managingGames.some(mg => mg.game_id === g.game_id)).map(g => (
                    <option key={g.game_id} value={g.game_id}>{g.title}</option>
                  ))}
                </select>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg font-bold text-xs tracking-wider transition-colors">
                  MAP
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
               <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Installed Games ({managingGames.length})</h4>
               {managingGames.length === 0 ? (
                 <div className="text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg py-8">No games installed on this console.</div>
               ) : (
                 managingGames.map(game => (
                   <div key={game.game_id} className="flex items-center justify-between border border-slate-200 rounded-xl p-4 bg-slate-50">
                     <div>
                       <div className="font-bold text-slate-900 text-sm">{game.title}</div>
                       <div className="text-xs text-slate-400 mt-0.5">{game.genre}</div>
                     </div>
                     <button onClick={() => handleRemoveGame(game.game_id)} className="text-red-400 hover:text-red-500 bg-red-100 p-2 rounded-md transition-colors" title="Remove Game">
                       <Trash2 size={16} />
                     </button>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component: Games Panel
// -----------------------------------------------------------------------------
function GamesPanel() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');

  const loadData = async () => {
    setLoading(true);
    fetch('/api/games')
      .then(r => r.json())
      .then(data => setGames(Array.isArray(data) ? data : []))
      .catch(console.error);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre, release_year: parseInt(releaseYear) })
      });
      if (res.ok) {
        setTitle(''); setGenre(''); setReleaseYear('');
        loadData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { alert('Error creating game'); }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Are you sure you want to delete this game?')) return;
    try {
      const res = await fetch(`/api/games/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) { alert('Error deleting game'); }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
        <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-tighter mb-4 flex items-center gap-2">
          <Dices size={16} /> Add Game Title
        </h3>
        <form onSubmit={handleCreateGame} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Game Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Genre</label>
            <input required type="text" value={genre} onChange={e => setGenre(e.target.value)} placeholder="e.g. Action RPG" className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-tighter text-slate-400 mb-1">Release Year</label>
            <input required type="number" min="1990" max="2050" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} placeholder="e.g. 2024" className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg p-2.5 outline-none focus:border-indigo-600 text-sm" />
          </div>
          <button type="submit" className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow mt-2">
            ADD GAME
          </button>
        </form>
      </div>

      <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Games Library</h3>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-indigo-600 uppercase tracking-wider">
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Title</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Genre</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter">Year</th>
                <th className="px-6 py-3 font-medium text-slate-400 tracking-tighter text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-indigo-600 font-mono">Loading data...</td></tr>
              ) : games.map(g => (
                <tr key={g.game_id} className="hover:bg-indigo-700/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{g.title}</td>
                  <td className="px-6 py-4 text-slate-600">{g.genre}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono">{g.release_year}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(g.game_id)} className="text-red-400 hover:text-red-300 transition-colors bg-red-500/10 p-1.5 rounded-md border border-red-500/20">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

