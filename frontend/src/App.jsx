import React, { useEffect } from 'react';
import { useCloudStore } from './store';
import { Server, Activity, ShieldAlert, DollarSign } from 'lucide-react';

function App() {
  // Grab state and actions from our centralized Zustand store
  const { currentTenant, cloudAccounts, liveLogs, addLog } = useCloudStore();

  // Simulating background data updates just for visual testing
  useEffect(() => {
    const logInterval = setInterval(() => {
      addLog("Polled cluster health status successfully.");
    }, 5000);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">

      {/* 1. SIDEBAR WIREFRAME */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-400 tracking-wide mb-8">☁️ CloudPulse</h1>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Active Workspace</div>
          <div className="p-3 bg-slate-800 rounded-lg text-sm font-semibold border border-indigo-500/30">
            {currentTenant.name}
          </div>
        </div>
        <div className="text-xs text-slate-500">Hackathon Build v1.0.0</div>
      </aside>

      {/* 2. MAIN DASHBOARD AREA */}
      <main className="flex-1 p-8 flex flex-col overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold">Multi-Cloud Infrastructure Control</h2>
          <p className="text-sm text-slate-400">Cross-platform tracking across integrated vendors.</p>
        </header>

        {/* METRICS ROW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cloudAccounts.map((account) => (
            <div key={account.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded text-slate-300">{account.env}</span>
                  <h3 className="text-lg font-bold mt-2">{account.provider} Integration</h3>
                </div>
                {account.status === 'Connected' ? (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50"></span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50"></span>
                )}
              </div>
              <div className="text-2xl font-mono font-bold text-indigo-300">${account.spend}/hr</div>
            </div>
          ))}
        </section>

        {/* WIREFRAME SPLIT WINDOW: CHART (LEFT) & LIVE TERMINAL LOGS (RIGHT) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[300px]">
          {/* Chart Placeholder Box */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <h4 className="text-sm font-semibold text-slate-400">Aggregate Spend Analytics (Placeholder)</h4>
            <div className="h-48 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-sm">
              [Chart Component Will Render Here]
            </div>
          </div>

          {/* Live Terminal Log Stream Component */}
          <div className="bg-black border border-slate-800 rounded-xl p-4 flex flex-col h-full font-mono text-xs">
            <div className="text-slate-400 mb-2 font-semibold pb-2 border-b border-slate-800 flex items-center gap-2">
              <Activity size={14} className="text-indigo-400 animate-pulse" /> Live Pipeline Diagnostics
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 text-emerald-400/90 max-h-[220px]">
              {liveLogs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
