import React from 'react'
import { useEffect, useRef, useState } from 'react'; 
import { Chart } from 'chart.js/auto';
import { timeToHours, formatDate, calcSleepDuration } from '../../utils/helper.js' 
import ChartDataLabels from 'chartjs-plugin-datalabels';

const SeeAllSleep = ({ sleepData }) => {

  const chartRef = useRef(null); 
  const chartInstance = useRef(null); 

  Chart.register(ChartDataLabels);

  useEffect(() => { 
    if (chartRef.current) { 
      const durations = sleepData.map(record => { 
        const diffMs = new Date(record.sleepEnd) - new Date(record.sleepStart);
        return Math.round((diffMs/(1000 * 60 * 60)) * 10) / 10; //hours with 1 d.p.
      });

      //format labels with date range 
      const labels = sleepData.map(record => { 
        const date = new Date(record.sleepEnd);
        return date.toLocaleDateString('en-US', {
          weekday: 'long', 
          month: 'short',
          day: 'numeric'
        })
        
      })

      const timeDetails = sleepData.map(record => {
        return [
          `Start: ${new Date(record.sleepStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          `End: ${new Date(record.sleepEnd).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
        ];
      });

      const ctx = chartRef.current.getContext('2d'); 
      if (chartInstance.current) { 
        chartInstance.current.destroy(); 
      }

      chartInstance.current = new Chart(ctx, { 
        type:'bar',
        plugins: [ChartDataLabels],
        data: {
          labels: labels,
          datasets: [{
            label: 'Sleep Duration (hours)',
            data: durations,
            backgroundColor: [
              '#FFEE8C',
              '#dfc7a7'
            ],
            
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hours Slept',
                font: {
                  weight: 'bold'
                }
              },
              ticks: {
                stepSize: 2
              }
            },
            x: {
              title: {
                display: true,
                text: 'Sleep Session',
                font: {
                  weight: 'bold'
                }
              }, 
              ticks: { 
                autoSkip: false, 
             
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                padding: 20,
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.parsed.y} hours`,
                afterLabel: function(context) {
                const record = sleepData[context.dataIndex];
                const dreamInfo = record.dreams 
                  ? `Dream: ${record.dreams}`
                  : 'No dream recorded';
                
                return [
                  ...timeDetails[context.dataIndex], // Existing time details
                  dreamInfo // Added dream information
                ];
              }
              }
            },
            title: {
              display: true,
              text: 'Your Sleep Patterns',
              font: {
                size: 18,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 30
              }
            },
            datalabels: { 
              anchor: 'end', 
              align: 'top', 
              formatter: (value) =>  `${value}h`,
              color: '#444',
              font: { 
                weight: 'bold'
              }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);


  if (!sleepData || sleepData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No sleep data available</p>
      </div>
    );
  }



  return (
    <div className="sleep-chart-container bg-white rounded-xl p-5">
      
      <div className="chart-wrapper" style={{ height: '400px', margin: '20px 0' }}>
        <canvas ref={chartRef} />
      </div>
      
      
    </div>
  )
}

export default SeeAllSleep