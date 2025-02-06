import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({ data }) {
  const pieData = Object.entries(data).map(([label, value]) => ({
    value: value,
    label: label,
  }));

  return (
    <Box sx={{ marginTop: 6 }}>
      <PieChart
        series={[
          {
            arcLabel: (params) => params.label ?? '',
            arcLabelMinAngle: 70,
            data: pieData,
          },
        ]}
        {...pieParams}
      />
    </Box>
  );
}

const pieParams = {
    width: 500,
    height: 250,
    slotProps: { legend: { hidden: true } },
    colors: [
      '#76b7b2',
      '#af7aa1',
      '#edc949',
      '#f28e2c',
      '#9c755f',
      '#af7aa1',
      '#bab0ab',
      '#4e79a7',
      '#e15759',
      '#59a14f',
      '#ff9da7',
    ]
  };
