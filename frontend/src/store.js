import { create } from 'zustand';
import api from './api'; // Import our multi-tenant configured Axios client

export const useCloudStore = create((set, get) => ({
  // Core State variables
  currentTenant: { id: "64ad5c4465b556525274404b8", name: "Enterprise Dev Stack" },
  cloudAccounts: [
    { id: "1", provider: "AWS", env: "Production", status: "Connected", spend: 1240 },
    { id: "2", provider: "Azure", env: "Staging", status: "Connected", spend: 450 },
    { id: "3", provider: "GCP", env: "Production", status: "Warning", spend: 890 }
  ],
  liveLogs: ["[SYSTEM]: System initialized with fallback token parameters."],

  // Actions
  addLog: (newLog) => set((state) => ({ 
    liveLogs: [...state.liveLogs, newLog] // Removed time prefix since backend streams its own timestamp signatures
  })),
  
  updateSpend: (accountId, newAmount) => set((state) => ({
    cloudAccounts: state.cloudAccounts.map(acc => 
      acc.id === accountId ? { ...acc, spend: newAmount } : acc
    )
  })),

  setTenantId: (newId) => set((state) => ({
    currentTenant: { ...state.currentTenant, id: newId },
    liveLogs: [...state.liveLogs, `[SYSTEM]: Migrated session connection to new Tenant Passport ID: ${newId}`]
  })),

  // 🔥 NEW ACTION: Triggers the backend job runner via Express and BullMQ
  launchDeployment: async () => {
    try {
      set((state) => ({
        liveLogs: [...state.liveLogs, `[SYSTEM]: Dispatching deployment job package to centralized runner queue... 📤`]
      }));

      // Hits http://localhost:5000/api/deployments/launch
      // Our Axios interceptor automatically appends 'x-tenant-id': activeTenantId to headers!
      await api.post('/deployments/launch', {
        clusterName: "production-api-node",
        provider: "AWS"
      });

    } catch (err) {
      console.error("Failed to trigger background orchestration lines:", err);
      set((state) => ({
        liveLogs: [...state.liveLogs, `[❌ ERROR]: Failed to reach execution engine pipeline: ${err.message}`]
      }));
    }
  }
}));
