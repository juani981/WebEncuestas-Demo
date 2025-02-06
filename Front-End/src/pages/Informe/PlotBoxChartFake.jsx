import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

export default function BoxChartFake({ max, min, quantiles }) {

  const dataset = [
    {
      low: min,
      q1: quantiles[0]-min,
      median: quantiles[1]-quantiles[0],
      q3: quantiles[2]-quantiles[1],
      high: max-quantiles[2],
      order: 'Diagrama de caja',  // label
    },
  ];

  const chartSettings = {
    dataset,
    height: 350,
    xAxis: [{ scaleType: 'band', dataKey: 'order' }],
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
    slotProps: {
      legend: {
        direction: 'row',
        position: { vertical: 'bottom', horizontal: 'middle' },
        padding: -5,
      },
    },
    colors: ['white', 'lavender', '#ff9da7', '#af7aa1', 'lavender'], 
  };

   return (
    <BarChart
      series={[
        { dataKey: 'low', label: 'Min', stack: 'stack' },
        { dataKey: 'q1', label: 'Q1', stack: 'stack' }, 
        { dataKey: 'median', label: 'Mediana', stack: 'stack' },
        { dataKey: 'q3', label: 'Q3', stack: 'stack' },
        { dataKey: 'high', label: 'Max', stack: 'stack' },
      ]}
      {...chartSettings}
      // @ts-ignore
      borderRadius={10}
    />
  );
}