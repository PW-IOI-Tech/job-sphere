// components/charts/BarChart.tsx
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: { label: string; value: number }[];
  title?: string;
  color?: string;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  color = '#3B82F6', 
  className 
}) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Count',
        data: data.map(item => item.value),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className || ''}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};
