import { Ticket, columns } from "./columns"
import { DataTable } from "./data-table"


async function getData(): Promise<Ticket[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
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

export default async function Page() {
    const data = await getData()

    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={data} />
        </div>
    )
}