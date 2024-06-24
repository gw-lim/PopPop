import { ArcElement, Chart } from 'chart.js';
import ChartDataLables from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import DescriptionCard from './DescriptionCard';

Chart.register(ArcElement);
Chart.register(ChartDataLables);

const GenderRatioCard = (props: { male: number; female: number }) => {
  const { male, female } = props;

  const data = {
    labels: ['남성', '여성'],
    datasets: [
      {
        label: '비율',
        data: [male, female],
        backgroundColor: ['rgb(2, 136, 209)', 'rgb(239, 83, 80)'],
      },
    ],
  };

  return (
    <DescriptionCard title='실시간 성비'>
      <div className='h-172 w-full'>
        <Doughnut
          data={data}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
              datalabels: {
                display: true,
                color: 'white',
                font: {
                  weight: 'bold',
                  size: 14,
                },
                formatter: (value) => {
                  return value + '%';
                },
              },
            },
            rotation: -90,
            circumference: 180,
            cutout: '50%',
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
      <div className='flex h-24 items-center justify-between px-16'>
        <div className='flex h-full items-center rounded-[6px] bg-[rgb(2,136,209)] px-4 text-14 font-600 text-white'>
          남성
        </div>
        <div className='flex h-full items-center rounded-[6px] bg-red px-4 text-14 font-600 text-white'>
          여성
        </div>
      </div>
    </DescriptionCard>
  );
};

export default GenderRatioCard;
