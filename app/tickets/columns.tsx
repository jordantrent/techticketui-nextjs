"use client"
import { ColumnDef } from "@tanstack/react-table"
import ViewTicket from "./view-ticket"

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    phone: string;
    email: string;
}

export type Ticket = {
    id: number;
    issueDescription: string;
    createdDate: string;
    employees: Employee[];
}

export const columns: ColumnDef<Ticket>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "issueDescription",
        header: "Description",
        cell: ({ getValue }) => {
            const text = getValue() as string;
            const maxLength =100;
            return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
        },
    },
    {
        accessorKey: "createdDate",
        header: "Created Date",
    },
    {
        accessorKey: "employees",
        header: "Assigned Employees",
        cell: ({ row }) => (
            row.original.employees.map(emp => `${emp.firstName} ${emp.lastName}`).join(', ')
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => {
         
            return (
                <div className="flex justify-end">
                    <ViewTicket rowSelect={row.original.id} />
                </div>
            )
        },
    },
]
