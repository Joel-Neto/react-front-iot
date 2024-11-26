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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TemperatureChart = ({ data, selectedMonth }) => {
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === selectedMonth;
  });

  const groupedData = filteredData.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { internalTemperature: 0, externalTemperature: 0, count: 0 };
    }
    acc[date].internalTemperature += item.internalTemperature;
    acc[date].externalTemperature += item.externalTemperature;
    acc[date].count += 1;
    return acc;
  }, {});

  const labels = Object.keys(groupedData);
  const internalTemperature = labels.map(
    (label) => groupedData[label].internalTemperature / groupedData[label].count
  );
  const externalTemperature = labels.map(
    (label) => groupedData[label].externalTemperature / groupedData[label].count
  );

  const temperatureData = {
    labels: labels,
    datasets: [
      {
        label: "Temperatura Interna (°C)",
        data: internalTemperature,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Temperatura Externa (°C)",
        data: externalTemperature,
        backgroundColor: "rgba(255, 159, 64, 0.8)",
        borderColor: "rgba(255, 159, 64, 1)",
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
        text: "Comparação de Temperatura Interna vs Externa",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={temperatureData} options={options} />;
};

TemperatureChart.propTypes = {
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

export default TemperatureChart;
