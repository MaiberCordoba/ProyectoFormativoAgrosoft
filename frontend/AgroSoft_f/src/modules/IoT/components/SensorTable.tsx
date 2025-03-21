import { Table } from "@heroui/react";

const SensorTable = ({ data }) => {
    return (
        <Table className="mt-6 w-full">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                {data.map((d, index) => (
                    <tr key={index}>
                        <td>{new Date(d.timestamp).toLocaleDateString()}</td>
                        <td>{new Date(d.timestamp).toLocaleTimeString()}</td>
                        <td>{d.value}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default SensorTable;
