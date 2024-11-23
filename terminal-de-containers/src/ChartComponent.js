import React from 'react';
import { Bar } from 'react-chartjs-2';

const ChartComponent = ({ data }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Quantidade de Containers',
        data: data.values || [],
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} containers`;
          }
        }
      }
    }
  };

  return (
    <div>
      <h2>Ocupação por Rua/Quadra</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
