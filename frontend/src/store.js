import { create } from 'zustand';

export const useCloudStore = create((set) => ({
    // 1. Core State variables (Updated with your partner's exact Tenant ID)
    currentTenant: {
        id: "6ad45c6405f3193f8d53026e",
        name: "Enterprise Dev Stack"
    },
    cloudAccounts: [
        { id: "1", provider: "AWS", env: "Production", status: "Connected", spend: 1240 },
        { id: "2", provider: "Azure", env: "Staging", status: "Connected", spend: 450 },
        { id: "3", provider: "GCP", env: "Production", status: "Warning", spend: 890 }
    ],
    liveLogs: ["[SYSTEM]: Initializing connection using Tenant Passport ID..."],

    // 2. Actions to modify state
    addLog: (newLog) => set((state) => ({
        liveLogs: [...state.liveLogs, `[${new Date().toLocaleTimeString()}]: ${newLog}`]
    })),

    updateSpend: (accountId, newAmount) => set((state) => ({
        cloudAccounts: state.cloudAccounts.map(acc =>
            acc.id === accountId ? { ...acc, spend: newAmount } : acc
        )
    }))
}));
