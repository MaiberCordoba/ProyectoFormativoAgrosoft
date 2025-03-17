import { useEffect, useState } from "react";
import useSensorData from "../hooks/useSensorData";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const IoTPage = () => {
    const { data } = useSensorData();
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (data && data.temperatura !== undefined) {
            setChartData((prev) => [...prev.slice(-20), data]);
        }
    }, [data]);

    return (
        <div>
            <h1>📡 Sensores IoT</h1>
            
            <h2>📊 Temperatura</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis dataKey="timestamp" tick={false} />
                    <YAxis domain={[0, 50]} />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" />
                    <Line type="monotone" dataKey="temperatura" stroke="#FF0000" dot={false} />
                </LineChart>
            </ResponsiveContainer>

            <h2>💧 Humedad</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis dataKey="timestamp" tick={false} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" />
                    <Line type="monotone" dataKey="humedad" stroke="#0000FF" dot={false} />
                </LineChart>
            </ResponsiveContainer>

            <h2>☀️ Luz</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis dataKey="timestamp" tick={false} />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid stroke="#ccc" />
                    <Line type="monotone" dataKey="luz" stroke="#FFA500" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IoTPage;
