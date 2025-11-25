import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { StorageStats } from '../types';
import { formatBytes } from '../App'; // We'll move formatBytes to a utils if needed, but for now referencing helper

interface StorageChartProps {
  stats: StorageStats;
}

const StorageChart: React.FC<StorageChartProps> = ({ stats }) => {
  const percentage = Math.round((stats.used / stats.total) * 100);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-surface border border-dark-border p-2 rounded shadow-xl text-xs">
          <p className="font-semibold text-white">{payload[0].name}</p>
          <p className="text-gray-400">{formatBytes(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-dark-surface p-4 rounded-xl border border-dark-border flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Storage Usage</h3>
        <span className="text-xs text-brand-500 font-mono">{percentage}% Full</span>
      </div>
      
      <div className="w-full h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats.byType}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {stats.byType.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
          <p className="text-xl font-bold text-white">{formatBytes(stats.used)}</p>
          <p className="text-[10px] text-gray-500">USED</p>
        </div>
      </div>
    </div>
  );
};

export default StorageChart;
