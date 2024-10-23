import { Ticket, columns } from "../tickets/columns";
import { DataTable } from "./data-table-employee-tickets";


type EmployeeTableProps = {
    data: Ticket[];
};

export default function EmployeeTable({ data }: EmployeeTableProps) {
    return (
        <div className="container mx-auto">
            <DataTable columns={columns} data={data} />
        </div>
    );
}