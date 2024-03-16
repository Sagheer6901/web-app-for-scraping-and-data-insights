import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const Chart = ({info}) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (Array.isArray(info)) { // Check if info is an array
      const data = info.map(entry => entry.citations);
      const years = info.map(entry => entry.year);
  
      setChartData({
        labels: years,
        datasets: [
          {
            label: 'Citations',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          }
        ]
      });
    }
  }, [info]);

  return (
    <div className='rounded-lg'>
      <h1 className='text-2xl ml-2'>Citations Over Years</h1>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default Chart;
