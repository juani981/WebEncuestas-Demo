import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const chartSetting = {
  yAxis: [
    // {
    //   label: 'Frecuencia',
    // },
  ],
  width: 400,
  height: 350,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translate(-20px, 0)',
    },
  },
};

// Formateo del valor para mostrar la frecuencia con el sufijo "veces"
const valueFormatter = (value) => `${value} veces`;

export default function Barsfrequency({ data, titulo, color }) {
  // Adaptar el objeto de palabras y frecuencias a un formato de array compatible con el BarChart
  // const dataset = Object.keys(data).map((palabra) => ({
  //   palabra,
  //   frecuencia: data[palabra],
  // }));
  const dataset = Object.keys(data)
    .map((palabra) => ({
      palabra,
      frecuencia: data[palabra],
    }))
    .sort((a, b) => b.frecuencia - a.frecuencia); // Ordenar por frecuencia descendente
    
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'palabra', tickPlacement: 'middle', tickLabelPlacement: 'middle' }]}
      series={[{ dataKey: 'frecuencia', label: titulo, valueFormatter, color: color}]}
      {...chartSetting}
    />
  );
}