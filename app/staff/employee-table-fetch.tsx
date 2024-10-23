import { useEffect, useState } from 'react';
import { Ticket } from "../tickets/columns";
import EmployeeTable from './employee-table';


async function fetchData(): Promise<Ticket[]> {
    const response = await fetch("http://localhost:8080/api/tickets", {
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
    return data;
}

export default function TicketsPage() {
    const [data, setData] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await fetchData();
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
            <h1 className="text-2xl font-bold mb-4">Tickets</h1>
            <EmployeeTable data={data} />
        </div>
    );
}