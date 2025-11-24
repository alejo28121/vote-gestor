import { Bar } from 'react-chartjs-2'
import{ Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, plugins} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({labels, data}){
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Votos",
                data: data,
                backgroundColor: [
                    "rgb(250, 141, 116)",
                    "rgb(0, 121, 211)",
                    "rgb(196, 106, 191)",
                    "rgb(136, 185, 98)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {display: false},
        },
        scales: {
            x: {
                ticks: { display: false },
                grid: { display: true },
            },
            y: {
                ticks: { display: true },
                grid: { display: true },
            },
        },
    };
    return(
        <div className="Diagram-container">
            <div className="Subcontainer-diagram-bar">
                <Bar data={chartData} options={options}/>
            </div>
        </div>
    );
}