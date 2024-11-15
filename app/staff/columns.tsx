"use client"
import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ViewEmployee from "./view-employee"


export type Employee = {
    id: number
    firstName: string
    lastName: string
    position: string
    phone: string
    email: string
    photo: string
}



export const columns = (
    data: Employee[],
    setData: React.Dispatch<React.SetStateAction<Employee[]>>
) => [
 
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "position",
        header: "Position",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        id: "actions",
        cell: ({ row }: { row: Row<Employee> }) => {
            const employee = row.original;

            return (
                <div className="flex justify-end">
                    <ViewEmployee employeeId={employee.id} />
                </div>
            )
        },
    },

]
