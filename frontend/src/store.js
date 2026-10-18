import { create } from 'zustand';

export const useCloudStore = create((set) => ({
    // 1. Core State variables
    currentTenant: { id: "tenant_nike_01", name: "Nike DevOps Team" },
    cloudAccounts: [
        { id: "1", provider: "AWS", env: "Production", status: "Connected", spend: 1240 },
        { id: "2", provider: "Azure", env: "Staging", status: "Connected", spend: 450 },
        { id: "3", provider: "GCP", env: "Production", status: "Warning", spend: 890 }
    ],
    liveLogs: ["[SYSTEM]: Connecting to centralized control plane..."],

    // 2. Actions to modify state (Simulating real-time incoming websocket updates)
    addLog: (newLog) => set((state) => ({
        liveLogs: [...state.liveLogs, `[${new Date().toLocaleTimeString()}]: ${newLog}`]
    })),

    updateSpend: (accountId, newAmount) => set((state) => ({
        cloudAccounts: state.cloudAccounts.map(acc =>
            acc.id === accountId ? { ...acc, spend: newAmount } : acc
        )
    }))
}));
