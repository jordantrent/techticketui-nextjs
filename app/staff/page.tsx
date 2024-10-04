"use client"; // Add this if you are using hooks

import { useEffect, useState } from "react"; 
import { Employee, columns } from "./columns";
import { DataTable } from "./data-table";

export default function Page() {
    const [data, setData] = useState<Employee[]>([]); 

   
    const fetchData = async (): Promise<Employee[]> => {
        const response = await fetch('http://localhost:8080/api/employees', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch employee data');
        }

        const data: Employee[] = await response.json();
        return data;
    };

    // Refetch data function
    const refetchData = async () => {
        const newData = await fetchData();
        setData(newData); 
    };

    useEffect(() => {
        refetchData(); 
    }, []);

    return (
        <div className="container mx-auto">
            <DataTable columns={columns(data, setData)} data={data} refetchData={refetchData} setData={setData} />
        </div>
    );
}
