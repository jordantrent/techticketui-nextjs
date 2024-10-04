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


export type Employee = {
    id: number
    firstName: string
    lastName: string
    position: string
    phone: string
    email: string
}

const deleteEmployee = async (
    employeeId: number,
    setData: React.Dispatch<React.SetStateAction<Employee[]>>,
    data: Employee[]
) => {
    try {
        const response = await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete the employee');
        }

        setData(data.filter(employee => employee.id !== employeeId));

        console.log(`Employee with ID ${employeeId} deleted successfully`);
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
};

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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Tickets</DropdownMenuItem>
                        <DropdownMenuItem>Assign Tickets</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onSelect={() => deleteEmployee(employee.id, setData, data)}>Delete User</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]
