import { useEffect, useState } from 'react';
import { Ticket } from "../tickets/columns";
import EmployeeTable from './employee-table';

type ViewEmployeeProps = {
    employeeId: number;
};

async function fetchData(employeeId): Promise<Ticket[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/employee/${employeeId}`, {
        method: "GET",
        headers: {
            "Cache-Control": "no-cache"
        },
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tickets");
    }

    const data: Ticket[] = await response.json();
    console.log("employeeId:" + employeeId);
    return data;
}

export default function TicketsPage({ employeeId }) {
    const [data, setData] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await fetchData(employeeId);
                setData(fetchedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-lg font-bold">Assigned Tickets</h1>
            <EmployeeTable data={data} />
        </div>
    );
}