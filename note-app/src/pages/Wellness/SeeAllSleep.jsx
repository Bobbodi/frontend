import React from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const SleepCharts = ({ sleeps }) => {
  if (!sleeps || sleeps.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No sleep data available</p>
      </div>
    );
  }

  // Prepare data - using raw 24-hour times directly
  const labels = sleeps.map((_, i) => `Day ${i + 1}`);
  const sleepStartData = sleeps.map(s => s.sleepStart); // Keep as "HH:mm"
  const sleepEndData = sleeps.map(s => s.sleepEnd);    // Keep as "HH:mm"

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => context.raw // Show raw "HH:mm" value in tooltip
        }
      }
    },
    scales: {
      x: {
        display: false // Hide x-axis for both charts
      },
      y: {
        type: 'category', // Use category scale for direct time display
        labels: [
          '00:00', '02:00', '04:00', '06:00', 
          '08:00', '10:00', '12:00', '14:00',
          '16:00', '18:00', '20:00', '22:00', '24:00'
        ],
        grid: {
          color: '#e5e7eb'
        }
      }
    }
  };

  return (
    <div className="space-y-0"> {/* No space between charts */}
      {/* Bedtime Chart */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium mb-2">Bedtime</h3>
        <div className="h-48">
          <Line 
            data={{
              labels,
              datasets: [{
                data: sleepStartData,
                borderColor: '#6366f1',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 4
              }]
            }} 
            options={chartOptions}
          />
        </div>
      </div>

      {/* Wake-up Chart */}
      <div className="bg-white p-4">
        <h3 className="text-lg font-medium mb-2">Wake-up</h3>
        <div className="h-48">
          <Line 
            data={{
              labels,
              datasets: [{
                data: sleepEndData,
                borderColor: '#10b981',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 4
              }]
            }} 
            options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: {
                  display: true, // Show x-axis only on wake-up chart
                  ticks: {
                    callback: (_, index) => labels[index]
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SleepCharts;

// import React from 'react'
// import { Line } from "react-chartjs-2"; 

// import { 
//     Chart as ChartJS, 
//     TimeScale
// } from 'chart.js';

// import { format } from 'date-fns'; 
// import 'chartjs-adapter-date-fns'; 

// ChartJS.register(
//     TimeScale,
// )

// const SeeAllSleep = ({allSleep}) => {

//     console.log(allSleep);  
//     //wWHY THE FUCKIS ALLSLEEP UNDEFINED RN

//     if (!allSleep) { 
//         return null; 
//     }
    
//     const chartData = { 
//         datasets: [
//             {
//                 label:'Bedtime',
//                 data: allSleep.map(sleep => ({ 
//                     x: new Date(sleep.createdOn),
//                     y: new Date(sleep.startSleep),
//                 })),
//             }
//         ]
//     };

//     const options = { 
//         responsive: true, 
//         scales: { 
//             x: { 
//                 type: 'time', 
//                 time: { 
//                     'unit': 'day'
//                 }
//             }, 
//             y: { 
//                 type: 'time', 
//                 time: { 
//                     unit: 'hour',
//                     displayFormats: { 
//                         hour: 'HH:mm'
//                     }
//                 }
//             }
//         }
//     }




//     return (
//         <div>
//             <Line data={chartData} options={options}/> 
//         </div> 
//     )
// }

// export default SeeAllSleep
