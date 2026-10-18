import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { historicalSpendData } from '../mockData';

export default function CostTimelineChart() {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
            <div className="mb-4">
                <h3 className="text-base font-bold text-slate-100">Cumulative Cloud Spends</h3>
                <p className="text-xs text-slate-400">7-Day historical budget tracking across linked providers.</p>
            </div>

            <div className="flex-1 w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalSpendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAws" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                            labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />

                        <Area type="monotone" dataKey="AWS" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorAws)" />
                        <Area type="monotone" dataKey="Azure" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAzure)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
