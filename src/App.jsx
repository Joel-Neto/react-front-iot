import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import useSWR from "swr";
import HumidityChart from "./components/humidityChart";
import TemperatureChart from "./components/temperatureChart";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function App() {
  const [page, setPage] = useState(1);
  const [monthData, setMonthData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const rowsPerPage = 15;

  const { data, error, isLoading } = useSWR(
    `https://express-api-iot.vercel.app/temp?limit=${rowsPerPage}&skip=${
      (page - 1) * rowsPerPage
    }`,
    fetcher,
    { keepPreviousData: true }
  );

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetch(
          `https://express-api-iot.vercel.app/temp/dates?month=${
            selectedMonth + 1
          }&year=2024`
        );
        const data = await response.json();
        setMonthData(data.data.temps);
      };

      fetchData();
    } catch (error) {
      console.error(error.message);
    }
  }, [selectedMonth]);

  const totalItems = data?.data?.count ?? 0;
  const pages = totalItems > 0 ? Math.ceil(totalItems / rowsPerPage) : 0;

  if (error) {
    return (
      <div className="bg-zinc-800 min-h-screen flex justify-center items-center">
        <p className="flex items-center gap-2">
          <span className="text-zinc-200 text-xl font-bold">
            Erro ao carregar dados...
          </span>
        </p>
      </div>
    );
  }

  const loadingState =
    isLoading || data?.data?.length === 0 ? "loading" : "idle";

  if (!data || data.length === 0) {
    return (
      <div className="bg-zinc-800 min-h-screen flex justify-center items-center">
        <p className="flex items-center gap-2">
          <span className="text-zinc-200 text-xl font-bold">Carregando</span>
          <Spinner color="default" />
        </p>
      </div>
    );
  }

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  return (
    <main className="bg-zinc-800 px-20 py-10 ">
      <h1 className="text-zinc-200 text-5xl font-bold mb-10">
        Dashboard Temperatura e Umidade:
      </h1>
      <section className=" flex flex-col gap-10">
        <div className="flex justify-start items-center">
          <label htmlFor="month-select" className="text-white mr-2">
            Selecione o Mês:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-zinc-700 text-white p-2 rounded"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                {new Date(0, index).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        <HumidityChart data={monthData} selectedMonth={selectedMonth} />
        <TemperatureChart data={monthData} selectedMonth={selectedMonth} />
      </section>

      <section className="container mx-auto max-w-5xl pt-20 px-5">
        <div className="space-y-5">
          <Table aria-label="Example table with client async pagination">
            <TableHeader>
              <TableColumn className="bg-zinc-500 text-white">
                Temperatura Interna
              </TableColumn>
              <TableColumn className="bg-zinc-500 text-white">
                Temperatura Externa
              </TableColumn>
              <TableColumn className="bg-zinc-500 text-white">
                Umidade Interna
              </TableColumn>
              <TableColumn className="bg-zinc-500 text-white">
                Umidade Externa
              </TableColumn>
              <TableColumn className="bg-zinc-500 text-white">Data</TableColumn>
            </TableHeader>
            <TableBody
              items={data?.data.temps ?? []}
              loadingContent={<Spinner />}
              loadingState={loadingState}
            >
              {(item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.internalTemperature} ºC</TableCell>
                  <TableCell>{item.externalTemperature} ºC</TableCell>
                  <TableCell>{item.internalHumidity}%</TableCell>
                  <TableCell>{item.externalHumidity}%</TableCell>
                  <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {pages > 0 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
