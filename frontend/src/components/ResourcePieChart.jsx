import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { resourceAllocationData } from '../mockData';

export default function ResourcePieChart() {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
            <div className="mb-4">
                <h3 className="text-base font-bold text-slate-100">Asset Distribution</h3>
                <p className="text-xs text-slate-400">Resource load distribution by architectural tier.</p>
            </div>

            <div className="flex-1 w-full h-[260px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={resourceAllocationData}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {resourceAllocationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                        <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
