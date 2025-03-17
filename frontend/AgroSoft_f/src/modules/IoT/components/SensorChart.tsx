import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { SensorData } from "../types/sensorTypes";

interface Props {
  data: SensorData[];
}

const SensorChart: React.FC<Props> = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="valor" stroke="#8884d8" />
    </LineChart>
  );
};

export default SensorChart;
