import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HumidityChart = ({ data, selectedMonth }) => {
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === selectedMonth;
  });

  const groupedData = filteredData.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { internalHumidity: 0, externalHumidity: 0, count: 0 };
    }
    acc[date].internalHumidity += item.internalHumidity;
    acc[date].externalHumidity += item.externalHumidity;
    acc[date].count += 1;
    return acc;
  }, {});

  const labels = Object.keys(groupedData);
  const internalHumidity = labels.map(
    (label) => groupedData[label].internalHumidity / groupedData[label].count
  );
  const externalHumidity = labels.map(
    (label) => groupedData[label].externalHumidity / groupedData[label].count
  );

  const humidityData = {
    labels: labels,
    datasets: [
      {
        label: "Umidade Interna",
        data: internalHumidity,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Umidade Externa",
        data: externalHumidity,
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Comparação de Umidade Interna vs Externa",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={humidityData} options={options} />;
};

HumidityChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      externalHumidity: PropTypes.number.isRequired,
      externalTemperature: PropTypes.number.isRequired,
      internalHumidity: PropTypes.number.isRequired,
      internalTemperature: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedMonth: PropTypes.number.isRequired,
};

export default HumidityChart;
