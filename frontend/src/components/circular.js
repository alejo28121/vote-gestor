import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ labels, data }) {
    const chartData = {
        labels: labels,
        datasets: [
        {
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
        legend: {
            display: false  
        },
    },
    };
    return (
        <div className="Diagram-container">
            <div className="Subcontainer-diagram">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
}