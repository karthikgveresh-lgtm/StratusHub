import React, { useEffect, useState } from 'react';
import { useCloudStore } from './store';
import { connectSocket } from './socket'; // Import our new real-time connector
import CostTimelineChart from './components/CostTimelineChart';
import ResourcePieChart from './components/ResourcePieChart';
import { Activity, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

function App() {
  const { currentTenant, cloudAccounts, liveLogs, setTenantId, launchDeployment } = useCloudStore();
  const [inputToken, setInputToken] = useState(currentTenant.id);


  const handleSwitchTenant = () => {
    const cleaned = inputToken.trim(); // Remove whitespace
    if (cleaned) {
      setTenantId(cleaned); // This updates Redux AND triggers the useEffect in Dashboard
    }
  };


  // Re-binds WebSocket pipelines instantly whenever currentTenant.id changes
  useEffect(() => {
    const activeSocket = connectSocket();

    return () => {
      if (activeSocket) {
        activeSocket.disconnect();
      }
    };
  }, [currentTenant.id]); // Added currentTenant.id here as a dependency parameter


  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <h1 className="text-xl font-bold text-indigo-400 tracking-wide mb-8">☁️ StratusHub</h1>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Active Workspace</div>
          <div className="p-3 bg-slate-800 rounded-lg border border-indigo-500/20 mb-4">
            <div className="text-sm font-semibold">{currentTenant.name}</div>
          </div>

          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tenant Verification Token</div>
          <div className="p-2 bg-black/40 rounded border border-slate-800 font-mono text-[10px] text-indigo-300 break-all select-all">
            {currentTenant.id}
          </div>
        </div>
        <div className="text-xs text-slate-500">Hackathon Dev Workspace v1.3.0</div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto space-y-6">

        {/* DYNAMIC HEADER BAR */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-slate-900 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Infrastructure Control Panel</h2>
            <p className="text-xs text-slate-400">Real-time metrics active via multi-tenant streaming.</p>
          </div>

          {/* Live Automation Command Interface */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
            {/* Token Syncer Group */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Paste Tenant ID..."
                className="bg-transparent text-xs text-indigo-300 font-mono focus:outline-none px-2 w-48"
              />
              <button
                onClick={() => setTenantId(inputToken)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1 rounded-md transition-colors"
              >
                Sync
              </button>
            </div>

            {/* 🔥 THE WOW FACTOR TRIGGER BUTTON */}
            <button
              onClick={launchDeployment}
              className="bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/20 text-white font-bold text-xs px-4 py-2 rounded-lg active:scale-95 transition-all flex items-center justify-center gap-2 tracking-wide"
            >
              🚀 Launch Global Cluster Stack
            </button>
          </div>
        </header>



        {/* METRICS TRACK ROW */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cloudAccounts.map((account) => (
            <div key={account.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800 rounded text-slate-400">{account.env}</span>
                <h3 className="text-base font-bold mt-1.5">{account.provider} Gateway</h3>
                <div className="text-xl font-mono font-bold text-indigo-400 mt-1">${account.spend}/hr</div>
              </div>
              <div className={`p-3 rounded-lg ${account.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {account.provider === 'AWS' ? <Cpu size={22} /> : <HardDrive size={22} />}
              </div>
            </div>
          ))}
        </section>

        {/* ANALYTICS CHARTS ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CostTimelineChart />
          </div>
          <div>
            <ResourcePieChart />
          </div>
        </section>

        {/* LOWER LIVE DIAGNOSTICS LAYER */}
        <section className="bg-black border border-slate-800 rounded-xl p-4 flex flex-col h-48 font-mono text-xs shadow-inner">
          <div className="text-slate-400 mb-2 font-semibold pb-2 border-b border-slate-800 flex items-center gap-2">
            <Activity size={14} className="text-indigo-400 animate-pulse" /> Live WebSocket Diagnostics Console
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 text-emerald-500/90 custom-scrollbar">
            {liveLogs.map((log, idx) => (
              <div key={idx} className="hover:bg-slate-900/50 p-0.5 rounded transition-colors">{log}</div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
