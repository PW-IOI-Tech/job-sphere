// components/charts/PieChart.tsx
'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  className?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title, className }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color || '#3B82F6'),
        borderColor: data.map(item => item.color || '#3B82F6'),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className || ''}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};
