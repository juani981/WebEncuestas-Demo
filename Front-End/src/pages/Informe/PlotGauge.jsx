import { Gauge } from '@mui/x-charts/Gauge';

export default function BasicGauge({ value }) {
    const valueRound = Math.round(value) 
    return (
        <Gauge width={200} height={100} value={valueRound} startAngle={-90} endAngle={90} />
    );
}